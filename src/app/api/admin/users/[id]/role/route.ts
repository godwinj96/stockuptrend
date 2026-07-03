import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction, countOtherActiveAdmins } from '@/lib/admin/audit'

const schema = z.object({ role: z.enum(['user', 'admin']) })

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  if (params.id === user!.id) {
    return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 })
  }

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { role } = parsed.data

  const { data: target } = await db.from('profiles').select('role, deleted_at').eq('id', params.id).single()
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (target.deleted_at) {
    return NextResponse.json({ error: 'This user has been deleted. Restore them first.' }, { status: 400 })
  }

  if (role === 'user' && target.role === 'admin') {
    const remaining = await countOtherActiveAdmins(db, params.id)
    if (remaining === 0) {
      return NextResponse.json({ error: 'Cannot demote the last remaining admin' }, { status: 400 })
    }
  }

  await db.from('profiles').update({ role }).eq('id', params.id)

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: 'role_changed',
    details: { previous: target.role, next: role },
  })

  return NextResponse.json({ success: true, role })
}
