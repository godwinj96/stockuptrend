---
title: Architecture
description: System topology, rendering strategy, API layer, and data flow for StockUptrend.
alwaysApply: true
---

# Architecture

## System Topology

```
Browser
  │
  ├── Vercel Edge Network (CDN, static assets, Edge Middleware)
  │     │
  │     └── Next.js App (Vercel Serverless / Edge Functions)
  │           │
  │           ├── Server Components → Supabase (direct DB queries)
  │           ├── Route Handlers (/app/api/) → Supabase (service role)
  │           │                              → Stripe API
  │           │                              → Coinbase Commerce API
  │           └── Client Components → Supabase (anon/user client)
  │                                 → TradingView widget embeds
  │                                 → MoonPay widget embed
  │
  └── Supabase
        ├── Auth (email/password, MFA)
        ├── PostgreSQL (all app data)
        ├── Storage (KYC docs, avatars)
        └── Realtime (live balance updates, price tickers)
```

## Rendering Strategy

| Surface | Strategy | Rationale |
|---|---|---|
| Homepage | ISR (revalidate: 3600) | SEO + performance, content rarely changes |
| Marketing content pages | ISR (revalidate: 86400) | Static content, daily revalidation sufficient |
| FAQ | Static (generateStaticParams) | Fully static, no dynamic data |
| Blog / Education | ISR (revalidate: 3600) | Content updates need to be visible quickly |
| Auth pages (login, register) | Client-side only | No SEO value, fast interactivity needed |
| Client portal | SSR + client hydration | Auth-gated, personalised data |
| Portal dashboard | SSR initial load + SWR | Show data fast, then keep it fresh |

**Rules:**
- Never use `"use client"` on a page file unless the entire page is client-rendered (auth pages, portal).
- Server Components fetch data and pass it as props to Client Components. Client Components do not re-fetch what Server Components already loaded.
- Route Handlers are the only place service-role Supabase operations are permitted.

## API Layer

All backend logic lives in `/app/api/` as Next.js Route Handlers. There is no separate Express/Node backend.

**Route Handler conventions:**
```
/app/api/
  auth/
    callback/route.ts       ← Supabase OAuth callback
  portal/
    deposit/route.ts        ← Stripe payment intent creation
    withdrawal/route.ts     ← Withdrawal request submission
    kyc/route.ts            ← KYC document upload handler
  webhooks/
    stripe/route.ts         ← Stripe webhook processor
    coinbase/route.ts       ← Coinbase Commerce webhook
  admin/                    ← Service-role operations (Phase 1: internal use only)
```

Every Route Handler must:
1. Validate the session with `createServerClient` before processing
2. Validate and parse the request body with Zod
3. Return typed JSON responses with appropriate HTTP status codes
4. Never expose Supabase service role key in response bodies or logs

## Supabase Client Usage

**Two clients — never mix them up:**

```typescript
// Server-side (Server Components, Route Handlers, middleware)
import { createServerClient } from '@supabase/ssr'
// Uses cookies from the request — reads the authenticated session

// Client-side (Client Components)
import { createBrowserClient } from '@supabase/ssr'
// Uses the anon key — respects RLS policies
```

The service role client is instantiated only in Route Handlers where admin operations are needed (e.g., webhook processing that updates transaction status). It must never be imported in files that can be bundled client-side.

## Realtime Subscriptions

**Where used:**
- Portal dashboard: subscribe to `transactions` table filtered by `user_id` — triggers balance refresh on new confirmed deposit
- Market ticker strip: TradingView widget handles its own websocket — no Supabase Realtime for price data

**Pattern:**
```typescript
// In a Client Component, clean up on unmount
useEffect(() => {
  const channel = supabase
    .channel('user-transactions')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      // Invalidate SWR cache or update Zustand store
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [userId])
```

## Third-Party Integrations

| Integration | How it loads | Where |
|---|---|---|
| TradingView widgets | Script tag in Client Component, lazy via IntersectionObserver | Marketing pages, portal header |
| MoonPay widget | Iframe embed in Client Component | `/portal/deposit` |
| Coinbase Commerce | API call from Route Handler + webhook | `/portal/deposit`, `/api/webhooks/coinbase` |
| Stripe Elements | `@stripe/stripe-js` loaded client-side; `stripe` server-side only | `/portal/deposit`, `/api/portal/deposit` |

## File Upload Flow (KYC)

```
Client Component (file input)
  → validates type (PDF/JPEG/PNG) and size (< 10MB) client-side
  → sends to /api/portal/kyc (Route Handler)
    → validates session (user must be authenticated)
    → validates file again server-side
    → uploads to Supabase Storage 'kyc-documents' bucket (service role)
    → inserts record in kyc_documents table
    → returns { success: true, documentId }
```

Files are stored under `{userId}/{docType}/{timestamp}.{ext}` — never expose raw storage URLs to the client. Generate signed URLs server-side when displaying uploaded documents.

## Error Handling Strategy

- Every major page section is wrapped in an Error Boundary (`error.tsx` file in the route folder)
- Route Handlers return structured error responses: `{ error: string, code: string }`
- Client Components display inline error states — never crash the whole page for a section failure
- Unrecoverable errors redirect to a `/error` page with a support link
- Sentry captures all uncaught errors (both client and server) with user context attached

## Environment Variables

```
# Public (safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_MOONPAY_API_KEY=
NEXT_PUBLIC_SITE_URL=

# Private (server-side only — never prefix with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
COINBASE_COMMERCE_API_KEY=
COINBASE_COMMERCE_WEBHOOK_SECRET=
SENTRY_DSN=
```
