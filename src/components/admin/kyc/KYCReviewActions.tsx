'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ROUTES } from '@/lib/constants/routes'

interface KYCReviewActionsProps {
  userId: string
  currentStatus: string | null
}

export function KYCReviewActions({ userId, currentStatus }: KYCReviewActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reason, setReason] = useState('')

  const isApproved = currentStatus === 'approved'
  const isRejected = currentStatus === 'rejected'

  function approve() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/kyc/${userId}/approve`, { method: 'PATCH' })
      if (res.ok) {
        toast.success('KYC approved — user notified')
        router.push(ROUTES.admin.kyc)
        router.refresh()
      } else {
        toast.error('Failed to approve KYC')
      }
    })
  }

  function reject() {
    if (!reason.trim()) { toast.error('Please provide a rejection reason'); return }
    startTransition(async () => {
      const res = await fetch(`/api/admin/kyc/${userId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        toast.success('KYC rejected — user notified')
        router.push(ROUTES.admin.kyc)
        router.refresh()
      } else {
        toast.error('Failed to reject KYC')
      }
    })
  }

  if (isApproved) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-accent-primary/20 bg-accent-primary-muted px-5 py-3">
        <CheckCircle className="h-4 w-4 text-accent-primary" />
        <span className="text-sm font-semibold text-accent-primary">KYC Approved</span>
      </div>
    )
  }

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger-muted px-5 py-3">
        <XCircle className="h-4 w-4 text-danger" />
        <span className="text-sm font-semibold text-danger">KYC Rejected</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-4 font-display text-sm font-semibold text-text-primary">Review Decision</h3>

      {showRejectForm ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Rejection reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why the submission is being rejected..."
              className="input-field w-full resize-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={reject}
              disabled={isPending || !reason.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-danger py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger/80 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Rejection
            </button>
            <button
              onClick={() => setShowRejectForm(false)}
              className="rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={approve}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Approve KYC
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger-muted py-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/20 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </div>
      )}
    </div>
  )
}
