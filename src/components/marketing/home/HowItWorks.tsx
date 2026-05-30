'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { UserPlus, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { WordRevealHeading } from '@/components/shared/WordRevealHeading'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Register in under two minutes. No trading knowledge required.',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Deposit Funds',
    description: 'Complete a quick identity check and deposit. Funds are accepted by card, bank transfer, or crypto.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'AI Takes Over',
    description: 'Our AI immediately begins placing trades on your behalf — tracking markets, managing risk, and compounding your returns 24 hours a day.',
  },
]

export function HowItWorks() {
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
              How It Works
            </p>
            <WordRevealHeading
              text="Three Steps to Automated Returns"
              className="font-display text-3xl font-bold text-text-primary sm:text-4xl"
            />
          </motion.div>

          <div className="relative">
            {/* SVG connecting line (desktop only) */}
            <svg
              className="pointer-events-none absolute inset-0 hidden w-full lg:block"
              style={{ height: '64px', top: '32px' }}
              preserveAspectRatio="none"
              viewBox="0 0 1000 1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.line
                x1="180" y1="0.5" x2="820" y2="0.5"
                stroke="var(--accent-primary)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeOpacity="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
              />
            </svg>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 32 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step number bubble with scale-bounce entrance */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 18,
                      delay: 0.25 + i * 0.15,
                    }}
                    className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-bg-base shadow-card"
                  >
                    <span className="font-display text-2xl font-extrabold text-accent-primary">
                      {step.number}
                    </span>
                  </motion.div>

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary-muted">
                    <step.icon className="h-5 w-5 text-accent-primary" />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7, ease: [0, 0, 0.2, 1] }}
            className="mt-12 text-center"
          >
            <Link
              href={ROUTES.auth.register}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
            >
              Start Earning Today
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
