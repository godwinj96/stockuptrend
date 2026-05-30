'use client'

import { useEffect } from 'react'
import useSWR, { mutate as globalMutate } from 'swr'
import { Bell, CheckCheck, TrendingUp, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, MessageSquare, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/shared/EmptyState'
import { useUIStore } from '@/lib/store/index'
import { formatRelativeTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { AppNotification } from '@/lib/supabase/types'

interface NotificationsResponse {
  notifications: AppNotification[]
  unread_count: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<NotificationsResponse>)

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  trade_closed: TrendingUp,
  deposit_confirmed: ArrowDownToLine,
  withdrawal_approved: ArrowUpFromLine,
  withdrawal_rejected: ArrowUpFromLine,
  kyc_approved: ShieldCheck,
  kyc_rejected: ShieldCheck,
  support_reply: MessageSquare,
  system: Info,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  trade_closed: 'text-accent-primary bg-accent-primary-muted',
  deposit_confirmed: 'text-accent-primary bg-accent-primary-muted',
  withdrawal_approved: 'text-accent-primary bg-accent-primary-muted',
  withdrawal_rejected: 'text-danger bg-danger-muted',
  kyc_approved: 'text-accent-primary bg-accent-primary-muted',
  kyc_rejected: 'text-danger bg-danger-muted',
  support_reply: 'text-accent-secondary bg-accent-secondary-muted',
  system: 'text-text-secondary bg-bg-elevated',
}

async function markRead(id: string) {
  await fetch(`/api/portal/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_read: true }),
  })
  await globalMutate('/api/portal/notifications')
}

async function markAllRead(notifications: AppNotification[]) {
  const unread = notifications.filter((n) => !n.is_read)
  await Promise.all(unread.map((n) => markRead(n.id)))
}

export function NotificationDropdown() {
  const { data, isLoading } = useSWR<NotificationsResponse>(
    '/api/portal/notifications',
    fetcher,
    { refreshInterval: 30_000 },
  )
  const setUnreadNotifications = useUIStore((s) => s.setUnreadNotifications)
  const unreadCount = useUIStore((s) => s.unreadNotifications)

  useEffect(() => {
    if (data?.unread_count !== undefined) {
      setUnreadNotifications(data.unread_count)
    }
  }, [data?.unread_count, setUnreadNotifications])

  const notifications = data?.notifications ?? []
  const hasUnread = unreadCount > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-primary text-[9px] font-bold text-text-inverse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated p-0 shadow-elevated"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <span className="text-sm font-semibold text-text-primary">Notifications</span>
          {hasUnread && (
            <button
              onClick={() => markAllRead(notifications)}
              className="flex items-center gap-1 text-xs text-accent-primary hover:opacity-80"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 rounded-lg p-3">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-bg-overlay" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-bg-overlay" />
                    <div className="h-2.5 w-full animate-pulse rounded bg-bg-overlay" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up!"
              />
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] ?? Info
                const colorClass = NOTIFICATION_COLORS[notification.type] ?? 'text-text-secondary bg-bg-elevated'
                return (
                  <li key={notification.id}>
                    <button
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-overlay',
                        !notification.is_read && 'bg-accent-primary/[0.04]',
                      )}
                      onClick={() => {
                        if (!notification.is_read) markRead(notification.id)
                      }}
                    >
                      <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', colorClass)}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-xs font-medium leading-snug', notification.is_read ? 'text-text-secondary' : 'text-text-primary')}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                          )}
                        </div>
                        {notification.body && (
                          <p className="mt-0.5 truncate text-[11px] text-text-tertiary">
                            {notification.body}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] text-text-tertiary">
                          {notification.created_at ? formatRelativeTime(notification.created_at) : ''}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
