'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface Account {
  id: string
  account_type: string | null
  balance: number | null
  currency: string | null
  is_active: boolean | null
  ai_active: boolean | null
  account_number: string
}

interface UserAccountCardProps {
  userId: string
  account: Account
}

// Each control below saves independently, on its own button, with its own
// confirmation where the action is impactful. This is deliberate: a single shared
// "Save Changes" button covering unrelated fields (tier + trading-account visibility)
// is what silently deactivated a user's account and hid their real balance in a past
// incident — see admin_audit_log for the audit trail this now produces.
export function UserAccountCard({ userId, account }: UserAccountCardProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <TierSection userId={userId} account={account} onSaved={() => router.refresh()} />
      <VisibilitySection userId={userId} account={account} onSaved={() => router.refresh()} />
      <AITradingSection userId={userId} account={account} onSaved={() => router.refresh()} />
    </div>
  )
}

function TierSection({ userId, account, onSaved }: UserAccountCardProps & { onSaved: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [accountType, setAccountType] = useState(account.account_type ?? 'standard')

  function save() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_type: accountType }),
      })
      if (res.ok) {
        toast.success('Account tier updated')
        onSaved()
      } else {
        toast.error('Failed to update tier')
      }
    })
  }

  const changed = accountType !== (account.account_type ?? 'standard')

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <h2 className="mb-4 font-display text-sm font-semibold text-text-primary">Account</h2>

      <div className="mb-4 space-y-3">
        <div>
          <p className="text-xs text-text-tertiary">Account Number</p>
          <p className="mt-0.5 font-mono text-sm text-text-primary">{account.account_number}</p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Balance</p>
          <p className="mt-0.5 font-display text-xl font-bold tabular-nums text-accent-primary">
            {formatCurrency(account.balance ?? 0)}
          </p>
        </div>
      </div>

      <label className="mb-1.5 block text-xs font-medium text-text-secondary">Account Tier</label>
      <div className="flex gap-2">
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="input-field w-full text-sm"
        >
          <option value="standard">Standard</option>
          <option value="pro">Pro</option>
          <option value="vip">VIP</option>
        </select>
        <button
          onClick={save}
          disabled={isPending || !changed}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save
        </button>
      </div>
    </div>
  )
}

function VisibilitySection({ userId, account, onSaved }: UserAccountCardProps & { onSaved: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const isActive = account.is_active ?? true

  function toggle() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/account-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !isActive }),
      })
      if (res.ok) {
        toast.success(isActive ? 'Trading account hidden' : 'Trading account visible again')
        setConfirming(false)
        onSaved()
      } else {
        const { error } = await res.json().catch(() => ({ error: null }))
        toast.error(error ?? 'Failed to update trading account visibility')
      }
    })
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <h2 className="mb-1 font-display text-sm font-semibold text-text-primary">Trading Account Visibility</h2>
      <p className="mb-4 text-xs text-text-tertiary">
        Controls whether this account&apos;s balance, positions, and portfolio appear anywhere in the
        portal. Turning this off hides the balance from the user everywhere — it does not change it.
      </p>

      <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <div>
          <p className="text-sm text-text-secondary">
            Status: <span className={cn('font-semibold', isActive ? 'text-accent-primary' : 'text-danger')}>
              {isActive ? 'Visible' : 'Hidden'}
            </span>
          </p>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-danger/80 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Confirm Hide
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-overlay"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            role="switch"
            aria-checked={isActive}
            onClick={() => (isActive ? setConfirming(true) : toggle())}
            disabled={isPending}
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors disabled:opacity-50',
              isActive ? 'bg-accent-primary' : 'bg-bg-overlay'
            )}
          >
            <span className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
              isActive ? 'translate-x-4' : 'translate-x-0.5'
            )} />
          </button>
        )}
      </div>
    </div>
  )
}

function AITradingSection({ userId, account, onSaved }: UserAccountCardProps & { onSaved: () => void }) {
  const [isPending, startTransition] = useTransition()
  const aiActive = account.ai_active ?? true

  function toggle() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/ai-trading`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiActive: !aiActive }),
      })
      if (res.ok) {
        toast.success(aiActive ? 'AI trading disabled' : 'AI trading enabled')
        onSaved()
      } else {
        toast.error('Failed to update AI trading')
      }
    })
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
      <h2 className="mb-1 font-display text-sm font-semibold text-text-primary">AI Trading</h2>
      <p className="mb-4 text-xs text-text-tertiary">
        Pauses the automated trading engine for this account. Open positions are left as-is.
      </p>

      <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <span className="text-sm text-text-secondary">
          {aiActive ? 'Running' : 'Paused'}
        </span>
        <button
          role="switch"
          aria-checked={aiActive}
          onClick={toggle}
          disabled={isPending}
          className={cn(
            'relative h-5 w-9 rounded-full transition-colors disabled:opacity-50',
            aiActive ? 'bg-accent-primary' : 'bg-bg-overlay'
          )}
        >
          <span className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
            aiActive ? 'translate-x-4' : 'translate-x-0.5'
          )} />
        </button>
      </div>
    </div>
  )
}
