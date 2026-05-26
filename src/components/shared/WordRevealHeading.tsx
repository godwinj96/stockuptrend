'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface WordRevealHeadingProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  once?: boolean
}

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1],
      delay: i * 0.04,
    },
  }),
}

export function WordRevealHeading({
  text,
  className,
  as: Tag = 'h2',
  once = true,
}: WordRevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once, amount: 0.5 })

  const words = text.split(' ')

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={cn('overflow-hidden', className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          custom={i}
          variants={wordVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
