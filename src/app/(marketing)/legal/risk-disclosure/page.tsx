import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Risk Disclosure | StockUptrend',
}

export default function RiskDisclosurePage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-secondary">Risk Disclosure</span>
        </nav>
        <h1 className="mb-6 font-display text-4xl font-bold text-text-primary">Risk Disclosure</h1>

        <div className="mb-8 flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-sm leading-relaxed text-warning">
            CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. A significant percentage of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Leverage Risk</h2>
            <p>Trading on margin means you can control a large position with a relatively small capital outlay. While this amplifies potential profits, it equally amplifies potential losses. You can lose more than your initial deposit if the market moves against you beyond your margin.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Market Volatility</h2>
            <p>Financial markets can be highly volatile. Prices can move rapidly and dramatically, especially around economic news releases, geopolitical events, or low-liquidity periods such as market open/close and holidays.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Cryptocurrency Risk</h2>
            <p>Cryptocurrency markets are particularly volatile and subject to regulatory uncertainty. Crypto assets have no underlying fundamental value guarantee and can experience extreme price swings in short periods.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Technology Risk</h2>
            <p>Online trading depends on internet connectivity and electronic systems. Technical failures, connectivity issues, or platform outages could affect your ability to manage or close positions.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Suitability</h2>
            <p>You should only trade financial instruments you understand fully. If you are uncertain whether trading is appropriate for your circumstances, seek independent financial advice before proceeding.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
