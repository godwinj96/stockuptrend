import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { DocumentViewer } from '@/components/admin/kyc/DocumentViewer'
import { KYCReviewActions } from '@/components/admin/kyc/KYCReviewActions'
import { ROUTES } from '@/lib/constants/routes'
import { formatDateTime } from '@/lib/utils/format'

export const metadata: Metadata = { title: 'KYC Review | Admin', robots: { index: false, follow: false } }

const KYC_STATUS_STYLES: Record<string, string> = {
  pending:      'bg-warning/10 text-warning',
  under_review: 'bg-accent-secondary-muted text-accent-secondary',
  approved:     'bg-accent-primary-muted text-accent-primary',
  rejected:     'bg-danger-muted text-danger',
  not_started:  'bg-bg-elevated text-text-tertiary',
}

export default async function KYCReviewPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.auth.login)

  const service = createServiceRoleClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = service as any
  const [{ data: profile }, { data: documents }] = await Promise.all([
    db.from('profiles').select('*').eq('id', params.id).single(),
    db.from('kyc_documents').select('*').eq('user_id', params.id).order('created_at', { ascending: true }),
  ])

  if (!profile) notFound()

  const documents_ = documents ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.admin.kyc} className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to KYC Queue
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: user profile summary */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-text-primary">Applicant</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${KYC_STATUS_STYLES[(profile as Record<string,unknown>).kyc_status as string ?? ''] ?? 'bg-bg-elevated text-text-tertiary'}`}>
                {((profile as Record<string,unknown>).kyc_status as string | null)?.replace('_', ' ') ?? 'unknown'}
              </span>
            </div>
            <dl className="space-y-3">
              {[
                { label: 'Full Name',  value: (profile as Record<string,unknown>).full_name as string | null },
                { label: 'Email',      value: (profile as Record<string,unknown>).email as string | null },
                { label: 'Phone',      value: (profile as Record<string,unknown>).phone as string | null },
                { label: 'Country',    value: (profile as Record<string,unknown>).country as string | null },
                { label: 'Registered', value: (profile as Record<string,unknown>).created_at ? formatDateTime((profile as Record<string,unknown>).created_at as string) : null },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-text-tertiary">{label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-text-primary">{value ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          <KYCReviewActions userId={params.id} currentStatus={(profile as Record<string,unknown>).kyc_status as string | null} />
        </div>

        {/* Right: documents */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border-subtle bg-bg-surface p-5 shadow-card">
            <h2 className="mb-4 font-display text-sm font-semibold text-text-primary">
              Submitted Documents ({documents_.length})
            </h2>
            <DocumentViewer userId={params.id} documents={documents_ as Parameters<typeof DocumentViewer>[0]['documents']} />
          </div>
        </div>
      </div>
    </div>
  )
}
