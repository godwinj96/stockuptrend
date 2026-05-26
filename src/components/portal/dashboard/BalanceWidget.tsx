'use client'

import { useEffect, useRef } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { animate } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'
import type { AccountType } from '@/lib/supabase/types'

interface BalanceWidgetProps {
  balance: number
  currency: string
  accountNumber: string
  accountType: AccountType
}

const ACCOUNT_LABELS: Record<AccountType, string> = {
  standard: 'Standard',
  pro: 'Pro',
  vip: 'VIP',
}

const ACCOUNT_BADGE_CLASSES: Record<AccountType, string> = {
  standard: 'bg-accent-secondary-muted text-accent-secondary',
  pro: 'bg-accent-primary-muted text-accent-primary',
  vip: 'bg-accent-gold-muted text-accent-gold',
}

export function BalanceWidget({ balance, currency, accountNumber, accountType }: BalanceWidgetProps) {
  const balanceRef = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const node = balanceRef.current
    if (!node) return

    if (shouldReduceMotion) {
      node.textContent = formatCurrency(balance, currency)
      return
    }

    const controls = animate(0, balance, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        node.textContent = formatCurrency(v, currency)
      },
    })
    return () => controls.stop()
  }, [balance, currency, shouldReduceMotion])

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">Account Balance</p>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-medium',
            ACCOUNT_BADGE_CLASSES[accountType]
          )}
        >
          {ACCOUNT_LABELS[accountType]}
        </span>
      </div>

      <div className="mb-1">
        <span
          ref={balanceRef}
          className="font-display text-4xl font-bold tabular-nums text-text-primary"
        >
          {formatCurrency(balance, currency)}
        </span>
      </div>

      <p className="mb-6 font-mono text-xs text-text-tertiary">{accountNumber}</p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={ROUTES.portal.deposit}
          className="flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Deposit
        </Link>
        <Link
          href={ROUTES.portal.withdrawal}
          className="flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-elevated"
        >
          <ArrowUpFromLine className="h-4 w-4" />
          Withdraw
        </Link>
        <Link
          href={ROUTES.portal.tradeHistory}
          className="flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
        >
          <TrendingUp className="h-4 w-4" />
          History
        </Link>
      </div>
    </div>
  )
}
