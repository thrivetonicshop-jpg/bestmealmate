-- Add usage tracking and subscription details to households table
-- Run this in Supabase SQL Editor

-- Add new columns to households
ALTER TABLE households ADD COLUMN IF NOT EXISTS ai_suggestions_this_week INTEGER DEFAULT 0;
ALTER TABLE households ADD COLUMN IF NOT EXISTS ai_suggestions_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE households ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE households ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete'));

-- Create index for usage tracking
CREATE INDEX IF NOT EXISTS idx_households_ai_reset ON households(ai_suggestions_reset_at);

-- Function to reset weekly AI suggestion count
CREATE OR REPLACE FUNCTION reset_weekly_ai_suggestions()
RETURNS TRIGGER AS $$
BEGIN
  -- If it's been more than 7 days since last reset, reset the counter
  IF NEW.ai_suggestions_reset_at IS NULL OR
     NEW.ai_suggestions_reset_at < NOW() - INTERVAL '7 days' THEN
    NEW.ai_suggestions_this_week := 0;
    NEW.ai_suggestions_reset_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment AI usage
CREATE OR REPLACE FUNCTION increment_ai_usage(household_uuid UUID)
RETURNS TABLE(allowed BOOLEAN, current_count INTEGER, max_allowed INTEGER, tier VARCHAR) AS $$
DECLARE
  h_record RECORD;
  limit_count INTEGER;
BEGIN
  -- Get household info
  SELECT * INTO h_record FROM households WHERE id = household_uuid;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 0, 'unknown'::VARCHAR;
    RETURN;
  END IF;

  -- Check if week needs reset
  IF h_record.ai_suggestions_reset_at IS NULL OR
     h_record.ai_suggestions_reset_at < NOW() - INTERVAL '7 days' THEN
    UPDATE households
    SET ai_suggestions_this_week = 0,
        ai_suggestions_reset_at = NOW()
    WHERE id = household_uuid;
    h_record.ai_suggestions_this_week := 0;
  END IF;

  -- Determine limit based on tier
  CASE h_record.subscription_tier
    WHEN 'free' THEN limit_count := 5;
    WHEN 'premium' THEN limit_count := 999999; -- Unlimited
    WHEN 'family' THEN limit_count := 999999; -- Unlimited
    ELSE limit_count := 5;
  END CASE;

  -- Check if under limit
  IF h_record.ai_suggestions_this_week < limit_count THEN
    -- Increment counter
    UPDATE households
    SET ai_suggestions_this_week = ai_suggestions_this_week + 1
    WHERE id = household_uuid;

    RETURN QUERY SELECT TRUE, h_record.ai_suggestions_this_week + 1, limit_count, h_record.subscription_tier;
  ELSE
    RETURN QUERY SELECT FALSE, h_record.ai_suggestions_this_week, limit_count, h_record.subscription_tier;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get usage stats
CREATE OR REPLACE FUNCTION get_usage_stats(household_uuid UUID)
RETURNS TABLE(
  suggestions_used INTEGER,
  suggestions_limit INTEGER,
  reset_date TIMESTAMP WITH TIME ZONE,
  tier VARCHAR,
  trial_ends TIMESTAMP WITH TIME ZONE,
  status VARCHAR
) AS $$
DECLARE
  h_record RECORD;
  limit_count INTEGER;
BEGIN
  SELECT * INTO h_record FROM households WHERE id = household_uuid;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Check if week needs reset
  IF h_record.ai_suggestions_reset_at IS NULL OR
     h_record.ai_suggestions_reset_at < NOW() - INTERVAL '7 days' THEN
    h_record.ai_suggestions_this_week := 0;
    h_record.ai_suggestions_reset_at := NOW();
  END IF;

  -- Determine limit based on tier
  CASE h_record.subscription_tier
    WHEN 'free' THEN limit_count := 5;
    WHEN 'premium' THEN limit_count := -1; -- -1 means unlimited
    WHEN 'family' THEN limit_count := -1;
    ELSE limit_count := 5;
  END CASE;

  RETURN QUERY SELECT
    h_record.ai_suggestions_this_week,
    limit_count,
    h_record.ai_suggestions_reset_at + INTERVAL '7 days',
    h_record.subscription_tier,
    h_record.trial_ends_at,
    h_record.subscription_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
