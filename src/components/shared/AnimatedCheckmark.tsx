'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface AnimatedCheckmarkProps {
  size?: number
  className?: string
  onComplete?: () => void
}

export function AnimatedCheckmark({ size = 56, className, onComplete }: AnimatedCheckmarkProps) {
  const [scope, animate] = useAnimate()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function run() {
      await animate(
        scope.current,
        { scale: [0, 1.1, 1], opacity: [0, 1] },
        { duration: 0.4, ease: [0, 0, 0.2, 1] }
      )
      await animate(
        '#check-path',
        { pathLength: [0, 1], opacity: [0, 1] },
        { duration: 0.35, ease: 'easeOut' }
      )
      onComplete?.()
    }

    run()
  }, [animate, scope, onComplete])

  return (
    <motion.div
      ref={scope}
      className={cn('inline-flex items-center justify-center', className)}
      style={{ opacity: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle */}
        <circle cx="28" cy="28" r="26" fill="var(--accent-primary-muted)" stroke="var(--accent-primary)" strokeWidth="1.5" />
        {/* Checkmark */}
        <motion.path
          id="check-path"
          d="M17 28.5L24 35.5L39 20"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
        />
      </svg>
    </motion.div>
  )
}
