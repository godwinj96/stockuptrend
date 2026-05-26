'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Gauge, ShieldCheck, Globe2, BarChart3 } from 'lucide-react'
import { WordRevealHeading } from '@/components/shared/WordRevealHeading'

const WHY_ITEMS = [
  {
    icon: Gauge,
    title: 'Tight Spreads',
    description: 'Trade EUR/USD from 0.0 pips on Pro accounts. Institutional-grade pricing for retail traders.',
  },
  {
    icon: BarChart3,
    title: 'Powerful Execution',
    description: 'Market execution with no requotes. Ultra-low latency connects you to deep liquidity.',
  },
  {
    icon: ShieldCheck,
    title: 'Funds Protected',
    description: 'Client funds held in segregated accounts at tier-1 banks. SSL encryption and 2FA on every account.',
  },
  {
    icon: Globe2,
    title: 'Trade Anywhere',
    description: 'Full-featured MetaTrader 5 on desktop, web browser, and iOS/Android. Your charts, always with you.',
  },
]

export function WhyStockUptrend() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="bg-bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="mb-14 text-center"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Why Us
            </p>
            <WordRevealHeading
              text="Built for Traders, Not Beginners"
              className="font-display text-3xl font-bold text-text-primary sm:text-4xl"
            />
            <p className="mx-auto mt-3 max-w-lg text-text-secondary">
              Every feature, every decision — engineered to give you an edge in the market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={isInView ? { clipPath: 'inset(0 0 0% 0)', opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl border border-border-subtle bg-bg-base p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary-muted">
                  <item.icon className="h-5 w-5 text-accent-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
