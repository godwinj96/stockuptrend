'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { useReducedMotion } from 'framer-motion'
import { format } from 'date-fns'
import { EmptyState } from '@/components/shared/EmptyState'
import { TrendingUp } from 'lucide-react'
import type { PortfolioSnapshot } from '@/lib/supabase/types'

interface PerformanceChartProps {
  snapshots: PortfolioSnapshot[]
  currency: string
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 shadow-elevated">
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
        ${Number(payload[0]?.value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

export function PerformanceChart({ snapshots, currency: _ }: PerformanceChartProps) {
  const shouldReduceMotion = useReducedMotion()

  if (snapshots.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center">
        <EmptyState
          icon={TrendingUp}
          title="No performance data yet"
          description="Make a deposit and the AI will start building your chart."
        />
      </div>
    )
  }

  const chartData = snapshots.map((s) => ({
    date: format(new Date(s.snapshot_at), 'dd MMM'),
    balance: s.balance,
  }))

  const minBalance = Math.min(...chartData.map((d) => d.balance))
  const maxBalance = Math.max(...chartData.map((d) => d.balance))
  const yDomain = [Math.floor(minBalance * 0.98), Math.ceil(maxBalance * 1.02)]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={yDomain}
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="var(--accent-primary)"
          strokeWidth={2}
          fill="url(#balanceGradient)"
          isAnimationActive={!shouldReduceMotion}
          animationDuration={800}
          dot={false}
          activeDot={{ r: 4, fill: 'var(--accent-primary)', stroke: 'var(--bg-surface)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
