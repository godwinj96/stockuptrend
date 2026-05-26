import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import { RiskWarningBanner } from '@/components/shared/RiskWarningBanner'
import { ROUTES } from '@/lib/constants/routes'
import { ContactForm } from '@/components/marketing/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | StockUptrend',
  description:
    'Get in touch with the StockUptrend support team. We are available 24/5 via live chat, email, and ticket.',
}

const CHANNELS = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with a support agent in real time. Available during market hours.',
    detail: 'Mon–Fri · 24 hours',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'For account, compliance, and billing enquiries.',
    detail: 'support@stockuptrend.com',
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We aim to respond to all tickets within 4 business hours.',
    detail: 'Priority support for VIP accounts',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border-subtle bg-bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
            <Link href={ROUTES.home} className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Contact</span>
          </nav>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-primary">
              Support
            </p>
            <h1 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
              We&apos;re Here to Help
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Our team is available around the clock during market hours. Choose the channel that works best for you.
            </p>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {CHANNELS.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-border-subtle bg-bg-surface p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary-muted">
                  <c.icon className="h-5 w-5 text-accent-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">{c.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{c.description}</p>
                <p className="mt-3 text-xs font-medium text-accent-primary">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-bg-surface py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-display text-2xl font-bold text-text-primary">
            Send Us a Message
          </h2>
          <ContactForm />
        </div>
      </section>

      <RiskWarningBanner variant="footer" />
    </>
  )
}
