import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface RiskWarningBannerProps {
  variant?: 'banner' | 'inline' | 'footer'
  className?: string
}

const RISK_TEXT =
  'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 74% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'

export function RiskWarningBanner({ variant = 'banner', className }: RiskWarningBannerProps) {
  if (variant === 'footer') {
    return (
      <div className={cn('border-t border-border-subtle px-6 py-4', className)}>
        <p className="mx-auto max-w-4xl text-xs leading-relaxed text-text-tertiary">{RISK_TEXT}</p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <p className={cn('text-xs leading-relaxed text-text-tertiary', className)}>{RISK_TEXT}</p>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border border-warning/20 bg-warning-muted px-4 py-3',
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-xs leading-relaxed text-text-secondary">{RISK_TEXT}</p>
    </div>
  )
}
