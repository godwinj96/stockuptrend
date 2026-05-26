import type { Metadata } from 'next'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'AML & KYC Policy | StockUptrend',
}

export default function AMLKYCPage() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-secondary">AML & KYC Policy</span>
        </nav>
        <h1 className="mb-8 font-display text-4xl font-bold text-text-primary">AML & KYC Policy</h1>
        <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
          <p className="text-text-tertiary">Last updated: May 2025</p>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Our Commitment</h2>
            <p>StockUptrend is committed to preventing money laundering, terrorist financing, and financial crime. We comply with applicable Anti-Money Laundering (AML) regulations and apply a robust Know Your Customer (KYC) programme.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">KYC Requirements</h2>
            <p>All clients must complete identity verification before accessing trading and full withdrawal services. This includes:</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>• Government-issued photo identification (passport, national ID, or driving licence)</li>
              <li>• Proof of address dated within 3 months (utility bill or bank statement)</li>
              <li>• Selfie holding the ID document</li>
              <li>• Enhanced due diligence (EDD) for high-value accounts or unusual activity</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Transaction Monitoring</h2>
            <p>We monitor all transactions for suspicious activity. Unusual transaction patterns, large deposits, or activity inconsistent with stated purpose may trigger additional verification requests or account holds.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Reporting</h2>
            <p>We are obligated by law to report suspicious activity to relevant financial intelligence authorities. We co-operate fully with law enforcement and regulatory investigations.</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xl font-semibold text-text-primary">Contact</h2>
            <p>For AML/compliance enquiries: <a href="mailto:compliance@stockuptrend.com" className="text-accent-primary hover:underline">compliance@stockuptrend.com</a></p>
          </div>
        </div>
      </div>
    </section>
  )
}
