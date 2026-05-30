'use client'

import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { Users, ArrowDownToLine, ShieldCheck, MessageSquare, TrendingUp, ArrowUpFromLine } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/format'

interface AdminStatsGridProps {
  totalUsers: number
  pendingDeposits: number
  pendingKyc: number
  openTickets: number
  pendingWithdrawals: number
  totalVolume: number
}

interface StatCardProps {
  label: string
  value: number
  format?: 'number' | 'currency'
  icon: React.ElementType
  iconClass: string
  urgency?: boolean
}

function StatCard({ label, value, format = 'number', icon: Icon, iconClass, urgency }: StatCardProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (shouldReduceMotion) {
      node.textContent = format === 'currency' ? formatCurrency(value) : String(value)
      return
    }
    const controls = animate(0, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => {
        node.textContent = format === 'currency'
          ? formatCurrency(v)
          : Math.round(v).toString()
      },
    })
    return () => controls.stop()
  }, [value, format, shouldReduceMotion])

  return (
    <div className={cn(
      'rounded-xl border bg-bg-surface p-5 shadow-card',
      urgency && value > 0 ? 'border-warning/30' : 'border-border-subtle'
    )}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconClass)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-display text-2xl font-bold tabular-nums text-text-primary">
        <span ref={ref}>{format === 'currency' ? formatCurrency(value) : String(value)}</span>
      </p>
      {urgency && value > 0 && (
        <p className="mt-1 text-xs font-medium text-warning">Requires attention</p>
      )}
    </div>
  )
}

export function AdminStatsGrid({ totalUsers, pendingDeposits, pendingKyc, openTickets, pendingWithdrawals, totalVolume }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total Users"          value={totalUsers}          icon={Users}            iconClass="bg-accent-secondary-muted text-accent-secondary" />
      <StatCard label="Total Volume"         value={totalVolume}         icon={TrendingUp}       iconClass="bg-accent-primary-muted text-accent-primary"     format="currency" />
      <StatCard label="Pending Deposits"     value={pendingDeposits}     icon={ArrowDownToLine}  iconClass="bg-warning/10 text-warning"                      urgency />
      <StatCard label="Pending KYC"          value={pendingKyc}          icon={ShieldCheck}      iconClass="bg-warning/10 text-warning"                      urgency />
      <StatCard label="Pending Withdrawals"  value={pendingWithdrawals}  icon={ArrowUpFromLine}  iconClass="bg-warning/10 text-warning"                      urgency />
      <StatCard label="Open Tickets"         value={openTickets}         icon={MessageSquare}    iconClass="bg-accent-secondary-muted text-accent-secondary"  urgency />
    </div>
  )
}
