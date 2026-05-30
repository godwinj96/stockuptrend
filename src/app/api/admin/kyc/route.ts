import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const db = createServiceRoleClient()
  const { searchParams } = new URL(req.url)
  const kycStatus = searchParams.get('status') ?? 'pending'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const statuses = kycStatus === 'all'
    ? ['not_started', 'pending', 'under_review', 'approved', 'rejected']
    : [kycStatus]

  const { data: profiles, count, error: dbError } = await db
    .from('profiles')
    .select('id, full_name, email, country, kyc_status, created_at', { count: 'exact' })
    .in('kyc_status', statuses)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (dbError) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  // Fetch doc counts per user
  const userIds = (profiles ?? []).map((p: { id: string }) => p.id)
  const { data: docs } = userIds.length
    ? await db.from('kyc_documents').select('user_id').in('user_id', userIds)
    : { data: [] }

  const docCountMap = new Map<string, number>()
  ;(docs ?? []).forEach((d: { user_id: string }) => {
    docCountMap.set(d.user_id, (docCountMap.get(d.user_id) ?? 0) + 1)
  })

  const submissions = (profiles ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    doc_count: docCountMap.get(p.id as string) ?? 0,
  }))

  return NextResponse.json({ submissions, total: count ?? 0, page, limit })
}
