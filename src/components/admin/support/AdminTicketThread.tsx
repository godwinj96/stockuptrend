'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { formatDateTime } from '@/lib/utils/format'

interface Message {
  id: string
  message: string
  sender_role: string
  created_at: string | null
}

interface AdminTicketThreadProps {
  ticketId: string
  messages: Message[]
  currentStatus: string | null
}

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved'] as const

export function AdminTicketThread({ ticketId, messages, currentStatus }: AdminTicketThreadProps) {
  const router = useRouter()
  const [reply, setReply] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus ?? 'open')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendReply() {
    if (!reply.trim()) return
    startTransition(async () => {
      const res = await fetch(`/api/admin/support/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      })
      if (res.ok) {
        setReply('')
        toast.success('Reply sent')
        router.refresh()
      } else {
        toast.error('Failed to send reply')
      }
    })
  }

  function updateStatus(newStatus: string) {
    setStatus(newStatus)
    startTransition(async () => {
      await fetch(`/api/admin/support/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Status control */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-tertiary">Status:</span>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors',
              status === s
                ? s === 'resolved' ? 'bg-accent-primary-muted text-accent-primary'
                  : s === 'in_progress' ? 'bg-accent-secondary-muted text-accent-secondary'
                  : 'bg-warning/10 text-warning'
                : 'bg-bg-elevated text-text-tertiary hover:text-text-secondary'
            )}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Message thread */}
      <div className="max-h-[500px] overflow-y-auto rounded-xl border border-border-subtle bg-bg-surface p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-tertiary">No messages yet</p>
        ) : messages.map((msg) => {
          const isAgent = msg.sender_role === 'agent'
          return (
            <div key={msg.id} className={cn('flex', isAgent ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[75%] rounded-2xl px-4 py-3 text-sm',
                isAgent
                  ? 'rounded-tr-sm bg-accent-primary-muted text-accent-primary'
                  : 'rounded-tl-sm bg-bg-elevated text-text-primary'
              )}>
                <p className="leading-relaxed">{msg.message}</p>
                <p className={cn('mt-1 text-[10px]', isAgent ? 'text-accent-primary/60' : 'text-text-tertiary')}>
                  {isAgent ? 'Support Agent' : 'User'} · {msg.created_at ? formatDateTime(msg.created_at) : '—'}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      <div className="flex gap-3">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply() }}
          rows={3}
          placeholder="Type your reply… (Ctrl+Enter to send)"
          className="input-field flex-1 resize-none text-sm"
        />
        <button
          onClick={sendReply}
          disabled={isPending || !reply.trim()}
          className="flex items-center gap-2 self-end rounded-lg bg-accent-primary px-5 py-3 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-primary-hover disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </button>
      </div>
    </div>
  )
}
