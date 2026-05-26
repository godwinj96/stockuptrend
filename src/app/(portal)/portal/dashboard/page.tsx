import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getServerUser, getProfile } from '@/lib/supabase/queries'
import { KYCStatusBanner } from '@/components/portal/layout/KYCStatusBanner'
import { BalanceWidget } from '@/components/portal/dashboard/BalanceWidget'
import { RecentTransactions } from '@/components/portal/dashboard/RecentTransactions'
import { QuickActions } from '@/components/portal/dashboard/QuickActions'
import { ROUTES } from '@/lib/constants/routes'
import type { Account, Transaction } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const user = await getServerUser()
  if (!user) redirect(ROUTES.auth.login)

  const supabase = createServerClient()

  // getProfile is cached — layout's SidebarUserInfo already called it,
  // so this hits the per-request cache instead of making a second DB call.
  const [profile, accountsResult, txResult] = await Promise.all([
    getProfile(user.id),
    supabase.from('accounts').select('*').eq('user_id', user.id).eq('is_active', true),
    supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  const accounts = accountsResult.data as Account[] | null
  const recentTransactions = txResult.data as Transaction[] | null
  const primaryAccount = accounts?.[0] ?? null

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {profile && (
        <KYCStatusBanner
          status={profile.kyc_status ?? 'not_started'}
          rejectionReason={null}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <BalanceWidget
            balance={primaryAccount?.balance ?? 0}
            currency={primaryAccount?.currency ?? 'USD'}
            accountNumber={primaryAccount?.account_number ?? '—'}
            accountType={primaryAccount?.account_type ?? 'standard'}
          />
          <RecentTransactions initialTransactions={recentTransactions ?? []} userId={user.id} />
        </div>

        <div className="space-y-6">
          <QuickActions kycStatus={profile?.kyc_status ?? 'not_started'} />
        </div>
      </div>
    </div>
  )
}
