'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { AnimatedCheckmark } from '@/components/shared/AnimatedCheckmark'
import { KYCStepPersonal } from './KYCStepPersonal'
import { KYCStepDocuments } from './KYCStepDocuments'
import { KYCStepSelfie } from './KYCStepSelfie'

interface KYCWizardProps {
  kycStatus: string
  userId: string
  prefillName: string
  prefillCountry: string
}

const STEPS = [
  { number: 1, label: 'Personal Details' },
  { number: 2, label: 'ID Documents' },
  { number: 3, label: 'Selfie' },
]

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle2,
    title: 'Verification Approved',
    body: 'Your identity has been verified. You have full access to trading and withdrawals.',
    className: 'border-accent-primary/30 bg-accent-primary-muted text-accent-primary',
  },
  under_review: {
    icon: Clock,
    title: 'Under Review',
    body: 'Your documents have been submitted and are being reviewed. This typically takes 1 business day.',
    className: 'border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary',
  },
  rejected: {
    icon: XCircle,
    title: 'Verification Rejected',
    body: 'Your submission was rejected. Please re-submit with clear, valid documents.',
    className: 'border-danger/30 bg-danger/10 text-danger',
  },
  pending: {
    icon: AlertCircle,
    title: 'Pending Submission',
    body: 'Please complete all steps below to submit your verification.',
    className: 'border-warning/30 bg-warning/10 text-warning',
  },
  not_started: null,
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
}

export function KYCWizard({ kycStatus, userId, prefillName, prefillCountry }: KYCWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [direction, setDirection] = useState(1)
  const [showCelebration, setShowCelebration] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const statusKey = kycStatus as keyof typeof STATUS_CONFIG
  const statusConfig = STATUS_CONFIG[statusKey]

  if ((statusConfig && kycStatus !== 'not_started' && kycStatus !== 'rejected') || submitted) {
    const config = submitted ? STATUS_CONFIG.under_review : statusConfig!
    const StatusIcon = config.icon
    return (
      <AnimatePresence mode="wait">
        {showCelebration ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <AnimatedCheckmark
              size={72}
              onComplete={() => setTimeout(() => setShowCelebration(false), 600)}
            />
            <p className="mt-4 text-sm text-text-secondary">Submitting your documents…</p>
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
            className={cn('rounded-2xl border p-8 text-center', config.className)}
          >
            <StatusIcon className="mx-auto mb-3 h-12 w-12" />
            <h2 className="font-display text-xl font-bold">{config.title}</h2>
            <p className="mt-2 text-sm opacity-80">{config.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  function handleStepComplete(step: number) {
    setCompletedSteps((prev) => new Set([...prev, step]))
    if (step < 3) {
      setDirection(1)
      setCurrentStep(step + 1)
    } else {
      // Step 3 done — show celebration then status card
      setShowCelebration(true)
      setSubmitted(true)
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={
                  completedSteps.has(step.number)
                    ? { scale: [1, 1.15, 1] }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  completedSteps.has(step.number)
                    ? 'border-accent-primary bg-accent-primary text-text-inverse'
                    : currentStep === step.number
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-border-default text-text-tertiary'
                )}
              >
                {completedSteps.has(step.number) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </motion.div>
              <span
                className={cn(
                  'mt-1 text-xs',
                  currentStep === step.number ? 'text-text-primary' : 'text-text-tertiary'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                animate={{
                  backgroundColor: completedSteps.has(step.number)
                    ? 'var(--accent-primary)'
                    : 'var(--border-subtle)',
                }}
                transition={{ duration: 0.4 }}
                className="mb-4 h-px flex-1"
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content with slide transitions */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {currentStep === 1 && (
              <KYCStepPersonal
                userId={userId}
                prefillName={prefillName}
                prefillCountry={prefillCountry}
                onComplete={() => handleStepComplete(1)}
              />
            )}
            {currentStep === 2 && (
              <KYCStepDocuments userId={userId} onComplete={() => handleStepComplete(2)} />
            )}
            {currentStep === 3 && (
              <KYCStepSelfie userId={userId} onComplete={() => handleStepComplete(3)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
