'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { Bot, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'

interface AIStatusWidgetProps {
  aiActive: boolean
  openPositions: number
  strategyName: string
  totalTrades: number
  winRate: number
}

export function AIStatusWidget({
  aiActive,
  openPositions,
  strategyName,
  totalTrades,
  winRate,
}: AIStatusWidgetProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
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

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-bg-elevated p-2 text-center sm:p-2.5">
          <p className="font-display text-base font-bold tabular-nums text-text-primary sm:text-lg">{openPositions}</p>
          <p className="text-[10px] text-text-tertiary">Open</p>
        </div>
        <div className="rounded-lg bg-bg-elevated p-2 text-center sm:p-2.5">
          <p className="font-display text-base font-bold tabular-nums text-text-primary sm:text-lg">{totalTrades}</p>
          <p className="text-[10px] text-text-tertiary">Trades</p>
        </div>
        <div className="rounded-lg bg-bg-elevated p-2 text-center sm:p-2.5">
          <p className={cn('font-display text-base font-bold tabular-nums sm:text-lg', winRate >= 60 ? 'text-accent-primary' : 'text-text-primary')}>
            {winRate}%
          </p>
          <p className="text-[10px] text-text-tertiary">Win Rate</p>
        </div>
      </div>

      <p className="mb-3 text-xs text-text-tertiary">
        Strategy: <span className="font-medium text-text-secondary">{strategyName}</span>
      </p>

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
