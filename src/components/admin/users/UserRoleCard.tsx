'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

interface UserRoleCardProps {
  userId: string
  role: string
  isSelf: boolean
}

export function UserRoleCard({ userId, role, isSelf }: UserRoleCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState<'promote' | 'demote' | null>(null)
  const isAdmin = role === 'admin'

  function apply(nextRole: 'user' | 'admin') {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      })
      if (res.ok) {
        toast.success(nextRole === 'admin' ? 'User promoted to admin' : 'Admin access revoked')
        setConfirming(null)
        router.refresh()
      } else {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Failed to update role')
      }
    })
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <h2 className="mb-1 font-display text-sm font-semibold text-text-primary">Role</h2>
      <p className="mb-4 text-xs text-text-tertiary">
        Admins can access this admin panel, review KYC, approve deposits/withdrawals, and manage other users.
      </p>

      <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <div className="flex items-center gap-2">
          {isAdmin && <ShieldCheck className="h-4 w-4 text-accent-gold" />}
          <span className={isAdmin ? 'text-sm font-semibold text-accent-gold' : 'text-sm font-semibold text-text-secondary'}>
            {isAdmin ? 'Admin' : 'Standard User'}
          </span>
        </div>

        {isSelf ? (
          <span className="text-xs text-text-tertiary">This is you</span>
        ) : confirming ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => apply(confirming === 'promote' ? 'admin' : 'user')}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-primary-hover disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Confirm {confirming === 'promote' ? 'Promotion' : 'Demotion'}
            </button>
            <button
              onClick={() => setConfirming(null)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-overlay"
            >
              Cancel
            </button>
          </div>
        ) : isAdmin ? (
          <button
            onClick={() => setConfirming('demote')}
            disabled={isPending}
            className="rounded-lg border border-danger/30 bg-danger-muted px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20 disabled:opacity-50"
          >
            Revoke Admin
          </button>
        ) : (
          <button
            onClick={() => setConfirming('promote')}
            disabled={isPending}
            className="rounded-lg border border-accent-gold/30 bg-accent-gold-muted px-3 py-1.5 text-xs font-semibold text-accent-gold transition-colors hover:bg-accent-gold/20 disabled:opacity-50"
          >
            Promote to Admin
          </button>
        )}
      </div>
    </div>
  )
}
