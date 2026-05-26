---
title: Database Schema
description: Complete Supabase schema — tables, RLS policies, enums, and storage buckets for StockUptrend.
alwaysApply: false
---

# Database Schema

All data lives in Supabase PostgreSQL. Agents must use these exact table and column names — never invent schema.

## Enums

Define as PostgreSQL enums before creating tables:

```sql
CREATE TYPE kyc_status AS ENUM ('not_started', 'pending', 'under_review', 'approved', 'rejected');
CREATE TYPE account_type AS ENUM ('standard', 'pro', 'vip');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'trade_profit', 'trade_loss', 'bonus', 'fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'pending_review', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE trade_direction AS ENUM ('buy', 'sell');
CREATE TYPE trade_status AS ENUM ('open', 'closed', 'cancelled');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE sender_role AS ENUM ('user', 'agent');
CREATE TYPE doc_type AS ENUM ('passport', 'national_id', 'drivers_license', 'utility_bill', 'bank_statement', 'selfie');
CREATE TYPE notification_type AS ENUM ('deposit_confirmed', 'withdrawal_approved', 'withdrawal_rejected', 'kyc_approved', 'kyc_rejected', 'trade_closed', 'support_reply', 'system');
CREATE TYPE user_role AS ENUM ('user', 'admin');
```

## Tables

### `profiles`
Extends `auth.users`. Created automatically on user registration via database trigger.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  country TEXT,                          -- ISO 3166-1 alpha-2 code
  address TEXT,
  city TEXT,
  postal_code TEXT,
  preferred_currency TEXT DEFAULT 'USD', -- ISO 4217 code
  account_type account_type DEFAULT 'standard',
  kyc_status kyc_status DEFAULT 'not_started',
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `kyc_documents`
One row per uploaded document. Users may have multiple documents (re-submissions on rejection).

```sql
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doc_type doc_type NOT NULL,
  file_path TEXT NOT NULL,               -- Supabase Storage path (not public URL)
  status kyc_status DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `accounts`
A user may have one or more trading accounts (Phase 1: one per user).

```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL,   -- e.g. "SUT1000001"
  balance NUMERIC(18, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  leverage INTEGER DEFAULT 100,          -- e.g. 100 = 1:100
  account_type account_type DEFAULT 'standard',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `transactions`
All money movements (deposits, withdrawals, trade credits/debits).

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id),
  type transaction_type NOT NULL,
  amount NUMERIC(18, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status transaction_status DEFAULT 'pending',
  method TEXT,                           -- 'card', 'bank_transfer', 'crypto_moonpay', 'crypto_coinbase'
  provider_reference TEXT,               -- Stripe payment intent ID, Coinbase charge ID, etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `trades`
Trading positions. Phase 1: manually entered or via MT5 sync. Phase 2: live MT5 feed.

```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id),
  symbol TEXT NOT NULL,                  -- e.g. 'EURUSD', 'BTCUSD', 'AAPL'
  direction trade_direction NOT NULL,
  volume NUMERIC(10, 2) NOT NULL,        -- Lot size
  open_price NUMERIC(18, 8) NOT NULL,
  close_price NUMERIC(18, 8),
  stop_loss NUMERIC(18, 8),
  take_profit NUMERIC(18, 8),
  open_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  close_at TIMESTAMPTZ,
  profit_loss NUMERIC(18, 2),
  commission NUMERIC(10, 4) DEFAULT 0,
  swap NUMERIC(10, 4) DEFAULT 0,
  status trade_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `support_tickets`

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,               -- 'deposits', 'withdrawals', 'trading', 'kyc', 'technical', 'other'
  status ticket_status DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `ticket_messages`

```sql
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role sender_role NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[],                   -- Array of storage file paths
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,                      -- References the related record (transaction_id, ticket_id, etc.)
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Row-Level Security (RLS) Policies

RLS is enabled on every table. The following policies are the minimum required:

### `profiles`
```sql
-- Users can read and update only their own profile
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

### `kyc_documents`
```sql
CREATE POLICY "users_own_kyc" ON kyc_documents
  FOR ALL USING (auth.uid() = user_id);
```

### `accounts`
```sql
CREATE POLICY "users_own_accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);
-- INSERT/UPDATE only via service role (Route Handlers)
```

### `transactions`
```sql
CREATE POLICY "users_read_own_transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
-- INSERT/UPDATE only via service role (Route Handlers / webhooks)
```

### `trades`
```sql
CREATE POLICY "users_read_own_trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);
```

### `support_tickets`
```sql
CREATE POLICY "users_own_tickets" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);
```

### `ticket_messages`
```sql
CREATE POLICY "users_read_own_ticket_messages" ON ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE id = ticket_messages.ticket_id
      AND user_id = auth.uid()
    )
  );
CREATE POLICY "users_insert_own_ticket_messages" ON ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM support_tickets
      WHERE id = ticket_messages.ticket_id
      AND user_id = auth.uid()
    )
  );
```

### `notifications`
```sql
CREATE POLICY "users_own_notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);
```

## Triggers & Functions

### Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Update `updated_at` timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- (repeat for accounts, transactions, support_tickets)
```

## Supabase Storage Buckets

### `kyc-documents`
- **Access:** Private
- **RLS:** Owner can read their own files; service role can read/write
- **Path convention:** `{userId}/{docType}/{timestamp}.{ext}`
- **Allowed MIME types:** `application/pdf`, `image/jpeg`, `image/png`
- **Max file size:** 10MB

### `profile-avatars`
- **Access:** Public
- **Path convention:** `{userId}/avatar.{ext}`
- **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`
- **Max file size:** 2MB

## TypeScript Types

Run `supabase gen types typescript --project-id [project-id] > src/lib/supabase/types.ts` to regenerate after schema changes. Import from `@/lib/supabase/types` — never define manual interfaces that duplicate the generated types.
