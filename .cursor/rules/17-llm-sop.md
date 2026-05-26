---
title: LLM Output SOP
description: Hard rules for code quality, completeness, and design consistency. Every agent must pass this checklist before submitting output.
alwaysApply: true
---

# LLM Output Standard Operating Procedure

This file contains non-negotiable rules for code quality, completeness, and consistency. Every agent working on this codebase must apply these rules without exception. The purpose is to prevent:
- Broken or non-functional output
- Missing features ("I'll implement this later")
- Generic-looking UI that ignores the design system
- Inconsistent patterns across files
- Security vulnerabilities introduced through carelessness

---

## Completeness Rules

### No Stubs, No Placeholders

These patterns are **forbidden** in submitted code:

```typescript
// ❌ FORBIDDEN
// TODO: implement this
// TODO: add validation
// TODO: handle error
// Placeholder
// Coming soon
function doSomething() {
  // implement later
}
// @ts-ignore
```

If you declare a function, implement it fully. If you add an error boundary, provide the error UI. If you add a form field, add its validation schema.

**Exception:** A comment explaining WHY a non-obvious constraint exists (e.g., "MoonPay requires unsigned URL — see https://...") is acceptable. What is not acceptable is a comment indicating unfinished work.

### Required Files Per Route

For every new page route created, these files must exist:

| File | Purpose | Required? |
|---|---|---|
| `page.tsx` | Page component | Always |
| `layout.tsx` | Layout wrapper | If the route needs its own layout |
| `loading.tsx` | Skeleton/loading UI | Always (if page fetches data) |
| `error.tsx` | Error boundary UI | Always (if page fetches data) |
| Metadata export | SEO | Always (marketing pages) |

### Required States Per Data Component

Every component that renders async or dynamic data must implement:

| State | Implementation |
|---|---|
| Loading | Skeleton UI matching data shape (not a spinner unless it's a button) |
| Error | `<ErrorState />` with message and optional retry |
| Empty | `<EmptyState />` with contextual message and optional action |
| Data | The actual rendered content |

Never skip a state because "the data will always be there." Network calls fail. Databases go down.

### Form Completeness Checklist

Every form must have:
- [ ] Zod validation schema in `src/lib/validations/`
- [ ] React Hook Form with `zodResolver`
- [ ] All fields have labels
- [ ] Inline error messages below each invalid field
- [ ] Submit button shows loading state while submitting
- [ ] Success feedback after submission (toast + UI state change)
- [ ] Error feedback if submission fails (toast + field errors if server returns them)
- [ ] Form resets or navigates away after successful submission

---

## Code Quality Rules

### TypeScript

```typescript
// ❌ Never use 'any'
function processData(data: any) {}

// ✅ Type it properly
function processData(data: Transaction[]) {}

// ❌ Never use non-null assertion without certainty
const name = profile!.full_name

// ✅ Check first
const name = profile?.full_name ?? 'Unknown'

// ❌ Never ignore TypeScript errors with @ts-ignore
// @ts-ignore
const result = someUnsafeOperation()

// ✅ Fix the underlying type issue
```

### File Size

Component files must not exceed 250 lines. If they grow larger:
1. Extract logical sub-sections into named sub-components (same folder)
2. Extract hooks into `/src/hooks/`
3. Extract repeated render logic into utility functions

### No Magic Strings

```typescript
// ❌ Magic string
if (profile.kyc_status === 'approved') {}
router.push('/portal/dashboard')

// ✅ Constants
import { KYC_STATUS } from '@/lib/constants/kyc'
import { ROUTES } from '@/lib/constants/routes'
if (profile.kyc_status === KYC_STATUS.APPROVED) {}
router.push(ROUTES.portal.dashboard)
```

### No Inline Styles

```typescript
// ❌
<div style={{ color: 'red', marginTop: 16 }}>

// ✅
<div className="text-danger mt-4">
```

### No console.log in Production Code

```typescript
// ❌
console.log('deposit data:', data)

// ✅
// Remove debug logs entirely. For errors, use Sentry:
// Sentry.captureException(error, { extra: { context: 'deposit' } })
```

### Imports

```typescript
// ❌ Relative imports traversing multiple directories
import { createMetadata } from '../../../lib/utils/metadata'

// ✅ Path alias
import { createMetadata } from '@/lib/utils/metadata'

// ❌ Unused imports — TypeScript will flag these, but also visually review
import { useState, useEffect, useCallback, useMemo } from 'react' // only using useState

// ✅ Import only what you use
import { useState } from 'react'
```

---

## Design Quality Rules

### Colour: Use Tokens, Not Hardcoded Values

```typescript
// ❌ Hardcoded colour
className="text-green-500 bg-gray-900"

// ✅ Brand tokens
className="text-accent-primary bg-bg-surface"
```

Before using any colour class, check `07-design-system.md`. If the exact visual is needed and no token matches, define a new token — do not hardcode.

### No Default shadcn Colours

shadcn/ui defaults use a grey zinc palette. Every shadcn component extended or used directly must be overridden with brand tokens.

```typescript
// ❌ Default shadcn Button — grey, generic
<Button>Submit</Button>

// ✅ Brand-styled variant
<Button className="bg-accent-primary text-text-inverse hover:bg-accent-primary-hover">
  Submit
</Button>
// Or better: use a pre-built CTAButton shared component
```

### Mobile-First

Write base (mobile) styles first, then add breakpoint overrides:

```typescript
// ❌ Desktop-first
className="flex-row md:flex-col"

// ✅ Mobile-first
className="flex-col md:flex-row"
```

### Animations Must Follow the Motion Rules

All animations must:
1. Use values from `MOTION` constants (`src/lib/constants/motion.ts`)
2. Respect `prefers-reduced-motion` via `useReducedMotion()`
3. Not exceed 800ms duration
4. Use `ease-out` for entrances

See `09-animation-and-motion.md` for full rules and forbidden patterns.

---

## Integration Rules

### Supabase Queries

```typescript
// ❌ Ignoring errors
const { data } = await supabase.from('profiles').select('*')
// If error, data is null and you'll crash rendering

// ✅ Always handle errors
const { data, error } = await supabase.from('profiles').select('*')
if (error) throw error  // In Server Components — let error.tsx catch it
if (error) return <ErrorState message={error.message} />  // In Client Components
```

### API Routes: Never Trust Client-Side User ID

```typescript
// ❌ Using userId from request body
const { userId, amount } = await request.json()
await supabase.from('transactions').insert({ user_id: userId, amount })

// ✅ Read userId from session
const { data: { user } } = await supabase.auth.getUser()
if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
await supabase.from('transactions').insert({ user_id: user.id, amount })
```

### KYC Gate

Any feature that requires `approved` KYC must check before rendering:

```typescript
// Withdrawal page — Server Component
if (profile.kyc_status !== 'approved') {
  return <KYCRequiredState redirectTo="/portal/kyc" />
}
// ...render withdrawal form
```

---

## Self-Check Checklist

Run through this before completing any task. Every box must be checked:

### Code
- [ ] No TypeScript errors (run `tsc --noEmit` mentally or confirm with IDE)
- [ ] No unused imports
- [ ] No `any` types
- [ ] No `console.log`
- [ ] No inline styles
- [ ] No hardcoded route strings (use `ROUTES` constants)
- [ ] No hardcoded colour values (use brand tokens)
- [ ] No magic strings for enums or status values
- [ ] File is under 250 lines (or has been split)
- [ ] Path aliases used (`@/...` not `../../...`)

### Features
- [ ] Loading state implemented
- [ ] Error state implemented
- [ ] Empty state implemented (if applicable)
- [ ] Form has full validation + error + success handling
- [ ] Session validation in Route Handler
- [ ] KYC gate applied where required (withdrawal, trading)

### Design
- [ ] Brand colour tokens used (not default shadcn grey)
- [ ] Mobile layout works at 375px width
- [ ] Desktop layout works at 1440px width
- [ ] Animations follow `09-animation-and-motion.md` rules
- [ ] `prefers-reduced-motion` respected in all Framer Motion code
- [ ] Lucide React used for icons (not any other icon library)
- [ ] Typography uses design system scale (no custom font sizes)

### Security
- [ ] User ID read from session (not request body)
- [ ] Zod validation on all Route Handler inputs
- [ ] No secrets in NEXT_PUBLIC_ variables
- [ ] RLS will protect the data (consider the query — does it return only the user's own data?)

### SEO (marketing pages only)
- [ ] `generateMetadata` or `metadata` export present
- [ ] `loading.tsx` present
- [ ] `error.tsx` present
- [ ] Risk warning present (on trading-related pages)

---

## Patterns That Are Banned

These patterns indicate AI-generated slop. If you're about to write them, stop and reconsider:

1. **Generic hero with purple-to-blue gradient** — see `07-design-system.md` for the actual palette
2. **"Lorem ipsum" or placeholder copy** — write real representative copy for every section
3. **`// TODO: add error handling`** — add it now
4. **A fetch inside a `useEffect` without SWR** — use SWR for all client-side data fetching
5. **A Tailwind className string longer than 80 characters on one line** — extract with `cn()` multi-line or into a constant
6. **Duplicate component patterns** — if you've written this shape before, extract it to a shared component
7. **A button that just looks like a clickable text with no visual identity** — every button maps to a type (primary/secondary/ghost/destructive) from the design system
8. **Empty `catch` blocks** — every `catch` must either rethrow, log to Sentry, or display an error to the user
9. **A Server Component that has `"use client"` at the top** — if you added it because the component uses a hook, extract only the interactive part to a Client Component
10. **A page with `export default function Page() { return <div>Coming soon</div> }`** — build the page
