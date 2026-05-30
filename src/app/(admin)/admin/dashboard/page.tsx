import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminStatsGrid } from '@/components/admin/dashboard/AdminStatsGrid'
import { PendingQueue } from '@/components/admin/dashboard/PendingQueue'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Admin Dashboard | StockUptrend',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [
    { count: totalUsers },
    { count: pendingDepositsCount },
    { count: pendingKycCount },
    { count: pendingWithdrawalsCount },
    { count: openTicketsCount },
    { data: volumeRows },
    { data: recentDeposits },
    { data: kycQueue },
    { data: ticketQueue },
  ] = await Promise.all([
    db.from('profiles').select('id', { count: 'exact', head: true }),
    db.from('transactions').select('id', { count: 'exact', head: true }).eq('type', 'deposit').eq('status', 'pending_review'),
    db.from('profiles').select('id', { count: 'exact', head: true }).in('kyc_status', ['pending', 'under_review']),
    db.from('transactions').select('id', { count: 'exact', head: true }).eq('type', 'withdrawal').eq('status', 'pending_review'),
    db.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    db.from('transactions').select('amount').eq('type', 'deposit').eq('status', 'completed'),
    db.from('transactions').select('id, amount, currency, created_at, user_id').eq('type', 'deposit').eq('status', 'pending_review').order('created_at', { ascending: false }).limit(5),
    db.from('profiles').select('id, full_name, email, created_at').in('kyc_status', ['pending', 'under_review']).order('created_at', { ascending: false }).limit(5),
    db.from('support_tickets').select('id, subject, category, created_at, user_id').in('status', ['open', 'in_progress']).order('created_at', { ascending: false }).limit(5),
  ])

  const totalVolume = (volumeRows ?? []).reduce((s: number, t: { amount: number }) => s + t.amount, 0)

  const depositUserIds = [...new Set((recentDeposits ?? []).map((d: { user_id: string }) => d.user_id))]
  const ticketUserIds = [...new Set((ticketQueue ?? []).map((t: { user_id: string }) => t.user_id))]
  const allUserIds = [...new Set([...depositUserIds, ...ticketUserIds])]

  const { data: profiles } = allUserIds.length
    ? await db.from('profiles').select('id, full_name, email').in('id', allUserIds)
    : { data: [] }
  const profileMap = new Map((profiles ?? []).map((p: { id: string }) => [p.id, p]))

  const kycIds = (kycQueue ?? []).map((k: { id: string }) => k.id)
  const { data: kyc_docs } = kycIds.length
    ? await db.from('kyc_documents').select('user_id').in('user_id', kycIds)
    : { data: [] }
  const docCountMap = new Map<string, number>()
  ;(kyc_docs ?? []).forEach((d: { user_id: string }) => {
    docCountMap.set(d.user_id, (docCountMap.get(d.user_id) ?? 0) + 1)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deposits = (recentDeposits ?? []).map((d: any) => ({ ...d, user: profileMap.get(d.user_id) ?? null }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kycSubmissions = (kycQueue ?? []).map((k: any) => ({ ...k, doc_count: docCountMap.get(k.id) ?? 0 }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tickets = (ticketQueue ?? []).map((t: any) => ({ ...t, user: profileMap.get(t.user_id) ?? null }))

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="anim-fade-up" style={{ animationDelay: '0ms' }}>
        <AdminStatsGrid
          totalUsers={totalUsers ?? 0}
          pendingDeposits={pendingDepositsCount ?? 0}
          pendingKyc={pendingKycCount ?? 0}
          openTickets={openTicketsCount ?? 0}
          pendingWithdrawals={pendingWithdrawalsCount ?? 0}
          totalVolume={parseFloat(totalVolume.toFixed(2))}
        />
      </div>
      <div className="anim-fade-up" style={{ animationDelay: '80ms' }}>
        <PendingQueue deposits={deposits} kycSubmissions={kycSubmissions} tickets={tickets} />
      </div>
    </div>
  )
}
