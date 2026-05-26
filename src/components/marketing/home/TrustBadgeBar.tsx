'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Lock, Users, Headphones, Zap, Vault } from 'lucide-react'
import { containerVariants, fadeUpVariants } from '@/lib/constants/motion'

const TRUST_ITEMS = [
  { icon: Shield, label: 'Regulated Broker' },
  { icon: Lock, label: 'SSL Secured' },
  { icon: Users, label: '50,000+ Traders' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Zap, label: 'Instant Deposits' },
  { icon: Vault, label: 'Segregated Funds' },
]

export function TrustBadgeBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="border-y border-border-subtle bg-bg-surface py-5">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8"
      >
        {TRUST_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            variants={fadeUpVariants}
            className="flex items-center gap-2.5 text-text-secondary"
          >
            <item.icon className="h-4 w-4 shrink-0 text-accent-primary" />
            <span className="text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
