---
title: Client Portal
description: Full feature spec for the authenticated client portal — dashboard, KYC, payments, trade history, support, and settings.
alwaysApply: false
---

# Client Portal

All portal routes are under `(portal)/portal/` and require authentication (enforced by middleware). See `05-auth-and-authorization.md` for route protection.

## Portal Layout

### `<PortalSidebar />`

Fixed left sidebar, 240px wide on desktop. Collapsed (icon-only, 60px) when `sidebarCollapsed` is `true` in Zustand store.

Navigation items and their icons (Lucide):

```
[LayoutDashboard]  Dashboard
[ArrowDownToLine]  Deposit
[ArrowUpFromLine]  Withdrawal
[LineChart]        Trade History
[ShieldCheck]      KYC Verification  [status badge]
[MessageSquare]    Support           [unread badge]
[Settings]         Settings
[LogOut]           Sign Out
```

Bottom of sidebar: user avatar, name, account type badge (Standard / Pro / VIP), account balance (compact).

Sidebar collapse toggle: chevron icon on the sidebar edge. State persists across sessions (Zustand persist middleware).

### `<PortalHeader />`

Height: 56px. Position: sticky top.

Contents (left to right):
- Sidebar toggle (hamburger / close icon on mobile, chevron icon on desktop)
- Page title (derived from current route)
- Spacer (flex-grow)
- `<NotificationDropdown />` — bell icon with unread count badge
- User avatar — opens dropdown: "My Profile", "Settings", divider, "Sign Out"

### Mobile Navigation

Bottom tab bar (5 items, always visible):
1. Dashboard (LayoutDashboard)
2. Deposit (ArrowDownToLine)
3. Withdraw (ArrowUpFromLine)
4. History (LineChart)
5. More (Menu) → opens a drawer with: KYC, Support, Settings, Sign Out

---

## Dashboard (`/portal/dashboard`)

### Layout

Two-column on desktop (main content + sidebar widgets), single column on mobile.

### Main Content Area

**1. KYC Status Banner** (conditional — see `<KYCStatusBanner />` in `08-components.md`)
Shown at top if KYC is not `approved`.

**2. Account Overview Card**
```
[Account number]  [Account type badge]
[Balance]         [Currency selector toggle: USD / EUR / GBP]
[+X.XX% today]   [Unrealised P&L]
──────────────────────────
[Deposit button]  [Withdraw button]  [Trade button (Phase 2)]
```
Balance uses count-up animation on first render. Positive daily change: `text-accent-primary`. Negative: `text-danger`.

**3. P&L Summary Tabs**
Tabs: Today | This Week | This Month | All Time
Each tab shows:
- Net P&L (large number, coloured)
- Total trades count
- Win rate %
- Best trade symbol + amount

**4. Recent Transactions** (last 5)
Compact table: date, type badge, amount, status badge. "View all" link to `/portal/trade-history`.

### Sidebar Widgets

**5. Market Ticker** (TradingView ticker tape, compact)

**6. Quick Stats**
- Total deposits
- Total withdrawals
- Account age (joined X days ago)

**7. Pending Items** (if any)
- "KYC document under review" (link)
- "Withdrawal request pending" (link)

### Data Loading

Page is Server Component that fetches initial data (profile, account, last 5 transactions). Client Components mount with `initialData` and use SWR for subsequent refreshes. Balance subscribes to Supabase Realtime via `useTransactionUpdates` hook.

---

## KYC Verification (`/portal/kyc`)

### Step Structure

3-step wizard with progress indicator at the top:
`[1: Personal Info] → [2: Documents] → [3: Selfie]`

Step progress state managed with React Context (not URL params — stateful wizard).

**Step 1: Personal Information**
```
Form fields:
- Full name (pre-filled from profile)
- Date of birth (date picker)
- Nationality (country select, searchable)
- Residential address
- City
- Postal code
- Country of residence (country select)

Validation: All fields required, age ≥ 18, valid date
```

**Step 2: Identity Documents**
```
Sub-sections:
A) Government ID
   - Document type: Passport / National ID / Driver's License (radio)
   - File upload (drag-and-drop + click to browse)
   - Preview of uploaded file

B) Proof of Address
   - Document type: Utility Bill / Bank Statement / Government Letter
   - File upload
   - Preview
   - Note: "Must be dated within the last 3 months"

Upload validation: PDF/JPEG/PNG, max 10MB, shown inline on file selection
```

**Step 3: Selfie with ID**
```
Instructions displayed:
- "Hold your government ID next to your face"
- "Ensure your face and the ID are clearly visible"
- "Good lighting — avoid shadows"

File upload: single image (JPEG/PNG, max 10MB)
Preview shown after upload

Submit button: "Submit for Review"
```

**On submission:**
- Files uploaded to Supabase Storage via `/api/portal/kyc`
- `profiles.kyc_status` updated to `'pending'`
- User sees success confirmation: "Documents submitted! We'll review within 1-2 business days."

### Status Page (post-submission)

When KYC has been submitted (status is `pending`, `under_review`, `approved`, or `rejected`), replace the wizard with a status card:

```
[Status icon + colour]
[Status label]
[Status description]
[Estimated time (if pending/under_review)]
[Re-submit button (if rejected) + rejection reason]
```

---

## Deposit (`/portal/deposit`)

### Layout

Left: payment method tabs + form. Right: summary panel + deposit history.

### Payment Method Tabs

**Card (Stripe)**
```
Amount input (number, with currency selector: USD/EUR/GBP)
[Stripe PaymentElement renders here after amount is entered and valid]
[Submit: "Deposit $X.XX"]
Min deposit notice: "Minimum: $10"
```

**Bank Transfer**
```
Amount input
[Submit: "Generate Reference"]
↓ (after submit)
Bank details card:
  Bank: [Bank Name]
  Account: XXXX XXXX XXXX
  Reference: SUT-XXXX-XXXX  ← copy button
  Note: "Include the reference in your transfer"
  "Processing time: 1-3 business days"
```

**Crypto**
```
Sub-tabs: [Buy with card (MoonPay)] [Send from wallet (Coinbase)]

MoonPay tab:
  Amount input + currency
  [MoonPay widget iframe loads]

Coinbase tab:
  Amount input + crypto currency selector (BTC/ETH/USDT/USDC)
  [Submit: "Generate Address"]
  ↓
  Crypto address card:
    QR code + address + copy button
    "Send exactly X [currency] to this address"
    "Do not send other assets to this address"
    "Processing: typically under 30 minutes after network confirmation"
```

### Deposit History

Below the form: `<TransactionTable />` filtered to `type = 'deposit'` for the current user.

---

## Withdrawal (`/portal/withdrawal`)

### KYC Gate

If `profiles.kyc_status !== 'approved'`, show:
```
[ShieldAlert icon]
"Identity Verification Required"
"You must complete KYC verification before making withdrawals."
[Complete Verification button → /portal/kyc]
```
Do not render the withdrawal form.

### Withdrawal Form (KYC approved users)

```
Amount input
  Available balance: $X,XXX.XX
  [Max button]

Method selector:
  [Bank Wire Transfer]  [Cryptocurrency]

Bank Wire fields:
  - Account holder name
  - Bank name
  - IBAN / Account number
  - SWIFT / BIC
  - Bank address (optional)

Crypto fields:
  - Network selector (Bitcoin / Ethereum / Tron / BSC)
  - Wallet address

Processing time notice (per method)
Fee notice (if applicable)

[Submit: "Request Withdrawal"]
```

Validation: amount ≤ available balance, amount ≥ minimum, all required fields present.

On success: transaction created with `status: 'pending_review'`. Confirmation message: "Withdrawal request submitted. Expected processing: 1-3 business days."

---

## Trade History (`/portal/trade-history`)

### Filters (URL param-driven)

```
[Symbol search input]  [Direction: All/Buy/Sell]  [Status: All/Open/Closed]
[Date range: from—to]  [Clear filters]             [Export CSV]
```

### Table Columns

| # | Symbol | Direction | Volume | Open Price | Close Price | Open Date | Close Date | P&L | Status |
|---|---|---|---|---|---|---|---|---|---|

- Direction: "Buy" (green) / "Sell" (red) badge
- P&L: positive `text-accent-primary`, negative `text-danger`
- Status: Open (blue badge) / Closed (neutral) / Cancelled (muted)
- Numeric columns: `tabular-nums`, right-aligned

### Pagination

20 rows per page. URL param: `?page=1`. Pagination component below table with prev/next and page number.

### Export CSV

Client-side CSV generation from the currently filtered dataset:
```typescript
function exportToCSV(trades: Trade[]) {
  const headers = ['Symbol', 'Direction', 'Volume', ...]
  const rows = trades.map(t => [t.symbol, t.direction, ...])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  // Trigger download
}
```

---

## Support (`/portal/support`)

### Ticket List Page

Header: "Support" + "New Ticket" button (opens modal or navigates to form).

Ticket cards in a list:
```
[Category badge]  [Subject]                    [Status badge]
[#ticket-id]      "Last reply: X hours ago"    [Open date]
```

Click → navigate to `/portal/support/[ticketId]`.

Filter: All / Open / In Progress / Resolved.

### New Ticket Form (modal or page)

```
Subject (text input)
Category (select): Deposits | Withdrawals | Trading | KYC | Technical | Other
Message (textarea, min 20 chars)
Attachment (optional file upload)

[Submit: "Create Ticket"]
```

### Ticket Detail (`/portal/support/[ticketId]`)

```
Header: Subject + Status badge + Category badge

Message thread:
  [User message — right-aligned bubble, dark accent bg]
    Avatar + "You" + timestamp

  [Agent message — left-aligned bubble, surface bg]
    Avatar + "Support Team" + timestamp

Reply input:
  Textarea
  [Attach file button]
  [Send button]
```

New messages: Supabase Realtime subscription on `ticket_messages` for this `ticket_id`.

---

## Settings (`/portal/settings`)

Tab navigation: Profile | Security | Notifications | Payment Methods

### Profile Tab

```
Avatar upload (circular, click to replace)
Full name (editable)
Email (displayed, not editable — change email is separate flow Phase 2)
Phone number
Country
Preferred currency

[Save Changes button]
```

### Security Tab

```
Change Password:
  Current password
  New password (requirements: min 8 chars, 1 number, 1 symbol)
  Confirm new password
  [Update Password]

Two-Factor Authentication:
  [Current status: Enabled/Disabled]
  If disabled: [Enable 2FA button] → opens modal with QR code + manual code + verification input
  If enabled: [Disable 2FA button] → requires password confirmation
```

### Notifications Tab

Toggle switches for:
- Deposit confirmed
- Withdrawal processed
- KYC status update
- Trade closed (Phase 2)
- Support ticket reply
- System announcements

Delivery method: In-app only (Phase 1). Email notifications: Phase 2.

### Payment Methods Tab

Saved payment methods list (Phase 2 — Stripe saved cards). In Phase 1: "No saved methods — payment details are entered at time of deposit."
