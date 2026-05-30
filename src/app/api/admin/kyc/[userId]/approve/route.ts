import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const db = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbAny = db as any

  await Promise.all([
    dbAny.from('profiles').update({ kyc_status: 'approved' }).eq('id', params.userId),
    dbAny.from('kyc_documents').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('user_id', params.userId),
  ])

  await dbAny.from('notifications').insert({
    user_id: params.userId,
    type:    'kyc_approved',
    title:   'Identity Verified',
    body:    'Your identity verification has been approved. You now have full access to all platform features.',
    is_read: false,
  })

  return NextResponse.json({ success: true })
}
