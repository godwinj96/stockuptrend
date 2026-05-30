import { pickDistinctSymbols, getSymbolById } from './symbols'

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

export interface OpenTradeRow {
  id: string
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  open_price: number
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
  open_at: string
  status: 'open'
}

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export function computeTradePnL(
  balance: number,
  strategy: StrategyConfig,
): { profit_loss: number; is_win: boolean } {
  const is_win = Math.random() < strategy.win_rate
  // Cap risk to never exceed 5% of balance, and never exceed full balance
  const riskAmount = Math.min(balance * strategy.risk_per_trade, balance * 0.05, balance)
  const multiplier = is_win ? randBetween(1.5, 3.0) : randBetween(0.4, 0.9)
  const rawPnL = (is_win ? 1 : -1) * riskAmount * multiplier
  return { profit_loss: parseFloat(rawPnL.toFixed(2)), is_win }
}

export function computeClosePrice(
  trade: Pick<OpenTradeRow, 'direction' | 'open_price' | 'volume' | 'symbol'>,
  profit_loss: number,
): number {
  const sym = getSymbolById(trade.symbol)
  // Approximate price move from P&L — rough but convincing for display
  const priceMoveAbs = Math.abs(profit_loss) / Math.max(trade.volume * 100, 0.1)
  const direction =
    profit_loss >= 0
      ? trade.direction === 'buy' ? 1 : -1
      : trade.direction === 'buy' ? -1 : 1
  const rawClose = trade.open_price + direction * priceMoveAbs
  return parseFloat(rawClose.toFixed(sym.pipDecimalPlaces))
}

export function simulateOpenPrice(symbolId: string): number {
  const sym = getSymbolById(symbolId)
  const variance = sym.basePrice * 0.005 * (Math.random() * 2 - 1)
  return parseFloat((sym.basePrice + variance).toFixed(sym.pipDecimalPlaces))
}

export function selectTradesToClose(openTrades: OpenTradeRow[], count: number): OpenTradeRow[] {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)
  const eligible = openTrades.filter((t) => new Date(t.open_at) < thirtyMinAgo)
  return [...eligible].sort(() => Math.random() - 0.5).slice(0, count)
}

export function buildNewTrades(
  accountId: string,
  userId: string,
  openTrades: OpenTradeRow[],
  strategy: StrategyConfig,
): NewTradeSpec[] {
  const count = randInt(strategy.trades_per_cycle_min, strategy.trades_per_cycle_max)
  const existingSymbols = openTrades.map((t) => t.symbol)
  const symbols = pickDistinctSymbols(count, existingSymbols)
  const now = new Date().toISOString()

  return symbols.map((sym) => {
    const direction: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell'
    const rawVolume =
      Math.round(randBetween(sym.minVolume, Math.min(sym.minVolume * 8, sym.maxVolume)) / sym.volumeStep) *
      sym.volumeStep
    return {
      account_id: accountId,
      user_id: userId,
      symbol: sym.id,
      direction,
      volume: parseFloat(rawVolume.toFixed(3)),
      open_price: simulateOpenPrice(sym.id),
      open_at: now,
      status: 'open' as const,
    }
  })
}

export function getCloseCycleCount(strategy: StrategyConfig, openCount: number): number {
  const desired = randInt(strategy.closes_per_cycle_min, strategy.closes_per_cycle_max)
  return Math.min(desired, openCount)
}
