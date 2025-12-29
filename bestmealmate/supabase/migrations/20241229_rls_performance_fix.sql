-- =============================================
-- RLS Performance Fixes for BestMealMate
-- Run this in Supabase SQL Editor
-- =============================================
-- Issue: auth.function() re-evaluates for each row
-- Fix: Wrap in (select auth.function()) for single evaluation

-- 1. Fix recipes table policies
DROP POLICY IF EXISTS "Users can view own recipes" ON public.recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.recipes;

CREATE POLICY "Users can view own recipes" ON public.recipes
  FOR SELECT
  USING (household_id IN (
    SELECT household_id FROM public.family_members
    WHERE user_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can insert own recipes" ON public.recipes
  FOR INSERT
  WITH CHECK (household_id IN (
    SELECT household_id FROM public.family_members
    WHERE user_id = (SELECT auth.uid())
  ));

-- 2. Fix email_subscribers table policies
DROP POLICY IF EXISTS "Service role can manage subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Service role can update subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Service role can delete subscribers" ON public.email_subscribers;

CREATE POLICY "Service role can manage subscribers" ON public.email_subscribers
  FOR SELECT
  USING ((SELECT auth.role()) = 'service_role');

CREATE POLICY "Service role can update subscribers" ON public.email_subscribers
  FOR UPDATE
  USING ((SELECT auth.role()) = 'service_role');

CREATE POLICY "Service role can delete subscribers" ON public.email_subscribers
  FOR DELETE
  USING ((SELECT auth.role()) = 'service_role');

-- Keep the insert policy for public signups (no auth check needed)
-- This one is fine as-is since it uses WITH CHECK (true)
