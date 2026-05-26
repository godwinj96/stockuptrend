export const PAYMENT_LIMITS = {
  deposit: {
    card: { min: 10, max: 10_000, currency: 'USD' },
    bank_transfer: { min: 100, max: 100_000, currency: 'USD' },
    crypto_moonpay: { min: 10, max: 50_000, currency: 'USD' },
    crypto_coinbase: { min: 10, max: 50_000, currency: 'USD' },
    preKycMax: 500,
  },
  withdrawal: {
    bank_wire: { min: 50, max: 50_000, currency: 'USD' },
    crypto: { min: 20, max: 50_000, currency: 'USD' },
  },
} as const

export type DepositMethod = 'card' | 'bank_transfer' | 'crypto_moonpay' | 'crypto_coinbase'
export type WithdrawalMethod = 'bank_wire' | 'crypto'

export const DEPOSIT_METHODS = [
  {
    id: 'card' as const,
    label: 'Credit / Debit Card',
    description: 'Instant deposit via Visa or Mastercard',
    minAmount: PAYMENT_LIMITS.deposit.card.min,
    maxAmount: PAYMENT_LIMITS.deposit.card.max,
    processingTime: 'Instant',
    icon: 'CreditCard',
  },
  {
    id: 'bank_transfer' as const,
    label: 'Bank Transfer',
    description: 'Wire transfer from your bank account',
    minAmount: PAYMENT_LIMITS.deposit.bank_transfer.min,
    maxAmount: PAYMENT_LIMITS.deposit.bank_transfer.max,
    processingTime: '1–3 business days',
    icon: 'Building2',
  },
  {
    id: 'crypto_moonpay' as const,
    label: 'Crypto (Buy)',
    description: 'Buy crypto with your card via MoonPay',
    minAmount: PAYMENT_LIMITS.deposit.crypto_moonpay.min,
    maxAmount: PAYMENT_LIMITS.deposit.crypto_moonpay.max,
    processingTime: 'Under 30 minutes',
    icon: 'Coins',
  },
  {
    id: 'crypto_coinbase' as const,
    label: 'Crypto (Wallet)',
    description: 'Send from your existing crypto wallet',
    minAmount: PAYMENT_LIMITS.deposit.crypto_coinbase.min,
    maxAmount: PAYMENT_LIMITS.deposit.crypto_coinbase.max,
    processingTime: 'Under 30 minutes',
    icon: 'Wallet',
  },
]

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]
