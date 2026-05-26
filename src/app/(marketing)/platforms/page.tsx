import type { Metadata } from 'next'
import Link from 'next/link'
import { Monitor, Smartphone, Globe, Zap, BarChart3, Bell, ArrowRight } from 'lucide-react'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Trading Platforms | StockUptrend',
  description:
    'Trade on MetaTrader 5 for desktop, web, and mobile. Professional tools, one-click execution, and full charting suite.',
}

const FEATURES = [
  { icon: Zap, title: 'One-Click Execution', body: 'Execute orders instantly with configurable lot sizes and built-in risk controls.' },
  { icon: BarChart3, title: '21 Timeframes', body: 'From 1-minute to monthly charts with 80+ built-in technical indicators.' },
  { icon: Bell, title: 'Smart Alerts', body: 'Price alerts, news alerts, and custom indicator signals — delivered to your device.' },
  { icon: Globe, title: 'Multi-Account', body: 'Manage multiple trading accounts from a single MT5 terminal login.' },
]

export default function PlatformsPage() {
  return (
    <>
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Platforms</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">Platform</p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              MetaTrader 5 — Everywhere
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              The industry-standard platform, fully supported across desktop, web browser, iOS, and Android.
              One account. Every market.
            </p>
            <Link
              href={ROUTES.auth.register}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover hover:shadow-glow-accent"
            >
              Start Trading
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              { icon: Monitor, title: 'MT5 Desktop', body: 'Full-featured terminal for Windows and macOS. Advanced scripting with MQL5, EA support, and multi-chart layouts.' },
              { icon: Globe, title: 'MT5 Web', body: 'Trade directly in your browser — no installation required. Full charting, order management, and account overview.' },
              { icon: Smartphone, title: 'MT5 Mobile', body: 'iOS and Android apps with the complete trading toolkit. Push notifications and biometric login.' },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl border border-border-subtle bg-bg-surface p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary-muted">
                  <p.icon className="h-6 w-6 text-accent-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-text-primary">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 font-display text-3xl font-bold text-text-primary">Platform Features</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border-subtle bg-bg-base p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary-muted">
                  <f.icon className="h-4 w-4 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-text-primary">{f.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
