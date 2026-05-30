'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatDateTime } from '@/lib/utils/format'

interface Withdrawal {
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

interface Props {
  withdrawals: Withdrawal[]
  total: number
  currentPage: number
  pageSize: number
}

const STATUS_STYLES: Record<string, string> = {
  pending_review: 'bg-warning/10 text-warning',
  completed:      'bg-accent-primary-muted text-accent-primary',
  failed:         'bg-danger-muted text-danger',
}

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending',
  completed:      'Approved',
  failed:         'Rejected',
}

function WithdrawalRow({ w, onAction }: { w: Withdrawal; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null)
  const resolvedStatus = optimisticStatus ?? w.status

  function approve() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/withdrawals/${w.id}/approve`, { method: 'PATCH' })
      if (res.ok) {
        setOptimisticStatus('completed')
        toast.success('Withdrawal approved')
        onAction()
      } else if (res.status === 400) {
        setOptimisticStatus('completed')
        toast.info('Withdrawal was already processed')
        onAction()
      } else {
        toast.error('Failed to approve withdrawal')
      }
    })
  }

  function reject() {
    if (!reason.trim()) { toast.error('Please provide a reason'); return }
    startTransition(async () => {
      const res = await fetch(`/api/admin/withdrawals/${w.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        setOptimisticStatus('failed')
        setExpanded(false)
        toast.success('Withdrawal rejected — balance refunded')
        onAction()
      } else {
        toast.error('Failed to reject withdrawal')
      }
    })
  }

  const isPendingStatus = resolvedStatus === 'pending_review'

  return (
    <>
      <tr className={cn('bg-bg-surface transition-colors hover:bg-bg-elevated', expanded && 'bg-bg-elevated')}>
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-text-primary">{w.user?.full_name ?? '—'}</p>
          <p className="text-xs text-text-tertiary">{w.user?.email ?? '—'}</p>
        </td>
        <td className="px-4 py-3 font-semibold tabular-nums text-text-primary">{formatCurrency(w.amount)}</td>
        <td className="px-4 py-3 text-xs text-text-secondary">{w.method ?? '—'}</td>
        <td className="px-4 py-3 text-xs text-text-tertiary">{w.created_at ? formatDateTime(w.created_at) : '—'}</td>
        <td className="px-4 py-3">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_STYLES[resolvedStatus ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
            {STATUS_LABELS[resolvedStatus ?? ''] ?? resolvedStatus}
          </span>
        </td>
        <td className="px-4 py-3">
          {isPendingStatus && (
            <div className="flex items-center gap-2">
              <button onClick={approve} disabled={isPending}
                className="flex items-center gap-1 rounded-lg bg-accent-primary-muted px-2.5 py-1.5 text-xs font-semibold text-accent-primary hover:bg-accent-primary/20 disabled:opacity-50">
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                Approve
              </button>
              <button onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 rounded-lg bg-danger-muted px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20">
                <XCircle className="h-3 w-3" />
                Reject
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
          )}
        </td>
      </tr>
      {expanded && isPendingStatus && (
        <tr className="bg-bg-elevated">
          <td colSpan={6} className="px-4 pb-4 pt-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Rejection reason</label>
                <input value={reason} onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for rejection..." className="input-field w-full text-sm" />
              </div>
              <button onClick={reject} disabled={isPending || !reason.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-danger/80 disabled:opacity-50">
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function WithdrawalsTableClient({ withdrawals, total, currentPage, pageSize }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-elevated">
              {['User', 'Amount', 'Method', 'Requested', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {withdrawals.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-text-tertiary">No withdrawals found</td></tr>
            ) : withdrawals.map((w) => <WithdrawalRow key={w.id} w={w} onAction={() => router.refresh()} />)}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-text-tertiary">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-elevated disabled:opacity-40">Previous</button>
            <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary hover:bg-bg-elevated disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
