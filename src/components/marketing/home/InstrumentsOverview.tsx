'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Zap, BarChart2, Layers, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import type { InstrumentCategory } from '@/lib/constants/instruments'
import { INSTRUMENT_CATEGORIES } from '@/lib/constants/instruments'
import { WordRevealHeading } from '@/components/shared/WordRevealHeading'
import { useTilt } from '@/hooks/useTilt'

const CATEGORY_ICONS: Record<InstrumentCategory, React.ComponentType<{ className?: string }>> = {
  forex: TrendingUp,
  crypto: Zap,
  stocks: BarChart2,
  commodities: Layers,
}

function TiltCard({ category, info, i, isInView }: {
  category: InstrumentCategory
  info: typeof INSTRUMENT_CATEGORIES[InstrumentCategory]
  i: number
  isInView: boolean
}) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(8)
  const Icon = CATEGORY_ICONS[category]

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={`${ROUTES.instruments}?category=${category}`}
        className="group flex flex-col rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-default hover:shadow-elevated"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-primary-muted">
          <Icon className="h-5 w-5 text-accent-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold text-text-primary">
          {info.label}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{info.description}</p>
        <p className="mt-3 text-xs font-semibold text-accent-primary">{info.count}</p>
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-text-tertiary transition-colors group-hover:text-accent-primary">
          Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  )
}

export function InstrumentsOverview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
              Markets
            </p>
            <WordRevealHeading
              text="Trade 200+ Instruments Across Every Market"
              className="font-display text-3xl font-bold text-text-primary sm:text-4xl"
            />
            <p className="mt-3 max-w-xl text-text-secondary">
              From major forex pairs to the latest cryptocurrencies, global stocks, and commodities
              — all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(INSTRUMENT_CATEGORIES) as [InstrumentCategory, typeof INSTRUMENT_CATEGORIES[InstrumentCategory]][]).map(
              ([category, info], i) => (
                <TiltCard key={category} category={category} info={info} i={i} isInView={isInView} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
