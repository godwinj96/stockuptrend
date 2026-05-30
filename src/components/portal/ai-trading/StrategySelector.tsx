'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Zap, Shield, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import type { AIStrategy } from '@/lib/supabase/types'

interface StrategySelectorProps {
  strategies: AIStrategy[]
  selectedStrategyId: string | null
  accountId: string
}

const DEFAULT_META = { icon: BarChart2, riskLabel: 'Balanced', riskClass: 'text-accent-primary bg-accent-primary-muted', monthlyReturn: '8–15%' }

const STRATEGY_META: Record<string, typeof DEFAULT_META> = {
  conservative: { icon: Shield,    riskLabel: 'Steady Growth', riskClass: 'text-accent-secondary bg-accent-secondary-muted', monthlyReturn: '3–8%' },
  balanced:     { icon: BarChart2, riskLabel: 'Balanced',      riskClass: 'text-accent-primary bg-accent-primary-muted',     monthlyReturn: '8–15%' },
  aggressive:   { icon: Zap,       riskLabel: 'High Growth',   riskClass: 'text-accent-gold bg-accent-gold-muted',           monthlyReturn: '15–30%' },
}

export function StrategySelector({ strategies, selectedStrategyId: initial, accountId }: StrategySelectorProps) {
  const [selectedId, setSelectedId] = useState(initial ?? '')
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function handleSelect(strategyId: string) {
    if (strategyId === selectedId || pendingId) return
    setPendingId(strategyId)
    setSelectedId(strategyId) // optimistic

    try {
      const res = await fetch('/api/portal/ai-trading/strategy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, strategyId }),
      })
      if (!res.ok) throw new Error('Failed')
      const strategy = strategies.find((s) => s.id === strategyId)
      toast.success(`Switched to ${strategy?.name ?? 'new'} strategy`)
    } catch {
      setSelectedId(initial ?? '') // revert
      toast.error('Could not update strategy')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
      <div className="mb-4">
        <h3 className="font-display text-sm font-semibold text-text-primary">AI Strategy</h3>
        <p className="mt-0.5 text-xs text-text-secondary">Your strategy sets the AI&apos;s risk tolerance and position sizing. You can change it at any time.</p>
      </div>

      <div className="space-y-3">
        {strategies.map((strategy) => {
          const meta = STRATEGY_META[strategy.slug] ?? DEFAULT_META
          const Icon = meta.icon
          const isSelected = selectedId === strategy.id
          const isPending = pendingId === strategy.id

          return (
            <button
              key={strategy.id}
              type="button"
              onClick={() => handleSelect(strategy.id)}
              disabled={!!pendingId}
              className={cn(
                'relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-accent-primary bg-accent-primary-muted'
                  : 'border-border-subtle bg-bg-elevated hover:border-border-default',
                'disabled:cursor-wait',
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="strategy-selected-bg"
                  className="absolute inset-0 rounded-xl border border-accent-primary bg-accent-primary-muted"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative flex items-center gap-3">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', meta.riskClass)}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-sm font-semibold', isSelected ? 'text-accent-primary' : 'text-text-primary')}>
                      {strategy.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', meta.riskClass)}>
                        {meta.riskLabel}
                      </span>
                      {isSelected && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-accent-primary" />
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">
                    {strategy.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[11px] text-text-tertiary">
                      Win rate: <span className="font-semibold text-text-secondary">{Math.round(strategy.win_rate * 100)}%</span>
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      Est. monthly: <span className="font-semibold text-accent-primary">{meta.monthlyReturn}</span>
                    </span>
                  </div>
                </div>
              </div>

              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-bg-elevated/60">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
