import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import {
  simulateTradeClose,
  buildNewTrades,
  DEFAULT_STRATEGY,
} from '@/lib/trading/simulate'
import type { StrategyConfig, OpenTradeRow } from '@/lib/trading/simulate'

export const runtime = 'nodejs'
export const maxDuration = 60

// Number of trading sessions to simulate in one daily invocation.
// Mimics activity spread across the day (e.g. 6 × 4-hour windows).
const DAILY_CYCLES = 6

interface AccountRow {
  id: string
  user_id: string
  balance: number
  ai_active: boolean | null
  total_profit: number | null
  total_trades: number | null
  winning_trades: number | null
  preferred_symbols: string[] | null
  ai_strategies: StrategyConfig | null
}

async function runCycle(
  db: ReturnType<typeof createServiceRoleClient>,
  cycleMs: number,
): Promise<Array<{ accountId: string; closed: number; opened: number; error?: string }>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyDb = db as any
  const cycleIso = new Date(cycleMs).toISOString()

  const { data: accountsRaw, error: accountsError } = await db
    .from('accounts')
    .select(`
      id,
      user_id,
      balance,
      ai_active,
      total_profit,
      total_trades,
      winning_trades,
      preferred_symbols,
      ai_strategies (
        win_rate,
        risk_per_trade,
        trades_per_cycle_min,
        trades_per_cycle_max,
        closes_per_cycle_min,
        closes_per_cycle_max
      )
    `)
    .eq('is_active', true)
    .eq('ai_active', true)
    .gt('balance', 0)

  if (accountsError || !accountsRaw) {
    // eslint-disable-next-line no-console
    console.error('simulate-trades: failed to fetch accounts', accountsError)
    return []
  }

  const accounts = accountsRaw as unknown as AccountRow[]
  const results: Array<{ accountId: string; closed: number; opened: number; error?: string }> = []

  for (const account of accounts) {
    try {
      const strategy: StrategyConfig = account.ai_strategies ?? DEFAULT_STRATEGY
      const preferredSymbols: string[] = account.preferred_symbols ?? []

      const { data: openTradesRaw } = await db
        .from('trades')
        .select('id, symbol, direction, volume, open_price, stop_loss, take_profit, open_at, account_id, user_id')
        .eq('account_id', account.id)
        .eq('status', 'open')

      const openTrades = (openTradesRaw ?? []) as OpenTradeRow[]

      let balanceDelta = 0
      let winCount = 0
      let closedCount = 0

      for (const trade of openTrades) {
        const result = simulateTradeClose(trade, strategy, cycleMs)
        if (!result) continue

        const { error: updateErr } = await anyDb
          .from('trades')
          .update({
            status:       'closed',
            close_price:  result.close_price,
            profit_loss:  result.profit_loss,
            close_at:     result.close_at,
            close_reason: result.close_reason,
          })
          .eq('id', trade.id)

        if (updateErr) {
          // eslint-disable-next-line no-console
          console.error(`simulate-trades: failed to close trade ${trade.id}`, updateErr)
          continue
        }

        balanceDelta += result.profit_loss
        if (result.close_reason === 'take_profit') winCount++
        closedCount++

        const sign = result.profit_loss >= 0 ? '+' : ''
        const resultLabel = result.close_reason === 'take_profit' ? '✅ TP Hit' : '🔴 SL Hit'
        await anyDb.from('notifications').insert({
          user_id: account.user_id,
          type:    'trade_closed',
          title:   `${resultLabel}: ${trade.symbol}`,
          body:    `Your ${trade.direction.toUpperCase()} on ${trade.symbol} closed ${result.close_reason === 'take_profit' ? 'at take profit' : 'at stop loss'} — ${sign}$${Math.abs(result.profit_loss).toFixed(2)}.`,
          is_read: false,
        })
      }

      const newBalance = Math.max(0, (account.balance ?? 0) + balanceDelta)

      await anyDb
        .from('accounts')
        .update({
          balance:        newBalance,
          total_profit:   (account.total_profit ?? 0) + balanceDelta,
          total_trades:   (account.total_trades ?? 0) + closedCount,
          winning_trades: (account.winning_trades ?? 0) + winCount,
        })
        .eq('id', account.id)

      // Snapshot once per cycle (idempotency window: 3 hours)
      const threeHoursAgo = new Date(cycleMs - 3 * 60 * 60 * 1000).toISOString()
      const { count: recentSnapshotCount } = await db
        .from('portfolio_snapshots')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', account.id)
        .gte('snapshot_at', threeHoursAgo)

      if (!recentSnapshotCount || recentSnapshotCount === 0) {
        await anyDb.from('portfolio_snapshots').insert({
          user_id:     account.user_id,
          account_id:  account.id,
          balance:     newBalance,
          equity:      newBalance,
          snapshot_at: cycleIso,
        })
      }

      const newTradeSpecs = buildNewTrades(
        account.id,
        account.user_id,
        openTrades,
        strategy,
        preferredSymbols,
      )
      if (newTradeSpecs.length > 0) {
        await anyDb.from('trades').insert(newTradeSpecs)
      }

      results.push({ accountId: account.id, closed: closedCount, opened: newTradeSpecs.length })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`simulate-trades: error processing account ${account.id}`, err)
      results.push({ accountId: account.id, closed: 0, opened: 0, error: String(err) })
    }
  }

  return results
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceRoleClient()
  const startMs = Date.now()
  // Spread DAILY_CYCLES evenly across the past 24 hours so timestamps look realistic
  const intervalMs = (24 * 60 * 60 * 1000) / DAILY_CYCLES

  const allResults: Array<{ cycle: number; results: Array<{ accountId: string; closed: number; opened: number; error?: string }> }> = []

  for (let i = 0; i < DAILY_CYCLES; i++) {
    const cycleMs = startMs - (DAILY_CYCLES - 1 - i) * intervalMs
    const cycleResults = await runCycle(db, cycleMs)
    allResults.push({ cycle: i + 1, results: cycleResults })
  }

  return NextResponse.json({
    success: true,
    cycles: DAILY_CYCLES,
    timestamp: new Date(startMs).toISOString(),
    results: allResults,
  })
}
