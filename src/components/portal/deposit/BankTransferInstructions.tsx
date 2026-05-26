import { CopyButton } from '@/components/shared/CopyButton'

interface Props {
  accountNumber: string
  currency?: string
  limits: { min: number; max: number }
}

const BANK_DETAILS = {
  bankName: 'Barclays Bank PLC',
  accountName: 'StockUptrend Ltd Client Funds',
  sortCode: '20-00-00',
  iban: 'GB29NWBK60161331926819',
  swiftBic: 'BARCGB22',
}

export function BankTransferInstructions({ accountNumber, limits }: Props) {
  const rows = [
    { label: 'Bank Name', value: BANK_DETAILS.bankName },
    { label: 'Account Name', value: BANK_DETAILS.accountName },
    { label: 'Sort Code', value: BANK_DETAILS.sortCode },
    { label: 'IBAN', value: BANK_DETAILS.iban },
    { label: 'SWIFT/BIC', value: BANK_DETAILS.swiftBic },
    { label: 'Reference (required)', value: accountNumber, important: true },
  ]

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning">
        Always include your account number as the payment reference. Transfers without a reference
        may be delayed.
      </div>

      <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-text-secondary">{row.label}</span>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-sm font-medium ${row.important ? 'text-accent-primary' : 'text-text-primary'}`}
              >
                {row.value}
              </span>
              <CopyButton text={row.value} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-tertiary">
        Minimum: ${limits.min} · Maximum: ${limits.max.toLocaleString()} · Processing: 1–3 business days
      </p>
    </div>
  )
}
