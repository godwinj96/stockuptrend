'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useUIStore } from '@/lib/store'

interface PortalHeaderProps {
  avatarSlot: React.ReactNode
  notificationsSlot: React.ReactNode
}

const PAGE_TITLES: Record<string, string> = {
  '/portal/dashboard':    'Dashboard',
  '/portal/portfolio':    'Portfolio',
  '/portal/ai-trading':   'AI Trading',
  '/portal/deposit':      'Deposit Funds',
  '/portal/withdrawal':   'Withdraw Funds',
  '/portal/trade-history': 'Trade History',
  '/portal/kyc':          'Identity Verification',
  '/portal/support':      'Support',
  '/portal/settings':     'Account Settings',
}

export function PortalHeader({ avatarSlot, notificationsSlot }: PortalHeaderProps) {
  const pathname = usePathname()
  const { toggleMobileSidebar } = useUIStore()

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Portal'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="font-display text-base font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {notificationsSlot}
        {avatarSlot}
      </div>
    </header>
  )
}
