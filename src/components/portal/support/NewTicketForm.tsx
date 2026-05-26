'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  category: z.enum(['general', 'account', 'deposit', 'technical', 'compliance']),
  message: z.string().min(20, 'Please provide more detail (minimum 20 characters)'),
})

type FormData = z.infer<typeof schema>

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'account', label: 'Account & KYC' },
  { value: 'deposit', label: 'Deposits & Withdrawals' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'compliance', label: 'Compliance' },
]

export function NewTicketForm({ userId }: { userId: string }) {
  const supabase = createBrowserClient()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'general' },
  })

  async function onSubmit(data: FormData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: ticket, error } = await db
      .from('support_tickets')
      .insert({ user_id: userId, subject: data.subject, category: data.category, status: 'open' })
      .select('id')
      .single() as { data: { id: string } | null; error: unknown }

    if (error || !ticket) {
      toast.error('Failed to create ticket. Please try again.')
      return
    }

    await db.from('ticket_messages').insert({
      ticket_id: ticket.id,
      sender_role: 'user',
      message: data.message,
    })

    toast.success('Ticket created. We\'ll respond within 4 business hours.')
    reset()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-border-subtle bg-bg-surface p-5 space-y-4" noValidate>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Category</label>
        <select {...register('category')} className="input-field text-sm">
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Subject</label>
        <input {...register('subject')} placeholder="Brief summary" className="input-field text-sm" />
        {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Describe your issue in detail..."
          className="input-field resize-none text-sm"
        />
        {errors.message && <p className="mt-1 text-xs text-danger">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-primary py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting…' : 'Submit Ticket'}
      </button>
    </form>
  )
}
