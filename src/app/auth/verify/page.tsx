import type { Metadata } from 'next'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Verify Email',
  robots: { index: false, follow: false },
  description: 'Check your email to verify your StockUptrend account.',
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-primary-muted">
          <MailCheck className="h-8 w-8 text-accent-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Check your email</h1>
        <p className="mt-3 text-text-secondary">
          We&apos;ve sent a verification link to your email address. Click the link to activate your
          account and start trading.
        </p>
        <p className="mt-6 text-sm text-text-tertiary">
          Didn&apos;t receive an email? Check your spam folder or{' '}
          <Link
            href={ROUTES.auth.register}
            className="text-accent-primary hover:text-accent-primary-hover"
          >
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
