'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Bot, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import { formatCurrency } from '@/lib/utils/format'

interface LastTrade {
  symbol: string
  direction: 'buy' | 'sell'
  profit_loss: number
}

interface AIStatusWidgetProps {
  aiActive: boolean
  openPositions: number
  strategyName: string
  totalTrades: number
  winRate: number
  todayPnL?: number
  lastTrade?: LastTrade | null
  currency?: string
}

export function AIStatusWidget({
  aiActive,
  openPositions,
  strategyName,
  totalTrades,
  winRate,
  todayPnL = 0,
  lastTrade = null,
  currency = 'USD',
}: AIStatusWidgetProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card transition-shadow duration-500',
        aiActive && 'shadow-glow-accent',
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary-muted">
            <Bot className="h-4 w-4 text-accent-primary" />
          </div>
          <p className="text-sm font-medium text-text-primary">AI Trading</p>
        </div>
        <span
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
            aiActive ? 'bg-accent-primary-muted text-accent-primary' : 'bg-warning/10 text-warning',
          )}
        >
          {aiActive && !shouldReduceMotion && (
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent-primary"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {aiActive ? 'Active' : 'Paused'}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-1.5">
        <div className="rounded-lg bg-bg-elevated p-2 text-center">
          <p className="font-display text-sm font-bold tabular-nums text-text-primary sm:text-base">{openPositions}</p>
          <p className="text-[10px] text-text-tertiary">Open</p>
        </div>
        <div className="rounded-lg bg-bg-elevated p-2 text-center">
          <p className="font-display text-sm font-bold tabular-nums text-text-primary sm:text-base">{totalTrades}</p>
          <p className="text-[10px] text-text-tertiary">Trades</p>
        </div>
        <div className="rounded-lg bg-bg-elevated p-2 text-center">
          <p className={cn(
            'font-display text-sm font-bold tabular-nums sm:text-base',
            winRate >= 60 ? 'text-accent-primary' : 'text-text-primary',
          )}>
            {winRate}%
          </p>
          <p className="text-[10px] text-text-tertiary">Win %</p>
        </div>
        <div className="rounded-lg bg-bg-elevated p-2 text-center">
          <p className={cn(
            'font-display text-sm font-bold tabular-nums sm:text-base',
            todayPnL >= 0 ? 'text-accent-primary' : 'text-color-danger',
          )}>
            {todayPnL >= 0 ? '+' : ''}{formatCurrency(Math.abs(todayPnL), currency)}
          </p>
          <p className="text-[10px] text-text-tertiary">Today</p>
        </div>
      </div>

      <p className="mb-2 text-xs text-text-tertiary">
        Strategy: <span className="font-medium text-text-secondary">{strategyName}</span>
      </p>

      {lastTrade && (
        <p className="mb-3 truncate text-xs text-text-tertiary">
          Latest:{' '}
          <span className="font-medium text-text-secondary">
            {lastTrade.symbol} {lastTrade.direction.toUpperCase()}
          </span>{' '}
          <span className={cn(
            'font-medium',
            lastTrade.profit_loss >= 0 ? 'text-accent-primary' : 'text-color-danger',
          )}>
            {lastTrade.profit_loss >= 0 ? '+' : ''}{formatCurrency(Math.abs(lastTrade.profit_loss), currency)}
          </span>
        </p>
      )}

      <Link
        href={ROUTES.portal.aiTrading}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:bg-accent-primary-muted hover:text-accent-primary"
      >
        Manage AI
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
