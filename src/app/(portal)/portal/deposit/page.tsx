import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { DepositForm } from '@/components/portal/deposit/DepositForm'
import type { Account } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Deposit Funds | StockUptrend',
}

export default async function DepositPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: rawAccount } = await supabase
    .from('accounts')
    .select('id, balance, currency, account_type, account_number')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .single()
  const account = rawAccount as Pick<Account, 'id' | 'balance' | 'currency' | 'account_type' | 'account_number'> | null

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-text-primary">Deposit Funds</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose your preferred payment method and amount.
        </p>
      </div>
      <DepositForm
        accountId={account?.id ?? ''}
        accountNumber={account?.account_number ?? ''}
        currency={account?.currency ?? 'USD'}
        userId={user!.id}
      />
    </div>
  )
}
