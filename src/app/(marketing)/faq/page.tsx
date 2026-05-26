import type { Metadata } from 'next'
import Link from 'next/link'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'FAQ | StockUptrend',
  description:
    'Answers to common questions about accounts, deposits, withdrawals, KYC, trading conditions, and more.',
}

const FAQ_SECTIONS = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do I open an account?',
        a: 'Click "Open Account" on our homepage, fill in your details, and verify your email. You can fund your account and start trading in as little as one business day after completing KYC verification.',
      },
      {
        q: 'What documents are required for KYC?',
        a: 'You need a government-issued photo ID (passport, national ID, or driver\'s licence) and proof of address dated within the last 3 months (utility bill, bank statement). A selfie holding your ID is also required.',
      },
      {
        q: 'How long does KYC verification take?',
        a: 'Most accounts are verified within 1 business day. Complex cases may take up to 3 business days. You will receive email notifications at each stage.',
      },
      {
        q: 'Can I trade before completing KYC?',
        a: 'You can deposit up to $500 before KYC is approved. However, trading and withdrawals require full KYC approval. We recommend completing verification immediately after registration.',
      },
    ],
  },
  {
    category: 'Accounts & Trading',
    items: [
      {
        q: 'What account types are available?',
        a: 'We offer Standard ($100 minimum), Pro ($1,000 minimum), and VIP ($10,000 minimum) accounts. Each tier offers tighter spreads and higher leverage as you scale. See our Account Types page for a full comparison.',
      },
      {
        q: 'What leverage is available?',
        a: 'Leverage varies by account type and instrument. Standard accounts offer up to 1:200, Pro up to 1:400, and VIP up to 1:500. Leverage requirements differ for retail vs. professional clients in regulated regions.',
      },
      {
        q: 'What instruments can I trade?',
        a: 'Over 200 instruments including forex pairs, cryptocurrencies, global stocks and indices, and commodities. Our full instrument list is available on the Trading Instruments page.',
      },
      {
        q: 'What platform do you use?',
        a: 'We provide access to MetaTrader 5 (MT5) for desktop and mobile. Our web platform is also available directly in your browser with no download required.',
      },
    ],
  },
  {
    category: 'Deposits & Withdrawals',
    items: [
      {
        q: 'What deposit methods are accepted?',
        a: 'Credit and debit cards, bank wire transfers, and cryptocurrency (Bitcoin, USDT, Ethereum). Minimum deposit varies by method: $10 for card, $100 for bank transfer, $10 for crypto.',
      },
      {
        q: 'How long do deposits take?',
        a: 'Card deposits are instant. Bank transfers typically take 1–3 business days. Crypto deposits are processed after network confirmations (usually within 30 minutes for USDT TRC-20).',
      },
      {
        q: 'How do I withdraw funds?',
        a: 'Go to the Withdrawal section in your portal. Withdrawals are processed within 24 hours on business days. Funds are returned to the original payment method where possible.',
      },
      {
        q: 'Are there withdrawal fees?',
        a: 'StockUptrend does not charge withdrawal fees. Your bank or payment provider may charge their own fees. Crypto network fees apply for crypto withdrawals.',
      },
    ],
  },
  {
    category: 'Safety & Security',
    items: [
      {
        q: 'How are my funds protected?',
        a: 'Client funds are held in segregated accounts at tier-1 banks, separate from company operating funds. This means your funds cannot be used for any company purpose.',
      },
      {
        q: 'Is my personal data secure?',
        a: 'All data is encrypted in transit via SSL/TLS and at rest. We use industry-standard security practices including 2FA, SOC-2 aligned infrastructure, and regular penetration testing.',
      },
      {
        q: 'What is two-factor authentication (2FA)?',
        a: 'An additional security layer requiring a time-based code from an authenticator app on top of your password. We strongly recommend enabling 2FA in your account settings.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">FAQ</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Support
            </p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Everything you need to know about trading with StockUptrend.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.category}>
                <h2 className="mb-6 font-display text-xl font-semibold text-text-primary border-b border-border-subtle pb-3">
                  {section.category}
                </h2>
                <div className="space-y-5">
                  {section.items.map((item) => (
                    <div key={item.q} className="rounded-xl border border-border-subtle bg-bg-surface p-6">
                      <h3 className="font-semibold text-text-primary">{item.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-xl border border-border-subtle bg-bg-surface p-8 text-center">
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Still have questions?
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Our support team is available 24/5 to help you.
            </p>
            <Link
              href={ROUTES.contact}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
