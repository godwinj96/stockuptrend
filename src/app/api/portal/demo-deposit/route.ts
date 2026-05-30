import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'
import type { Account } from '@/lib/supabase/types'

const schema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().min(10).max(50_000),
  currency: z.enum(['BTC', 'ETH', 'BNB', 'USDT']),
})

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { accountId, amount, currency } = parsed.data
  const serviceSupabase = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceSupabase as any

  const { data: rawAccount } = await serviceSupabase
    .from('accounts')
    .select('id, balance')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()
  const account = rawAccount as Pick<Account, 'id' | 'balance'> | null

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const reference = `DEMO-${currency}-${Date.now()}`

  // Deposit goes to pending_review — admin must approve before balance is credited
  const { error: txError } = await db.from('transactions').insert({
    user_id: user.id,
    account_id: accountId,
    type: 'deposit',
    amount,
    currency: 'USD',
    status: 'pending_review',
    method: `crypto_demo_${currency.toLowerCase()}`,
    reference,
  })

  if (txError) {
    console.error('demo-deposit: failed to insert transaction', txError)
    return NextResponse.json({ error: 'Transaction failed' }, { status: 500 })
  }

  await db.from('notifications').insert({
    user_id: user.id,
    type: 'deposit_confirmed',
    title: 'Deposit Request Received',
    body: `Your deposit request of $${amount.toFixed(2)} via ${currency} is pending admin approval. You will be notified once it is processed.`,
    is_read: false,
  })

  return NextResponse.json({ success: true, reference, status: 'pending_review' })
}
