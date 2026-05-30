import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'

interface DepositItem {
  id: string
  amount: number
  currency: string | null
  created_at: string | null
  user: { full_name: string | null; email: string | null } | null
}

interface KycItem {
  id: string
  full_name: string | null
  email: string | null
  created_at: string | null
  doc_count: number
}

interface TicketItem {
  id: string
  subject: string
  category: string
  created_at: string | null
  user: { full_name: string | null; email: string | null } | null
}

interface PendingQueueProps {
  deposits: DepositItem[]
  kycSubmissions: KycItem[]
  tickets: TicketItem[]
}

function QueueSection({
  title, viewAllHref, count, children,
}: { title: string; viewAllHref: string; count: number; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-semibold text-text-primary">{title}</h3>
          {count > 0 && (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
              {count}
            </span>
          )}
        </div>
        <Link href={viewAllHref} className="flex items-center gap-1 text-xs text-accent-primary hover:underline underline-offset-2">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border-subtle">
        {children}
      </div>
    </div>
  )
}

export function PendingQueue({ deposits, kycSubmissions, tickets }: PendingQueueProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Pending Deposits */}
      <QueueSection title="Pending Deposits" viewAllHref={`${ROUTES.admin.deposits}?status=pending_review`} count={deposits.length}>
        {deposits.length === 0 ? (
          <p className="px-5 py-6 text-center text-xs text-text-tertiary">No pending deposits</p>
        ) : deposits.map((d) => (
          <Link key={d.id} href={ROUTES.admin.deposits} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-bg-elevated">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text-primary">
                {d.user?.full_name ?? d.user?.email ?? 'Unknown'}
              </p>
              <p className={cn('text-sm font-semibold tabular-nums text-accent-primary')}>
                {formatCurrency(d.amount)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="flex items-center gap-1 text-[10px] text-text-tertiary">
                <Clock className="h-2.5 w-2.5" />
                {d.created_at ? formatRelativeTime(d.created_at) : '—'}
              </p>
            </div>
          </Link>
        ))}
      </QueueSection>

      {/* Pending KYC */}
      <QueueSection title="KYC Review Queue" viewAllHref={ROUTES.admin.kyc} count={kycSubmissions.length}>
        {kycSubmissions.length === 0 ? (
          <p className="px-5 py-6 text-center text-xs text-text-tertiary">No pending KYC submissions</p>
        ) : kycSubmissions.map((k) => (
          <Link key={k.id} href={ROUTES.admin.kycReview(k.id)} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-bg-elevated">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text-primary">{k.full_name ?? 'Unknown'}</p>
              <p className="text-[11px] text-text-tertiary">{k.doc_count} document{k.doc_count !== 1 ? 's' : ''} submitted</p>
            </div>
            <p className="flex shrink-0 items-center gap-1 text-[10px] text-text-tertiary">
              <Clock className="h-2.5 w-2.5" />
              {k.created_at ? formatRelativeTime(k.created_at) : '—'}
            </p>
          </Link>
        ))}
      </QueueSection>

      {/* Open Tickets */}
      <QueueSection title="Open Support Tickets" viewAllHref={ROUTES.admin.support} count={tickets.length}>
        {tickets.length === 0 ? (
          <p className="px-5 py-6 text-center text-xs text-text-tertiary">No open tickets</p>
        ) : tickets.map((t) => (
          <Link key={t.id} href={ROUTES.admin.ticket(t.id)} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-bg-elevated">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text-primary">{t.subject}</p>
              <p className="text-[11px] text-text-tertiary">{t.user?.full_name ?? 'Unknown'}</p>
            </div>
            <p className="flex shrink-0 items-center gap-1 text-[10px] text-text-tertiary">
              <Clock className="h-2.5 w-2.5" />
              {t.created_at ? formatRelativeTime(t.created_at) : '—'}
            </p>
          </Link>
        ))}
      </QueueSection>
    </div>
  )
}
