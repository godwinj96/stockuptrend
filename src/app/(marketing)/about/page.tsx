import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Globe2, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'About StockUptrend | Who We Are',
  description:
    'Learn about StockUptrend — our mission, values, and commitment to giving retail traders access to institutional-grade tools and pricing.',
}

const STATS = [
  { value: '50,000+', label: 'Active Traders' },
  { value: '120+', label: 'Countries Served' },
  { value: '200+', label: 'Instruments' },
  { value: '24/5', label: 'Market Hours' },
]

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Transparency',
    body: 'No hidden fees, no confusing terms. You always know exactly what you pay and why. Our pricing is published openly.',
  },
  {
    icon: Users,
    title: 'Trader-First',
    body: 'Every product decision is driven by one question: does this make our traders more profitable or more efficient? We build for the trader, not the institution.',
  },
  {
    icon: Globe2,
    title: 'Global Access',
    body: "Markets shouldn't have borders. We serve traders across 120+ countries with localized support and accessible funding methods.",
  },
  {
    icon: TrendingUp,
    title: 'Execution Quality',
    body: 'Speed and accuracy matter when markets move fast. We invest heavily in infrastructure to ensure your orders are filled at the price you expect.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">About</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Our Story
            </p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Built by Traders, <br />for Traders
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-secondary">
              StockUptrend was founded on a simple frustration: the best trading infrastructure was
              locked behind institutional doors. We set out to change that — and to build the
              platform we always wanted to trade on ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border-subtle py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-extrabold text-accent-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
                Mission
              </p>
              <h2 className="font-display text-3xl font-bold text-text-primary">
                Democratising Access to Global Markets
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                The global financial markets move trillions of dollars daily, yet the average retail
                trader is working with inferior tools, wider spreads, and less reliable execution
                than the professionals on the other side of their trade.
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                Our mission is to close that gap. By investing in institutional-grade infrastructure
                and offering it to retail clients at accessible price points, we put the best tools
                in the hands of the people who need them most.
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
                Our Approach
              </p>
              <h2 className="font-display text-3xl font-bold text-text-primary">
                Infrastructure Over Marketing
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                We don&apos;t spend heavily on bonuses and promotions designed to attract and then
                drain trader accounts. Instead, every dollar we reinvest goes into tighter spreads,
                faster execution, and a better product.
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                We believe the best traders will find the best platform through word of mouth and
                results — not advertising. That belief keeps us honest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
            Values
          </p>
          <h2 className="mb-12 font-display text-3xl font-bold text-text-primary">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border-subtle bg-bg-base p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary-muted">
                  <v.icon className="h-5 w-5 text-accent-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/5 to-bg-surface p-10 text-center">
            <h2 className="font-display text-3xl font-bold text-text-primary">
              Ready to Trade with Us?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-text-secondary">
              Join thousands of traders who chose StockUptrend for better execution, tighter
              spreads, and a platform that grows with them.
            </p>
            <Link
              href={ROUTES.auth.register}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-3 text-sm font-semibold text-text-inverse transition-all duration-200 hover:bg-accent-primary-hover hover:shadow-glow-accent"
            >
              Open Your Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
