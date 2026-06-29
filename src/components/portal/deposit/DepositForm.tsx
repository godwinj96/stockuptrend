'use client'

import { useState } from 'react'
import { CreditCard, Bitcoin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { CardDepositForm } from './CardDepositForm'
import { BankTransferInstructions } from './BankTransferInstructions'
import { CryptoDepositInfo } from './CryptoDepositInfo'
import { SymbolPreferenceStep } from './SymbolPreferenceStep'
import { PAYMENT_LIMITS } from '@/lib/constants/payments'

interface DepositFormProps {
  accountId: string
  accountNumber: string
  currency: string
  userId: string
  depositSettings: Record<string, string>
  initialPreferredSymbols?: string[]
}

type PaymentMethod = 'card' | 'bank' | 'crypto'
type Step = 'preferences' | 'payment'

const METHODS: Array<{ id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }> = [
  { id: 'card', label: 'Card', icon: CreditCard, detail: 'Instant · $10–$10,000' },
  // { id: 'bank', label: 'Bank Transfer', icon: Building2, detail: '1–3 days · $100–$100,000' },
  { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin, detail: '~30 min · $10–$50,000' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -32 : 32,
    opacity: 0,
  }),
}

export function DepositForm({
  accountId,
  accountNumber,
  currency,
  userId,
  depositSettings,
  initialPreferredSymbols = [],
}: DepositFormProps) {
  const [step, setStep] = useState<Step>('preferences')
  const [slideDirection, setSlideDirection] = useState(1)
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

  function goToPayment() {
    setSlideDirection(1)
    setStep('payment')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6">
      {/* Step indicator */}
      <div className="mb-5 flex items-center gap-2">
        <div className={cn(
          'h-1.5 flex-1 rounded-full transition-colors duration-300',
          step === 'preferences' ? 'bg-accent-primary' : 'bg-accent-primary',
        )} />
        <div className={cn(
          'h-1.5 flex-1 rounded-full transition-colors duration-300',
          step === 'payment' ? 'bg-accent-primary' : 'bg-border-subtle',
        )} />
      </div>

      <AnimatePresence mode="wait" custom={slideDirection}>
        {step === 'preferences' ? (
          <motion.div
            key="preferences"
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <SymbolPreferenceStep
              initialSelected={initialPreferredSymbols}
              onContinue={goToPayment}
              onSkip={goToPayment}
            />
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Method tabs */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
