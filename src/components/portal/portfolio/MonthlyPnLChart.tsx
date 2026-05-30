'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { useReducedMotion } from 'framer-motion'
import { EmptyState } from '@/components/shared/EmptyState'
import { BarChart3 } from 'lucide-react'

export interface MonthlyPnLData {
  month: string
  pnl: number
}

interface MonthlyPnLChartProps {
  monthlyData: MonthlyPnLData[]
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const pnl = Number(payload[0]?.value ?? 0)
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 shadow-elevated">
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-semibold ${pnl >= 0 ? 'text-accent-primary' : 'text-danger'}`}>
        {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toFixed(2)}
      </p>
    </div>
  )
}

export function MonthlyPnLChart({ monthlyData }: MonthlyPnLChartProps) {
  const shouldReduceMotion = useReducedMotion()
  const last12 = monthlyData.slice(-12)

  if (last12.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <EmptyState
          icon={BarChart3}
          title="No monthly data yet"
          description="Data will appear after your first trading month."
        />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={last12} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v >= 0 ? '' : '-'}${Math.abs(v).toFixed(0)}`}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="pnl" radius={[4, 4, 0, 0]} isAnimationActive={!shouldReduceMotion}>
          {last12.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.pnl >= 0 ? 'var(--accent-primary)' : 'var(--color-danger)'}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
