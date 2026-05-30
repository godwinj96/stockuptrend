import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const db = createServiceRoleClient()
  const { searchParams } = new URL(req.url)
  const txStatus = searchParams.get('status') ?? 'pending_review'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('type', 'withdrawal')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (txStatus !== 'all') query = query.eq('status', txStatus)

  const { data: transactions, count, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  const userIds = [...new Set((transactions ?? []).map((t: { user_id: string }) => t.user_id))]
  const { data: profiles } = userIds.length
    ? await db.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] }

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string; full_name: string | null; email: string | null }) => [p.id, p])
  )

  const withdrawals = (transactions ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    user: profileMap.get(t.user_id as string) ?? null,
  }))

  return NextResponse.json({ withdrawals, total: count ?? 0, page, limit })
}
