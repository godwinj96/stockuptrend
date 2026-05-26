'use client'

import { useState } from 'react'
import { CreditCard, Building2, Bitcoin } from 'lucide-react'
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
}

type PaymentMethod = 'card' | 'bank' | 'crypto'

const METHODS: Array<{ id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }> = [
  { id: 'card', label: 'Card', icon: CreditCard, detail: 'Instant · $10–$10,000' },
  { id: 'bank', label: 'Bank Transfer', icon: Building2, detail: '1–3 days · $100–$100,000' },
  { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin, detail: '~30 min · $10–$50,000' },
]

export function DepositForm({ accountId, accountNumber, currency, userId }: DepositFormProps) {
  const [method, setMethod] = useState<PaymentMethod>('card')

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
      {/* Method tabs */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={cn(
              'flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-200',
              method === m.id
                ? 'border-accent-primary bg-accent-primary-muted'
                : 'border-border-subtle hover:border-border-default hover:bg-bg-elevated'
            )}
          >
            <m.icon
              className={cn('mb-1 h-5 w-5', method === m.id ? 'text-accent-primary' : 'text-text-tertiary')}
            />
            <span
              className={cn(
                'text-sm font-medium',
                method === m.id ? 'text-accent-primary' : 'text-text-secondary'
              )}
            >
              {m.label}
            </span>
            <span className="mt-0.5 text-xs text-text-tertiary">{m.detail}</span>
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
        />
      )}
      {method === 'crypto' && (
        <CryptoDepositInfo
          userId={userId}
          accountId={accountId}
          limits={PAYMENT_LIMITS.deposit.crypto_coinbase}
        />
      )}
    </div>
  )
}
