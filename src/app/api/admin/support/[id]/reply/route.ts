import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({ message: z.string().min(1).max(2000) })

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await requireAdmin()
  if (error) return NextResponse.json({ error }, { status })

  const body: unknown = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any

  const { data: ticketRaw } = await db.from('support_tickets').select('id, user_id').eq('id', params.id).single()
  const ticket = ticketRaw as { id: string; user_id: string } | null
  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

  await Promise.all([
    db.from('ticket_messages').insert({ ticket_id: params.id, message: parsed.data.message, sender_role: 'agent' }),
    db.from('support_tickets').update({ status: 'in_progress' }).eq('id', params.id),
  ])

  await db.from('notifications').insert({
    user_id: ticket.user_id, type: 'support_reply', is_read: false,
    title: 'Support Reply', body: 'Your support ticket has received a new reply from our team.',
  })

  return NextResponse.json({ success: true })
}
