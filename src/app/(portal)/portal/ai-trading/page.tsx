import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/supabase/queries'
import { createServerClient } from '@/lib/supabase/server'
import { AIStatusCard } from '@/components/portal/ai-trading/AIStatusCard'
import { StrategySelector } from '@/components/portal/ai-trading/StrategySelector'
import { OpenPositionsTable } from '@/components/portal/ai-trading/OpenPositionsTable'
import { ROUTES } from '@/lib/constants/routes'
import type { AIStrategy, Trade } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'AI Trading',
  robots: { index: false, follow: false },
}

interface AccountWithStrategy {
  id: string
  balance: number | null
  ai_active: boolean | null
  total_profit: number | null
  total_trades: number | null
  winning_trades: number | null
  strategy_id: string | null
  ai_strategies: { id: string; name: string; slug: string } | null
}

export default async function AITradingPage() {
  const user = await getServerUser()
  if (!user) redirect(ROUTES.auth.login)

  const supabase = createServerClient()

  const [accountResult, strategiesResult] = await Promise.all([
    supabase
      .from('accounts')
      .select('id, balance, ai_active, total_profit, total_trades, winning_trades, strategy_id, ai_strategies(id, name, slug)')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single(),
    supabase.from('ai_strategies').select('*').order('win_rate', { ascending: true }),
  ])

  const account = accountResult.data as unknown as AccountWithStrategy | null
  if (!account) redirect(ROUTES.portal.deposit)

  const strategies = (strategiesResult.data ?? []) as AIStrategy[]

  const { data: openTradesRaw } = await supabase
    .from('trades')
    .select('*')
    .eq('account_id', account.id)
    .eq('status', 'open')
    .order('open_at', { ascending: false })

  const openTrades = (openTradesRaw ?? []) as Trade[]

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data: todayTradesRaw } = await supabase
    .from('trades')
    .select('profit_loss')
    .eq('account_id', account.id)
    .eq('status', 'closed')
    .gte('close_at', todayStart.toISOString())

  const todayTradesList = todayTradesRaw as Array<{ profit_loss: number | null }> | null
  const todayPnL = (todayTradesList ?? []).reduce(
    (sum, t) => sum + (t.profit_loss ?? 0),
    0,
  )

  const selectedStrategyId =
    account.strategy_id ?? strategies.find((s) => s.slug === 'balanced')?.id ?? null
  const strategyName = account.ai_strategies?.name ?? 'Balanced'
  const winRate =
    (account.total_trades ?? 0) > 0
      ? Math.round(((account.winning_trades ?? 0) / (account.total_trades ?? 1)) * 100)
      : 0

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="anim-fade-up" style={{ animationDelay: '0ms' }}>
        <AIStatusCard
          accountId={account.id}
          aiActive={account.ai_active ?? true}
          todayPnL={parseFloat(todayPnL.toFixed(2))}
          openPositionsCount={openTrades.length}
          strategyName={strategyName}
        />
      </div>

      <div className="anim-fade-up grid grid-cols-2 gap-4 sm:grid-cols-4" style={{ animationDelay: '60ms' }}>
        {[
          { label: 'Total Profit',   value: `$${(account.total_profit ?? 0).toFixed(2)}`,   positive: (account.total_profit ?? 0) >= 0 },
          { label: 'Total Trades',   value: String(account.total_trades ?? 0),               positive: null },
          { label: 'Winning Trades', value: String(account.winning_trades ?? 0),             positive: null },
          { label: 'Win Rate',       value: `${winRate}%`,                                   positive: winRate >= 60 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-card">
            <p className="text-xs text-text-tertiary">{stat.label}</p>
            <p className={`mt-1 font-display text-xl font-bold tabular-nums ${
              stat.positive === null
                ? 'text-text-primary'
                : stat.positive ? 'text-accent-primary' : 'text-danger'
            }`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="anim-fade-up grid gap-6 lg:grid-cols-2" style={{ animationDelay: '120ms' }}>
        <StrategySelector
          strategies={strategies}
          selectedStrategyId={selectedStrategyId}
          accountId={account.id}
        />
        <OpenPositionsTable initialTrades={openTrades} accountId={account.id} />
      </div>

      <p className="anim-fade-up text-center text-xs text-text-tertiary" style={{ animationDelay: '180ms' }}>
        Trades are executed automatically by the AI engine every 30 minutes. Past performance does not guarantee future results.
      </p>
    </div>
  )
}
