import type { Metadata } from 'next'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Terms & Conditions | StockUptrend',
}

export default function TermsPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="#" className="hover:text-text-secondary">Legal</Link>
          <span>/</span>
          <span className="text-text-secondary">Terms & Conditions</span>
        </nav>
        <h1 className="mb-8 font-display text-4xl font-bold text-text-primary">Terms & Conditions</h1>
        <div className="prose prose-sm max-w-none text-text-secondary">
          <p className="text-text-tertiary">Last updated: May 2025</p>
          <h2 className="mt-8 font-display text-xl font-semibold text-text-primary">1. Agreement to Terms</h2>
          <p>By accessing StockUptrend and using our services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
          <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">2. Eligibility</h2>
          <p>You must be at least 18 years of age to open an account. You confirm that you are legally permitted to trade CFDs and similar financial instruments in your jurisdiction.</p>
          <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">3. Account Registration</h2>
          <p>You agree to provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
          <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">4. Risk Warning</h2>
          <p>Trading CFDs and other complex financial instruments involves a high level of risk and may not be suitable for all investors. You may lose all of your invested capital. Please ensure you fully understand the risks before trading.</p>
          <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">5. Deposit and Withdrawal</h2>
          <p>All deposits and withdrawals are subject to our payment policies and applicable limits. We reserve the right to request additional verification before processing large transactions.</p>
          <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">6. Prohibited Activities</h2>
          <p>You agree not to use our platform for money laundering, fraud, market manipulation, or any activity that violates applicable laws or regulations.</p>
          <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">7. Governing Law</h2>
          <p>These terms are governed by the laws of the applicable jurisdiction. Any disputes shall be resolved through binding arbitration.</p>
          <p className="mt-8">For questions, contact <a href="mailto:legal@stockuptrend.com" className="text-accent-primary hover:underline">legal@stockuptrend.com</a>.</p>
        </div>
      </div>
    </section>
  )
}
