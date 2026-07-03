import { History } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/format'

interface AuditLogEntry {
  id: string
  action: string
  details: Record<string, unknown> | null
  created_at: string
  admin: { full_name: string | null; email: string | null } | null
}

const ACTION_LABELS: Record<string, string> = {
  user_activated: 'Reactivated user',
  user_deactivated: 'Suspended user',
  user_deleted: 'Deleted user',
  user_restored: 'Restored user',
  role_changed: 'Changed role',
  account_tier_changed: 'Changed account tier',
  account_activated: 'Made trading account visible',
  account_deactivated: 'Hid trading account',
  ai_trading_enabled: 'Enabled AI trading',
  ai_trading_disabled: 'Disabled AI trading',
}

export function AuditLogList({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface shadow-card">
      <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-4">
        <History className="h-4 w-4 text-text-tertiary" />
        <h2 className="font-display text-sm font-semibold text-text-primary">Admin Activity</h2>
      </div>
      {entries.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-text-tertiary">No admin actions recorded for this user yet</p>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start justify-between gap-3 px-5 py-3">
              <div>
                <p className="text-sm text-text-primary">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </p>
                <p className="text-xs text-text-tertiary">
                  by {entry.admin?.full_name ?? entry.admin?.email ?? 'Unknown admin'}
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-text-tertiary">
                {formatDateTime(entry.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
