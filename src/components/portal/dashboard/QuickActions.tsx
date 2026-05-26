import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldCheck,
  MessageSquare,
  LineChart,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import type { KycStatus } from '@/lib/supabase/types'

interface QuickActionsProps {
  kycStatus: KycStatus
}

export function QuickActions({ kycStatus }: QuickActionsProps) {
  const isKycApproved = kycStatus === 'approved'

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-card">
      <h2 className="mb-4 font-display text-base font-semibold text-text-primary">Quick Actions</h2>

      <div className="space-y-2.5">
        <ActionLink href={ROUTES.portal.deposit} icon={ArrowDownToLine} label="Deposit Funds" primary />

        <ActionLink
          href={ROUTES.portal.withdrawal}
          icon={ArrowUpFromLine}
          label="Withdraw Funds"
          disabled={!isKycApproved}
          disabledReason={!isKycApproved ? 'Verify identity to withdraw' : undefined}
        />

        <ActionLink href={ROUTES.portal.tradeHistory} icon={LineChart} label="Trade History" />

        {kycStatus !== 'approved' && (
          <ActionLink
            href={ROUTES.portal.kyc}
            icon={ShieldCheck}
            label="Verify Identity"
            highlight
          />
        )}

        <ActionLink href={ROUTES.portal.support} icon={MessageSquare} label="Contact Support" />
      </div>
    </div>
  )
}

function ActionLink({
  href,
  icon: Icon,
  label,
  primary = false,
  highlight = false,
  disabled = false,
  disabledReason,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  primary?: boolean
  highlight?: boolean
  disabled?: boolean
  disabledReason?: string
}) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
        primary && 'bg-accent-primary text-text-inverse hover:bg-accent-primary-hover',
        highlight &&
          !primary &&
          'border border-accent-primary/30 bg-accent-primary-muted text-accent-primary hover:bg-accent-primary-muted',
        !primary && !highlight && 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
      {disabled && disabledReason && (
        <span className="ml-auto text-xs text-text-tertiary">{disabledReason}</span>
      )}
    </div>
  )

  if (disabled) return <div aria-disabled="true">{content}</div>

  return <Link href={href}>{content}</Link>
}
