'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { formatDateTime } from '@/lib/utils/format'
import { createBrowserClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_role: string
  message: string
  created_at: string | null
}

interface Ticket {
  id: string
  subject: string
  category: string
  status: string | null
  created_at: string | null
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-accent-primary/10 text-accent-primary',
  in_progress: 'bg-accent-secondary/10 text-accent-secondary',
  resolved: 'bg-bg-elevated text-text-tertiary',
}

export function TicketThread({ ticket, messages, userId: _userId }: { ticket: Ticket; messages: Message[]; userId: string }) {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendReply() {
    if (!reply.trim() || sending) return
    if (ticket.status === 'resolved') {
      toast.error('This ticket is resolved. Open a new ticket if you need further help.')
      return
    }

    setSending(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { error } = await db.from('ticket_messages').insert({
      ticket_id: ticket.id,
      sender_role: 'user',
      message: reply.trim(),
    })
    setSending(false)

    if (error) {
      toast.error('Failed to send reply. Please try again.')
      return
    }

    setReply('')
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 rounded-xl border border-border-subtle bg-bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold text-text-primary">{ticket.subject}</h1>
            <p className="mt-1 text-xs text-text-tertiary">
              {ticket.category} · Opened {formatDateTime(ticket.created_at ?? '')}
            </p>
          </div>
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize', STATUS_COLORS[ticket.status ?? 'open'] ?? STATUS_COLORS['open'])}>
            {(ticket.status ?? 'open').replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="mb-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender_role === 'user'
          return (
            <div key={msg.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', isUser ? 'rounded-br-md bg-accent-primary text-text-inverse' : 'rounded-bl-md bg-bg-surface border border-border-subtle text-text-primary')}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                <p className={cn('mt-1.5 text-xs', isUser ? 'text-text-inverse/60' : 'text-text-tertiary')}>
                  {formatDateTime(msg.created_at ?? '')}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      {ticket.status !== 'resolved' ? (
        <div className="flex gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() }
            }}
            placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
            rows={3}
            className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <button
            onClick={sendReply}
            disabled={!reply.trim() || sending}
            className="self-end flex h-9 w-9 items-center justify-center rounded-lg bg-accent-primary text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-40"
            aria-label="Send reply"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-bg-elevated p-4 text-center text-sm text-text-tertiary">
          This ticket has been resolved. Open a new ticket if you need further assistance.
        </div>
      )}
    </div>
  )
}
