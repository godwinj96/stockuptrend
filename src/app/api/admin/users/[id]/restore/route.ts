import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction } from '@/lib/admin/audit'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const { data: target } = await db.from('profiles').select('deleted_at').eq('id', params.id).single()
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (!target.deleted_at) return NextResponse.json({ error: 'User is not deleted' }, { status: 400 })

  const { error: banError } = await db.auth.admin.updateUserById(params.id, { ban_duration: 'none' })
  if (banError) return NextResponse.json({ error: 'Failed to update auth status' }, { status: 500 })

  await db.from('profiles').update({ is_active: true, deleted_at: null }).eq('id', params.id)

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: 'user_restored',
  })

  return NextResponse.json({ success: true })
}
