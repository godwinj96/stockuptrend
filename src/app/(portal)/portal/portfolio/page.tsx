import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { getServerUser } from '@/lib/supabase/queries'
import { createServerClient } from '@/lib/supabase/server'
import { PerformanceChart } from '@/components/portal/portfolio/PerformanceChart'
import { StatsGrid } from '@/components/portal/portfolio/StatsGrid'
import { MonthlyPnLChart } from '@/components/portal/portfolio/MonthlyPnLChart'
import { ROUTES } from '@/lib/constants/routes'
import type { PortfolioSnapshot } from '@/lib/supabase/types'
import type { MonthlyPnLData } from '@/components/portal/portfolio/MonthlyPnLChart'

export const metadata: Metadata = {
  title: 'Portfolio',
  robots: { index: false, follow: false },
}

interface AccountRow {
  id: string
  balance: number | null
  currency: string | null
  total_profit: number | null
  total_trades: number | null
  winning_trades: number | null
}

export default async function PortfolioPage() {
  const user = await getServerUser()
  if (!user) redirect(ROUTES.auth.login)

  const supabase = createServerClient()

  const [accountResult, snapshotsResult, tradesResult, depositsResult] = await Promise.all([
    supabase
      .from('accounts')
      .select('id, balance, currency, total_profit, total_trades, winning_trades')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single(),
    supabase
      .from('portfolio_snapshots')
      .select('*')
      .eq('user_id', user.id)
      .order('snapshot_at', { ascending: true })
      .limit(90),
    supabase
      .from('trades')
      .select('profit_loss, close_at')
      .eq('user_id', user.id)
      .eq('status', 'closed')
      .not('close_at', 'is', null),
    supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'deposit')
      .eq('status', 'completed'),
  ])

  const account = accountResult.data as unknown as AccountRow | null
  if (!account) redirect(ROUTES.portal.deposit)

  const snapshots = (snapshotsResult.data ?? []) as PortfolioSnapshot[]

  const depositRows = depositsResult.data as Array<{ amount: number }> | null
  const totalInvested = (depositRows ?? []).reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const tradeRows = tradesResult.data as Array<{ profit_loss: number | null; close_at: string | null }> | null
  const monthlyMap = new Map<string, number>()
  for (const trade of tradeRows ?? []) {
    if (!trade.close_at) continue
    const monthKey = format(new Date(trade.close_at), 'MMM yy')
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) ?? 0) + (trade.profit_loss ?? 0))
  }
  const monthlyData: MonthlyPnLData[] = Array.from(monthlyMap.entries())
    .map(([month, pnl]) => ({ month, pnl: parseFloat(pnl.toFixed(2)) }))
    .slice(-12)

  const winRate =
    (account.total_trades ?? 0) > 0
      ? Math.round(((account.winning_trades ?? 0) / (account.total_trades ?? 1)) * 100)
      : 0

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="anim-fade-up" style={{ animationDelay: '0ms' }}>
        <StatsGrid
          totalInvested={totalInvested}
          currentBalance={account.balance ?? 0}
          totalProfit={account.total_profit ?? 0}
          winRate={winRate}
          totalTrades={account.total_trades ?? 0}
          currency={account.currency ?? 'USD'}
        />
      </div>

      <div className="anim-fade-up rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card" style={{ animationDelay: '80ms' }}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold text-text-primary">Balance Over Time</h3>
            <p className="text-xs text-text-tertiary">Last 90 days of trading activity</p>
          </div>
          {snapshots.length > 0 && (
            <span className="rounded-full bg-accent-primary-muted px-2.5 py-0.5 text-xs font-medium text-accent-primary">
              {snapshots.length} data points
            </span>
          )}
        </div>
        <PerformanceChart snapshots={snapshots} currency={account.currency ?? 'USD'} />
      </div>

      <div className="anim-fade-up rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card" style={{ animationDelay: '160ms' }}>
        <div className="mb-4">
          <h3 className="font-display text-sm font-semibold text-text-primary">Monthly P&L</h3>
          <p className="text-xs text-text-tertiary">Profit and loss by calendar month</p>
        </div>
        <MonthlyPnLChart monthlyData={monthlyData} />
      </div>
    </div>
  )
}
