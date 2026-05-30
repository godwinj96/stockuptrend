import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const db = createServiceRoleClient()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const accountType = searchParams.get('account_type') ?? ''
  const kycStatus = searchParams.get('kyc_status') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('profiles')
    .select('id, full_name, email, country, kyc_status, account_type, role, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }
  if (accountType) query = query.eq('account_type', accountType)
  if (kycStatus) query = query.eq('kyc_status', kycStatus)

  const { data: profiles, count, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  // Fetch account balances for these users
  const userIds = (profiles ?? []).map((p: { id: string }) => p.id)
  const { data: accounts } = userIds.length
    ? await db.from('accounts').select('user_id, balance, currency').in('user_id', userIds).eq('is_active', true)
    : { data: [] }

  const balanceMap = new Map(
    (accounts ?? []).map((a: { user_id: string; balance: number; currency: string }) => [a.user_id, a])
  )

  const users = (profiles ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    balance:  (balanceMap.get(p.id as string) as { balance: number } | undefined)?.balance ?? 0,
    currency: (balanceMap.get(p.id as string) as { currency: string } | undefined)?.currency ?? 'USD',
  }))

  return NextResponse.json({ users, total: count ?? 0, page, limit })
}
