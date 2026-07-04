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
// Co-located with the Supabase project (eu-west-2) to cut round-trip latency on the
// many sequential DB calls this job makes. Vercel Hobby always runs in iad1
// regardless of this setting — this only takes effect on plans that support region
// pinning; verify/set the project's function region in the Vercel dashboard too.
export const preferredRegion = 'lhr1'

// Number of trading sessions to simulate in one daily invocation.
// Mimics activity spread across the day (e.g. 6 × 4-hour windows).
const DAILY_CYCLES = 6

// Accounts within a single cycle are independent of each other, so they're processed
// concurrently instead of one-at-a-time — bounded so we don't overwhelm Supabase's
// connection pool. This (plus batching the per-trade writes below) is what keeps a
// growing account base from pushing the whole invocation past Vercel's 60s ceiling.
const ACCOUNT_CONCURRENCY = 8

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

type CycleResult = { accountId: string; closed: number; opened: number; error?: string }

/** Runs `worker` over `items` with at most `limit` in flight at once. */
async function processWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0
  async function next(): Promise<void> {
    const current = index++
    const item = items[current]
    if (item === undefined) return
    await worker(item)
    return next()
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next))
}

async function processAccount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  account: AccountRow,
  cycleMs: number,
  cycleIso: string,
  results: CycleResult[],
): Promise<void> {
  try {
    const strategy: StrategyConfig = account.ai_strategies ?? DEFAULT_STRATEGY
    const preferredSymbols: string[] = account.preferred_symbols ?? []

    const { data: openTradesRaw } = await db
      .from('trades')
      .select('id, symbol, direction, volume, open_price, stop_loss, take_profit, open_at, account_id, user_id')
      .eq('account_id', account.id)
      .eq('status', 'open')

    const openTrades = (openTradesRaw ?? []) as OpenTradeRow[]

    const closes = openTrades
      .map((trade) => ({ trade, result: simulateTradeClose(trade, strategy, cycleMs) }))
      .filter((c): c is { trade: OpenTradeRow; result: NonNullable<ReturnType<typeof simulateTradeClose>> } => c.result !== null)

    // Batch the per-trade writes: all trade-close updates run concurrently (one
    // round-trip each, in flight together) and all notifications go in a single
    // insert, instead of N sequential round-trips per account.
    const updateResults = await Promise.all(
      closes.map(({ trade, result }) =>
        db
          .from('trades')
          .update({
            status: 'closed',
            close_price: result.close_price,
            profit_loss: result.profit_loss,
            close_at: result.close_at,
            close_reason: result.close_reason,
          })
          .eq('id', trade.id),
      ),
    )

    let balanceDelta = 0
    let winCount = 0
    let closedCount = 0
    const notificationRows: Array<Record<string, unknown>> = []

    closes.forEach(({ trade, result }, i) => {
      if (updateResults[i].error) {
        // eslint-disable-next-line no-console
        console.error(`simulate-trades: failed to close trade ${trade.id}`, updateResults[i].error)
        return
      }
      balanceDelta += result.profit_loss
      if (result.close_reason === 'take_profit') winCount++
      closedCount++

      const sign = result.profit_loss >= 0 ? '+' : ''
      const resultLabel = result.close_reason === 'take_profit' ? '✅ TP Hit' : '🔴 SL Hit'
      notificationRows.push({
        user_id: account.user_id,
        type: 'trade_closed',
        title: `${resultLabel}: ${trade.symbol}`,
        body: `Your ${trade.direction.toUpperCase()} on ${trade.symbol} closed ${result.close_reason === 'take_profit' ? 'at take profit' : 'at stop loss'} — ${sign}$${Math.abs(result.profit_loss).toFixed(2)}.`,
        is_read: false,
      })
    })

    if (notificationRows.length > 0) {
      await db.from('notifications').insert(notificationRows)
    }

    const newBalance = Math.max(0, (account.balance ?? 0) + balanceDelta)

    const [, snapshotCountResult] = await Promise.all([
      db
        .from('accounts')
        .update({
          balance: newBalance,
          total_profit: (account.total_profit ?? 0) + balanceDelta,
          total_trades: (account.total_trades ?? 0) + closedCount,
          winning_trades: (account.winning_trades ?? 0) + winCount,
        })
        .eq('id', account.id),
      // Snapshot idempotency window: 3 hours
      db
        .from('portfolio_snapshots')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', account.id)
        .gte('snapshot_at', new Date(cycleMs - 3 * 60 * 60 * 1000).toISOString()),
    ])

    if (!snapshotCountResult.count) {
      await db.from('portfolio_snapshots').insert({
        user_id: account.user_id,
        account_id: account.id,
        balance: newBalance,
        equity: newBalance,
        snapshot_at: cycleIso,
      })
    }

    const newTradeSpecs = buildNewTrades(account.id, account.user_id, openTrades, strategy, preferredSymbols)
    if (newTradeSpecs.length > 0) {
      await db.from('trades').insert(newTradeSpecs)
    }

    results.push({ accountId: account.id, closed: closedCount, opened: newTradeSpecs.length })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`simulate-trades: error processing account ${account.id}`, err)
    results.push({ accountId: account.id, closed: 0, opened: 0, error: String(err) })
  }
}

async function runCycle(
  db: ReturnType<typeof createServiceRoleClient>,
  cycleMs: number,
): Promise<CycleResult[]> {
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
  const results: CycleResult[] = []

  await processWithConcurrency(accounts, ACCOUNT_CONCURRENCY, (account) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processAccount(db as any, account, cycleMs, cycleIso, results),
  )

  return results
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now()
  try {
    if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = createServiceRoleClient()
    // Spread DAILY_CYCLES evenly across the past 24 hours so timestamps look realistic.
    // Cycles run sequentially — each one's balance math depends on the previous
    // cycle's DB writes, so this loop (unlike the per-account work inside it) is a
    // real dependency chain, not just leftover caution.
    const intervalMs = (24 * 60 * 60 * 1000) / DAILY_CYCLES
    const allResults: Array<{ cycle: number; results: CycleResult[] }> = []

    for (let i = 0; i < DAILY_CYCLES; i++) {
      const cycleMs = startedAt - (DAILY_CYCLES - 1 - i) * intervalMs
      const cycleResults = await runCycle(db, cycleMs)
      allResults.push({ cycle: i + 1, results: cycleResults })
    }

    const durationMs = Date.now() - startedAt
    // eslint-disable-next-line no-console
    console.log(`simulate-trades: completed ${DAILY_CYCLES} cycles in ${durationMs}ms`)

    return NextResponse.json({
      success: true,
      cycles: DAILY_CYCLES,
      durationMs,
      timestamp: new Date(startedAt).toISOString(),
      results: allResults,
    })
  } catch (err) {
    const durationMs = Date.now() - startedAt
    // eslint-disable-next-line no-console
    console.error(`simulate-trades: fatal error after ${durationMs}ms`, err)
    return NextResponse.json({ success: false, error: String(err), durationMs }, { status: 500 })
  }
}
