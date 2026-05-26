import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'There was an error loading this content.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10">
        <AlertCircle className="h-6 w-6 text-danger" />
      </div>
      <h3 className="font-display text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-text-secondary">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-elevated"
        >
          Try again
        </button>
      )}
    </div>
  )
}
