'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatDateTime } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'

interface KYCSubmission {
  id: string
  full_name: string | null
  email: string | null
  country: string | null
  kyc_status: string | null
  created_at: string | null
  doc_count: number
}

interface KYCTableProps {
  submissions: KYCSubmission[]
  total: number
  currentPage: number
  pageSize: number
}

const STATUS_STYLES: Record<string, string> = {
  pending:      'bg-warning/10 text-warning',
  under_review: 'bg-accent-secondary-muted text-accent-secondary',
  approved:     'bg-accent-primary-muted text-accent-primary',
  rejected:     'bg-danger-muted text-danger',
  not_started:  'bg-bg-elevated text-text-tertiary',
}

const STATUS_LABELS: Record<string, string> = {
  pending:      'Pending',
  under_review: 'Under Review',
  approved:     'Approved',
  rejected:     'Rejected',
  not_started:  'Not Started',
}

export function KYCTable({ submissions, total, currentPage, pageSize }: KYCTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-elevated">
              {['User', 'Country', 'Documents', 'Submitted', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-text-tertiary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {submissions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-text-tertiary">No submissions found</td></tr>
            ) : submissions.map((s) => (
              <tr key={s.id} className="bg-bg-surface transition-colors hover:bg-bg-elevated">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-text-primary">{s.full_name ?? '—'}</p>
                  <p className="text-xs text-text-tertiary">{s.email ?? '—'}</p>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{s.country ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <FileText className="h-3.5 w-3.5" />
                    {s.doc_count} file{s.doc_count !== 1 ? 's' : ''}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-tertiary">
                  {s.created_at ? formatDateTime(s.created_at) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_STYLES[s.kyc_status ?? ''] ?? 'bg-bg-elevated text-text-tertiary')}>
                    {STATUS_LABELS[s.kyc_status ?? ''] ?? s.kyc_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={ROUTES.admin.kycReview(s.id)}
                    className="flex items-center gap-1 text-xs font-medium text-accent-primary hover:underline underline-offset-2"
                  >
                    Review <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-text-tertiary">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-40">
              Previous
            </button>
            <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === totalPages}
              className="rounded-lg border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:bg-bg-elevated disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
