import type { Metadata } from 'next'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Privacy Policy | StockUptrend',
}

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-secondary">Privacy Policy</span>
        </nav>
        <h1 className="mb-8 font-display text-4xl font-bold text-text-primary">Privacy Policy</h1>
        <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
          <p className="text-text-tertiary">Last updated: May 2025</p>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Data We Collect</h2>
            <p>We collect information you provide (name, email, address, ID documents), usage data (login times, page visits), and technical data (IP address, device type). This data is used solely to operate and improve our services.</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">How We Use Your Data</h2>
            <p>To verify your identity (KYC), process transactions, provide support, detect fraud, comply with legal obligations, and communicate service updates.</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Data Sharing</h2>
            <p>We do not sell your data. We share data with third parties only as required: payment processors (Stripe), identity verification providers, and as required by law.</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Data Retention</h2>
            <p>We retain account data for 7 years after account closure, as required by financial regulations. KYC documents are retained for the duration of the account and 5 years thereafter.</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Your Rights</h2>
            <p>You have the right to access, correct, or delete your data (subject to regulatory requirements). Contact <a href="mailto:privacy@stockuptrend.com" className="text-accent-primary hover:underline">privacy@stockuptrend.com</a> to exercise these rights.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
