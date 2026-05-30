import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { DepositsTable } from '@/components/admin/deposits/DepositsTable'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'Deposits | Admin', robots: { index: false, follow: false } }

const TABS = [
  { label: 'Pending', value: 'pending_review' },
  { label: 'Approved', value: 'completed' },
  { label: 'Rejected', value: 'failed' },
  { label: 'All', value: 'all' },
]

export default async function AdminDepositsPage({
  searchParams,
}: { searchParams: { status?: string; page?: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any
  const status = searchParams.status ?? 'pending_review'
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('transactions')
    .select('*', { count: 'exact' })
    .eq('type', 'deposit')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status !== 'all') query = query.eq('status', status)

  const { data: transactions, count } = await query

  const userIds = [...new Set((transactions ?? []).map((t: { user_id: string }) => t.user_id))]
  const { data: profiles } = userIds.length
    ? await db.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] }
  const profileMap = new Map((profiles ?? []).map((p: { id: string }) => [p.id, p]))

  const deposits = (transactions ?? []).map((t: Record<string, unknown>) => ({
    ...t, user: profileMap.get(t.user_id as string) ?? null,
  }))

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex gap-1 rounded-xl border border-border-subtle bg-bg-surface p-1 w-fit">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`${ROUTES.admin.deposits}?status=${tab.value}`}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
              status === tab.value
                ? 'bg-accent-primary-muted text-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <DepositsTable
        deposits={deposits}
        total={count ?? 0}
        currentPage={page}
        pageSize={limit}
      />
    </div>
  )
}
