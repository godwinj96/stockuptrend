---
title: Payments
description: Deposit and withdrawal flow architecture, payment provider integration rules, and webhook handling.
alwaysApply: false
---

# Payments

## Phase 1 Payment Methods

| Method | Provider | Direction | Flow Type |
|---|---|---|---|
| Credit/Debit Card | Stripe | Deposit | Stripe Elements (client) + PaymentIntent (server) |
| Bank Transfer | Manual | Deposit + Withdrawal | Reference-based, admin confirms |
| Crypto (buy with card) | MoonPay | Deposit | MoonPay widget embed |
| Crypto (existing wallet) | Coinbase Commerce | Deposit | Charge via API + webhook |

## Deposit Flow

### General Pattern

```
1. User navigates to /portal/deposit
2. User selects payment method (tab: Card | Bank Transfer | Crypto)
3. User enters amount + currency
4. Provider-specific UI renders
5. User completes payment through provider
6. On success: POST /api/portal/deposit (creates transaction record, status: 'pending')
7. Webhook from provider updates transaction status to 'completed'
8. Supabase Realtime notifies portal — balance updates without page refresh
9. User sees success state + updated balance
```

### Stripe Card Deposit

**Client-side flow:**

```typescript
// 1. Load Stripe Elements in StripeCardForm component
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// 2. On amount entry, call Route Handler to create PaymentIntent
// POST /api/portal/deposit { method: 'card', amount, currency }
// Returns: { clientSecret }

// 3. Confirm payment using PaymentElement
const stripe = useStripe()
const elements = useElements()
const result = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: `${window.location.origin}/portal/deposit/success` },
})
```

**Server-side Route Handler:**

```typescript
// app/api/portal/deposit/route.ts
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { amount, currency, method } = depositSchema.parse(body)

  if (method === 'card') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),  // Stripe uses cents
      currency: currency.toLowerCase(),
      metadata: { userId: user.id },
    })

    // Create pending transaction record
    const { data: account } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    await supabase.from('transactions').insert({
      user_id: user.id,
      account_id: account!.id,
      type: 'deposit',
      amount,
      currency,
      status: 'pending',
      method: 'card',
      provider_reference: paymentIntent.id,
    })

    return Response.json({ clientSecret: paymentIntent.client_secret })
  }

  // ... other methods
}
```

### Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const supabase = createServerClient()
    
    // Use service role for this operation — webhook doesn't have user session
    const supabaseAdmin = createServerClient({ useServiceRole: true })
    
    await supabaseAdmin.from('transactions')
      .update({ status: 'completed' })
      .eq('provider_reference', pi.id)

    // Update account balance
    // (fetch transaction amount, add to accounts.balance)
  }

  return Response.json({ received: true })
}

// Disable body parsing — Stripe needs raw body for signature verification
export const config = { api: { bodyParser: false } }
```

### MoonPay Widget (Crypto Buy)

```typescript
// src/components/portal/payments/MoonPayWidget.tsx
'use client'

export function MoonPayWidget({ amount, currency }: { amount: number; currency: string }) {
  // MoonPay widget URL with pre-filled parameters
  const moonpayUrl = new URL('https://buy.moonpay.com')
  moonpayUrl.searchParams.set('apiKey', process.env.NEXT_PUBLIC_MOONPAY_API_KEY!)
  moonpayUrl.searchParams.set('currencyCode', 'usdc')  // or let user choose
  moonpayUrl.searchParams.set('baseCurrencyAmount', String(amount))
  moonpayUrl.searchParams.set('colorCode', '%2300C27A')  // Brand accent

  return (
    <iframe
      src={moonpayUrl.toString()}
      className="w-full h-[500px] rounded-xl border border-border-subtle"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
      title="Buy crypto with MoonPay"
    />
  )
}
```

### Coinbase Commerce (Crypto Wallet)

```typescript
// POST /api/portal/deposit with method: 'crypto_coinbase'
// Server creates a Coinbase Commerce charge:
const response = await fetch('https://api.commerce.coinbase.com/charges', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY!,
    'X-CC-Version': '2018-03-22',
  },
  body: JSON.stringify({
    name: 'StockUptrend Deposit',
    description: `Deposit for user ${userId}`,
    pricing_type: 'fixed_price',
    local_price: { amount: String(amount), currency },
    metadata: { userId },
  }),
})
const charge = await response.json()
// Return charge.data.hosted_url to display QR code / copy address
```

Coinbase Commerce webhook at `/api/webhooks/coinbase` updates transaction status on `charge:confirmed` event.

### Bank Transfer (Manual)

```typescript
// No API call needed — show bank details to user
// POST /api/portal/deposit with method: 'bank_transfer' creates a 'pending_review' transaction
// User is shown:
// - Bank name, account number, sort code/IBAN/routing
// - Reference code: "SUT-{userId.slice(0,8).toUpperCase()}-{transactionId.slice(0,6).toUpperCase()}"
// - Instructions to include the reference in their transfer
// Admin confirms receipt in Supabase Dashboard (Phase 1) or admin panel (Phase 2)
```

## Withdrawal Flow

```
1. User navigates to /portal/withdrawal
2. KYC status check — if not 'approved', show gate UI (not a redirect)
3. User enters amount + selects withdrawal method (bank wire / crypto)
4. Validation: amount <= available balance, minimum withdrawal check
5. POST /api/portal/withdrawal — creates transaction with status: 'pending_review'
6. User sees confirmation: "Withdrawal request submitted. Processed within 1-3 business days."
7. Admin processes withdrawal manually (Phase 1) via Supabase Dashboard
8. Status updated to 'processing' → 'completed'
9. Supabase Realtime notifies user — notification + balance update
```

**Withdrawal Route Handler:**

```typescript
// app/api/portal/withdrawal/route.ts
// 1. Validate session
// 2. Validate body with Zod
// 3. Check KYC status === 'approved' (service role query to profiles)
// 4. Check requested amount <= account balance
// 5. Insert transaction with status 'pending_review'
// 6. Insert notification for user: 'withdrawal_request_received'
// 7. Return success
```

## Security Rules for Payments

- Stripe secret key: server-side only, never in client bundles, never in `NEXT_PUBLIC_` vars
- MoonPay API key: `NEXT_PUBLIC_MOONPAY_API_KEY` — publishable key only (safe to expose)
- Coinbase API key: server-side only (`COINBASE_COMMERCE_API_KEY`)
- All payment amounts are validated server-side — client amount values are not trusted
- Webhook endpoints verify signatures before processing — reject unsigned requests with 400
- Never log full payment objects — log only IDs and status
- Payment amounts in database are stored in the account's currency — always validate currency matching

## Minimum/Maximum Limits

```typescript
// src/lib/constants/payments.ts
export const PAYMENT_LIMITS = {
  deposit: {
    card: { min: 10, max: 10_000, currency: 'USD' },
    bank_transfer: { min: 100, max: 100_000, currency: 'USD' },
    crypto: { min: 10, max: 50_000, currency: 'USD' },
    // Pre-KYC deposit cap:
    preKycMax: 500,
  },
  withdrawal: {
    bank_wire: { min: 50, max: 50_000, currency: 'USD' },
    crypto: { min: 20, max: 50_000, currency: 'USD' },
  },
} as const
```

## UI States for Payments

Every payment form must implement these states:

| State | UI |
|---|---|
| Idle | Form with method tabs and amount input |
| Loading (creating intent) | Spinner on submit button, form disabled |
| Provider UI active | Provider component shown (Stripe Elements, MoonPay iframe, crypto address) |
| Processing | "Your payment is being processed..." with progress indicator |
| Success | Green checkmark, amount, method, "View transaction history" link |
| Error | Error message with retry button and support link |
| KYC gate (withdrawal) | Informational panel with KYC status and link to `/portal/kyc` |
