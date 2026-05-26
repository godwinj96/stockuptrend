import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TicketThread } from '@/components/portal/support/TicketThread'
import { ROUTES } from '@/lib/constants/routes'
import type { SupportTicket, TicketMessage } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Support Ticket | StockUptrend',
}

export default async function TicketPage({ params }: { params: { ticketId: string } }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: rawTicket } = await supabase
    .from('support_tickets')
    .select('id, subject, category, status, created_at')
    .eq('id', params.ticketId)
    .eq('user_id', user!.id)
    .single()
  const ticket = rawTicket as Pick<SupportTicket, 'id' | 'subject' | 'category' | 'status' | 'created_at'> | null

  if (!ticket) notFound()

  const { data: rawMessages } = await supabase
    .from('ticket_messages')
    .select('id, sender_role, message, created_at')
    .eq('ticket_id', ticket.id)
    .order('created_at', { ascending: true })
  const messages = rawMessages as Pick<TicketMessage, 'id' | 'sender_role' | 'message' | 'created_at'>[] | null

  return (
    <div className="mx-auto max-w-3xl py-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-text-tertiary">
        <Link href={ROUTES.portal.support} className="hover:text-text-secondary">Support</Link>
        <span>/</span>
        <span className="text-text-secondary truncate max-w-xs">{ticket.subject}</span>
      </nav>

      <TicketThread
        ticket={ticket}
        messages={messages ?? []}
        userId={user!.id}
      />
    </div>
  )
}
