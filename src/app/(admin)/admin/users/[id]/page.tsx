import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { UserAccountCard } from '@/components/admin/users/UserAccountCard'
import { UserStatusCard } from '@/components/admin/users/UserStatusCard'
import { UserRoleCard } from '@/components/admin/users/UserRoleCard'
import { DangerZoneCard } from '@/components/admin/users/DangerZoneCard'
import { AuditLogList } from '@/components/admin/users/AuditLogList'
import { ROUTES } from '@/lib/constants/routes'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'User Detail | Admin', robots: { index: false, follow: false } }

const KYC_STYLES: Record<string, string> = {
  approved: 'bg-accent-primary-muted text-accent-primary',
  pending: 'bg-warning/10 text-warning',
  under_review: 'bg-accent-secondary-muted text-accent-secondary',
  rejected: 'bg-danger-muted text-danger',
  not_started: 'bg-bg-elevated text-text-tertiary',
}

const TX_STATUS_STYLES: Record<string, string> = {
  completed: 'text-accent-primary',
  pending_review: 'text-warning',
  failed: 'text-danger',
}

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: profile }, { data: accountRaw }, { data: transactions }, { data: trades }, { data: auditLogRaw }] =
    await Promise.all([
      db.from('profiles').select('*').eq('id', params.id).single(),
      // No is_active filter: an admin must be able to see and manage a deactivated
      // trading account, not just active ones (this exact filter previously caused
      // a 406 that made a deactivated account invisible even to admins).
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

  if (!profile) notFound()

  const account = accountRaw as { id: string; account_number: string; account_type: string | null; balance: number | null; currency: string | null; is_active: boolean | null; ai_active: boolean | null; total_trades: number | null } | null
  const closedTrades = (trades ?? []).filter((t: { status: string }) => t.status === 'closed')
  const totalPnL = closedTrades.reduce((s: number, t: { profit_loss: number | null }) => s + (t.profit_loss ?? 0), 0)
  const p = profile as Record<string, unknown>
  const isSelf = params.id === user.id
  const isDeleted = Boolean(p.deleted_at)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href={ROUTES.admin.users} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Profile */}
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-text-primary">Profile</h2>
              <div className="flex gap-1.5">
                {isDeleted ? (
                  <span className="rounded-full bg-danger-muted px-2.5 py-0.5 text-xs font-semibold text-danger">Deleted</span>
                ) : (p.is_active as boolean) === false ? (
                  <span className="rounded-full bg-danger-muted px-2.5 py-0.5 text-xs font-semibold text-danger">Suspended</span>
                ) : (
                  <span className="rounded-full bg-accent-primary-muted px-2.5 py-0.5 text-xs font-semibold text-accent-primary">Active</span>
                )}
                {p.role === 'admin' && (
                  <span className="rounded-full bg-accent-gold-muted px-2.5 py-0.5 text-xs font-bold text-accent-gold">Admin</span>
                )}
              </div>
            </div>
            <dl className="space-y-3">
              {[
                { label: 'Name',      value: p.full_name as string | null },
                { label: 'Email',     value: p.email as string | null },
                { label: 'Phone',     value: p.phone as string | null },
                { label: 'Country',   value: p.country as string | null },
                { label: 'Joined',    value: p.created_at ? formatDateTime(p.created_at as string) : null },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-text-tertiary">{label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-text-primary">{value ?? '—'}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs text-text-tertiary">KYC Status</dt>
                <dd className="mt-0.5">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', KYC_STYLES[(p.kyc_status as string) ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
                    {((p.kyc_status as string) ?? 'unknown').replace('_', ' ')}
                  </span>
                  {((p.kyc_status as string) === 'pending' || (p.kyc_status as string) === 'under_review') && (
                    <Link href={ROUTES.admin.kycReview(params.id)} className="ml-2 text-xs text-accent-primary hover:underline">
                      Review →
                    </Link>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {!isDeleted && (
            <>
              <UserStatusCard userId={params.id} isActive={(p.is_active as boolean) ?? true} isSelf={isSelf} />
              <UserRoleCard userId={params.id} role={(p.role as string) ?? 'user'} isSelf={isSelf} />
              {account && <UserAccountCard userId={params.id} account={account} />}
            </>
          )}

          <DangerZoneCard
            userId={params.id}
            email={p.email as string | null}
            deletedAt={p.deleted_at as string | null}
            isSelf={isSelf}
          />

          {/* Trade stats */}
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
            <h2 className="mb-3 font-display text-sm font-semibold text-text-primary">Trading Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Closed Trades', value: closedTrades.length.toString() },
                { label: 'Total P&L',     value: formatCurrency(totalPnL), positive: totalPnL >= 0 },
                { label: 'Balance',       value: account ? formatCurrency(account.balance ?? 0) : '—' },
                { label: 'Total Trades (lifetime)', value: (account?.total_trades ?? 0).toString() },
              ].map(({ label, value, positive }) => (
                <div key={label} className="rounded-lg bg-bg-elevated p-3">
                  <p className="text-[10px] text-text-tertiary">{label}</p>
                  <p className={cn('mt-0.5 text-sm font-bold tabular-nums', positive === undefined ? 'text-text-primary' : positive ? 'text-accent-primary' : 'text-danger')}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — transactions + audit log */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-border-subtle bg-bg-surface shadow-card">
            <div className="border-b border-border-subtle px-5 py-4">
              <h2 className="font-display text-sm font-semibold text-text-primary">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-elevated">
                    {['Type', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-text-tertiary">No transactions yet</td></tr>
                  ) : transactions.map((t: Record<string, unknown>) => (
                    <tr key={t.id as string} className="hover:bg-bg-elevated transition-colors">
                      <td className="px-4 py-3 capitalize text-sm text-text-primary">{t.type as string}</td>
                      <td className="px-4 py-3 font-mono text-sm tabular-nums text-text-primary">
                        {formatCurrency(t.amount as number)}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">
                        {(t.method as string)?.replace('crypto_demo_', '').toUpperCase() ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-medium capitalize', TX_STATUS_STYLES[(t.status as string) ?? ''] ?? 'text-text-secondary')}>
                          {(t.status as string)?.replace('_', ' ') ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-tertiary whitespace-nowrap">
                        {t.created_at ? formatDateTime(t.created_at as string) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AuditLogList entries={auditLogRaw ?? []} />
        </div>
      </div>
    </div>
  )
}
