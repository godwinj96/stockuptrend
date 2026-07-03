'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, Ban } from 'lucide-react'
import { toast } from 'sonner'

interface UserStatusCardProps {
  userId: string
  isActive: boolean
  isSelf: boolean
}

// Suspending blocks login at the Supabase Auth layer (see /status route — it bans the
// user, it doesn't just flip a display flag), so this is a real access control, not
// cosmetic.
export function UserStatusCard({ userId, isActive, isSelf }: UserStatusCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function apply(active: boolean) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      if (res.ok) {
        toast.success(active ? 'User reactivated' : 'User suspended')
        setConfirming(false)
        router.refresh()
      } else {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Failed to update user status')
      }
    })
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <h2 className="mb-1 font-display text-sm font-semibold text-text-primary">User Status</h2>
      <p className="mb-4 text-xs text-text-tertiary">
        Suspending blocks this person from signing in anywhere on the platform. Their data is untouched.
      </p>

      <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <div className="flex items-center gap-2">
          {isActive ? (
            <CheckCircle className="h-4 w-4 text-accent-primary" />
          ) : (
            <Ban className="h-4 w-4 text-danger" />
          )}
          <span className={isActive ? 'text-sm font-semibold text-accent-primary' : 'text-sm font-semibold text-danger'}>
            {isActive ? 'Active' : 'Suspended'}
          </span>
        </div>

        {isSelf ? (
          <span className="text-xs text-text-tertiary">This is you</span>
        ) : confirming ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => apply(false)}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-danger/80 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Confirm Suspend
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-overlay"
            >
              Cancel
            </button>
          </div>
        ) : isActive ? (
          <button
            onClick={() => setConfirming(true)}
            disabled={isPending}
            className="rounded-lg border border-danger/30 bg-danger-muted px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20 disabled:opacity-50"
          >
            Suspend User
          </button>
        ) : (
          <button
            onClick={() => apply(true)}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-primary-hover disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            Reactivate User
          </button>
        )}
      </div>
    </div>
  )
}
