import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const db = createServiceRoleClient()
  const { searchParams } = new URL(req.url)
  const ticketStatus = searchParams.get('status') ?? 'open'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('support_tickets')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (ticketStatus !== 'all') {
    if (ticketStatus === 'open') {
      query = query.in('status', ['open', 'in_progress'])
    } else {
      query = query.eq('status', ticketStatus)
    }
  }

  const { data: tickets, count, error: dbError } = await query
  if (dbError) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  const userIds = [...new Set((tickets ?? []).map((t: { user_id: string }) => t.user_id))]
  const { data: profiles } = userIds.length
    ? await db.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] }

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string }) => [p.id, p])
  )

  const enriched = (tickets ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    user: profileMap.get(t.user_id as string) ?? null,
  }))

  return NextResponse.json({ tickets: enriched, total: count ?? 0, page, limit })
}
