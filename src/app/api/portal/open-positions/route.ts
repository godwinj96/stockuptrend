import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { Trade } from '@/lib/supabase/types'

export async function GET(req: NextRequest) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get('accountId')

  if (!accountId) {
    return NextResponse.json({ error: 'accountId is required' }, { status: 400 })
  }

  // Verify account belongs to user
  const { data: account } = await supabase
    .from('accounts')
    .select('id')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single()

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('account_id', accountId)
    .eq('status', 'open')
    .order('open_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 })
  }

  return NextResponse.json({ trades: (data ?? []) as Trade[] })
}
