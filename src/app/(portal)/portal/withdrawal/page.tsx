import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { WithdrawalForm } from '@/components/portal/withdrawal/WithdrawalForm'
import { KYCStatusBanner } from '@/components/portal/layout/KYCStatusBanner'
import type { Profile, Account } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Withdraw Funds | StockUptrend',
}

export default async function WithdrawalPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [profileResult, accountResult] = await Promise.all([
    supabase.from('profiles').select('kyc_status, full_name').eq('id', user!.id).single(),
    supabase.from('accounts').select('id, balance, currency').eq('user_id', user!.id).eq('is_active', true).single(),
  ])
  const profile = profileResult.data as Pick<Profile, 'kyc_status' | 'full_name'> | null
  const account = accountResult.data as Pick<Account, 'id' | 'balance' | 'currency'> | null

  const kycApproved = profile?.kyc_status === 'approved'

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Withdraw Funds</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Withdrawals are processed within 1 business day.
        </p>
      </div>

      {!kycApproved && (
        <div className="mb-6">
          <KYCStatusBanner status={profile?.kyc_status ?? 'not_started'} rejectionReason={null} />
        </div>
      )}

      {kycApproved ? (
        <WithdrawalForm
          accountId={account?.id ?? ''}
          balance={account?.balance ?? 0}
          currency={account?.currency ?? 'USD'}
          userId={user!.id}
        />
      ) : (
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">
            Identity verification (KYC) must be approved before you can withdraw funds.
          </p>
        </div>
      )}
    </div>
  )
}
