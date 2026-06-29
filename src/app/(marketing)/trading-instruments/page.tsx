import type { Metadata } from 'next'
import Link from 'next/link'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'
import { INSTRUMENTS, INSTRUMENT_CATEGORIES } from '@/lib/constants/instruments'
import type { InstrumentCategory } from '@/lib/constants/instruments'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = {
  title: 'Trading Instruments | StockUptrend',
  description: 'Browse 200+ tradeable instruments — forex pairs, cryptocurrencies, global stocks, and commodities.',
}

const CATEGORY_COLORS: Record<InstrumentCategory, string> = {
  forex: 'bg-accent-primary/10 text-accent-primary',
  crypto: 'bg-accent-secondary/10 text-accent-secondary',
  stocks: 'bg-accent-gold/10 text-accent-gold',
  commodities: 'bg-warning/10 text-warning',
  indices: 'bg-text-secondary/10 text-text-secondary',
}

export default function TradingInstrumentsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const activeCategory = (searchParams.category as InstrumentCategory | undefined) ?? null
  const filtered = activeCategory
    ? INSTRUMENTS.filter((i) => i.category === activeCategory)
    : INSTRUMENTS

  return (
    <>
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Instruments</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">Markets</p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              200+ Instruments
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Forex, cryptocurrencies, global stocks, and commodities — all in one platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href={ROUTES.instruments}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                !activeCategory
                  ? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
                  : 'border-border-subtle text-text-secondary hover:border-border-default'
              )}
            >
              All
            </Link>
            {(Object.entries(INSTRUMENT_CATEGORIES) as [InstrumentCategory, typeof INSTRUMENT_CATEGORIES[InstrumentCategory]][]).map(
              ([cat, info]) => (
                <Link
                  key={cat}
                  href={`${ROUTES.instruments}?category=${cat}`}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    activeCategory === cat
                      ? 'border-accent-primary bg-accent-primary-muted text-accent-primary'
                      : 'border-border-subtle text-text-secondary hover:border-border-default'
                  )}
                >
                  {info.label}
                </Link>
              )
            )}
          </div>

          {/* Instruments grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((instrument) => (
              <div
                key={instrument.symbol}
                className="rounded-xl border border-border-subtle bg-bg-surface p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-text-primary">{instrument.symbol}</h3>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', CATEGORY_COLORS[instrument.category])}>
                    {instrument.category}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary">{instrument.name}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-text-tertiary">Leverage</span>
                  <span className="font-medium text-text-primary">{instrument.leverage}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-text-tertiary">
            Showing {filtered.length} instruments.{' '}
            <Link href={ROUTES.auth.register} className="text-accent-primary hover:underline">
              Open an account
            </Link>{' '}
            to access the full list.
          </p>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
