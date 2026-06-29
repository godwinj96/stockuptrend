import { createServerClient } from '@/lib/supabase/server'
import { AIStatusWidget } from '@/components/portal/dashboard/AIStatusWidget'
import { LiveOpenPositions } from '@/components/portal/dashboard/LiveOpenPositions'

interface Props {
  accountId: string
  currency: string
  aiActive: boolean
  strategyName: string
  totalTrades: number
  winRate: number
}

export async function AIStatusSuspense({
  accountId,
  currency,
  aiActive,
  strategyName,
  totalTrades,
  winRate,
}: Props) {
  const supabase = createServerClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [openPositionsResult, todayPnLResult, lastTradeResult] = await Promise.all([
    supabase
      .from('trades')
      .select('id, symbol, direction, volume, open_price, open_at')
      .eq('account_id', accountId)
      .eq('status', 'open')
      .limit(20),
    supabase
      .from('trades')
      .select('profit_loss')
      .eq('account_id', accountId)
      .eq('status', 'closed')
      .gte('close_at', todayStart.toISOString()),
    supabase
      .from('trades')
      .select('symbol, direction, profit_loss')
      .eq('account_id', accountId)
      .eq('status', 'closed')
      .order('close_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const openTrades = (openPositionsResult.data ?? []) as Array<{
    id: string
    symbol: string
    direction: 'buy' | 'sell'
    volume: number
    open_price: number
    open_at: string
  }>

  const todayPnL = (todayPnLResult.data ?? []).reduce(
    (sum: number, t: { profit_loss: number | null }) => sum + (t.profit_loss ?? 0),
    0,
  )

  const lastTrade = lastTradeResult.data as {
    symbol: string
    direction: 'buy' | 'sell'
    profit_loss: number
  } | null

  return (
    <>
      <LiveOpenPositions initialTrades={openTrades} accountId={accountId} />
      <AIStatusWidget
        aiActive={aiActive}
        openPositions={openTrades.length}
        strategyName={strategyName}
        totalTrades={totalTrades}
        winRate={winRate}
        todayPnL={todayPnL}
        lastTrade={lastTrade}
        currency={currency}
      />
    </>
  )
}
