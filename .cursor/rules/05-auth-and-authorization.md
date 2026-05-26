---
title: Auth & Authorization
description: Auth flows, session management, route protection, and KYC gating rules.
alwaysApply: false
---

# Auth & Authorization

## Provider

Supabase Auth only. Email/password is the primary method. Google OAuth is optional (Phase 2). No custom JWT implementation.

## Registration Flow

```
1. User fills register form (/auth/register)
   Fields: full_name, email, phone, country, password, confirm_password
   Validation: Zod schema in src/lib/validations/auth.ts

2. Client calls supabase.auth.signUp({ email, password, options: { data: { full_name, phone, country } } })

3. Supabase sends verification email

4. Database trigger creates row in profiles table (see 04-database-schema.md)

5. User redirected to /auth/verify — "Check your email" page

6. User clicks email link → redirected to /auth/callback?token=...
   (The /auth/callback route.ts handles the exchange and redirects to /portal/dashboard)

7. On first portal load, KYCStatusBanner prompts user to complete KYC
```

## Login Flow

```
1. User fills login form (/auth/login)
   Fields: email, password

2. Client calls supabase.auth.signInWithPassword({ email, password })

3. On success: session stored in HTTP-only cookies via @supabase/ssr
   (Never use localStorage for session storage)

4. Redirect to /portal/dashboard (or the originally requested protected URL)

5. On failure: show inline error — do not reveal whether email or password is wrong
   ("Invalid credentials. Please check your email and password.")
```

## Password Reset Flow

```
1. /auth/reset-password — user enters email
2. supabase.auth.resetPasswordForEmail(email, { redirectTo: '/auth/callback?next=/auth/update-password' })
3. User clicks email link → /auth/callback processes token → redirects to /auth/update-password
4. User enters new password → supabase.auth.updateUser({ password: newPassword })
```

## Session Management

- Sessions are stored in HTTP-only cookies using `@supabase/ssr` — this is handled by the middleware automatically.
- The middleware in `src/middleware.ts` refreshes the session on every request to prevent expiry mid-session.
- Never read or write auth tokens from `localStorage` or `sessionStorage`.

```typescript
// src/middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)']
}
```

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from portal routes
  if (!user && request.nextUrl.pathname.startsWith('/portal')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && (
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/register')
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

## Route Protection

| Route Pattern | Protection |
|---|---|
| `/portal/*` | Requires authenticated session (middleware redirect) |
| `/auth/login`, `/auth/register` | Redirects authenticated users to dashboard |
| `/auth/callback` | Public — processes Supabase callback tokens |
| `/api/portal/*` | Validates session in Route Handler before processing |
| All other routes | Public |

## KYC Gating

KYC status is stored in `profiles.kyc_status`. The gating rules:

| Feature | Required KYC Status |
|---|---|
| View portal dashboard | Any (authenticated) |
| Deposit funds | Any (`not_started` allowed, cap: $500 equivalent) |
| Withdraw funds | `approved` only |
| View trade history | Any |
| Open live trades (Phase 2) | `approved` only |

**Implementation pattern:**

```typescript
// In portal page Server Components
const { data: profile } = await supabase
  .from('profiles')
  .select('kyc_status')
  .eq('id', user.id)
  .single()

// Pass to client component to show gate or redirect
if (profile.kyc_status !== 'approved') {
  // Show KYCStatusBanner with appropriate CTA
  // Do NOT redirect — show informative state instead
}
```

The `<KYCStatusBanner />` component handles all KYC status states with appropriate messaging:
- `not_started` → "Complete verification to unlock full features" + CTA to `/portal/kyc`
- `pending` → "Documents uploaded. Under review — usually 1-2 business days."
- `under_review` → "Your documents are being reviewed by our team."
- `approved` → Not shown (banner hidden)
- `rejected` → "Verification rejected: [reason]. Please resubmit." + CTA to `/portal/kyc`

## Two-Factor Authentication (TOTP)

Supabase MFA is used for TOTP 2FA. Implementation:

```typescript
// Enrol: supabase.auth.mfa.enroll({ factorType: 'totp' })
// Returns QR code URI to display in /portal/settings

// Verify during login (if enrolled):
// After signInWithPassword succeeds, check if MFA is required
// supabase.auth.mfa.getAuthenticatorAssuranceLevel()
// If currentLevel < nextLevel, show TOTP input
// supabase.auth.mfa.challengeAndVerify({ factorId, code })

// Unenrol: supabase.auth.mfa.unenroll({ factorId })
// Requires re-authentication (password confirmation) before unenrolling
```

## Role System

Two roles in `profiles.role`: `user` (default) and `admin` (internal).

- Admin role is assigned manually in Supabase Dashboard — no self-serve admin creation
- Admin-only Route Handlers check `profiles.role === 'admin'` after verifying session
- RLS policies do not distinguish admin — admin operations use service role in Route Handlers
- Phase 1 has no admin UI — admin operations are performed directly in Supabase Dashboard

## Sign Out

```typescript
// Client Component
await supabase.auth.signOut()
// Then redirect to homepage
router.push('/')
```

The session cookie is cleared automatically by Supabase on signOut.
