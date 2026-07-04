import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ reason: z.string().min(1).max(500) })

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Reason is required' }, { status: 400 })

  const db = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbAny = db as any

  await Promise.all([
    dbAny.from('profiles').update({ kyc_status: 'rejected' }).eq('id', params.userId),
    dbAny.from('kyc_documents').update({
      status: 'rejected',
      rejection_reason: parsed.data.reason,
      reviewed_at: new Date().toISOString(),
    }).eq('user_id', params.userId),
  ])

  await dbAny.from('notifications').insert({
    user_id: params.userId,
    type:    'kyc_rejected',
    title:   'Verification Unsuccessful',
    body:    `Your KYC submission was not approved. Reason: ${parsed.data.reason}. Please resubmit with correct documents.`,
    is_read: false,
  })

  revalidateTag('admin-dashboard')
  return NextResponse.json({ success: true })
}
