'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  BarChart2,
  Shield,
  BookOpen,
  HelpCircle,
  Phone,
  Layers,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'

const TRADING_MENU = [
  { label: 'Trading Instruments', href: ROUTES.instruments, icon: TrendingUp, description: 'Forex, crypto, stocks & commodities' },
  { label: 'Trading Conditions', href: ROUTES.conditions, icon: BarChart2, description: 'Spreads, leverage & execution' },
  { label: 'Platforms', href: ROUTES.platforms, icon: Layers, description: 'MT5, WebTrader & mobile' },
  { label: 'Account Types', href: ROUTES.accountTypes, icon: Users, description: 'Standard, Pro & VIP accounts' },
]

const COMPANY_MENU = [
  { label: 'About Us', href: ROUTES.about, icon: Users, description: 'Our story and mission' },
  { label: 'Safety of Funds', href: ROUTES.safety, icon: Shield, description: 'How we protect your money' },
  { label: 'FAQ', href: ROUTES.faq, icon: HelpCircle, description: 'Common questions answered' },
  { label: 'Contact', href: ROUTES.contact, icon: Phone, description: 'Get in touch with support' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveMenu(null)
  }, [pathname])

  const isHomepage = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-300',
          scrolled || !isHomepage
            ? 'border-b border-border-subtle bg-bg-base/95 backdrop-blur-md'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex-shrink-0">
            <span className="font-display text-xl font-bold text-text-primary">
              Stock<span className="text-accent-primary">Uptrend</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavDropdown
              label="Trading"
              items={TRADING_MENU}
              isActive={activeMenu === 'trading'}
              onToggle={() => setActiveMenu(activeMenu === 'trading' ? null : 'trading')}
              onClose={() => setActiveMenu(null)}
            />
            <NavDropdown
              label="Company"
              items={COMPANY_MENU}
              isActive={activeMenu === 'company'}
              onToggle={() => setActiveMenu(activeMenu === 'company' ? null : 'company')}
              onClose={() => setActiveMenu(null)}
            />
            <Link
              href={ROUTES.education}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Education
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href={ROUTES.auth.login}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Log In
            </Link>
            <Link
              href={ROUTES.auth.register}
              className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
            >
              Open Account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-bg-base/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-40 w-72 border-l border-border-subtle bg-bg-surface px-6 py-8 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                  Trading
                </p>
                {TRADING_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <item.icon className="h-4 w-4 text-accent-primary" />
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-border-subtle" />
                <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                  Company
                </p>
                {COMPANY_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    <item.icon className="h-4 w-4 text-text-secondary" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={ROUTES.education}
                  className="flex items-center gap-3 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  <BookOpen className="h-4 w-4 text-text-secondary" />
                  Education
                </Link>
                <div className="border-t border-border-subtle" />
                <div className="flex flex-col gap-3">
                  <Link
                    href={ROUTES.auth.login}
                    className="w-full rounded-lg border border-border-default py-2.5 text-center text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated"
                  >
                    Log In
                  </Link>
                  <Link
                    href={ROUTES.auth.register}
                    className="w-full rounded-lg bg-accent-primary py-2.5 text-center text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-primary-hover"
                  >
                    Open Account
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay to close desktop dropdown on outside click */}
      {activeMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
      )}
    </>
  )
}

interface DropdownItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

function NavDropdown({
  label,
  items,
  isActive,
  onToggle,
  onClose,
}: {
  label: string
  items: DropdownItem[]
  isActive: boolean
  onToggle: () => void
  onClose: () => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-bg-elevated text-text-primary'
            : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
        )}
      >
        {label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', isActive && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border-subtle bg-bg-elevated p-2 shadow-elevated"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-bg-overlay"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary-muted">
                  <item.icon className="h-4 w-4 text-accent-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary">{item.description}</p>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
