-- Migration 004: Ensure notifications table has correct RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notifications' AND policyname = 'Users can read own notifications'
  ) THEN
    CREATE POLICY "Users can read own notifications"
      ON public.notifications FOR SELECT
      TO authenticated USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications'
  ) THEN
    CREATE POLICY "Users can update own notifications"
      ON public.notifications FOR UPDATE
      TO authenticated USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notifications' AND policyname = 'Service role can insert notifications'
  ) THEN
    CREATE POLICY "Service role can insert notifications"
      ON public.notifications FOR INSERT
      TO service_role WITH CHECK (true);
  END IF;
END $$;
