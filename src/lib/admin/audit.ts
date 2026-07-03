// Service-role Supabase client, typed loosely to match the rest of the admin API layer
// (see src/lib/supabase/admin.ts — every admin Route Handler bypasses strict typing this way).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminDb = any

export type AdminAuditAction =
  | 'user_activated'
  | 'user_deactivated'
  | 'user_deleted'
  | 'user_restored'
  | 'role_changed'
  | 'account_tier_changed'
  | 'account_activated'
  | 'account_deactivated'
  | 'ai_trading_enabled'
  | 'ai_trading_disabled'

export async function logAdminAction(
  db: AdminDb,
  params: {
    adminId: string
    targetUserId: string
    action: AdminAuditAction
    details?: Record<string, unknown>
  }
): Promise<void> {
  await db.from('admin_audit_log').insert({
    admin_id: params.adminId,
    target_user_id: params.targetUserId,
    action: params.action,
    details: params.details ?? null,
  })
}

/** Active, non-deleted admins other than the one excluded — used to block the last admin from being demoted/deleted. */
export async function countOtherActiveAdmins(db: AdminDb, excludingUserId: string): Promise<number> {
  const { count } = await db
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin')
    .eq('is_active', true)
    .is('deleted_at', null)
    .neq('id', excludingUserId)

  return count ?? 0
}
