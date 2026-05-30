'use client'

import useSWR from 'swr'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatRelativeTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Trade } from '@/lib/supabase/types'

interface OpenPositionsTableProps {
  initialTrades: Trade[]
  accountId: string
}

interface OpenPositionsResponse {
  trades: Trade[]
}

const fetcher = (url: string) =>
  fetch(url).then((r) => r.json() as Promise<OpenPositionsResponse>)

function formatPrice(price: number | null, openPrice: number): string {
  if (price === null) return '—'
  const decimals = openPrice > 100 ? 2 : 5
  return price.toFixed(decimals)
}

export function OpenPositionsTable({ initialTrades, accountId }: OpenPositionsTableProps) {
  const { data, isLoading } = useSWR<OpenPositionsResponse>(
    `/api/portal/open-positions?accountId=${accountId}`,
    fetcher,
    { refreshInterval: 60_000, fallbackData: { trades: initialTrades } },
  )

  const trades = data?.trades ?? initialTrades

  if (!isLoading && trades.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
        <h3 className="mb-4 font-display text-sm font-semibold text-text-primary">Open Positions</h3>
        <EmptyState
          title="No open positions"
          description="The AI will open new trades on the next cycle."
          className="py-8"
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <h3 className="font-display text-sm font-semibold text-text-primary">Open Positions</h3>
        <span className="rounded-full bg-accent-primary-muted px-2.5 py-0.5 text-xs font-semibold text-accent-primary">
          {trades.length} active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="px-5 py-3 text-left text-xs font-medium text-text-tertiary">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">Side</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary">Vol.</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary">Entry</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary">Stop Loss</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary">Take Profit</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-text-tertiary">Opened</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {isLoading && trades.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-3 animate-pulse rounded bg-bg-overlay" />
                      </td>
                    ))}
                  </tr>
                ))
              : trades.map((trade) => {
                  const isBuy = trade.direction === 'buy'
                  return (
                    <tr key={trade.id} className="transition-colors hover:bg-bg-elevated">
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs font-semibold text-text-primary">
                          {trade.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                            isBuy
                              ? 'bg-accent-primary-muted text-accent-primary'
                              : 'bg-danger-muted text-danger',
                          )}
                        >
                          {isBuy ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {trade.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-text-secondary">
                        {trade.volume}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-text-secondary">
                        {formatPrice(trade.open_price, trade.open_price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-md bg-danger-muted px-2 py-0.5 font-mono text-xs font-medium text-danger">
                          {formatPrice(trade.stop_loss, trade.open_price)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-md bg-accent-primary-muted px-2 py-0.5 font-mono text-xs font-medium text-accent-primary">
                          {formatPrice(trade.take_profit, trade.open_price)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-text-tertiary">
                        {trade.open_at ? formatRelativeTime(trade.open_at) : '—'}
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
