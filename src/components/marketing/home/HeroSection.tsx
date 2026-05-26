'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { AnimatedPriceCards } from './AnimatedPriceCards'

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-bg-base pt-16">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary opacity-[0.06] blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-secondary opacity-[0.06] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
        {/* Left: text content — CSS animations, no JS dependency */}
        <div className="max-w-xl">
          <div className="anim-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-accent-primary-muted px-3.5 py-1.5" style={{ animationDelay: '0ms' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-primary" />
            <span className="text-xs font-medium text-accent-primary">200+ instruments available</span>
          </div>

          <h1
            className="anim-fade-up font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-text-primary sm:text-6xl lg:text-[4rem]"
            style={{ animationDelay: '80ms' }}
          >
            Trade the World&apos;s{' '}
            <span className="gradient-text">Markets.</span>
            {' '}Smarter.
          </h1>

          <p
            className="anim-fade-up mt-6 text-lg leading-relaxed text-text-secondary"
            style={{ animationDelay: '160ms' }}
          >
            Access forex, crypto, stocks and commodities with tight spreads, powerful execution,
            and tools designed for serious traders.
          </p>

          <div
            className="anim-fade-up mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href={ROUTES.auth.register}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 text-base font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover hover:shadow-glow-accent active:scale-[0.98]"
            >
              Open Account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={ROUTES.instruments}
              className="inline-flex items-center gap-2 rounded-lg border border-border-default px-6 py-3 text-base font-semibold text-text-primary transition-all duration-200 hover:border-border-strong hover:bg-bg-elevated"
            >
              Explore Instruments
              <ChevronRight className="h-4 w-4 text-text-secondary" />
            </Link>
          </div>

          <p
            className="anim-fade-up mt-5 text-xs text-text-tertiary"
            style={{ animationDelay: '300ms' }}
          >
            74% of retail CFD accounts lose money. Trading carries significant risk.
          </p>

          <div
            className="anim-fade-up mt-10 flex flex-wrap gap-8 border-t border-border-subtle pt-8"
            style={{ animationDelay: '360ms' }}
          >
            {[
              { value: '50K+', label: 'Active Traders' },
              { value: '120+', label: 'Countries' },
              { value: '200+', label: 'Instruments' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated price cards — client-only, JS fine here */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block"
        >
          <AnimatedPriceCards />
        </motion.div>
      </div>
    </section>
  )
}
