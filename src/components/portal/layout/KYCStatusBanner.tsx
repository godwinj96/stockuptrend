'use client'

import Link from 'next/link'
import { ShieldAlert, Clock, ShieldX, X } from 'lucide-react'
import { useState } from 'react'
import type { KycStatus } from '@/lib/supabase/types'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

interface KYCStatusBannerProps {
  status: KycStatus
  rejectionReason?: string | null
}

const BANNER_CONFIG: Record<
  Exclude<KycStatus, 'approved'>,
  {
    icon: React.ComponentType<{ className?: string }>
    title: string
    body: string
    ctaLabel?: string
    ctaHref?: string
    variant: 'warning' | 'info' | 'danger'
  }
> = {
  not_started: {
    icon: ShieldAlert,
    title: 'Complete Identity Verification',
    body: 'Verify your identity to unlock full trading features and higher deposit limits.',
    ctaLabel: 'Start Verification',
    ctaHref: ROUTES.portal.kyc,
    variant: 'warning',
  },
  pending: {
    icon: Clock,
    title: 'Documents Submitted',
    body: 'Your documents have been uploaded and are awaiting review. This usually takes 1–2 business days.',
    variant: 'info',
  },
  under_review: {
    icon: Clock,
    title: 'Verification In Progress',
    body: "Our compliance team is reviewing your documents. You'll be notified once the review is complete.",
    variant: 'info',
  },
  rejected: {
    icon: ShieldX,
    title: 'Verification Rejected',
    body: 'Your documents could not be verified. Please resubmit with the corrections noted below.',
    ctaLabel: 'Resubmit Documents',
    ctaHref: ROUTES.portal.kyc,
    variant: 'danger',
  },
}

export function KYCStatusBanner({ status, rejectionReason }: KYCStatusBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (status === 'approved' || dismissed) return null

  const config = BANNER_CONFIG[status]
  const Icon = config.icon

  const variantClasses = {
    warning: 'bg-warning-muted border-warning/20',
    info: 'bg-accent-secondary-muted border-accent-secondary/20',
    danger: 'bg-danger/10 border-danger/20',
  }

  const iconClasses = {
    warning: 'text-warning',
    info: 'text-accent-secondary',
    danger: 'text-danger',
  }

  return (
    <div
      className={cn(
        'mb-6 flex items-start gap-3 rounded-xl border px-4 py-3.5',
        variantClasses[config.variant]
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconClasses[config.variant])} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-text-primary">{config.title}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{config.body}</p>
        {status === 'rejected' && rejectionReason && (
          <p className="mt-1.5 text-xs text-text-secondary">
            <span className="font-medium text-danger">Reason:</span> {rejectionReason}
          </p>
        )}
        {config.ctaHref && (
          <Link
            href={config.ctaHref}
            className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-primary-hover"
          >
            {config.ctaLabel}
          </Link>
        )}
      </div>
      {status !== 'not_started' && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded p-1 text-text-tertiary transition-colors hover:text-text-secondary"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
