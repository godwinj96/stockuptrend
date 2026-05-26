import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { Profile, Account } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceSupabase = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceSupabase as any

  const { data: rawProfile } = await serviceSupabase
    .from('profiles')
    .select('kyc_status')
    .eq('id', user.id)
    .single()
  const profile = rawProfile as Pick<Profile, 'kyc_status'> | null

  if (profile?.kyc_status !== 'approved') {
    return NextResponse.json({ error: 'KYC verification required' }, { status: 403 })
  }

  const body = await req.json() as {
    amount: number
    method: string
    accountId: string
    currency: string
    [key: string]: unknown
  }
  const { amount, method, accountId, currency } = body

  const limits = method === 'bank_wire' ? { min: 50, max: 50000 } : { min: 20, max: 50000 }
  if (!amount || amount < limits.min || amount > limits.max) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

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

  if ((account.balance ?? 0) < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const { error } = await db.from('transactions').insert({
    user_id: user.id,
    account_id: accountId,
    type: 'withdrawal',
    amount,
    currency,
    status: 'pending_review',
    method,
    reference: null,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to create withdrawal request' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
