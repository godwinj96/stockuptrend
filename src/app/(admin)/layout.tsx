import { redirect } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'
import { ROUTES } from '@/lib/constants/routes'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: profileRaw }, ...countResults] = await Promise.all([
    db.from('profiles').select('full_name, email, role').eq('id', user.id).single(),
    db.from('transactions').select('id', { count: 'exact', head: true }).eq('type', 'deposit').eq('status', 'pending_review'),
    db.from('profiles').select('id', { count: 'exact', head: true }).in('kyc_status', ['pending', 'under_review']),
    db.from('transactions').select('id', { count: 'exact', head: true }).eq('type', 'withdrawal').eq('status', 'pending_review'),
    db.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
  ])

  const profile = profileRaw as { full_name: string | null; email: string | null; role: string | null } | null
  if (profile?.role !== 'admin') redirect(ROUTES.portal.dashboard)

  const typedCounts = countResults as Array<{ count: number | null }>
  const [deposits, kyc, withdrawals, tickets] = [typedCounts[0], typedCounts[1], typedCounts[2], typedCounts[3]]

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <AdminSidebar
        pendingDeposits={deposits?.count ?? 0}
        pendingKyc={kyc?.count ?? 0}
        pendingWithdrawals={withdrawals?.count ?? 0}
        openTickets={tickets?.count ?? 0}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          adminName={profile?.full_name ?? ''}
          adminEmail={profile?.email ?? ''}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
