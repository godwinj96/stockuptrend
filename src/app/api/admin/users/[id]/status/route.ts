import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction, countOtherActiveAdmins } from '@/lib/admin/audit'

const schema = z.object({ active: z.boolean() })

// Suspends/reactivates a user at the Supabase Auth layer (ban) — not just an app-level
// flag — so a suspension actually blocks login/session refresh, not merely UI access.
const BAN_DURATION = '87600h' // ~10 years; de-facto indefinite, reversible via reactivate

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  if (params.id === user!.id) {
    return NextResponse.json({ error: 'You cannot change your own account status' }, { status: 400 })
  }

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { active } = parsed.data

  const { data: target } = await db.from('profiles').select('role, is_active, deleted_at').eq('id', params.id).single()
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (target.deleted_at) {
    return NextResponse.json({ error: 'This user has been deleted. Restore them first.' }, { status: 400 })
  }

  if (!active && target.role === 'admin') {
    const remaining = await countOtherActiveAdmins(db, params.id)
    if (remaining === 0) {
      return NextResponse.json({ error: 'Cannot suspend the last remaining admin' }, { status: 400 })
    }
  }

  const { error: banError } = await db.auth.admin.updateUserById(params.id, {
    ban_duration: active ? 'none' : BAN_DURATION,
  })
  if (banError) return NextResponse.json({ error: 'Failed to update auth status' }, { status: 500 })

  await db.from('profiles').update({ is_active: active }).eq('id', params.id)

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: active ? 'user_activated' : 'user_deactivated',
    details: { previous: target.is_active, next: active },
  })

  revalidateTag('admin-dashboard')
  return NextResponse.json({ success: true, isActive: active })
}
