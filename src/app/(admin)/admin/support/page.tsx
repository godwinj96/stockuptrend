import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { formatDateTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'Support | Admin', robots: { index: false, follow: false } }

const TABS = [
  { label: 'Open',     value: 'open' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'All',      value: 'all' },
]

const STATUS_STYLES: Record<string, string> = {
  open:        'bg-warning/10 text-warning',
  in_progress: 'bg-accent-secondary-muted text-accent-secondary',
  resolved:    'bg-accent-primary-muted text-accent-primary',
}

export default async function AdminSupportPage({
  searchParams,
}: { searchParams: { status?: string; page?: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any
  const status = searchParams.status ?? 'open'
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('support_tickets')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status !== 'all') {
    query = status === 'open' ? query.in('status', ['open', 'in_progress']) : query.eq('status', status)
  }

  const { data: tickets, count } = await query

  const userIds = [...new Set((tickets ?? []).map((t: { user_id: string }) => t.user_id))]
  const { data: profiles } = userIds.length
    ? await db.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] }
  const profileMap = new Map((profiles ?? []).map((p: { id: string }) => [p.id, p]))

  const totalPages = Math.ceil((count ?? 0) / limit)

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex gap-1 rounded-xl border border-border-subtle bg-bg-surface p-1 w-fit">
        {TABS.map((tab) => (
          <Link key={tab.value} href={`${ROUTES.admin.support}?status=${tab.value}`}
            className={cn('rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
              status === tab.value ? 'bg-accent-primary-muted text-accent-primary' : 'text-text-secondary hover:text-text-primary')}>
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-elevated">
              {['User', 'Subject', 'Category', 'Status', 'Created', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {(tickets ?? []).length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-text-tertiary">No tickets found</td></tr>
            ) : (tickets ?? []).map((t: Record<string, unknown>) => {
              const user_ = profileMap.get(t.user_id as string) as { full_name: string | null; email: string | null } | undefined
              return (
                <tr key={t.id as string} className="bg-bg-surface transition-colors hover:bg-bg-elevated">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-primary">{user_?.full_name ?? '—'}</p>
                    <p className="text-xs text-text-tertiary">{user_?.email ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="truncate text-sm text-text-primary">{t.subject as string}</p>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-text-secondary">{t.category as string}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STATUS_STYLES[(t.status as string) ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
                      {(t.status as string)?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-tertiary whitespace-nowrap">
                    {t.created_at ? formatDateTime(t.created_at as string) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={ROUTES.admin.ticket(t.id as string)} className="flex items-center gap-1 text-xs font-medium text-accent-primary hover:underline underline-offset-2">
                      Reply <ArrowRight className="h-3 w-3" />
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
          <p className="text-text-tertiary">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            {page > 1 && <Link href={`${ROUTES.admin.support}?status=${status}&page=${page - 1}`} className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-elevated">Previous</Link>}
            {page < totalPages && <Link href={`${ROUTES.admin.support}?status=${status}&page=${page + 1}`} className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-elevated">Next</Link>}
          </div>
        </div>
      )}
    </div>
  )
}
