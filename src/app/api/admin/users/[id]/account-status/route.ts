import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction } from '@/lib/admin/audit'

const schema = z.object({ active: z.boolean() })

// Controls accounts.is_active — the flag that determines whether this user's trading
// account (balance, positions, portfolio) is visible across the portal. This is the
// exact flag involved in the 2026-07-03 incident: it was flipped off with no
// confirmation and no audit trail, silently hiding a real $780.11 balance from the
// user. Every write here is now its own explicit action, logged to admin_audit_log.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { active } = parsed.data

  const { data: account } = await db.from('accounts').select('id, is_active').eq('user_id', params.id).maybeSingle()
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  await db.from('accounts').update({ is_active: active }).eq('id', account.id)

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: active ? 'account_activated' : 'account_deactivated',
    details: { accountId: account.id, previous: account.is_active, next: active },
  })

  return NextResponse.json({ success: true, isActive: active })
}
