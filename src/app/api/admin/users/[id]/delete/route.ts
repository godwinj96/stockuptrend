import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction, countOtherActiveAdmins } from '@/lib/admin/audit'

// Soft delete: preserves all profile/account/transaction/trade history for compliance
// and dispute investigation, blocks login via Supabase Auth ban, and hides the user from
// the default admin list. Fully reversible via /restore.
const BAN_DURATION = '87600h'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  if (params.id === user!.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
  }

  const { data: target } = await db.from('profiles').select('role, deleted_at, email').eq('id', params.id).single()
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (target.deleted_at) {
    return NextResponse.json({ error: 'User is already deleted' }, { status: 400 })
  }

  if (target.role === 'admin') {
    const remaining = await countOtherActiveAdmins(db, params.id)
    if (remaining === 0) {
      return NextResponse.json({ error: 'Cannot delete the last remaining admin' }, { status: 400 })
    }
  }

  const { error: banError } = await db.auth.admin.updateUserById(params.id, { ban_duration: BAN_DURATION })
  if (banError) return NextResponse.json({ error: 'Failed to update auth status' }, { status: 500 })

  await db.from('profiles').update({ is_active: false, deleted_at: new Date().toISOString() }).eq('id', params.id)

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: 'user_deleted',
    details: { email: target.email },
  })

  return NextResponse.json({ success: true })
}
