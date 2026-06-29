'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useLivePrices } from '@/lib/context/LivePricesContext'
import { SYMBOL_POOL } from '@/lib/trading/symbols'

const TICKER_SYMBOL_IDS = ['BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'XAUUSD', 'AAPL', 'MSFT', 'SPX500']

const TICKER_SYMBOLS = SYMBOL_POOL.filter((s) => TICKER_SYMBOL_IDS.includes(s.id))

function formatTickerPrice(price: number, pipDecimalPlaces: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: Math.min(pipDecimalPlaces, 4),
    maximumFractionDigits: Math.min(pipDecimalPlaces, 4),
  })
}

export function LivePriceTicker() {
  const prices = useLivePrices()

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 shadow-card">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        <span className="mr-2 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Live
        </span>
        {TICKER_SYMBOLS.map((sym, i) => {
          const live = prices.get(sym.id)
          const price = live?.price ?? sym.basePrice
          const direction = live?.direction ?? null
          const changePct = live?.changePct ?? 0

          return (
            <div key={sym.id} className="flex items-center gap-3">
              {i > 0 && <span className="text-border-default">·</span>}
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-xs font-semibold text-text-secondary">
                  {sym.displayName}
                </span>
                <span
                  className={cn(
                    'font-mono text-xs tabular-nums transition-colors duration-200',
                    direction === 'up' && 'text-accent-primary',
                    direction === 'down' && 'text-color-danger',
                    direction === null && 'text-text-primary',
                  )}
                >
                  {formatTickerPrice(price, sym.pipDecimalPlaces)}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-[10px] tabular-nums',
                    changePct >= 0 ? 'text-accent-primary' : 'text-color-danger',
                  )}
                >
                  {changePct >= 0.005 ? (
                    <TrendingUp className="h-2.5 w-2.5" />
                  ) : changePct <= -0.005 ? (
                    <TrendingDown className="h-2.5 w-2.5" />
                  ) : (
                    <Minus className="h-2.5 w-2.5 text-text-tertiary" />
                  )}
                  {Math.abs(changePct) < 0.005
                    ? '0.00%'
                    : `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
