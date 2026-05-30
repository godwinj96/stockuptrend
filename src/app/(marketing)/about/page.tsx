import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Globe2, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'About StockUptrend | Who We Are',
  description:
    'StockUptrend automates investing with institutional-grade AI. Learn about our mission and how we built hands-free portfolio growth for everyone.',
}

const STATS = [
  { value: '50,000+', label: 'Investors' },
  { value: '120+', label: 'Countries Served' },
  { value: '72%', label: 'Avg Win Rate' },
  { value: '24/5', label: 'AI Trading Hours' },
]

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Transparency',
    body: 'Every trade your AI places is logged in real time. No hidden activity, no opaque fees. You see exactly where your money goes.',
  },
  {
    icon: Users,
    title: 'Investor-First',
    body: 'Every product decision starts with one question: does this improve outcomes for our investors? We build for the portfolio, not the platform.',
  },
  {
    icon: Globe2,
    title: 'Global Access',
    body: "The best AI investing tools should not be reserved for one geography. We serve investors across 120+ countries with accessible funding methods.",
  },
  {
    icon: TrendingUp,
    title: 'Execution Quality',
    body: 'Our AI executes with speed and precision — entering and exiting positions at optimal prices, around the clock, without emotion.',
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
              Investing, <br />Automated
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-secondary">
              StockUptrend was built on a straightforward idea: the most powerful trading technology
              should not be reserved for hedge funds and proprietary desks. We built the infrastructure.
              We automated the execution. We opened it to everyone.
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
                Markets Move 24 Hours. So Does Your AI.
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                Institutional desks run automated strategies around the clock. Individual investors
                historically could not. We changed that — by building and deploying the same category
                of AI-driven execution technology, accessible from any account size.
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                The result is a platform where you deposit, select a risk strategy, and the AI does
                the rest — entering positions, managing risk, and compounding returns continuously.
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
                Our Approach
              </p>
              <h2 className="font-display text-3xl font-bold text-text-primary">
                Performance Over Promises
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                We do not compete on signup bonuses or promotional gimmicks. Every resource we
                reinvest goes into the AI engine — tighter execution, more instruments, better
                risk management.
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                Our investors stay because results compound. That keeps us focused on the one thing
                that matters: performance.
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
              Ready to Put Your Capital to Work?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-text-secondary">
              Join thousands of investors who chose StockUptrend for hands-free portfolio growth.
              Deposit once. The AI works continuously.
            </p>
            <Link
              href={ROUTES.auth.register}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-3 text-sm font-semibold text-text-inverse transition-all duration-200 hover:bg-accent-primary-hover hover:shadow-glow-accent"
            >
              Start Earning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
