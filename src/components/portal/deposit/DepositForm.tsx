'use client'

import { useState } from 'react'
import { CreditCard, Building2, Bitcoin } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { CardDepositForm } from './CardDepositForm'
import { BankTransferInstructions } from './BankTransferInstructions'
import { CryptoDepositInfo } from './CryptoDepositInfo'
import { PAYMENT_LIMITS } from '@/lib/constants/payments'

interface DepositFormProps {
  accountId: string
  accountNumber: string
  currency: string
  userId: string
  depositSettings: Record<string, string>
}

type PaymentMethod = 'card' | 'bank' | 'crypto'

const METHODS: Array<{ id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }> = [
  { id: 'card', label: 'Card', icon: CreditCard, detail: 'Instant · $10–$10,000' },
  // { id: 'bank', label: 'Bank Transfer', icon: Building2, detail: '1–3 days · $100–$100,000' },
  { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin, detail: '~30 min · $10–$50,000' },
]

export function DepositForm({ accountId, accountNumber, currency, userId, depositSettings }: DepositFormProps) {
  const [method, setMethod] = useState<PaymentMethod>('card')

  const bankDetails = {
    bankName:    depositSettings.bank_name          ?? '',
    accountName: depositSettings.bank_account_name  ?? '',
    sortCode:    depositSettings.bank_sort_code      ?? '',
    iban:        depositSettings.bank_iban           ?? '',
    swiftBic:    depositSettings.bank_swift          ?? '',
  }

  const walletAddresses = {
    BTC:  depositSettings.crypto_btc_address  ?? '',
    ETH:  depositSettings.crypto_eth_address  ?? '',
    BNB:  depositSettings.crypto_bnb_address  ?? '',
    USDT: depositSettings.crypto_usdt_address ?? '',
  } as Record<'BTC' | 'ETH' | 'BNB' | 'USDT', string>

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
      {/* Method tabs with sliding indicator */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={cn(
              'relative flex flex-col items-center rounded-xl border p-3 text-center transition-colors duration-200',
              method === m.id
                ? 'border-accent-primary'
                : 'border-border-subtle hover:border-border-default'
            )}
          >
            {method === m.id && (
              <motion.span
                layoutId="deposit-tab-bg"
                className="absolute inset-0 rounded-xl bg-accent-primary-muted"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <m.icon
              className={cn('relative mb-1 h-5 w-5', method === m.id ? 'text-accent-primary' : 'text-text-tertiary')}
            />
            <span
              className={cn(
                'relative text-sm font-medium',
                method === m.id ? 'text-accent-primary' : 'text-text-secondary'
              )}
            >
              {m.label}
            </span>
            <span className="relative mt-0.5 text-xs text-text-tertiary">{m.detail}</span>
          </button>
        ))}
      </div>

      {method === 'card' && (
        <CardDepositForm
          accountId={accountId}
          currency={currency}
          userId={userId}
          limits={PAYMENT_LIMITS.deposit.card}
        />
      )}
      {method === 'bank' && (
        <BankTransferInstructions
          accountNumber={accountNumber}
          currency={currency}
          limits={PAYMENT_LIMITS.deposit.bank_transfer}
          bankDetails={bankDetails}
        />
      )}
      {method === 'crypto' && (
        <CryptoDepositInfo
          userId={userId}
          accountId={accountId}
          limits={PAYMENT_LIMITS.deposit.crypto_coinbase}
          walletAddresses={walletAddresses}
        />
      )}
    </div>
  )
}
