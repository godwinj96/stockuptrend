import type { Metadata } from 'next'
import Link from 'next/link'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Trading Conditions | StockUptrend',
  description:
    'Review StockUptrend spreads, leverage, margin requirements, swap rates, and execution policy.',
}

const CONDITIONS = [
  { label: 'Execution Type', value: 'Market Execution (no requotes)' },
  { label: 'Min Trade Size', value: '0.01 lots' },
  { label: 'Max Trade Size', value: '500 lots' },
  { label: 'EUR/USD Spread (Pro)', value: 'From 0.0 pips' },
  { label: 'EUR/USD Spread (Standard)', value: 'From 1.2 pips' },
  { label: 'Max Leverage (Forex)', value: 'Up to 1:500 (VIP)' },
  { label: 'Max Leverage (Crypto)', value: 'Up to 1:10' },
  { label: 'Max Leverage (Stocks)', value: 'Up to 1:20' },
  { label: 'Margin Call Level', value: '80%' },
  { label: 'Stop Out Level', value: '50%' },
  { label: 'Swap-Free Accounts', value: 'Available on request' },
  { label: 'Hedging', value: 'Allowed' },
]

const HOURS = [
  { market: 'Forex', hours: 'Mon 00:00 – Fri 23:59 GMT' },
  { market: 'Cryptocurrencies', hours: '24/7 including weekends' },
  { market: 'US Stocks & Indices', hours: 'Mon–Fri 14:30–21:00 GMT' },
  { market: 'UK Stocks', hours: 'Mon–Fri 08:00–16:30 GMT' },
  { market: 'Gold & Silver', hours: 'Mon–Fri 01:00–23:59 GMT' },
  { market: 'Oil (WTI/Brent)', hours: 'Mon–Fri 01:00–23:59 GMT' },
]

export default function TradingConditionsPage() {
  return (
    <>
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Trading Conditions</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">Conditions</p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Transparent Pricing, No Surprises
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Every spread, lever, and limit — published openly so you can plan your trading strategy with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">Account Conditions</h2>
          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border-subtle">
                {CONDITIONS.map((c, i) => (
                  <tr key={c.label} className={i % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-base'}>
                    <td className="px-5 py-3.5 text-text-secondary">{c.label}</td>
                    <td className="px-5 py-3.5 font-medium text-text-primary">{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">Trading Hours</h2>
          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-elevated">
                  <th className="px-5 py-3 text-left font-medium text-text-tertiary">Market</th>
                  <th className="px-5 py-3 text-left font-medium text-text-tertiary">Trading Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {HOURS.map((h) => (
                  <tr key={h.market} className="bg-bg-surface">
                    <td className="px-5 py-3.5 font-medium text-text-primary">{h.market}</td>
                    <td className="px-5 py-3.5 text-text-secondary">{h.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
