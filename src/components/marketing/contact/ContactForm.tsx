'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject is required'),
  category: z.enum(['general', 'account', 'deposit', 'technical', 'compliance']),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactFormData = z.infer<typeof schema>

const CATEGORIES = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'account', label: 'Account & KYC' },
  { value: 'deposit', label: 'Deposits & Withdrawals' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'compliance', label: 'Compliance' },
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'general' },
  })

  async function onSubmit(data: ContactFormData) {
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    reset()
    toast.success('Message sent! We will get back to you shortly.')
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-accent-primary/20 bg-accent-primary-muted p-8 text-center">
        <p className="text-lg font-semibold text-text-primary">Message Received</p>
        <p className="mt-2 text-sm text-text-secondary">
          We&apos;ll respond within 4 business hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-accent-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Full Name
          </label>
          <input
            {...register('name')}
            placeholder="Your name"
            className="input-field"
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="input-field"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Category</label>
        <select {...register('category')} className="input-field">
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Subject</label>
        <input
          {...register('subject')}
          placeholder="Brief summary of your issue"
          className="input-field"
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Please describe your issue or question in detail..."
          className="input-field resize-none"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-primary py-3 text-sm font-semibold text-text-inverse transition-all duration-200 hover:bg-accent-primary-hover hover:shadow-glow-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
