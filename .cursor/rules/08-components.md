---
title: Components
description: Component authoring rules, composition patterns, key shared component specs.
alwaysApply: true
---

# Components

## Authoring Rules

### TypeScript

Every component has an explicit props interface:

```typescript
interface BalanceWidgetProps {
  balance: number
  currency: string
  change24h: number
  isLoading?: boolean
}

export function BalanceWidget({ balance, currency, change24h, isLoading = false }: BalanceWidgetProps) {
  // ...
}
```

No `any`. No prop spreading of unknown types. No `React.FC` — use named function declarations.

### Server vs Client

- **Default: Server Component.** A file without `"use client"` is a Server Component.
- Add `"use client"` only when the component uses: browser APIs, `useState`, `useEffect`, event handlers, Framer Motion, Zustand, SWR, or any hook.
- Never add `"use client"` to a page file if only a section of it needs interactivity — extract that section into a separate Client Component.

### Extending shadcn Components

```typescript
// ✅ Correct — extend via className, don't modify /components/ui/ files
import { Button } from '@/components/ui/button'

export function CTAButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn('bg-accent-primary hover:bg-accent-primary-hover text-text-inverse font-semibold shadow-none hover:shadow-glow-accent transition-all duration-200', props.className)}
      {...props}
    >
      {children}
    </Button>
  )
}
```

Use the `cn()` utility from `@/lib/utils/cn` to merge classes.

### forwardRef

Use `forwardRef` for any component that wraps a native DOM element:

```typescript
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn('...', className)} {...props} />
  }
)
Input.displayName = 'Input'
```

### Prop Drilling Limit

Maximum 2 levels of prop drilling. If a value needs to go deeper, use:
- Zustand for global UI state
- React Context for subtree-scoped state (e.g., a multi-step form's state)
- SWR for server data (each component fetches what it needs, SWR deduplicates)

### Required States

Every component that fetches or receives async data must implement all three:

```typescript
// Loading state
if (isLoading) return <ComponentSkeleton />

// Error state
if (error) return <ErrorState message={error.message} onRetry={mutate} />

// Empty state
if (!data || data.length === 0) return <EmptyState title="No trades yet" description="Your trade history will appear here." />

// Data state
return <ActualComponent data={data} />
```

Never render `null` silently for loading or error states — always show meaningful UI.

### File Size Limit

Component files must not exceed 250 lines. If a component grows beyond this:
1. Extract logical sub-sections into named sub-components in the same folder
2. Extract repeated patterns into shared components

### Accessibility

- All interactive elements (`button`, `a`, custom inputs): must have visible label or `aria-label`
- Focus rings: never remove `outline` without replacing with a visible custom focus style
- Keyboard navigation: all interactive elements must be reachable and operable via keyboard
- Images: always provide `alt` text — empty string (`alt=""`) only for decorative images
- Tables: use `<th scope="col">` for column headers, `<caption>` if the table needs context
- Forms: every input has an associated `<label>` (via `htmlFor` or wrapping)
- Modal dialogs: use Radix Dialog (included in shadcn) — it handles focus trap, aria, and keyboard

## The `cn()` Utility

Always use this for merging Tailwind classes:

```typescript
// src/lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Key Shared Components

### `<MarketTicker />`

- Wraps TradingView ticker tape widget
- Full-width horizontal scrolling strip
- Shows: selected instruments with current price and daily change %
- Loads lazily (below fold: IntersectionObserver; above fold: immediate)
- Skeleton: full-width bar with shimmer while widget loads
- Position: directly below navbar on marketing pages; below portal header in portal

### `<TrustBadgeBar />`

- Horizontal strip of trust signals
- Items: regulatory claims, security (SSL/256-bit), user count ("50,000+ traders"), uptime claim
- Each item: icon + short text, separated by subtle dividers
- Animation: slides in from bottom on first viewport entry (staggered)
- Background: `bg-bg-surface` with `border-y border-border-subtle`

### `<InstrumentCard />`

```typescript
interface InstrumentCardProps {
  symbol: string      // e.g. 'EURUSD'
  name: string        // e.g. 'Euro / US Dollar'
  category: 'forex' | 'crypto' | 'stocks' | 'commodities'
  price: number
  change24h: number   // percentage
  spread: string      // e.g. '0.8 pips'
  leverage: string    // e.g. '1:500'
}
```

- Card with symbol icon, name, live price, change % (green/red), spread, leverage
- Price updates: flicker green/red briefly when price changes (CSS transition on background-color)
- Hover: `translateY(-2px)` + deeper shadow
- Clickable: navigates to `/trading-instruments/[slug]`

### `<AccountTypeTier />`

```typescript
interface AccountTypeTierProps {
  name: string            // 'Standard' | 'Pro' | 'VIP'
  minDeposit: string      // e.g. '$100'
  spread: string
  leverage: string
  features: string[]
  isPopular?: boolean
  variant?: 'standard' | 'pro' | 'vip'
}
```

- `isPopular`: renders "Most Popular" badge and accent border
- `vip` variant uses `--accent-gold` accent colour
- Feature list: checkmark icon + text for each item

### `<KYCStatusBanner />`

- Full-width banner at top of portal pages (when KYC is not `approved`)
- States: `not_started`, `pending`, `under_review`, `rejected`
- Each state: different icon, title, body text, and CTA
- Can be dismissed temporarily (persists in sessionStorage — never hides permanently until approved)

### `<TransactionTable />`

- Paginated table: 20 rows per page
- Columns: Date, Type (badge), Method, Amount, Currency, Status (badge)
- Row click: expands inline detail row or opens a drawer
- Filterable: Type dropdown, Status dropdown, Date range picker
- URL params: `?page=1&type=deposit&status=completed`
- Export: "Download CSV" button triggers client-side CSV generation

### `<DepositWithdrawForm />`

- Tab selector: Card | Bank Transfer | Crypto
- Amount input with currency selector
- Minimum deposit notice per method
- Summary: "You will receive: X USD" with fee breakdown
- Submit: calls relevant Route Handler
- On success: `sonner` toast + transaction appears in `<TransactionTable />`

### `<SupportTicketThread />`

- Message list: user messages (right-aligned, accent bg) vs agent messages (left-aligned, surface bg)
- Message: avatar, role label, timestamp, text
- Input at bottom: textarea + attach file + send button
- New messages appear without full page reload (SWR polling or Supabase Realtime)

### `<NotificationDropdown />`

- Triggered by bell icon in portal header
- Dropdown: list of last 10 notifications, newest first
- Each: icon (by type), title, body (truncated), timestamp
- Unread: bold + accent left border
- "Mark all read" button
- "View all" link (no dedicated notifications page in Phase 1 — dropdown only)
- Badge count on bell: unread count (max "9+")

### Loading Skeletons

Every data-dependent component has a matching skeleton. Skeleton must mirror the exact layout of the loaded component:

```typescript
// Example: BalanceWidgetSkeleton
export function BalanceWidgetSkeleton() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 animate-pulse">
      <div className="h-4 w-24 bg-bg-overlay rounded mb-4" />
      <div className="h-8 w-36 bg-bg-overlay rounded mb-2" />
      <div className="h-3 w-20 bg-bg-overlay rounded" />
    </div>
  )
}
```

Use `animate-pulse` (Tailwind) for skeleton shimmer. Match the exact shape of the content.

### `<ErrorState />`

```typescript
interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}
```

- Shows error icon, title, message, optional retry button
- Used inside components, not as a full-page error
- Style: subtle — `text-danger` icon, `text-text-secondary` message

### `<EmptyState />`

```typescript
interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
  icon?: LucideIcon
}
```

- Centred in its container with icon, heading, description, optional CTA
- Used for: empty trade history, no tickets, no notifications
