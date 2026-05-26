'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'

interface PortalHeaderProps {
  avatarSlot: React.ReactNode
}

const PAGE_TITLES: Record<string, string> = {
  '/portal/dashboard': 'Dashboard',
  '/portal/deposit': 'Deposit Funds',
  '/portal/withdrawal': 'Withdraw Funds',
  '/portal/trade-history': 'Trade History',
  '/portal/kyc': 'Identity Verification',
  '/portal/support': 'Support',
  '/portal/settings': 'Account Settings',
}

export function PortalHeader({ avatarSlot }: PortalHeaderProps) {
  const pathname = usePathname()

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Portal'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="font-display text-base font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary" />
        </button>

        {avatarSlot}
      </div>
    </header>
  )
}
