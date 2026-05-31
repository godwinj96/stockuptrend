'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, ArrowDownToLine, ShieldCheck,
  ArrowUpFromLine, MessageSquare, ChevronLeft, ChevronRight, LogOut, Settings2, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import { createBrowserClient } from '@/lib/supabase/client'
import { useUIStore } from '@/lib/store/index'

interface AdminSidebarProps {
  pendingDeposits: number
  pendingKyc: number
  pendingWithdrawals: number
  openTickets: number
}

export function AdminSidebar({ pendingDeposits, pendingKyc, pendingWithdrawals, openTickets }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const supabase = createBrowserClient()

  const NAV_ITEMS = [
    { label: 'Dashboard',    href: ROUTES.admin.dashboard,   icon: LayoutDashboard, badge: 0 },
    { label: 'Users',        href: ROUTES.admin.users,       icon: Users,           badge: 0 },
    { label: 'Deposits',     href: ROUTES.admin.deposits,    icon: ArrowDownToLine, badge: pendingDeposits },
    { label: 'KYC Review',   href: ROUTES.admin.kyc,         icon: ShieldCheck,     badge: pendingKyc },
    { label: 'Withdrawals',  href: ROUTES.admin.withdrawals, icon: ArrowUpFromLine, badge: pendingWithdrawals },
    { label: 'Support',      href: ROUTES.admin.support,     icon: MessageSquare,   badge: openTickets },
    { label: 'Settings',     href: ROUTES.admin.settings,    icon: Settings2,       badge: 0 },
  ]

  // Close mobile drawer on route change
  useEffect(() => {
    closeMobileSidebar()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileSidebarOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push(ROUTES.auth.login)
    router.refresh()
  }

  return (
    <>
      {/* ── Mobile drawer (always in DOM, transitions via CSS) ── */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
            mobileSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border-subtle bg-bg-surface transition-transform duration-300 ease-out',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border-subtle px-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-text-primary">
                Stock<span className="text-accent-primary">Up</span>
              </span>
              <span className="rounded-full bg-accent-gold-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-gold">
                Admin
              </span>
            </div>
            <button
              onClick={closeMobileSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-elevated hover:text-text-primary"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobileSidebar}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'border-l-2 border-accent-primary bg-accent-primary-muted text-accent-primary'
                          : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-primary px-1.5 text-[10px] font-bold text-text-inverse">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Sign out */}
          <div className="border-t border-border-subtle px-2 py-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className={cn(
        'hidden flex-col border-r border-border-subtle bg-bg-surface transition-all duration-300 lg:flex',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}>
        <div className="flex h-16 items-center justify-between border-b border-border-subtle px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-text-primary">
                Stock<span className="text-accent-primary">Up</span>
              </span>
              <span className="rounded-full bg-accent-gold-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-gold">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-elevated hover:text-text-secondary',
              sidebarCollapsed && 'mx-auto'
            )}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'border-l-2 border-accent-primary bg-accent-primary-muted text-accent-primary'
                        : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="flex-1">{item.label}</span>}
                    {!sidebarCollapsed && item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-primary px-1.5 text-[10px] font-bold text-text-inverse">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                    {sidebarCollapsed && item.badge > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-primary" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border-subtle px-2 py-4">
          <button
            onClick={handleSignOut}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary',
              sidebarCollapsed && 'justify-center px-2'
            )}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
