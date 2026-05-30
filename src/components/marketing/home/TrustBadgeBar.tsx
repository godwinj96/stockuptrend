'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Lock, Users, Headphones, Zap, Vault } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Shield, label: 'Regulated & Compliant' },
  { icon: Lock, label: '256-bit Encryption' },
  { icon: Users, label: '50,000+ Investors' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Zap, label: 'Deposits Accepted Daily' },
  { icon: Vault, label: 'Segregated Client Funds' },
]

export function TrustBadgeBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="border-y border-border-subtle bg-bg-surface py-5">
      <div
        ref={ref}
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8"
      >
        {TRUST_ITEMS.map((item, i) => {
          const fromLeft = i % 2 === 0
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: fromLeft ? -32 : 32, scale: 0.92 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0, 0, 0.2, 1] }}
              className="flex items-center gap-2.5 text-text-secondary"
            >
              <item.icon className="h-4 w-4 shrink-0 text-accent-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
