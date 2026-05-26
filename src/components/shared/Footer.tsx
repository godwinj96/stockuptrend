import Link from 'next/link'
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react'
import { RiskWarningBanner } from './RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

const TRADING_LINKS = [
  { label: 'Trading Instruments', href: ROUTES.instruments },
  { label: 'Trading Conditions', href: ROUTES.conditions },
  { label: 'Platforms', href: ROUTES.platforms },
  { label: 'Account Types', href: ROUTES.accountTypes },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: ROUTES.about },
  { label: 'Safety of Funds', href: ROUTES.safety },
  { label: 'FAQ', href: ROUTES.faq },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Education', href: ROUTES.education },
]

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: ROUTES.legal.terms },
  { label: 'Privacy Policy', href: ROUTES.legal.privacy },
  { label: 'Risk Disclosure', href: ROUTES.legal.riskDisclosure },
  { label: 'AML & KYC Policy', href: ROUTES.legal.amlKyc },
]

const SOCIAL_LINKS = [
  { label: 'Twitter', href: '#', icon: Twitter },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Instagram', href: '#', icon: Instagram },
]

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-surface">
      <RiskWarningBanner variant="footer" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href={ROUTES.home}>
              <span className="font-display text-lg font-bold text-text-primary">
                Stock<span className="text-accent-primary">Uptrend</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Trade global markets with tight spreads, powerful tools, and a platform built for
              serious traders.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-tertiary transition-colors hover:border-border-default hover:text-text-secondary"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Trading */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Trading
            </h3>
            <ul className="space-y-2.5">
              {TRADING_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} StockUptrend. All rights reserved.
          </p>
          <p className="text-xs text-text-tertiary">
            Trading CFDs involves significant risk of loss.
          </p>
        </div>
      </div>
    </footer>
  )
}
