import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import {
  simulateTradeClose,
  buildNewTrades,
  DEFAULT_STRATEGY,
} from '@/lib/trading/simulate'
import type { StrategyConfig, OpenTradeRow } from '@/lib/trading/simulate'

export const runtime = 'nodejs'
export const maxDuration = 300

interface AccountRow {
  id: string
  user_id: string
  balance: number
  ai_active: boolean | null
  total_profit: number | null
  total_trades: number | null
  winning_trades: number | null
  ai_strategies: StrategyConfig | null
}

export async function GET(_req: NextRequest) {
  const serviceSupabase = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceSupabase as any
  const nowMs = Date.now()
  const nowIso = new Date(nowMs).toISOString()

  const { data: accountsRaw, error: accountsError } = await serviceSupabase
    .from('accounts')
    .select(`
      id,
      user_id,
      balance,
      ai_active,
      total_profit,
      total_trades,
      winning_trades,
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
    console.error('simulate-trades: failed to fetch accounts', accountsError)
    return NextResponse.json({ error: 'DB error fetching accounts' }, { status: 500 })
  }

  const accounts = accountsRaw as unknown as AccountRow[]
  const results: Array<{ accountId: string; closed: number; opened: number; error?: string }> = []

  for (const account of accounts) {
    try {
      const strategy: StrategyConfig = account.ai_strategies ?? DEFAULT_STRATEGY

      const { data: openTradesRaw } = await serviceSupabase
        .from('trades')
        .select('id, symbol, direction, volume, open_price, stop_loss, take_profit, open_at, account_id, user_id')
        .eq('account_id', account.id)
        .eq('status', 'open')

      const openTrades = (openTradesRaw ?? []) as OpenTradeRow[]

      let balanceDelta = 0
      let winCount = 0
      let closedCount = 0

      // Evaluate every open trade individually — close if TP or SL hit
      for (const trade of openTrades) {
        const result = simulateTradeClose(trade, strategy, nowMs)
        if (!result) continue

        const { error: updateErr } = await db
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
          console.error(`simulate-trades: failed to close trade ${trade.id}`, updateErr)
          continue
        }

        balanceDelta += result.profit_loss
        if (result.close_reason === 'take_profit') winCount++
        closedCount++

        const sign = result.profit_loss >= 0 ? '+' : ''
        const resultLabel = result.close_reason === 'take_profit' ? '✅ TP Hit' : '🔴 SL Hit'
        await db.from('notifications').insert({
          user_id: account.user_id,
          type:    'trade_closed',
          title:   `${resultLabel}: ${trade.symbol}`,
          body:    `Your ${trade.direction.toUpperCase()} on ${trade.symbol} closed ${result.close_reason === 'take_profit' ? 'at take profit' : 'at stop loss'} — ${sign}$${Math.abs(result.profit_loss).toFixed(2)}.`,
          is_read: false,
        })
      }

      const newBalance = Math.max(0, (account.balance ?? 0) + balanceDelta)

      await db
        .from('accounts')
        .update({
          balance:        newBalance,
          total_profit:   (account.total_profit ?? 0) + balanceDelta,
          total_trades:   (account.total_trades ?? 0) + closedCount,
          winning_trades: (account.winning_trades ?? 0) + winCount,
        })
        .eq('id', account.id)

      await db.from('portfolio_snapshots').insert({
        user_id:     account.user_id,
        account_id:  account.id,
        balance:     newBalance,
        equity:      newBalance,
        snapshot_at: nowIso,
      })

      // Open new trades with staggered timestamps and TP/SL
      const newTradeSpecs = buildNewTrades(account.id, account.user_id, openTrades, strategy)
      if (newTradeSpecs.length > 0) {
        await db.from('trades').insert(newTradeSpecs)
      }

      results.push({ accountId: account.id, closed: closedCount, opened: newTradeSpecs.length })
    } catch (err) {
      console.error(`simulate-trades: error processing account ${account.id}`, err)
      results.push({ accountId: account.id, closed: 0, opened: 0, error: String(err) })
    }
  }

  return NextResponse.json({ success: true, processed: results.length, results, timestamp: nowIso })
}
