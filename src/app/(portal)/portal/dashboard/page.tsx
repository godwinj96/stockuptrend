import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getServerUser, getProfile } from '@/lib/supabase/queries'
import { KYCStatusBanner } from '@/components/portal/layout/KYCStatusBanner'
import { BalanceWidget } from '@/components/portal/dashboard/BalanceWidget'
import { RecentTransactions } from '@/components/portal/dashboard/RecentTransactions'
import { QuickActions } from '@/components/portal/dashboard/QuickActions'
import { PortfolioMiniChart } from '@/components/portal/dashboard/PortfolioMiniChart'
import { LivePriceTicker } from '@/components/portal/dashboard/LivePriceTicker'
import { AIStatusSuspense } from './AIStatusSuspense'
import { ROUTES } from '@/lib/constants/routes'
import type { Account, Transaction, PortfolioSnapshot, Profile } from '@/lib/supabase/types'

function PositionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-bg-elevated" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-bg-elevated" />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
        <div className="mb-4 h-4 w-24 animate-pulse rounded bg-bg-elevated" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-bg-elevated" />
          ))}
        </div>
      </div>
    </div>
  )
}

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

  // Redirect admins who accidentally land on the portal
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
    <div className="mx-auto max-w-6xl space-y-4">
      {profile && (
        <div className="anim-fade-up" style={{ animationDelay: '0ms' }}>
          <KYCStatusBanner
            status={profile.kyc_status ?? 'not_started'}
            rejectionReason={null}
          />
        </div>
      )}

      {/* Live price ticker — full width */}
      <div className="anim-fade-up" style={{ animationDelay: '40ms' }}>
        <LivePriceTicker />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="anim-fade-up space-y-6 lg:col-span-2" style={{ animationDelay: '80ms' }}>
          <BalanceWidget
            balance={primaryAccount?.balance ?? 0}
            currency={primaryAccount?.currency ?? 'USD'}
            accountNumber={primaryAccount?.account_number ?? '—'}
            accountType={primaryAccount?.account_type ?? 'standard'}
            openTrades={[]}
          />
          <RecentTransactions initialTransactions={recentTransactions ?? []} userId={user.id} />
          {/* Positions stream in independently — SWR in LiveOpenPositions self-populates */}
          {primaryAccount && (
            <Suspense fallback={<PositionsSkeleton />}>
              <AIStatusSuspense
                accountId={primaryAccount.id}
                currency={primaryAccount.currency ?? 'USD'}
                aiActive={primaryAccount.ai_active ?? true}
                strategyName={strategyName}
                totalTrades={primaryAccount.total_trades ?? 0}
                winRate={winRate}
              />
            </Suspense>
          )}
        </div>

        {/* Right column */}
        <div className="anim-fade-up space-y-4" style={{ animationDelay: '160ms' }}>
          <PortfolioMiniChart
            snapshots={snapshots}
            currency={primaryAccount?.currency ?? 'USD'}
          />
          <QuickActions kycStatus={profile?.kyc_status ?? 'not_started'} />
        </div>
      </div>
    </div>
  )
}
