-- Migration 001: Create ai_strategies table with seed data
CREATE TABLE IF NOT EXISTS public.ai_strategies (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  slug                  text NOT NULL UNIQUE,
  description           text,
  win_rate              numeric(4,3) NOT NULL,
  risk_per_trade        numeric(4,3) NOT NULL,
  trades_per_cycle_min  integer NOT NULL DEFAULT 2,
  trades_per_cycle_max  integer NOT NULL DEFAULT 4,
  closes_per_cycle_min  integer NOT NULL DEFAULT 1,
  closes_per_cycle_max  integer NOT NULL DEFAULT 3,
  created_at            timestamptz DEFAULT now()
);

ALTER TABLE public.ai_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read strategies"
  ON public.ai_strategies FOR SELECT
  TO authenticated USING (true);

INSERT INTO public.ai_strategies
  (name, slug, description, win_rate, risk_per_trade, trades_per_cycle_min, trades_per_cycle_max, closes_per_cycle_min, closes_per_cycle_max)
VALUES
  ('Conservative', 'conservative', 'Lower risk, steady growth. Smaller position sizes with disciplined targets.',   0.620, 0.010, 1, 2, 1, 2),
  ('Balanced',     'balanced',     'Optimal risk-reward balance across multiple asset classes. Recommended.',         0.720, 0.015, 2, 4, 1, 3),
  ('Aggressive',   'aggressive',   'Maximum growth potential. Higher frequency and position sizes for active markets.', 0.800, 0.025, 3, 5, 2, 4)
ON CONFLICT (slug) DO NOTHING;
