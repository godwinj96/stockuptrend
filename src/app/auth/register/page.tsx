import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ROUTES } from '@/lib/constants/routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Open Account',
  description: 'Create your free StockUptrend trading account.',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href={ROUTES.home} className="inline-flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-text-primary">
              Stock<span className="text-accent-primary">Uptrend</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8 shadow-elevated">
          <h1 className="mb-1 font-display text-2xl font-bold text-text-primary">
            Start trading today
          </h1>
          <p className="mb-6 text-sm text-text-secondary">
            Create your free account in minutes. No credit card required.
          </p>

          <RegisterForm />

          <div className="mt-6 flex items-center gap-1 text-sm text-text-secondary">
            <span>Already have an account?</span>
            <Link
              href={ROUTES.auth.login}
              className="font-medium text-accent-primary transition-colors hover:text-accent-primary-hover"
            >
              Sign In
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          By creating an account, you agree to our{' '}
          <Link href={ROUTES.legal.terms} className="underline hover:text-text-secondary">
            Terms of Service
          </Link>{' '}
          and acknowledge our{' '}
          <Link href={ROUTES.legal.riskDisclosure} className="underline hover:text-text-secondary">
            Risk Disclosure
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
