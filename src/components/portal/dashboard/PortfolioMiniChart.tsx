'use client'

import { AreaChart, Area, ResponsiveContainer, Tooltip, type TooltipProps } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatCompactCurrency } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'
import type { PortfolioSnapshot } from '@/lib/supabase/types'

interface PortfolioMiniChartProps {
  snapshots: PortfolioSnapshot[]
  currency: string
}

function MiniTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border-subtle bg-bg-elevated px-2 py-1 text-xs font-mono text-text-primary shadow-elevated">
      ${Number(payload[0]?.value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </div>
  )
}

export function PortfolioMiniChart({ snapshots, currency: _ }: PortfolioMiniChartProps) {
  const hasData = snapshots.length >= 2
  const first = snapshots[0]?.balance ?? 0
  const last = snapshots[snapshots.length - 1]?.balance ?? 0
  const isUp = last >= first
  const changePct = first > 0 ? (((last - first) / first) * 100).toFixed(1) : '0.0'

  const chartData = snapshots.map((s) => ({ balance: s.balance }))
  const strokeColor = isUp ? 'var(--accent-primary)' : 'var(--color-danger)'
  const gradientId = isUp ? 'miniGradientUp' : 'miniGradientDown'

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-text-secondary">Portfolio Performance</p>
        <Link href={ROUTES.portal.portfolio} className="text-xs text-accent-primary hover:underline underline-offset-2">
          View →
        </Link>
      </div>

      {hasData ? (
        <>
          <div className="mb-1 flex items-center gap-2">
            <span className="font-display text-base font-bold tabular-nums text-text-primary sm:text-xl">
              {formatCompactCurrency(last)}
            </span>
            <span className={cn('flex items-center gap-0.5 text-xs font-semibold', isUp ? 'text-accent-primary' : 'text-danger')}>
              {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isUp ? '+' : ''}{changePct}%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={<MiniTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={strokeColor}
                strokeWidth={1.5}
                fill={`url(#${gradientId})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className="py-6 text-center text-xs text-text-tertiary">
          Make a deposit to start tracking performance
        </p>
      )}
    </div>
  )
}
