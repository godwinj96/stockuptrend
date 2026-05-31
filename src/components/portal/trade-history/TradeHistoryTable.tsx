'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'
import type { Trade } from '@/lib/supabase/types'

interface Props {
  trades: Trade[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function TradeHistoryTable({ trades, totalCount, currentPage, pageSize }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalCount / pageSize)

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  function exportCSV() {
    const headers = ['Symbol', 'Direction', 'Volume', 'Open Price', 'Close Price', 'Open At', 'Close At', 'P&L', 'Result']
    const rows = trades.map((t) => [
      t.symbol,
      t.direction,
      t.volume,
      t.open_price,
      t.close_price ?? '',
      formatDateTime(t.open_at ?? ''),
      t.close_at ? formatDateTime(t.close_at) : '',
      t.profit_loss ?? '',
      t.close_reason ?? '',
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trades-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Filters + export */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Filter by symbol"
            defaultValue={searchParams.get('symbol') ?? ''}
            onBlur={(e) => handleFilter('symbol', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter('symbol', (e.target as HTMLInputElement).value)}
            className="input-field w-full text-sm sm:w-40"
          />
          <select
            defaultValue={searchParams.get('direction') ?? ''}
            onChange={(e) => handleFilter('direction', e.target.value)}
            className="input-field w-full text-sm sm:w-32"
          >
            <option value="">All sides</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-elevated">
              {['Symbol', 'Side', 'Volume', 'Open', 'Close', 'Opened', 'Closed', 'P&L', 'Result'].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-text-tertiary">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-text-tertiary">
                  No trades found
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <tr key={trade.id} className="bg-bg-surface transition-colors hover:bg-bg-elevated">
                  <td className="px-4 py-3 font-medium text-text-primary">{trade.symbol}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
                        trade.direction === 'buy'
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'bg-danger/10 text-danger'
                      )}
                    >
                      {trade.direction === 'buy' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {trade.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{trade.volume}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{trade.open_price}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{trade.close_price ?? '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-text-tertiary">
                    {formatDateTime(trade.open_at ?? '')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-text-tertiary">
                    {trade.close_at ? formatDateTime(trade.close_at) : '—'}
                  </td>
                  <td className={cn('px-4 py-3 font-medium tabular-nums', (trade.profit_loss ?? 0) >= 0 ? 'text-accent-primary' : 'text-danger')}>
                    {trade.profit_loss != null
                      ? `${trade.profit_loss >= 0 ? '+' : ''}${formatCurrency(trade.profit_loss)}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {trade.close_reason === 'take_profit' ? (
                      <span className="inline-block rounded-full bg-accent-primary-muted px-2.5 py-0.5 text-xs font-semibold text-accent-primary">
                        TP Hit
                      </span>
                    ) : trade.close_reason === 'stop_loss' ? (
                      <span className="inline-block rounded-full bg-danger-muted px-2.5 py-0.5 text-xs font-semibold text-danger">
                        SL Hit
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-text-tertiary">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => handlePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => handlePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
