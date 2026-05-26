import { cn } from '@/lib/utils/cn'
import { getProfile } from '@/lib/supabase/queries'
import type { AccountType } from '@/lib/supabase/types'

const ACCOUNT_TYPE_CLASSES: Record<AccountType, string> = {
  standard: 'bg-accent-secondary-muted text-accent-secondary',
  pro: 'bg-accent-primary-muted text-accent-primary',
  vip: 'bg-accent-gold-muted text-accent-gold',
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  standard: 'Standard',
  pro: 'Pro',
  vip: 'VIP',
}

export function SidebarUserInfoSkeleton() {
  return (
    <div className="border-b border-border-subtle px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-full bg-bg-overlay" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 animate-pulse rounded bg-bg-overlay" />
          <div className="h-4 w-14 animate-pulse rounded-full bg-bg-overlay" />
        </div>
      </div>
    </div>
  )
}

export async function SidebarUserInfo({ userId }: { userId: string }) {
  const profile = await getProfile(userId)
  if (!profile) return <SidebarUserInfoSkeleton />

  const initial =
    profile.full_name?.[0]?.toUpperCase() ?? profile.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="border-b border-border-subtle px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-primary-muted text-sm font-semibold text-accent-primary">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text-primary">
            {profile.full_name ?? 'Trader'}
          </p>
          <span
            className={cn(
              'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
              ACCOUNT_TYPE_CLASSES[profile.account_type ?? 'standard']
            )}
          >
            {ACCOUNT_TYPE_LABELS[profile.account_type ?? 'standard']}
          </span>
        </div>
      </div>
    </div>
  )
}
