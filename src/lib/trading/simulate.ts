import { pickDistinctSymbols, getSymbolById } from './symbols'
import type { SymbolConfig } from './symbols'

export interface StrategyConfig {
  win_rate: number
  risk_per_trade: number
  trades_per_cycle_min: number
  trades_per_cycle_max: number
  closes_per_cycle_min: number
  closes_per_cycle_max: number
}

export const DEFAULT_STRATEGY: StrategyConfig = {
  win_rate: 0.720,
  risk_per_trade: 0.015,
  trades_per_cycle_min: 2,
  trades_per_cycle_max: 4,
  closes_per_cycle_min: 1,
  closes_per_cycle_max: 3,
}

// Trades spread over last 2 hours for realistic intraday distribution
const CYCLE_WINDOW_MINUTES = 120

// Per-category price variance for realistic open-price simulation
const VARIANCE_BY_CATEGORY: Record<SymbolConfig['category'], number> = {
  forex:     0.003,
  crypto:    0.020,
  stock:     0.010,
  commodity: 0.008,
  index:     0.005,
}

export interface OpenTradeRow {
  id: string
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  open_price: number
  stop_loss: number | null
  take_profit: number | null
  open_at: string
  account_id: string
  user_id: string
}

export interface NewTradeSpec {
  account_id: string
  user_id: string
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  open_price: number
  stop_loss: number
  take_profit: number
  open_at: string
  status: 'open'
}

export interface CloseResult {
  close_price: number
  profit_loss: number
  close_reason: 'take_profit' | 'stop_loss'
  close_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}

// ─── Risk Levels ─────────────────────────────────────────────────────────────

interface RiskLevels {
  stop_loss: number
  take_profit: number
}

/**
 * Compute realistic SL and TP for a new trade.
 * Distances are proportional to typical intra-day ranges per asset class.
 * R:R is roughly 1.6–2.2:1 (TP always further than SL).
 */
export function computeRiskLevels(
  sym: SymbolConfig,
  direction: 'buy' | 'sell',
  openPrice: number,
): RiskLevels {
  let slPct: number
  let tpPct: number

  switch (sym.category) {
    case 'forex': {
      const pipSize = sym.pipDecimalPlaces >= 5 ? 0.0001 : 0.01
      const slPips = randBetween(20, 40)
      const tpPips = randBetween(35, 70)
      const slDist = slPips * pipSize
      const tpDist = tpPips * pipSize
      const rawSl = direction === 'buy' ? openPrice - slDist : openPrice + slDist
      const rawTp = direction === 'buy' ? openPrice + tpDist : openPrice - tpDist
      return {
        stop_loss:   parseFloat(rawSl.toFixed(sym.pipDecimalPlaces)),
        take_profit: parseFloat(rawTp.toFixed(sym.pipDecimalPlaces)),
      }
    }
    case 'crypto':
      slPct = randBetween(0.006, 0.012)
      tpPct = randBetween(0.010, 0.022)
      break
    case 'stock':
      slPct = randBetween(0.005, 0.015)
      tpPct = randBetween(0.009, 0.025)
      break
    case 'commodity':
      slPct = randBetween(0.004, 0.010)
      tpPct = randBetween(0.007, 0.018)
      break
    case 'index':
    default:
      slPct = randBetween(0.003, 0.008)
      tpPct = randBetween(0.005, 0.015)
      break
  }

  const slAmt = openPrice * slPct
  const tpAmt = openPrice * tpPct

  return {
    stop_loss: parseFloat(
      (direction === 'buy' ? openPrice - slAmt : openPrice + slAmt).toFixed(sym.pipDecimalPlaces)
    ),
    take_profit: parseFloat(
      (direction === 'buy' ? openPrice + tpAmt : openPrice - tpAmt).toFixed(sym.pipDecimalPlaces)
    ),
  }
}

// ─── Open Price ───────────────────────────────────────────────────────────────

export function simulateOpenPrice(symbolId: string): number {
  const sym = getSymbolById(symbolId)
  const variancePct = VARIANCE_BY_CATEGORY[sym.category]
  const variance = sym.basePrice * variancePct * (Math.random() * 2 - 1)
  return parseFloat((sym.basePrice + variance).toFixed(sym.pipDecimalPlaces))
}

// ─── Close Decision ───────────────────────────────────────────────────────────

const CONTRACT_MULTIPLIER: Record<SymbolConfig['category'], number> = {
  forex:     10_000,
  crypto:    1,
  stock:     1,
  commodity: 1,
  index:     1,
}

/**
 * Decide whether a trade closes this cycle and compute the result.
 * Older trades have a higher chance of closing.
 * Win/loss outcome uses per-trade jitter around strategy win_rate for realism.
 * Slippage is applied to the close price to reduce predictability.
 */
export function simulateTradeClose(
  trade: OpenTradeRow,
  strategy: StrategyConfig,
  nowMs: number,
): CloseResult | null {
  const ageMinutes = (nowMs - new Date(trade.open_at).getTime()) / 60_000

  // Probability ramps from ~0.45 at 0 min to ~0.85 at 90+ min, with per-trade noise
  const rampNoise = randBetween(-0.05, 0.05)
  const closeProbability = Math.min(0.45 + rampNoise + (ageMinutes / 90) * 0.40, 0.85)

  if (Math.random() >= closeProbability) return null

  // Per-trade win rate jitter (±6%) so outcomes aren't mechanically uniform
  const effectiveWinRate = Math.min(0.95, Math.max(0.40,
    strategy.win_rate + randBetween(-0.06, 0.06)
  ))

  const isWin = Math.random() < effectiveWinRate
  const sym = getSymbolById(trade.symbol)
  const multiplier = CONTRACT_MULTIPLIER[sym.category]

  const sl = trade.stop_loss ?? trade.open_price * (trade.direction === 'buy' ? 0.99 : 1.01)
  const tp = trade.take_profit ?? trade.open_price * (trade.direction === 'buy' ? 1.015 : 0.985)

  // Slippage: worsens the close price slightly (realistic fill simulation)
  let closePrice = isWin ? tp : sl
  if (sym.category === 'forex') {
    const pipSize = sym.pipDecimalPlaces >= 5 ? 0.0001 : 0.01
    const slippagePips = randBetween(0.5, 2.0) * pipSize
    // For wins: fill slightly worse than TP; for losses: fill slightly worse than SL
    closePrice = isWin
      ? (trade.direction === 'buy' ? closePrice - slippagePips : closePrice + slippagePips)
      : (trade.direction === 'buy' ? closePrice - slippagePips : closePrice + slippagePips)
  } else {
    const slippagePct = randBetween(0.001, 0.002)
    const slippageAmt = closePrice * slippagePct
    closePrice = isWin
      ? (trade.direction === 'buy' ? closePrice - slippageAmt : closePrice + slippageAmt)
      : (trade.direction === 'buy' ? closePrice - slippageAmt : closePrice + slippageAmt)
  }
  closePrice = parseFloat(closePrice.toFixed(sym.pipDecimalPlaces))

  const rawPnL = isWin
    ? Math.abs(closePrice - trade.open_price) * trade.volume * multiplier
    : -Math.abs(closePrice - trade.open_price) * trade.volume * multiplier

  const openMs = new Date(trade.open_at).getTime()
  const closeMs = openMs + Math.random() * (nowMs - openMs)

  return {
    close_price:  closePrice,
    profit_loss:  parseFloat(rawPnL.toFixed(2)),
    close_reason: isWin ? 'take_profit' : 'stop_loss',
    close_at:     new Date(closeMs).toISOString(),
  }
}

// ─── New Trade Builder ────────────────────────────────────────────────────────

export function buildNewTrades(
  accountId: string,
  userId: string,
  openTrades: OpenTradeRow[],
  strategy: StrategyConfig,
  preferredSymbols: string[] = [],
): NewTradeSpec[] {
  const count = randInt(
    strategy.trades_per_cycle_min * 3,
    strategy.trades_per_cycle_max * 4,
  )

  const existingSymbols = openTrades.map((t) => t.symbol)
  const symbols = pickDistinctSymbols(count, existingSymbols, preferredSymbols)
  const nowMs = Date.now()

  return symbols.map((sym) => {
    const direction: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell'
    const rawVolume =
      Math.round(
        randBetween(sym.minVolume, Math.min(sym.minVolume * 8, sym.maxVolume)) / sym.volumeStep
      ) * sym.volumeStep
    const openPrice = simulateOpenPrice(sym.id)
    const { stop_loss, take_profit } = computeRiskLevels(sym, direction, openPrice)

    const openAt = new Date(nowMs - Math.random() * CYCLE_WINDOW_MINUTES * 60_000).toISOString()

    return {
      account_id: accountId,
      user_id:    userId,
      symbol:     sym.id,
      direction,
      volume:     parseFloat(rawVolume.toFixed(3)),
      open_price: openPrice,
      stop_loss,
      take_profit,
      open_at:    openAt,
      status:     'open' as const,
    }
  })
}
