'use client'

import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { animate } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { Activity, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useLivePrices } from '@/lib/context/LivePricesContext'
import { getContractMultiplier } from '@/lib/trading/symbols'
import { ROUTES } from '@/lib/constants/routes'

interface OpenTrade {
  id: string
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  open_price: number
  open_at: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatPnL(v: number): string {
  const sign = v >= 0 ? '+' : ''
  return `${sign}$${Math.abs(v).toFixed(2)}`
}

function PnLCell({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevRef = useRef<number>(value)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || shouldReduceMotion) {
      if (node) node.textContent = formatPnL(value)
      prevRef.current = value
      return
    }
    const from = prevRef.current
    prevRef.current = value
    const ctrl = animate(from, value, {
      duration: 0.25,
      ease: 'easeOut',
      onUpdate: (v) => { if (node) node.textContent = formatPnL(v) },
    })
    return () => ctrl.stop()
  }, [value, shouldReduceMotion])

  return (
    <span
      ref={ref}
      className={cn(
        'font-mono text-xs tabular-nums font-medium',
        value >= 0 ? 'text-accent-primary' : 'text-color-danger',
      )}
    >
      {formatPnL(value)}
    </span>
  )
}

interface LiveOpenPositionsProps {
  initialTrades: OpenTrade[]
  accountId?: string
}

export function LiveOpenPositions({ initialTrades, accountId }: LiveOpenPositionsProps) {
  const url = accountId ? `/api/portal/open-positions?accountId=${accountId}` : null

  const { data } = useSWR<{ trades: OpenTrade[] }>(
    url,
    fetcher,
    { fallbackData: { trades: initialTrades }, refreshInterval: 15_000 },
  )

  const trades: OpenTrade[] = data?.trades ?? initialTrades
  const prices = useLivePrices()
  const displayTrades = trades.slice(0, 6)

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-secondary-muted">
            <Activity className="h-4 w-4 text-accent-secondary" />
          </div>
          <p className="text-sm font-medium text-text-primary">Open Positions</p>
        </div>
        {trades.length > 0 && (
          <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-xs font-semibold text-text-secondary">
            {trades.length}
          </span>
        )}
      </div>

      {displayTrades.length === 0 ? (
        <p className="py-4 text-center text-xs text-text-tertiary">
          No open positions — AI is preparing next trades
        </p>
      ) : (
        <div className="space-y-1">
          <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto] gap-x-3 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            <span>Symbol</span>
            <span className="text-right">Vol</span>
            <span className="text-right">Open</span>
            <span className="text-right">P&amp;L</span>
          </div>
          {displayTrades.map((trade) => {
            const liveData = prices.get(trade.symbol)
            const currentPrice = liveData?.price ?? trade.open_price
            const multiplier = getContractMultiplier(trade.symbol)
            const priceDiff = currentPrice - trade.open_price
            const directedDiff = trade.direction === 'buy' ? priceDiff : -priceDiff
            const unrealizedPnL = parseFloat((directedDiff * trade.volume * multiplier).toFixed(2))

            return (
              <div
                key={trade.id}
                className={cn(
                  'grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 rounded-lg px-2 py-1.5 transition-colors',
                  unrealizedPnL >= 0 ? 'bg-accent-primary-muted/30' : 'bg-color-danger/5',
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={cn(
                      'shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase',
                      trade.direction === 'buy'
                        ? 'bg-accent-primary/20 text-accent-primary'
                        : 'bg-color-danger/20 text-color-danger',
                    )}
                  >
                    {trade.direction}
                  </span>
                  <span className="truncate text-xs font-medium text-text-primary">
                    {trade.symbol}
                  </span>
                </div>
                <span className="text-right font-mono text-xs tabular-nums text-text-secondary">
                  {trade.volume}
                </span>
                <span className="text-right font-mono text-xs tabular-nums text-text-tertiary">
                  {trade.open_price}
                </span>
                <PnLCell value={unrealizedPnL} />
              </div>
            )
          })}
        </div>
      )}

      {trades.length > 0 && (
        <Link
          href={ROUTES.portal.tradeHistory}
          className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent-secondary hover:bg-accent-secondary-muted hover:text-accent-secondary"
        >
          View all trades
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}
