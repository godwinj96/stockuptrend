import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'Users | Admin', robots: { index: false, follow: false } }

const KYC_STYLES: Record<string, string> = {
  approved:     'bg-accent-primary-muted text-accent-primary',
  pending:      'bg-warning/10 text-warning',
  under_review: 'bg-accent-secondary-muted text-accent-secondary',
  rejected:     'bg-danger-muted text-danger',
  not_started:  'bg-bg-elevated text-text-tertiary',
}

const ACCOUNT_STYLES: Record<string, string> = {
  standard: 'bg-accent-secondary-muted text-accent-secondary',
  pro:      'bg-accent-primary-muted text-accent-primary',
  vip:      'bg-accent-gold-muted text-accent-gold',
}

export default async function AdminUsersPage({
  searchParams,
}: { searchParams: { search?: string; account_type?: string; kyc_status?: string; page?: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any
  const search = searchParams.search ?? ''
  const accountType = searchParams.account_type ?? ''
  const kycStatus = searchParams.kyc_status ?? ''
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('profiles')
    .select('id, full_name, email, kyc_status, account_type, role, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  if (accountType) query = query.eq('account_type', accountType)
  if (kycStatus) query = query.eq('kyc_status', kycStatus)

  const { data: profiles, count } = await query

  const userIds = (profiles ?? []).map((p: { id: string }) => p.id)
  const { data: accounts } = userIds.length
    ? await db.from('accounts').select('user_id, balance, currency').in('user_id', userIds).eq('is_active', true)
    : { data: [] }
  const balanceMap = new Map(
    (accounts ?? []).map((a: { user_id: string; balance: number; currency: string }) => [a.user_id, a])
  )

  const totalPages = Math.ceil((count ?? 0) / limit)

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Search + filters */}
      <form className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search name or email…"
            className="input-field pl-9 text-sm w-64"
          />
        </div>
        <select name="account_type" defaultValue={accountType} className="input-field text-sm w-36">
          <option value="">All tiers</option>
          <option value="standard">Standard</option>
          <option value="pro">Pro</option>
          <option value="vip">VIP</option>
        </select>
        <select name="kyc_status" defaultValue={kycStatus} className="input-field text-sm w-44">
          <option value="">All KYC status</option>
          <option value="not_started">Not started</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit" className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-text-inverse hover:bg-accent-primary-hover transition-colors">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-elevated">
              {['User', 'Tier', 'Balance', 'KYC Status', 'Role', 'Registered', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {(profiles ?? []).length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-text-tertiary">No users found</td></tr>
            ) : (profiles ?? []).map((p: Record<string, unknown>) => {
              const acct = balanceMap.get(p.id as string) as { balance: number; currency: string } | undefined
              return (
                <tr key={p.id as string} className="bg-bg-surface transition-colors hover:bg-bg-elevated">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-primary">{(p.full_name as string) ?? '—'}</p>
                    <p className="text-xs text-text-tertiary">{(p.email as string) ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', ACCOUNT_STYLES[(p.account_type as string) ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
                      {(p.account_type as string) ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm tabular-nums text-text-primary">
                    {acct ? formatCurrency(acct.balance) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', KYC_STYLES[(p.kyc_status as string) ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
                      {((p.kyc_status as string) ?? 'unknown').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.role === 'admin' && (
                      <span className="rounded-full bg-accent-gold-muted px-2.5 py-0.5 text-xs font-bold text-accent-gold">Admin</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-tertiary whitespace-nowrap">
                    {p.created_at ? formatDateTime(p.created_at as string) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={ROUTES.admin.user(p.id as string)} className="flex items-center gap-1 text-xs font-medium text-accent-primary hover:underline underline-offset-2">
                      View <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-text-tertiary">Page {page} of {totalPages} · {count} users</p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link href={`${ROUTES.admin.users}?page=${page - 1}${search ? `&search=${search}` : ''}`}
                className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-elevated">
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`${ROUTES.admin.users}?page=${page + 1}${search ? `&search=${search}` : ''}`}
                className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-elevated">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
