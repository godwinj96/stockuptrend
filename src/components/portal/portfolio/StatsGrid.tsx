'use client'

import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StatsGridProps {
  totalInvested: number
  currentBalance: number
  totalProfit: number
  winRate: number
  totalTrades: number
  currency: string
}

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (shouldReduceMotion) {
      node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
      return
    }
    const controls = animate(0, value, {
      duration: 1.0,
      ease: 'easeOut',
      onUpdate: (v) => {
        node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [value, prefix, suffix, decimals, shouldReduceMotion])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  )
}

export function StatsGrid({ totalInvested, currentBalance, totalProfit, winRate, totalTrades, currency: _ }: StatsGridProps) {
  const returnPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0
  const profitPositive = totalProfit >= 0

  const stats = [
    {
      label: 'Total Deposited',
      icon: Activity,
      iconClass: 'text-accent-secondary bg-accent-secondary-muted',
      value: <AnimatedNumber value={totalInvested} prefix="$" />,
      sub: 'All-time deposits',
      subClass: 'text-text-tertiary',
    },
    {
      label: 'Current Balance',
      icon: TrendingUp,
      iconClass: 'text-accent-primary bg-accent-primary-muted',
      value: <AnimatedNumber value={currentBalance} prefix="$" />,
      sub: 'Available funds',
      subClass: 'text-text-tertiary',
    },
    {
      label: 'Total Profit',
      icon: profitPositive ? TrendingUp : TrendingDown,
      iconClass: profitPositive ? 'text-accent-primary bg-accent-primary-muted' : 'text-danger bg-danger-muted',
      value: (
        <span className={cn('tabular-nums', profitPositive ? 'text-accent-primary' : 'text-danger')}>
          {profitPositive ? '+' : ''}<AnimatedNumber value={totalProfit} prefix="$" />
        </span>
      ),
      sub: <AnimatedNumber value={returnPct} prefix={returnPct >= 0 ? '+' : ''} suffix="% return" decimals={1} />,
      subClass: profitPositive ? 'text-accent-primary' : 'text-danger',
    },
    {
      label: 'Win Rate',
      icon: Target,
      iconClass: winRate >= 60 ? 'text-accent-primary bg-accent-primary-muted' : 'text-warning bg-warning/10',
      value: <AnimatedNumber value={winRate} suffix="%" decimals={0} />,
      sub: `${totalTrades} total trades`,
      subClass: 'text-text-tertiary',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
              <span className={cn('flex h-7 w-7 items-center justify-center rounded-lg', stat.iconClass)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className={cn('mt-1 text-xs', stat.subClass)}>{stat.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
