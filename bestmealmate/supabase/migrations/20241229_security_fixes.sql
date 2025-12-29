-- =============================================
-- Security Fixes for BestMealMate
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Enable RLS on email_subscribers table
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscribers;
DROP POLICY IF EXISTS "Service role can manage subscribers" ON public.email_subscribers;

-- Allow anyone to subscribe (insert their email)
CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only service role can view/update/delete subscribers (for admin/API use)
CREATE POLICY "Service role can manage subscribers" ON public.email_subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update subscribers" ON public.email_subscribers
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete subscribers" ON public.email_subscribers
  FOR DELETE
  USING (auth.role() = 'service_role');

-- 2. Fix update_updated_at function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================================
-- MANUAL STEP REQUIRED:
-- =============================================
-- For HaveIBeenPwned leaked password protection:
-- 1. Go to Supabase Dashboard
-- 2. Authentication → Providers → Email
-- 3. Enable "Protect against leaked passwords"
-- =============================================
