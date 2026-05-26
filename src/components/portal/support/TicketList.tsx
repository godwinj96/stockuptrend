import Link from 'next/link'
import { MessageSquare, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatRelativeTime } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'

interface Ticket {
  id: string
  subject: string
  category: string
  status: string
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-accent-primary/10 text-accent-primary' },
  in_progress: { label: 'In Progress', className: 'bg-accent-secondary/10 text-accent-secondary' },
  resolved: { label: 'Resolved', className: 'bg-bg-elevated text-text-tertiary' },
}

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-surface py-12 text-center">
        <MessageSquare className="mb-3 h-8 w-8 text-text-tertiary" />
        <p className="text-sm text-text-secondary">No support tickets yet</p>
        <p className="mt-1 text-xs text-text-tertiary">Submit a ticket to get help</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-bg-surface overflow-hidden">
      {tickets.map((ticket) => {
        const status = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open
        return (
          <Link
            key={ticket.id}
            href={ROUTES.portal.ticket(ticket.id)}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-bg-elevated"
          >
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{ticket.subject}</p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                {ticket.category} · {formatRelativeTime(ticket.created_at)}
              </p>
            </div>
            <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', status?.className)}>
              {status?.label}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary" />
          </Link>
        )
      })}
    </div>
  )
}
