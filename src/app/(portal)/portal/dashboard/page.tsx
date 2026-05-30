import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getServerUser, getProfile } from '@/lib/supabase/queries'
import { KYCStatusBanner } from '@/components/portal/layout/KYCStatusBanner'
import { BalanceWidget } from '@/components/portal/dashboard/BalanceWidget'
import { RecentTransactions } from '@/components/portal/dashboard/RecentTransactions'
import { QuickActions } from '@/components/portal/dashboard/QuickActions'
import { PortfolioMiniChart } from '@/components/portal/dashboard/PortfolioMiniChart'
import { AIStatusWidget } from '@/components/portal/dashboard/AIStatusWidget'
import { ROUTES } from '@/lib/constants/routes'
import type { Account, Transaction, PortfolioSnapshot, Profile } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { preview?: string }
}) {
  const user = await getServerUser()
  if (!user) redirect(ROUTES.auth.login)

  const supabase = createServerClient()

  const [profile, accountsResult, txResult, snapshotsResult] = await Promise.all([
    getProfile(user.id),
    supabase
      .from('accounts')
      .select('*, ai_strategies(id, name, slug)')
      .eq('user_id', user.id)
      .eq('is_active', true),
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('portfolio_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .order('snapshot_at', { ascending: true })
      .limit(14),
  ])

  const accounts = accountsResult.data as Account[] | null
  const recentTransactions = txResult.data as Transaction[] | null
  const snapshots = (snapshotsResult.data ?? []) as PortfolioSnapshot[]
  const primaryAccount = accounts?.[0] ?? null

  // Fetch open positions count
  const { count: openPositionsCount } = primaryAccount
    ? await supabase
        .from('trades')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', primaryAccount.id)
        .eq('status', 'open')
    : { count: 0 }

  // Redirect admins who accidentally land on the portal — unless they came here intentionally via ?preview=1
  const isAdmin = (profile as Profile & { role?: string } | null)?.role === 'admin'
  if (isAdmin && searchParams.preview !== '1') {
    redirect(ROUTES.admin.dashboard)
  }

  const accountWithStrategy = primaryAccount as unknown as (Account & { ai_strategies?: { name: string } | null }) | null
  const strategyName = accountWithStrategy?.ai_strategies?.name ?? 'Balanced'
  const winRate =
    (primaryAccount?.total_trades ?? 0) > 0
      ? Math.round(((primaryAccount?.winning_trades ?? 0) / (primaryAccount?.total_trades ?? 1)) * 100)
      : 0

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {profile && (
        <div className="anim-fade-up" style={{ animationDelay: '0ms' }}>
          <KYCStatusBanner
            status={profile.kyc_status ?? 'not_started'}
            rejectionReason={null}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="anim-fade-up space-y-6 lg:col-span-2" style={{ animationDelay: '80ms' }}>
          <BalanceWidget
            balance={primaryAccount?.balance ?? 0}
            currency={primaryAccount?.currency ?? 'USD'}
            accountNumber={primaryAccount?.account_number ?? '—'}
            accountType={primaryAccount?.account_type ?? 'standard'}
          />
          <RecentTransactions initialTransactions={recentTransactions ?? []} userId={user.id} />
        </div>

        <div className="anim-fade-up space-y-4" style={{ animationDelay: '160ms' }}>
          <PortfolioMiniChart
            snapshots={snapshots}
            currency={primaryAccount?.currency ?? 'USD'}
          />
          {primaryAccount && (
            <AIStatusWidget
              aiActive={primaryAccount.ai_active ?? true}
              openPositions={openPositionsCount ?? 0}
              strategyName={strategyName}
              totalTrades={primaryAccount.total_trades ?? 0}
              winRate={winRate}
            />
          )}
          <QuickActions kycStatus={profile?.kyc_status ?? 'not_started'} />
        </div>
      </div>
    </div>
  )
}
