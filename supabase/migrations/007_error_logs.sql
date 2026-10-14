-- ==============================================================================
-- Migration: 007_error_logs.sql
-- Lightweight Client and Server Error Logging Table (Free Tier Monitoring)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  user_agent TEXT,
  boundary TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated clients to log errors
DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;
CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view their own error logs
DROP POLICY IF EXISTS "Users can view own error logs" ON public.error_logs;
CREATE POLICY "Users can view own error logs"
  ON public.error_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Performance index for chronological queries
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at
  ON public.error_logs (created_at DESC);

-- Automatic cleanup trigger: Keep error log table under 10,000 rows to preserve Supabase free storage
CREATE OR REPLACE FUNCTION public.prune_old_error_logs()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.error_logs
  WHERE id IN (
    SELECT id FROM public.error_logs
    ORDER BY created_at DESC
    OFFSET 10000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prune_error_logs ON public.error_logs;
CREATE TRIGGER trigger_prune_error_logs
  AFTER INSERT ON public.error_logs
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.prune_old_error_logs();
