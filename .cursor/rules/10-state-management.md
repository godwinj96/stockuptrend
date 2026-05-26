---
title: State Management
description: Data fetching patterns, Zustand store, SWR usage, and state anti-patterns.
alwaysApply: false
---

# State Management

## Decision Tree

Before reaching for state management, ask:

1. **Can a Server Component fetch this data?** → Yes: fetch directly in the Server Component, pass as props. No state needed.
2. **Does the data need to be refreshed after the initial load?** → Yes: use SWR in a Client Component.
3. **Is this UI state shared between sibling components?** → Yes: Zustand store. No: local `useState`.
4. **Is this form state?** → Always React Hook Form. Never `useState` for form fields.

## Server Components (Primary Data Layer)

For any data that is available at render time and does not need real-time updates, fetch directly in Server Components:

```typescript
// app/(portal)/portal/dashboard/page.tsx — Server Component
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: accounts }, { data: recentTransactions }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('accounts').select('*').eq('user_id', user!.id),
    supabase.from('transactions').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
  ])

  // Pass as props to client components
  return (
    <DashboardContent
      profile={profile}
      accounts={accounts}
      initialTransactions={recentTransactions}
    />
  )
}
```

**Pattern:** Fetch multiple queries in parallel with `Promise.all`. Pass initial data to Client Components to avoid loading flicker.

## SWR (Client-Side Data Fetching)

Use SWR in Client Components for data that needs to:
- Refresh automatically (balances, transaction status)
- Be refetched after a mutation
- Stay in sync via polling

```typescript
// Custom hook pattern
// src/hooks/useAccountBalance.ts
import useSWR from 'swr'
import { createBrowserClient } from '@/lib/supabase/client'

const supabase = createBrowserClient()

async function fetchBalance(userId: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('balance, currency')
    .eq('user_id', userId)
    .single()
  if (error) throw error
  return data
}

export function useAccountBalance(userId: string) {
  return useSWR(
    userId ? `balance/${userId}` : null,
    () => fetchBalance(userId),
    {
      refreshInterval: 30_000,  // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )
}
```

**SWR key convention:** Use descriptive string keys that include the resource type and ID. Never use bare URLs as keys for Supabase queries.

**After mutations:** Call `mutate(key)` to invalidate and refetch:

```typescript
const { mutate } = useSWR(`transactions/${userId}`, fetcher)
// After a deposit submission succeeds:
mutate()  // Refetches the transactions list
```

## Supabase Realtime (Live Updates)

Used specifically for:
1. Transaction status updates in the portal (when a deposit is confirmed by webhook)
2. Ticket message replies (new agent message appears without page refresh)
3. Notification delivery

```typescript
// src/hooks/useTransactionUpdates.ts
import { useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useSWRConfig } from 'swr'

export function useTransactionUpdates(userId: string) {
  const { mutate } = useSWRConfig()
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel(`transactions:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` },
        () => {
          // Invalidate SWR caches for related data
          mutate(`transactions/${userId}`)
          mutate(`balance/${userId}`)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, mutate, supabase])
}
```

## Zustand (Global UI State)

Zustand stores only UI state — not server data. Single store file, divided into slices:

```typescript
// src/lib/store/index.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Modals
  activeModal: string | null
  openModal: (id: string) => void
  closeModal: () => void

  // Notifications
  unreadCount: number
  setUnreadCount: (count: number) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      activeModal: null,
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
      // Only persist sidebar state, not modal or notification state
    }
  )
)
```

**Zustand rules:**
- One store file, multiple logical slices (not multiple `create()` calls)
- Only UI state — never cache server data in Zustand
- `persist` only for state that should survive page refresh (sidebar collapsed, theme preference)
- Actions are co-located with the state they mutate (inside `create()`)

## Form State (React Hook Form)

All forms use React Hook Form + Zod. Never use `useState` for form fields.

```typescript
// Standard form pattern
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const depositSchema = z.object({
  amount: z.number({ required_error: 'Amount is required' }).min(10, 'Minimum deposit is $10'),
  currency: z.string().default('USD'),
  method: z.enum(['card', 'bank_transfer', 'crypto']),
})
type DepositFormData = z.infer<typeof depositSchema>

export function DepositForm() {
  const form = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: { currency: 'USD', method: 'card' },
  })

  async function onSubmit(data: DepositFormData) {
    try {
      const response = await fetch('/api/portal/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(await response.text())
      toast.success('Deposit initiated successfully')
      form.reset()
    } catch (error) {
      toast.error('Failed to process deposit. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

## URL State (Filters & Pagination)

Filter and pagination state lives in URL search params — not component state. This makes filtered views shareable and bookmarkable.

```typescript
// Reading
const searchParams = useSearchParams()
const page = Number(searchParams.get('page') ?? '1')
const statusFilter = searchParams.get('status') ?? 'all'

// Writing (use router, don't manipulate URL directly)
const router = useRouter()
const pathname = usePathname()

function setFilter(key: string, value: string) {
  const params = new URLSearchParams(searchParams.toString())
  params.set(key, value)
  params.set('page', '1')  // Reset to page 1 on filter change
  router.push(`${pathname}?${params.toString()}`)
}
```

## Anti-Patterns

- **No `useState` for form fields** — React Hook Form handles all form state
- **No Context API for server data** — use SWR; Context is only for static configuration
- **No Redux** — Zustand handles global UI state with far less boilerplate
- **No caching server data in Zustand** — SWR is the cache layer for server data
- **No polling without cleanup** — every `setInterval` or Realtime subscription must be cleaned up in `useEffect` return
- **No nested SWR fetches** — compose data needs at the top level, not inside child components
- **No optimistic updates without rollback** — if using optimistic UI, handle failure states and rollback
