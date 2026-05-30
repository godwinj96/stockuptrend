import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: profile }, { data: documents }] = await Promise.all([
    db.from('profiles').select('*').eq('id', params.userId).single(),
    db.from('kyc_documents').select('*').eq('user_id', params.userId),
  ])

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ profile, documents: documents ?? [] })
}
