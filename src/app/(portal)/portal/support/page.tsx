import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { NewTicketForm } from '@/components/portal/support/NewTicketForm'
import { TicketList } from '@/components/portal/support/TicketList'

export const metadata: Metadata = {
  title: 'Support | StockUptrend',
}

export default async function SupportPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, subject, category, status, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Support</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Submit a ticket and our team will respond within 4 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-text-primary">
            New Ticket
          </h2>
          <NewTicketForm userId={user!.id} />
        </div>

        <div className="lg:col-span-3">
          <h2 className="mb-4 font-display text-base font-semibold text-text-primary">
            Your Tickets
          </h2>
          <TicketList tickets={tickets ?? []} />
        </div>
      </div>
    </div>
  )
}
