import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const [{ data: ticket }, { data: messages }] = await Promise.all([
    db.from('support_tickets').select('*').eq('id', params.id).single(),
    db.from('ticket_messages').select('*').eq('ticket_id', params.id).order('created_at', { ascending: true }),
  ])

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

  const { data: profile } = await db.from('profiles').select('id, full_name, email').eq('id', ticket.user_id).single()

  return NextResponse.json({ ticket, messages: messages ?? [], user: profile ?? null })
}
