-- Migration 003: Create portfolio_snapshots table
CREATE TABLE IF NOT EXISTS public.portfolio_snapshots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id  uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  balance     numeric(12,2) NOT NULL,
  equity      numeric(12,2) NOT NULL,
  snapshot_at timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_user_id
  ON public.portfolio_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_account_id
  ON public.portfolio_snapshots(account_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_snapshot_at
  ON public.portfolio_snapshots(snapshot_at DESC);

ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own snapshots"
  ON public.portfolio_snapshots FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Service role can insert snapshots"
  ON public.portfolio_snapshots FOR INSERT
  TO service_role WITH CHECK (true);
