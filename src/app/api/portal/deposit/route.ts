import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { Account } from '@/lib/supabase/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    amount: number
    method: string
    accountId: string
    currency: string
  }
  const { amount, method, accountId, currency } = body

  if (!amount || amount < 10 || amount > 10000) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if (method !== 'card') {
    return NextResponse.json({ error: 'Invalid method for this endpoint' }, { status: 400 })
  }

  const serviceSupabase = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceSupabase as any

  const { data: rawAccount } = await serviceSupabase
    .from('accounts')
    .select('id')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  const account = rawAccount as Pick<Account, 'id'> | null

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: `StockUptrend Deposit — Account ${accountId.slice(0, 8)}` },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
      accountId,
      amount: String(amount),
      currency,
      type: 'deposit',
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/deposit?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/deposit?cancelled=true`,
  })

  await db.from('transactions').insert({
    user_id: user.id,
    account_id: accountId,
    type: 'deposit',
    amount,
    currency,
    status: 'pending',
    method: 'card',
    reference: session.id,
  })

  return NextResponse.json({ url: session.url })
}
