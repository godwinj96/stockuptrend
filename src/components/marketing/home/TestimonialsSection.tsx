'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'
import { WordRevealHeading } from '@/components/shared/WordRevealHeading'

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    country: 'United Kingdom',
    initials: 'MT',
    rating: 5,
    quote:
      'Switched from my previous broker 6 months ago. The execution speed and tight spreads on EUR/USD are genuinely impressive. Deposits clear instantly — no complaints.',
    accountType: 'Pro',
    // enters from left
    enterFrom: { x: -60, y: 0 },
  },
  {
    name: 'Adeola F.',
    country: 'Nigeria',
    initials: 'AF',
    rating: 5,
    quote:
      'The onboarding was painless. KYC cleared in one business day, and I was trading by the next morning. Support actually answers within minutes.',
    accountType: 'Standard',
    // enters from below
    enterFrom: { x: 0, y: 48 },
  },
  {
    name: 'Chen Wei',
    country: 'Singapore',
    initials: 'CW',
    rating: 5,
    quote:
      'I trade crypto and forex. Having both in one platform with competitive leverage and a clean interface saves me from juggling multiple accounts.',
    accountType: 'VIP',
    // enters from right
    enterFrom: { x: 60, y: 0 },
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            className="mb-12 text-center"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Traders Say
            </p>
            <WordRevealHeading
              text="Trusted by Traders Worldwide"
              className="font-display text-3xl font-bold text-text-primary sm:text-4xl"
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: t.enterFrom.x, y: t.enterFrom.y, scale: 0.95 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.65,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent-gold text-accent-gold" />
                  ))}
                </div>

                <blockquote className="mb-5 text-sm leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary-muted text-xs font-bold text-accent-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {t.country} · {t.accountType}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
