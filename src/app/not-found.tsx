import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base px-4 text-center">
      <p className="font-mono text-sm font-medium tracking-widest text-accent-primary">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-text-primary">Page not found</h1>
      <p className="mt-3 max-w-sm text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href={ROUTES.home}
        className="mt-8 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-all duration-200 hover:scale-[1.02] hover:bg-accent-primary-hover active:scale-[0.98]"
      >
        Back to home
      </Link>
    </div>
  )
}
