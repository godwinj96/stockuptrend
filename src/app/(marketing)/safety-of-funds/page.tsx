import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Lock, Building2, Eye } from 'lucide-react'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Safety of Funds | StockUptrend',
  description:
    'Learn how StockUptrend protects your funds through segregated accounts, SSL encryption, and strict operational controls.',
}

const MEASURES = [
  {
    icon: Building2,
    title: 'Segregated Client Accounts',
    body: 'All client funds are held in dedicated accounts at tier-1 banking institutions, completely separated from company operating funds. Your money cannot be used for any company purpose — including operational expenses or debt settlement.',
  },
  {
    icon: Lock,
    title: 'SSL/TLS Encryption',
    body: 'Every connection to StockUptrend uses 256-bit SSL encryption. All data transmitted between your device and our servers is protected against interception or tampering.',
  },
  {
    icon: ShieldCheck,
    title: 'Two-Factor Authentication',
    body: 'We require email verification on account creation and strongly recommend enabling TOTP-based 2FA. Suspicious login attempts trigger automatic account holds pending review.',
  },
  {
    icon: Eye,
    title: 'Identity Verification (KYC)',
    body: 'KYC verification is mandatory before trading. This protects you by ensuring no one else can access or operate your account — and protects the platform against fraud.',
  },
]

export default function SafetyOfFundsPage() {
  return (
    <>
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Safety of Funds</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">Security</p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Your Funds Are Protected
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              We apply the same standards that institutional fund managers apply to client money.
              Here is exactly how we protect what you deposit with us.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {MEASURES.map((m) => (
              <div key={m.title} className="flex gap-6 rounded-2xl border border-border-subtle bg-bg-surface p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-primary-muted">
                  <m.icon className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-text-primary">{m.title}</h2>
                  <p className="mt-2 leading-relaxed text-text-secondary">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/5 to-bg-elevated p-8">
            <h2 className="font-display text-2xl font-bold text-text-primary">Our Commitment</h2>
            <p className="mt-3 leading-relaxed text-text-secondary">
              We publish our security practices openly because transparency is the foundation of
              trust. If you ever have a concern about the safety of your funds, our compliance team
              is available at{' '}
              <a href="mailto:compliance@stockuptrend.com" className="text-accent-primary hover:underline">
                compliance@stockuptrend.com
              </a>
              .
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              We conduct regular third-party security audits and penetration testing. Reports are
              available to regulated institutional clients upon request under NDA.
            </p>
          </div>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
