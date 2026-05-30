'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { ACCOUNT_TIERS } from '@/lib/constants/account-types'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import { WordRevealHeading } from '@/components/shared/WordRevealHeading'
import { useTilt } from '@/hooks/useTilt'

function TiltAccountCard({ tier, i, isInView }: {
  tier: typeof ACCOUNT_TIERS[number]
  i: number
  isInView: boolean
}) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(6)

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 32, scale: 0.93 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        'relative rounded-xl border bg-bg-surface p-6 transition-shadow duration-200 hover:shadow-elevated',
        tier.isPopular
          ? 'border-accent-primary shadow-glow-accent'
          : tier.id === 'vip'
          ? 'border-accent-gold/30'
          : 'border-border-subtle'
      )}
    >
      {tier.isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-primary px-3 py-0.5 text-xs font-semibold text-text-inverse">
          Most Popular
        </span>
      )}

      <div className="mb-4">
        <h3 className={cn(
          'font-display text-xl font-bold',
          tier.id === 'vip' ? 'text-accent-gold' : tier.isPopular ? 'text-accent-primary' : 'text-text-primary'
        )}>
          {tier.name}
        </h3>
        <p className="mt-1">
          <span className="ml-1 text-sm text-text-secondary">From</span>
          <span className="font-display text-3xl font-bold text-text-primary">{tier.minDeposit}</span>
        </p>
      </div>

      <div className="mb-5 space-y-2 border-t border-border-subtle pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Spreads</span>
          <span className="font-medium text-text-primary">{tier.spread}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Leverage</span>
          <span className="font-medium text-text-primary">{tier.leverage}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Commission</span>
          <span className="font-medium text-text-primary">{tier.commission}</span>
        </div>
      </div>

      <ul className="mb-6 space-y-2">
        {tier.features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-primary" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ROUTES.auth.register}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200',
          tier.isPopular
            ? 'bg-accent-primary text-text-inverse hover:bg-accent-primary-hover hover:shadow-glow-accent'
            : 'border border-border-default text-text-primary hover:bg-bg-elevated'
        )}
      >
        Activate This Strategy
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}

export function AccountTypesTease() {
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
            className="mb-12"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Accounts
            </p>
            <WordRevealHeading
              text="Choose Your AI Strategy"
              className="font-display text-3xl font-bold text-text-primary sm:text-4xl"
            />
            <p className="mt-3 max-w-lg text-text-secondary">
              Three risk profiles. Each managed by the same proven AI. Pick the one that matches your goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {ACCOUNT_TIERS.map((tier, i) => (
              <TiltAccountCard key={tier.id} tier={tier} i={i} isInView={isInView} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Link
              href={ROUTES.accountTypes}
              className="text-sm font-medium text-accent-primary transition-colors hover:text-accent-primary-hover"
            >
              Compare all account features →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
