export interface AccountTier {
  id: 'standard' | 'pro' | 'vip'
  name: string
  minDeposit: string
  minDepositAmount: number
  spread: string
  leverage: string
  commission: string
  features: string[]
  isPopular?: boolean
  accentColor: string
}

export const ACCOUNT_TIERS: AccountTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    minDeposit: '$100',
    minDepositAmount: 100,
    spread: 'From 1.2 pips',
    leverage: 'Up to 1:200',
    commission: 'No commission',
    features: [
      'Access to 200+ instruments',
      'MetaTrader 5 platform',
      'Real-time price alerts',
      'Educational resources',
      '24/5 customer support',
    ],
    accentColor: 'accent-secondary',
  },
  {
    id: 'pro',
    name: 'Pro',
    minDeposit: '$1,000',
    minDepositAmount: 1000,
    spread: 'From 0.6 pips',
    leverage: 'Up to 1:400',
    commission: '$3.50/lot',
    features: [
      'Everything in Standard',
      'Raw ECN spreads',
      'Priority execution',
      'VPS hosting (free)',
      'Dedicated account manager',
      '24/7 priority support',
    ],
    isPopular: true,
    accentColor: 'accent-primary',
  },
  {
    id: 'vip',
    name: 'VIP',
    minDeposit: '$10,000',
    minDepositAmount: 10000,
    spread: 'From 0.0 pips',
    leverage: 'Up to 1:500',
    commission: '$2.00/lot',
    features: [
      'Everything in Pro',
      'Ultra-low spreads',
      'Custom leverage',
      'Personal trading analyst',
      'Exclusive market insights',
      'Cashback on volume',
      '24/7 white-glove support',
    ],
    accentColor: 'accent-gold',
  },
]
