'use client'

import Link from 'next/link'
import { ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format'
import { EmptyState } from '@/components/shared/EmptyState'
import { ROUTES } from '@/lib/constants/routes'
import type { Transaction, TransactionStatus, TransactionType } from '@/lib/supabase/types'

interface RecentTransactionsProps {
  initialTransactions: Transaction[]
  userId: string
}

const STATUS_CONFIG: Record<TransactionStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Pending', className: 'bg-warning-muted text-warning', icon: Clock },
  pending_review: { label: 'Under Review', className: 'bg-warning-muted text-warning', icon: Clock },
  completed: { label: 'Completed', className: 'bg-accent-primary-muted text-accent-primary', icon: CheckCircle2 },
  failed: { label: 'Failed', className: 'bg-danger/10 text-danger', icon: XCircle },
  cancelled: { label: 'Cancelled', className: 'bg-bg-elevated text-text-tertiary', icon: XCircle },
}

const TYPE_CONFIG: Record<TransactionType, { label: string; icon: React.ComponentType<{ className?: string }>; amountClass: string }> = {
  deposit: { label: 'Deposit', icon: ArrowDownToLine, amountClass: 'text-accent-primary' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpFromLine, amountClass: 'text-danger' },
  trade: { label: 'Trade', icon: ArrowDownToLine, amountClass: 'text-text-primary' },
}

export function RecentTransactions({ initialTransactions }: RecentTransactionsProps) {
  const transactions = initialTransactions

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 shadow-card sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-text-primary">
          Recent Transactions
        </h2>
        <Link
          href={ROUTES.portal.tradeHistory}
          className="text-xs font-medium text-accent-primary transition-colors hover:text-accent-primary-hover"
        >
          View all →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Your transaction history will appear here."
          action={{ label: 'Make a Deposit', href: ROUTES.portal.deposit }}
          className="py-8"
        />
      ) : (
        <ul className="divide-y divide-border-subtle">
          {transactions.map((tx) => {
            const typeConfig = TYPE_CONFIG[tx.type]
            const status = tx.status ?? 'pending'
            const statusConfig = STATUS_CONFIG[status]
            const StatusIcon = statusConfig.icon
            const TypeIcon = typeConfig.icon

            return (
              <li key={tx.id} className="flex items-center gap-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated">
                  <TypeIcon className="h-4 w-4 text-text-secondary" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">{typeConfig.label}</p>
                  <p className="text-xs text-text-tertiary">{formatRelativeTime(tx.created_at ?? '')}</p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={cn('text-xs font-semibold tabular-nums sm:text-sm', typeConfig.amountClass)}>
                    {tx.type === 'withdrawal' ? '−' : '+'}
                    {formatCurrency(tx.amount, tx.currency ?? 'USD')}
                  </span>
                  <span
                    className={cn(
                      'flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      statusConfig.className
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
