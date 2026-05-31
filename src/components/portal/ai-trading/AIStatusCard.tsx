'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { Bot, Power, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { formatCompactCurrency } from '@/lib/utils/format'

interface AIStatusCardProps {
  accountId: string
  aiActive: boolean
  todayPnL: number
  openPositionsCount: number
  strategyName: string
}

export function AIStatusCard({
  accountId,
  aiActive: initialAiActive,
  todayPnL,
  openPositionsCount,
  strategyName,
}: AIStatusCardProps) {
  const [aiActive, setAiActive] = useState(initialAiActive)
  const [isToggling, setIsToggling] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  async function handleToggle() {
    setIsToggling(true)
    const newActive = !aiActive
    setAiActive(newActive) // optimistic
    try {
      const res = await fetch('/api/portal/ai-trading/toggle', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, aiActive: newActive }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(newActive ? 'AI trading resumed' : 'AI trading paused')
    } catch {
      setAiActive(!newActive) // revert
      toast.error('Could not update AI status')
    } finally {
      setIsToggling(false)
    }
  }

  const pnlPositive = todayPnL >= 0

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary-muted">
            <Bot className="h-5 w-5 text-accent-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Your AI Trader</p>
            <p className="text-xs text-text-tertiary">{strategyName} Strategy</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              aiActive
                ? 'bg-accent-primary-muted text-accent-primary'
                : 'bg-warning/10 text-warning',
            )}
          >
            {aiActive && !shouldReduceMotion && (
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-accent-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {aiActive ? 'TRADING' : 'PAUSED'}
          </span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-bg-elevated p-3">
          <p className="text-xs text-text-tertiary">Today&apos;s Return</p>
          <p className={cn('mt-1 font-display text-base font-bold tabular-nums sm:text-xl', pnlPositive ? 'text-accent-primary' : 'text-danger')}>
            {pnlPositive ? '+' : ''}{formatCompactCurrency(todayPnL)}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            {pnlPositive ? (
              <TrendingUp className="h-3 w-3 text-accent-primary" />
            ) : (
              <TrendingDown className="h-3 w-3 text-danger" />
            )}
          </div>
        </div>
        <div className="rounded-lg bg-bg-elevated p-3">
          <p className="text-xs text-text-tertiary">Open Positions</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums text-text-primary">
            {openPositionsCount}
          </p>
          <p className="mt-0.5 text-xs text-text-tertiary">Live positions</p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all duration-200',
          aiActive
            ? 'border-warning/30 bg-warning/5 text-warning hover:bg-warning/10'
            : 'border-accent-primary/30 bg-accent-primary-muted text-accent-primary hover:bg-accent-primary/20',
          'disabled:opacity-50',
        )}
      >
        <Power className="h-4 w-4" />
        {isToggling ? 'Updating…' : aiActive ? 'Pause Trading' : 'Resume Trading'}
      </button>
    </div>
  )
}
