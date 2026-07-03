'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/utils/format'

interface DangerZoneCardProps {
  userId: string
  email: string | null
  deletedAt: string | null
  isSelf: boolean
}

export function DangerZoneCard({ userId, email, deletedAt, isSelf }: DangerZoneCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  function del() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/delete`, { method: 'POST' })
      if (res.ok) {
        toast.success('User deleted — data preserved, can be restored')
        setShowConfirm(false)
        setConfirmText('')
        router.refresh()
      } else {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Failed to delete user')
      }
    })
  }

  function restore() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/restore`, { method: 'POST' })
      if (res.ok) {
        toast.success('User restored')
        router.refresh()
      } else {
        toast.error('Failed to restore user')
      }
    })
  }

  if (deletedAt) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-muted p-5">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-danger" />
          <h2 className="font-display text-sm font-semibold text-danger">User Deleted</h2>
        </div>
        <p className="mb-4 text-xs text-text-secondary">
          Deleted on {formatDateTime(deletedAt)}. All profile, account, transaction, and trade data is
          preserved. The user cannot sign in until restored.
        </p>
        <button
          onClick={restore}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
          Restore User
        </button>
      </div>
    )
  }

  if (isSelf) {
    return (
      <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
        <h2 className="mb-1 font-display text-sm font-semibold text-danger">Danger Zone</h2>
        <p className="text-xs text-text-tertiary">You cannot delete your own account.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-danger/20 bg-bg-surface p-5 shadow-card">
      <h2 className="mb-1 font-display text-sm font-semibold text-danger">Danger Zone</h2>
      <p className="mb-4 text-xs text-text-tertiary">
        Deletes this user. Their profile, transactions, and trades are preserved and this can be undone
        from the same place — but the user loses access immediately.
      </p>

      {showConfirm ? (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-text-secondary">
            Type <span className="font-mono text-text-primary">{email}</span> to confirm
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={email ?? ''}
            className="input-field w-full text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={del}
              disabled={isPending || confirmText !== email}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-danger py-2.5 text-sm font-semibold text-white transition-colors hover:bg-danger/80 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete User
            </button>
            <button
              onClick={() => { setShowConfirm(false); setConfirmText('') }}
              className="rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-muted px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/20"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Delete User
        </button>
      )}
    </div>
  )
}
