import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ACCOUNT_TIERS } from '@/lib/constants/account-types'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title: 'Account Types | StockUptrend',
  description:
    'Compare Standard, Pro, and VIP trading accounts. Find the right account for your trading style and capital level.',
}

const COMPARISON_ROWS = [
  { label: 'Minimum Deposit', values: ['$100', '$1,000', '$10,000'] },
  { label: 'Spreads from', values: ['1.2 pips', '0.5 pips', '0.0 pips'] },
  { label: 'Max Leverage', values: ['1:200', '1:400', '1:500'] },
  { label: 'Commission', values: ['None', 'None', '$3/lot'] },
  { label: 'Instruments', values: ['200+', '200+', '200+'] },
  { label: 'MT5 Access', values: [true, true, true] },
  { label: 'VIP Support', values: [false, false, true] },
  { label: 'Personal Account Manager', values: [false, false, true] },
  { label: 'Priority Withdrawals', values: [false, false, true] },
  { label: 'Copy Trading', values: [false, true, true] },
  { label: 'Economic Calendar', values: [true, true, true] },
  { label: 'Trading Signals', values: [false, true, true] },
]

export default function AccountTypesPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Account Types</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Accounts
            </p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Choose Your Account
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              From your first trade to high-volume strategies — an account built for every stage of
              your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ACCOUNT_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  'relative rounded-2xl border bg-bg-surface p-7',
                  tier.isPopular
                    ? 'border-accent-primary shadow-glow-accent'
                    : tier.id === 'vip'
                    ? 'border-accent-gold/30'
                    : 'border-border-subtle'
                )}
              >
                {tier.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-primary px-3 py-0.5 text-xs font-semibold text-text-inverse">
                    Most Popular
                  </span>
                )}
                <h2
                  className={cn(
                    'font-display text-2xl font-bold',
                    tier.id === 'vip'
                      ? 'text-accent-gold'
                      : tier.isPopular
                      ? 'text-accent-primary'
                      : 'text-text-primary'
                  )}
                >
                  {tier.name}
                </h2>
                <p className="mt-1">
                  <span className="font-display text-4xl font-extrabold text-text-primary">
                    {tier.minDeposit}
                  </span>
                  <span className="ml-1 text-sm text-text-secondary">min deposit</span>
                </p>
                <p className="mt-1 text-xs text-text-tertiary">
                  {tier.spread} spreads · {tier.leverage} leverage
                </p>

                <ul className="my-6 space-y-2.5 border-t border-border-subtle pt-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-primary" />
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={ROUTES.auth.register}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200',
                    tier.isPopular
                      ? 'bg-accent-primary text-text-inverse hover:bg-accent-primary-hover hover:shadow-glow-accent'
                      : 'border border-border-default text-text-primary hover:bg-bg-elevated'
                  )}
                >
                  Open {tier.name} Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full comparison table */}
      <section className="bg-bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-display text-2xl font-bold text-text-primary">
            Full Feature Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-elevated">
                  <th className="py-4 pl-6 pr-4 text-left font-medium text-text-secondary">Feature</th>
                  {ACCOUNT_TIERS.map((tier) => (
                    <th
                      key={tier.id}
                      className={cn(
                        'py-4 px-4 text-center font-semibold',
                        tier.id === 'vip'
                          ? 'text-accent-gold'
                          : tier.isPopular
                          ? 'text-accent-primary'
                          : 'text-text-primary'
                      )}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'border-b border-border-subtle last:border-0',
                      i % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-base'
                    )}
                  >
                    <td className="py-3.5 pl-6 pr-4 text-text-secondary">{row.label}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="py-3.5 px-4 text-center">
                        {typeof v === 'boolean' ? (
                          v ? (
                            <Check className="mx-auto h-4 w-4 text-accent-primary" />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-text-tertiary" />
                          )
                        ) : (
                          <span className="font-medium text-text-primary">{v}</span>
                        )}
                      </td>
                    ))}
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
