---
title: Security
description: Security rules covering RLS, environment variables, input validation, CSP, file uploads, and API security.
alwaysApply: true
---

# Security

## Non-Negotiable Rules

These rules apply to every piece of code. No exceptions, no "we'll fix it later."

1. **Every Supabase table has RLS enabled.** No table is publicly readable or writable without an explicit policy.
2. **Service role key is server-side only.** It never appears in a `NEXT_PUBLIC_` variable, never in client-side code, never in logs.
3. **Every Route Handler validates the session before processing.** Unauthenticated requests return 401 immediately.
4. **Every user input is validated with Zod on the server.** Client-side validation is UX — server-side validation is security.
5. **Payment provider secrets are server-side only.** Never pass Stripe secret key, Coinbase API key, or webhook secrets to the client.

## Supabase Row-Level Security

All tables in `public` schema have `ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;`.

**Pattern: users can only access their own rows.**

```sql
-- Template RLS policy (applied to each table)
CREATE POLICY "users_own_[table]" ON [table]
  FOR ALL
  USING (auth.uid() = user_id);
```

Exceptions:
- Admin operations use the service role key in server-side Route Handlers — RLS is bypassed for service role
- `profiles` uses `id` not `user_id` (FK references `auth.users.id`)

**Never bypass RLS** by disabling it or using the service role key on the client.

## Environment Variables

```
# These are the ONLY variables that may be prefixed NEXT_PUBLIC_:
NEXT_PUBLIC_SUPABASE_URL          ← Supabase project URL (safe — it's the API endpoint)
NEXT_PUBLIC_SUPABASE_ANON_KEY     ← Supabase anon key (safe — protected by RLS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ← Stripe publishable key (safe by design)
NEXT_PUBLIC_MOONPAY_API_KEY       ← MoonPay publishable key (safe by design)
NEXT_PUBLIC_SITE_URL              ← Public site URL for callbacks

# These MUST NOT be NEXT_PUBLIC_ — server-side only:
SUPABASE_SERVICE_ROLE_KEY         ← Admin Supabase access — NEVER expose
STRIPE_SECRET_KEY                 ← Stripe server operations
STRIPE_WEBHOOK_SECRET             ← Webhook signature verification
COINBASE_COMMERCE_API_KEY         ← Coinbase server operations
COINBASE_COMMERCE_WEBHOOK_SECRET  ← Webhook verification
SENTRY_DSN                        ← Error monitoring (can be client-side too, but keep server-only)
```

If a variable is needed server-side only, access it with `process.env.VAR_NAME` (no `NEXT_PUBLIC_`). Next.js will strip it from client bundles.

## Input Validation

Every Route Handler validates the request body against a Zod schema before touching the database:

```typescript
// Pattern for all Route Handlers
import { z } from 'zod'

const requestSchema = z.object({ /* ... */ })

export async function POST(request: Request) {
  // 1. Auth check first
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  // 2. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON', code: 'INVALID_BODY' }, { status: 400 })
  }

  const result = requestSchema.safeParse(body)
  if (!result.success) {
    return Response.json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: result.error.flatten(),
    }, { status: 422 })
  }

  const data = result.data
  // 3. Business logic
}
```

**Validation rules:**
- Strings: always `.trim()` and validate max length
- Numbers: validate min, max, and that they're finite (no `Infinity`, `NaN`)
- Enums: use `z.enum([...])` — never accept arbitrary strings for type fields
- User IDs: never accept `userId` from request body — always read from session (`user.id`)
- Amounts: validate as positive numbers with max 2 decimal places for currency

## Content Security Policy

Configure in `next.config.js` via `headers()`:

```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://s3.tradingview.com https://js.stripe.com https://buy.moonpay.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.supabase.co https://assets.tradingview.com;
  frame-src https://js.stripe.com https://hooks.stripe.com https://buy.moonpay.com https://s.tradingview.com https://widget.coinbase.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.moonpay.com https://api.commerce.coinbase.com https://api.sentry.io https://s3.tradingview.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}
```

## File Upload Security (KYC)

Validated at two levels:

**Client-side (UX validation):**
- File type: check `file.type` against `['application/pdf', 'image/jpeg', 'image/png']`
- File size: check `file.size < 10 * 1024 * 1024` (10MB)
- Show error immediately without submitting

**Server-side (security validation) in `/api/portal/kyc/route.ts`:**
- Re-validate file type by checking magic bytes (not just MIME type header)
- Re-validate size
- Generate storage path: `{userId}/{docType}/{Date.now()}.{ext}` — never use the original filename
- Upload via service role client (user cannot write directly to this bucket)
- Store only the storage path in the database — never expose the full signed URL until needed

**Generating signed URLs (for admin review):**
```typescript
const { data } = await supabaseAdmin.storage
  .from('kyc-documents')
  .createSignedUrl(filePath, 3600)  // 1 hour expiry
```

## Rate Limiting

Apply to auth endpoints and payment endpoints to prevent abuse:

- Tool: Upstash Redis with `@upstash/ratelimit` (or Vercel Edge Config if simpler)
- Limits:
  - `/auth/login` (attempted): 5 requests per 15 minutes per IP
  - `/auth/register`: 3 requests per hour per IP
  - `/api/portal/deposit`: 10 requests per hour per user
  - `/api/portal/withdrawal`: 5 requests per hour per user

```typescript
// Pattern for rate-limited Route Handlers
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
})

// In Route Handler:
const identifier = request.headers.get('x-forwarded-for') ?? 'unknown'
const { success } = await ratelimit.limit(identifier)
if (!success) {
  return Response.json({ error: 'Too many requests' }, { status: 429 })
}
```

## HTTPS & Transport Security

- Vercel enforces HTTPS automatically — no configuration needed
- All Supabase connections use SSL by default
- Never make HTTP requests to payment APIs — always HTTPS
- Cookie settings (managed by `@supabase/ssr`): `Secure`, `HttpOnly`, `SameSite=Lax`

## Dependency Security

```bash
# Run before deploying — fail CI if critical vulnerabilities found
npm audit --audit-level=critical
```

Do not install packages with critical CVEs. If a dependency has a high/critical vulnerability, either upgrade or find an alternative.

## Data Exposure Rules

- Never return full user objects from API routes — select only needed fields
- Never expose `profiles.role` to client-rendered output (it can be read but not exploited via RLS)
- Never log: passwords, payment card numbers, full bank account numbers, document file contents
- Stripe webhook bodies contain card data — never log them; log only the event ID and type
