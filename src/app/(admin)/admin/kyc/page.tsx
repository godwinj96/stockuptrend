import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { KYCTable } from '@/components/admin/kyc/KYCTable'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'KYC Review | Admin', robots: { index: false, follow: false } }

const TABS = [
  { label: 'Pending',      value: 'pending' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved',     value: 'approved' },
  { label: 'Rejected',     value: 'rejected' },
  { label: 'All',          value: 'all' },
]

export default async function AdminKYCPage({
  searchParams,
}: { searchParams: { status?: string; page?: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any
  const status = searchParams.status ?? 'pending'
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const statuses = status === 'all'
    ? ['not_started', 'pending', 'under_review', 'approved', 'rejected']
    : [status]

  const { data: profiles, count } = await db
    .from('profiles')
    .select('id, full_name, email, country, kyc_status, created_at', { count: 'exact' })
    .in('kyc_status', statuses)
    .order('created_at', { ascending: false })
    .range(from, to)

  const userIds = (profiles ?? []).map((p: { id: string }) => p.id)
  const { data: docs } = userIds.length
    ? await db.from('kyc_documents').select('user_id').in('user_id', userIds)
    : { data: [] }

  const docCountMap = new Map<string, number>()
  ;(docs ?? []).forEach((d: { user_id: string }) => {
    docCountMap.set(d.user_id, (docCountMap.get(d.user_id) ?? 0) + 1)
  })

  const submissions = (profiles ?? []).map((p: Record<string, unknown>) => ({
    ...p, doc_count: docCountMap.get(p.id as string) ?? 0,
  }))

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex gap-1 rounded-xl border border-border-subtle bg-bg-surface p-1 w-fit">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`${ROUTES.admin.kyc}?status=${tab.value}`}
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

      <KYCTable submissions={submissions} total={count ?? 0} currentPage={page} pageSize={limit} />
    </div>
  )
}
