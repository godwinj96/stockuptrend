import type { Metadata } from 'next'
import Link from 'next/link'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { ROUTES } from '@/lib/constants/routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reset Password | StockUptrend',
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href={ROUTES.home} className="font-display text-xl font-bold text-text-primary">
            StockUptrend
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold text-text-primary">Reset Password</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-7 shadow-card">
          <ResetPasswordForm />
          <p className="mt-5 text-center text-sm text-text-secondary">
            Remembered it?{' '}
            <Link href={ROUTES.auth.login} className="font-medium text-accent-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
