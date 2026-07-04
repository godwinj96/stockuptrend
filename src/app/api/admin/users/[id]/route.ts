import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/supabase/admin'
import { logAdminAction } from '@/lib/admin/audit'
import { z } from 'zod'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const [{ data: profile }, { data: account }, { data: transactions }, { data: trades }, { data: auditLog }] =
    await Promise.all([
      db.from('profiles').select('*').eq('id', params.id).single(),
      // No is_active filter here: admins must be able to see and manage a
      // deactivated trading account, not just active ones.
      db.from('accounts').select('*').eq('user_id', params.id).maybeSingle(),
      db.from('transactions').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(10),
      db.from('trades').select('profit_loss, status').eq('user_id', params.id),
      db
        .from('admin_audit_log')
        .select('*, admin:profiles!admin_audit_log_admin_id_fkey(full_name, email)')
        .eq('target_user_id', params.id)
        .order('created_at', { ascending: false })
        .limit(20),
    ])

  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const closedTrades = (trades ?? []).filter((t: { status: string }) => t.status === 'closed')
  const totalPnL = closedTrades.reduce((s: number, t: { profit_loss: number | null }) => s + (t.profit_loss ?? 0), 0)

  return NextResponse.json({
    profile, account: account ?? null, transactions: transactions ?? [], auditLog: auditLog ?? [],
    stats: { totalTrades: closedTrades.length, totalPnL: parseFloat(totalPnL.toFixed(2)) },
  })
}

const patchSchema = z.object({
  account_type: z.enum(['standard', 'pro', 'vip']),
})

// Tier change only. Role, active-status, deletion, and AI-trading toggles each have
// their own dedicated, single-purpose, audited endpoint — see role/, status/, delete/,
// account-status/, ai-trading/ in this same [id] segment. Bundling unrelated mutations
// behind one shared "Save" button is what caused the 2026-07-03 incident.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, db, error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { account_type } = parsed.data

  const { data: account } = await db.from('accounts').select('id, account_type').eq('user_id', params.id).maybeSingle()
  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  // Tier lives on accounts.account_type (authoritative, shown on the account card) and
  // is mirrored onto profiles.account_type (used for the tier badge/filter on the users list).
  await Promise.all([
    db.from('accounts').update({ account_type }).eq('id', account.id),
    db.from('profiles').update({ account_type }).eq('id', params.id),
  ])

  await logAdminAction(db, {
    adminId: user!.id,
    targetUserId: params.id,
    action: 'account_tier_changed',
    details: { accountId: account.id, previous: account.account_type, next: account_type },
  })

  revalidateTag('admin-dashboard')
  return NextResponse.json({ success: true })
}
