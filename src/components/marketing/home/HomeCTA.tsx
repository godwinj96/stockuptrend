'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
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
        {/* Curtain reveal wrapper */}
        <motion.div
          ref={ref}
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={isInView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease: [0, 0, 0.2, 1] }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary-muted px-4 py-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-accent-primary" />
            <span className="text-xs font-semibold text-accent-primary">Join 50,000+ Investors</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.32, ease: [0, 0, 0.2, 1] }}
            className="font-display text-4xl font-bold text-text-primary sm:text-5xl"
          >
            Let the AI{' '}
            <span className="gradient-text">Work for You</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease: [0, 0, 0.2, 1] }}
            className="mx-auto mt-4 max-w-xl text-lg text-text-secondary"
          >
            Create your account, deposit, and choose a strategy. The AI starts trading immediately —
            no charts to read, no timing the market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.48, ease: [0, 0, 0.2, 1] }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href={ROUTES.auth.register}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-3.5 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-border-default px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:border-border-strong hover:bg-bg-elevated"
            >
              Learn How It Works
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.56 }}
            className="mt-5 text-xs text-text-tertiary"
          >
            No trading experience needed · KYC required · Capital at risk
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
