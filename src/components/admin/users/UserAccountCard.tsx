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
  account_number: string
}

interface UserAccountCardProps {
  userId: string
  account: Account
}

export function UserAccountCard({ userId, account }: UserAccountCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [accountType, setAccountType] = useState(account.account_type ?? 'standard')
  const [isActive, setIsActive] = useState(account.is_active ?? true)

  function save() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_type: accountType, is_active: isActive }),
      })
      if (res.ok) {
        toast.success('Account updated')
        router.refresh()
      } else {
        toast.error('Failed to update account')
      }
    })
  }

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

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Account Tier</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="input-field w-full text-sm"
          >
            <option value="standard">Standard</option>
            <option value="pro">Pro</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
          <span className="text-sm text-text-secondary">Account Active</span>
          <button
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((v) => !v)}
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors',
              isActive ? 'bg-accent-primary' : 'bg-bg-overlay'
            )}
          >
            <span className={cn(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
              isActive ? 'translate-x-4' : 'translate-x-0.5'
            )} />
          </button>
        </div>
      </div>

      <button
        onClick={save}
        disabled={isPending}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Changes
      </button>
    </div>
  )
}
