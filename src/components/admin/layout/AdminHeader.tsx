'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Menu, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createBrowserClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants/routes'

interface AdminHeaderProps {
  adminName: string
  adminEmail: string
}

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':   'Dashboard',
  '/admin/users':       'Users',
  '/admin/deposits':    'Deposits',
  '/admin/kyc':         'KYC Review',
  '/admin/withdrawals': 'Withdrawals',
  '/admin/support':     'Support Tickets',
}

export function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Admin'

  const initials = adminName
    ? adminName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push(ROUTES.auth.login)
    router.refresh()
  }

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
        <span className="rounded-full bg-accent-gold-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-gold">
          Admin
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-bg-elevated">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-accent-primary-muted text-accent-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {adminName && (
              <span className="hidden text-sm font-medium text-text-secondary md:block">
                {adminName.split(' ')[0]}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <div className="px-3 py-2 border-b border-border-subtle">
            <p className="text-xs font-medium text-text-primary truncate">{adminName}</p>
            <p className="text-[11px] text-text-tertiary truncate">{adminEmail}</p>
          </div>
          <DropdownMenuItem onClick={handleSignOut} className="text-danger focus:text-danger mt-1">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
