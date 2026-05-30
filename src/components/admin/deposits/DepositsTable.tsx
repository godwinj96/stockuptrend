'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'

interface Deposit {
  id: string
  amount: number
  currency: string | null
  method: string | null
  reference: string | null
  status: string | null
  created_at: string | null
  admin_note: string | null
  user: { full_name: string | null; email: string | null } | null
}

interface DepositsTableProps {
  deposits: Deposit[]
  total: number
  currentPage: number
  pageSize: number
}

const STATUS_STYLES: Record<string, string> = {
  pending_review: 'bg-warning/10 text-warning',
  completed:      'bg-accent-primary-muted text-accent-primary',
  failed:         'bg-danger-muted text-danger',
  cancelled:      'bg-bg-elevated text-text-tertiary',
}

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending',
  completed:      'Approved',
  failed:         'Rejected',
  cancelled:      'Cancelled',
}

function DepositRow({ deposit, onAction }: { deposit: Deposit; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  // Optimistic status — immediately reflects action without waiting for router.refresh()
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null)

  const resolvedStatus = optimisticStatus ?? deposit.status

  function approve() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/deposits/${deposit.id}/approve`, { method: 'PATCH' })
      if (res.ok) {
        setOptimisticStatus('completed')
        toast.success('Deposit approved — balance credited')
        onAction()
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string }
        // 400 means it was already processed (e.g. double-click)
        if (res.status === 400) {
          setOptimisticStatus('completed')
          toast.info('Deposit was already processed')
          onAction()
        } else {
          toast.error(data.error ?? 'Failed to approve deposit')
        }
      }
    })
  }

  function reject() {
    if (!reason.trim()) { toast.error('Please provide a rejection reason'); return }
    startTransition(async () => {
      const res = await fetch(`/api/admin/deposits/${deposit.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        setOptimisticStatus('failed')
        setExpanded(false)
        toast.success('Deposit rejected')
        onAction()
      } else {
        toast.error('Failed to reject deposit')
      }
    })
  }

  const isPending_ = resolvedStatus === 'pending_review'

  return (
    <>
      <tr className={cn('bg-bg-surface transition-colors hover:bg-bg-elevated', expanded && 'bg-bg-elevated')}>
        <td className="px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary">{deposit.user?.full_name ?? '—'}</p>
            <p className="text-xs text-text-tertiary">{deposit.user?.email ?? '—'}</p>
          </div>
        </td>
        <td className="px-4 py-3 font-semibold tabular-nums text-text-primary">
          {formatCurrency(deposit.amount)}
        </td>
        <td className="px-4 py-3 text-xs text-text-secondary">{deposit.method?.replace('crypto_demo_', '').toUpperCase() ?? '—'}</td>
        <td className="px-4 py-3 font-mono text-xs text-text-tertiary">{deposit.reference?.slice(0, 20) ?? '—'}</td>
        <td className="px-4 py-3 text-xs text-text-tertiary">{deposit.created_at ? formatDateTime(deposit.created_at) : '—'}</td>
        <td className="px-4 py-3">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_STYLES[resolvedStatus ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
            {STATUS_LABELS[resolvedStatus ?? ''] ?? resolvedStatus}
          </span>
        </td>
        <td className="px-4 py-3">
          {isPending_ ? (
            <div className="flex items-center gap-2">
              <button
                onClick={approve}
                disabled={isPending}
                className="flex items-center gap-1 rounded-lg bg-accent-primary-muted px-2.5 py-1.5 text-xs font-semibold text-accent-primary transition-colors hover:bg-accent-primary/20 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                Approve
              </button>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 rounded-lg bg-danger-muted px-2.5 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
              >
                <XCircle className="h-3 w-3" />
                Reject
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
          ) : deposit.admin_note ? (
            <p className="max-w-[180px] truncate text-xs text-text-tertiary" title={deposit.admin_note}>
              {deposit.admin_note}
            </p>
          ) : null}
        </td>
      </tr>
      {expanded && isPending_ && (
        <tr className="bg-bg-elevated">
          <td colSpan={7} className="px-4 pb-4 pt-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Rejection reason</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Insufficient verification, duplicate request..."
                  className="input-field w-full text-sm"
                />
              </div>
              <button
                onClick={reject}
                disabled={isPending || !reason.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger/80 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function DepositsTable({ deposits, total, currentPage, pageSize }: DepositsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  function refresh() { router.refresh() }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-elevated">
              {['User', 'Amount', 'Method', 'Reference', 'Submitted', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {deposits.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-text-tertiary">No deposits found</td></tr>
            ) : deposits.map((d) => <DepositRow key={d.id} deposit={d} onAction={refresh} />)}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-text-tertiary">Page {currentPage} of {totalPages} · {total} total</p>
          <div className="flex gap-1">
            <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-40">
              Previous
            </button>
            <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
