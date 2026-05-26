import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { ROUTES } from '@/lib/constants/routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Sign in to your StockUptrend account.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
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
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-text-secondary">
            Sign in to your StockUptrend account
          </p>

          <LoginForm />

          <div className="mt-6 flex items-center gap-1 text-sm text-text-secondary">
            <span>Don&apos;t have an account?</span>
            <Link
              href={ROUTES.auth.register}
              className="font-medium text-accent-primary transition-colors hover:text-accent-primary-hover"
            >
              Open Account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          By continuing, you agree to our{' '}
          <Link href={ROUTES.legal.terms} className="underline hover:text-text-secondary">
            Terms
          </Link>{' '}
          and{' '}
          <Link href={ROUTES.legal.privacy} className="underline hover:text-text-secondary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
