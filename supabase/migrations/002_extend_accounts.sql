-- Migration 002: Add AI trading columns to accounts table
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS strategy_id    uuid REFERENCES public.ai_strategies(id),
  ADD COLUMN IF NOT EXISTS ai_active      boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS total_profit   numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_trades   integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS winning_trades integer NOT NULL DEFAULT 0;

-- Default all existing accounts to the balanced strategy
UPDATE public.accounts
SET strategy_id = (SELECT id FROM public.ai_strategies WHERE slug = 'balanced')
WHERE strategy_id IS NULL;

-- Allow service role to update account balances (used by cron)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'accounts' AND policyname = 'Service role can update accounts'
  ) THEN
    CREATE POLICY "Service role can update accounts"
      ON public.accounts FOR UPDATE
      TO service_role USING (true);
  END IF;
END $$;
