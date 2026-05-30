import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminTicketThread } from '@/components/admin/support/AdminTicketThread'
import { ROUTES } from '@/lib/constants/routes'
import { formatDateTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'Ticket | Admin', robots: { index: false, follow: false } }

const STATUS_STYLES: Record<string, string> = {
  open:        'bg-warning/10 text-warning',
  in_progress: 'bg-accent-secondary-muted text-accent-secondary',
  resolved:    'bg-accent-primary-muted text-accent-primary',
}

export default async function AdminTicketPage({ params }: { params: { ticketId: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: ticketRaw }, { data: messages }] = await Promise.all([
    db.from('support_tickets').select('*').eq('id', params.ticketId).single(),
    db.from('ticket_messages').select('*').eq('ticket_id', params.ticketId).order('created_at', { ascending: true }),
  ])

  if (!ticketRaw) notFound()
  const ticket = ticketRaw as { id: string; subject: string; category: string; status: string | null; created_at: string | null; user_id: string }

  const { data: profileRaw } = await db.from('profiles').select('id, full_name, email').eq('id', ticket.user_id).single()
  const profile = profileRaw as { full_name: string | null; email: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href={ROUTES.admin.support} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Support
      </Link>

      <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-text-primary">{ticket.subject}</h2>
            <p className="mt-1 text-xs text-text-tertiary">
              From: <span className="text-text-secondary">{profile?.full_name ?? profile?.email ?? 'Unknown'}</span>
              {' · '}Category: <span className="capitalize text-text-secondary">{ticket.category}</span>
              {' · '}Opened: {ticket.created_at ? formatDateTime(ticket.created_at) : '—'}
            </p>
          </div>
          <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STATUS_STYLES[ticket.status ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
            {(ticket.status ?? '').replace('_', ' ')}
          </span>
        </div>

        <AdminTicketThread
          ticketId={params.ticketId}
          messages={(messages ?? []) as Parameters<typeof AdminTicketThread>[0]['messages']}
          currentStatus={ticket.status}
        />
      </div>
    </div>
  )
}
