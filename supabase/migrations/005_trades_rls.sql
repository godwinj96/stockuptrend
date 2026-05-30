-- Migration 005: Ensure trades table has correct RLS policies for cron + users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trades' AND policyname = 'Users can read own trades'
  ) THEN
    CREATE POLICY "Users can read own trades"
      ON public.trades FOR SELECT
      TO authenticated USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trades' AND policyname = 'Service role can insert trades'
  ) THEN
    CREATE POLICY "Service role can insert trades"
      ON public.trades FOR INSERT
      TO service_role WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trades' AND policyname = 'Service role can update trades'
  ) THEN
    CREATE POLICY "Service role can update trades"
      ON public.trades FOR UPDATE
      TO service_role USING (true);
  END IF;
END $$;
