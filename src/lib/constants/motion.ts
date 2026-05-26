export const MOTION = {
  duration: {
    micro: 0.15,
    fast: 0.2,
    standard: 0.3,
    entrance: 0.6,
    slow: 0.8,
  },
  ease: {
    out: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
    inOut: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  stagger: {
    fast: 0.05,
    standard: 0.1,
    slow: 0.15,
  },
} as const

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.duration.entrance,
      ease: MOTION.ease.out,
      delay: i * MOTION.stagger.standard,
    },
  }),
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION.duration.standard, ease: MOTION.ease.out },
  },
}

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION.duration.entrance, ease: MOTION.ease.out },
  },
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION.duration.standard,
      ease: MOTION.ease.out,
      delay: i * MOTION.stagger.fast,
    },
  }),
}

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.standard, ease: MOTION.ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: MOTION.duration.fast },
  },
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION.stagger.standard,
      delayChildren: 0.1,
    },
  },
}
