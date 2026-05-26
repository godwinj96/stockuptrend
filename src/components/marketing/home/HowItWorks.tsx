'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { UserPlus, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'
import { slideInLeftVariants, fadeUpVariants } from '@/lib/constants/motion'
import { ROUTES } from '@/lib/constants/routes'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Account',
    description: 'Register in under 2 minutes with your email. No credit card required to get started.',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Verify & Fund',
    description: 'Complete identity verification and deposit funds using card, bank transfer, or crypto.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Start Trading',
    description: 'Access 200+ instruments across global markets with professional tools and real-time data.',
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
            variants={slideInLeftVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mb-14 text-center"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              How It Works
            </p>
            <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Start Trading in 3 Steps
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="absolute left-0 right-0 top-1/4 hidden h-px bg-gradient-to-r from-transparent via-border-default to-transparent lg:block" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  custom={i}
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step number bubble */}
                  <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-bg-base shadow-card">
                    <span className="font-display text-2xl font-extrabold text-accent-primary">
                      {step.number}
                    </span>
                    {/* Arrow connector (desktop) */}
                    {i < STEPS.length - 1 && (
                      <ArrowRight className="absolute -right-10 top-1/2 hidden -translate-y-1/2 h-5 w-5 text-border-default lg:block" />
                    )}
                  </div>

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
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="mt-12 text-center"
          >
            <Link
              href={ROUTES.auth.register}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
            >
              Open Account Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
