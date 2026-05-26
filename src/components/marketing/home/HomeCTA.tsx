'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { fadeUpVariants, slideInLeftVariants } from '@/lib/constants/motion'
import { ROUTES } from '@/lib/constants/routes'

export function HomeCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative overflow-hidden py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-bg-base to-bg-base" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,hsl(var(--accent-primary)/0.08),transparent)]" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div ref={ref}>
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary-muted px-4 py-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-accent-primary" />
            <span className="text-xs font-semibold text-accent-primary">Join 50,000+ Active Traders</span>
          </motion.div>

          <motion.h2
            variants={slideInLeftVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="font-display text-4xl font-bold text-text-primary sm:text-5xl"
          >
            Ready to Start{' '}
            <span className="gradient-text">Trading?</span>
          </motion.h2>

          <motion.p
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mx-auto mt-4 max-w-xl text-lg text-text-secondary"
          >
            Open your account in minutes. Access 200+ instruments with professional tools,
            tight spreads, and a platform built for serious traders.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href={ROUTES.auth.register}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-3.5 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
            >
              Open Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.instruments}
              className="inline-flex items-center gap-2 rounded-lg border border-border-default px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-border-strong hover:bg-bg-elevated"
            >
              Explore Instruments
            </Link>
          </motion.div>

          <motion.p
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mt-5 text-xs text-text-tertiary"
          >
            No credit card required · KYC required to trade · CFDs carry risk of loss
          </motion.p>
        </div>
      </div>
    </section>
  )
}
