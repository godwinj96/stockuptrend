'use client'

import { useEffect, useRef } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'
import { useLivePrices } from '@/lib/context/LivePricesContext'
import { getContractMultiplier } from '@/lib/trading/symbols'
import type { AccountType } from '@/lib/supabase/types'

interface OpenTradeForPnL {
  symbol: string
  direction: 'buy' | 'sell'
  volume: number
  open_price: number
}

interface BalanceWidgetProps {
  balance: number
  currency: string
  accountNumber: string
  accountType: AccountType
  openTrades?: OpenTradeForPnL[]
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

export function BalanceWidget({
  balance,
  currency,
  accountNumber,
  accountType,
  openTrades = [],
}: BalanceWidgetProps) {
  const balanceRef = useRef<HTMLSpanElement>(null)
  const unrealizedRef = useRef<HTMLSpanElement>(null)
  const prevUnrealizedRef = useRef<number>(0)
  const shouldReduceMotion = useReducedMotion()
  const prices = useLivePrices()

  // Count-up animation on mount
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
      onUpdate: (v) => { node.textContent = formatCurrency(v, currency) },
    })
    return () => controls.stop()
  }, [balance, currency, shouldReduceMotion])

  // Compute total unrealized P&L from live prices
  let unrealizedPnL = 0
  for (const trade of openTrades) {
    const liveData = prices.get(trade.symbol)
    const currentPrice = liveData?.price ?? trade.open_price
    const multiplier = getContractMultiplier(trade.symbol)
    const priceDiff = currentPrice - trade.open_price
    const directedDiff = trade.direction === 'buy' ? priceDiff : -priceDiff
    unrealizedPnL += directedDiff * trade.volume * multiplier
  }
  unrealizedPnL = parseFloat(unrealizedPnL.toFixed(2))

  // Animate unrealized P&L changes
  useEffect(() => {
    const node = unrealizedRef.current
    if (!node || shouldReduceMotion || openTrades.length === 0) return
    const from = prevUnrealizedRef.current
    prevUnrealizedRef.current = unrealizedPnL
    const ctrl = animate(from, unrealizedPnL, {
      duration: 0.25,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (node) {
          const sign = v >= 0 ? '+' : ''
          node.textContent = `${sign}${formatCurrency(v, currency)}`
        }
      },
    })
    return () => ctrl.stop()
  }, [unrealizedPnL, currency, shouldReduceMotion, openTrades.length])

  const unrealizedSign = unrealizedPnL >= 0 ? '+' : ''

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-card sm:p-6">
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
          className="font-display text-2xl font-bold tabular-nums text-text-primary sm:text-3xl lg:text-4xl"
        >
          {formatCurrency(balance, currency)}
        </span>
      </div>

      {openTrades.length > 0 && (
        <div className="mb-2 flex items-center gap-1.5">
          <motion.span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              unrealizedPnL >= 0 ? 'bg-accent-primary' : 'bg-color-danger',
            )}
            animate={shouldReduceMotion ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-xs text-text-tertiary">Unrealized P&amp;L</span>
          <span
            ref={unrealizedRef}
            className={cn(
              'font-mono text-xs font-medium tabular-nums',
              unrealizedPnL >= 0 ? 'text-accent-primary' : 'text-color-danger',
            )}
          >
            {unrealizedSign}{formatCurrency(Math.abs(unrealizedPnL), currency)}
          </span>
        </div>
      )}

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
