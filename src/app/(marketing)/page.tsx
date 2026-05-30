import type { Metadata } from 'next'
import { HeroSection } from '@/components/marketing/home/HeroSection'
import { TrustBadgeBar } from '@/components/marketing/home/TrustBadgeBar'
import { InstrumentsOverview } from '@/components/marketing/home/InstrumentsOverview'
import { WhyStockUptrend } from '@/components/marketing/home/WhyStockUptrend'
import { AccountTypesTease } from '@/components/marketing/home/AccountTypesTease'
import { HowItWorks } from '@/components/marketing/home/HowItWorks'
import { TestimonialsSection } from '@/components/marketing/home/TestimonialsSection'
import { HomeCTA } from '@/components/marketing/home/HomeCTA'
import { TradingViewTicker } from '@/components/charts/TradingViewTicker'

export const metadata: Metadata = {
  title: 'StockUptrend — AI-Powered Investing | Automated Portfolio Growth',
  description:
    'Deposit, choose a strategy, and let our AI trade for you. Automated portfolio management across global markets — no experience required.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TradingViewTicker />
      <TrustBadgeBar />
      <InstrumentsOverview />
      <WhyStockUptrend />
      <AccountTypesTease />
      <HowItWorks />
      <TestimonialsSection />
      <HomeCTA />
    </>
  )
}
