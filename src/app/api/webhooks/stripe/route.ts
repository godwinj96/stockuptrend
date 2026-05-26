import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { Account } from '@/lib/supabase/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, accountId, amount, currency } = session.metadata ?? {}

    if (!userId || !accountId || !amount || !currency) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    await db.from('transactions').update({ status: 'completed' }).eq('reference', session.id)

    const numericAmount = parseFloat(amount)

    const { data: rawAccount } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .single()
    const account = rawAccount as Pick<Account, 'balance'> | null

    if (account) {
      await db.from('accounts').update({ balance: (account.balance ?? 0) + numericAmount }).eq('id', accountId)
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    await db.from('transactions').update({ status: 'failed' }).eq('reference', session.id)
  }

  return NextResponse.json({ received: true })
}
