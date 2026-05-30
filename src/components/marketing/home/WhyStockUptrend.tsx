'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bot, Clock, BarChart3, SlidersHorizontal } from 'lucide-react'
import { WordRevealHeading } from '@/components/shared/WordRevealHeading'

const WHY_ITEMS = [
  {
    icon: Bot,
    title: 'AI Execution',
    description: 'Our AI enters and exits positions across 200+ instruments, optimising every trade for maximum risk-adjusted returns.',
  },
  {
    icon: Clock,
    title: 'Always On',
    description: 'Markets move at all hours. Your AI does too — monitoring positions and executing trades 24 hours a day, 5 days a week.',
  },
  {
    icon: BarChart3,
    title: 'Full Transparency',
    description: 'Every trade your AI places is visible in your portfolio in real time. You see every entry, every exit, every result.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Choose Your Strategy',
    description: 'Conservative, Balanced, or Aggressive — pick the risk profile that fits your goals. The AI handles the rest.',
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
              text="Institutional-Grade AI. Zero Effort."
              className="font-display text-3xl font-bold text-text-primary sm:text-4xl"
            />
            <p className="mx-auto mt-3 max-w-lg text-text-secondary">
              Everything that used to require years of experience — automated, optimised, and working for you.
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
