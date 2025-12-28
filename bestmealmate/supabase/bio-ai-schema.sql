-- ============================================
-- BIO-AI ARCHITECTURE DATABASE SCHEMA
-- Human-inspired AI system tables and functions
-- ============================================

-- ============================================
-- 🧠 AI MEMORIES (Brain module storage)
-- Stores short-term and long-term memories for AI decisions
-- ============================================
CREATE TABLE ai_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  -- Memory Properties
  type VARCHAR(20) NOT NULL CHECK (type IN ('short_term', 'long_term')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('preference', 'behavior', 'feedback', 'pattern')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  strength DECIMAL(3,2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  -- Timestamps
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_memories_user ON ai_memories(user_id);
CREATE INDEX idx_ai_memories_category ON ai_memories(category);
CREATE INDEX idx_ai_memories_strength ON ai_memories(strength DESC);
CREATE INDEX idx_ai_memories_type ON ai_memories(type);

ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own AI memories" ON ai_memories
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- 🍽️ NUTRITION LOGS (Digestive module storage)
-- Tracks digested food data and nutrition info
-- ============================================
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Food Info
  food_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  -- Nutrition Data
  nutrients JSONB DEFAULT '{}'::jsonb,
  -- Example: {"calories": 200, "protein": 25, "carbs": 0, "fat": 10, "fiber": 0, "vitamins": ["B12"], "minerals": ["Iron"]}
  freshness INTEGER CHECK (freshness >= 0 AND freshness <= 100),
  -- Metadata
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nutrition_logs_household ON nutrition_logs(household_id);
CREATE INDEX idx_nutrition_logs_logged ON nutrition_logs(logged_at);
CREATE INDEX idx_nutrition_logs_food ON nutrition_logs(food_name);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage household nutrition logs" ON nutrition_logs
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 🍽️ FOOD WASTE LOG (Digestive module waste tracking)
-- Tracks eliminated/expired food items
-- ============================================
CREATE TABLE food_waste_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  -- Item Info
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  reason VARCHAR(50) CHECK (reason IN ('expired', 'spoiled', 'too_much', 'didnt_like', 'other')),
  estimated_cost DECIMAL(10,2),
  -- Metadata
  eliminated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_food_waste_log_household ON food_waste_log(household_id);
CREATE INDEX idx_food_waste_log_eliminated ON food_waste_log(eliminated_at);

ALTER TABLE food_waste_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage household food waste" ON food_waste_log
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 🧬 BIO-AI SYSTEM LOGS (Overall system events)
-- Tracks all bio-AI system events
-- ============================================
CREATE TABLE bio_ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  -- Event Info
  event_type VARCHAR(100) NOT NULL,
  -- Types: system_event, health_check, memory_formed, thought_processed, digestion_complete, etc.
  data JSONB DEFAULT '{}'::jsonb,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bio_ai_logs_user ON bio_ai_logs(user_id);
CREATE INDEX idx_bio_ai_logs_event ON bio_ai_logs(event_type);
CREATE INDEX idx_bio_ai_logs_created ON bio_ai_logs(created_at);

ALTER TABLE bio_ai_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bio-AI logs" ON bio_ai_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert bio-AI logs" ON bio_ai_logs
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 🧬 NEURAL SIGNALS (Nervous system events)
-- Stores neural signals for analysis
-- ============================================
CREATE TABLE neural_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  -- Signal Info
  signal_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  source VARCHAR(100),
  payload JSONB DEFAULT '{}'::jsonb,
  -- Neuron Info
  neuron_type VARCHAR(20) CHECK (neuron_type IN ('sensory', 'motor', 'interneuron')),
  pathway TEXT[] DEFAULT '{}',
  strength DECIMAL(3,2) CHECK (strength >= 0 AND strength <= 1),
  -- Response
  was_processed BOOLEAN DEFAULT FALSE,
  response JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_neural_signals_user ON neural_signals(user_id);
CREATE INDEX idx_neural_signals_type ON neural_signals(signal_type);
CREATE INDEX idx_neural_signals_priority ON neural_signals(priority);
CREATE INDEX idx_neural_signals_created ON neural_signals(created_at);

ALTER TABLE neural_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own neural signals" ON neural_signals
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- ❤️ CIRCULATION EVENTS (Heart module events)
-- Stores data flow events
-- ============================================
CREATE TABLE circulation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  -- Event Info
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('pantry_update', 'family_change', 'meal_plan', 'grocery_update')),
  source VARCHAR(100),
  payload JSONB DEFAULT '{}'::jsonb,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_circulation_events_household ON circulation_events(household_id);
CREATE INDEX idx_circulation_events_type ON circulation_events(event_type);
CREATE INDEX idx_circulation_events_created ON circulation_events(created_at);

ALTER TABLE circulation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view household circulation events" ON circulation_events
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert circulation events" ON circulation_events
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 🫁 API BREATH LOGS (Lungs module tracking)
-- Stores API request/response cycles
-- ============================================
CREATE TABLE api_breath_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Breath Info
  breath_type VARCHAR(10) CHECK (breath_type IN ('inhale', 'exhale')),
  endpoint VARCHAR(255) NOT NULL,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_breath_logs_user ON api_breath_logs(user_id);
CREATE INDEX idx_api_breath_logs_endpoint ON api_breath_logs(endpoint);
CREATE INDEX idx_api_breath_logs_created ON api_breath_logs(created_at);

ALTER TABLE api_breath_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API logs" ON api_breath_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert API logs" ON api_breath_logs
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 🧬 SYNAPTIC CONNECTIONS (Learning patterns)
-- Stores learned connections between concepts
-- ============================================
CREATE TABLE synaptic_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Connection Info
  pre_concept VARCHAR(255) NOT NULL, -- Source concept
  post_concept VARCHAR(255) NOT NULL, -- Target concept
  connection_type VARCHAR(20) CHECK (connection_type IN ('excitatory', 'inhibitory')),
  strength DECIMAL(3,2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  -- Metadata
  times_activated INTEGER DEFAULT 1,
  last_activated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pre_concept, post_concept)
);

CREATE INDEX idx_synaptic_connections_user ON synaptic_connections(user_id);
CREATE INDEX idx_synaptic_connections_pre ON synaptic_connections(pre_concept);
CREATE INDEX idx_synaptic_connections_strength ON synaptic_connections(strength DESC);

ALTER TABLE synaptic_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own synaptic connections" ON synaptic_connections
  FOR ALL USING (user_id = auth.uid());

CREATE TRIGGER update_synaptic_connections_updated_at
  BEFORE UPDATE ON synaptic_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SUPABASE STORAGE BUCKET FOR BIO-AI STATES
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('bio-ai-states', 'bio-ai-states', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for bio-AI states
CREATE POLICY "Users can upload bio-AI states" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'bio-ai-states' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view own bio-AI states" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'bio-ai-states' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own bio-AI states" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'bio-ai-states' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete own bio-AI states" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'bio-ai-states' AND
    auth.uid() IS NOT NULL
  );

-- ============================================
-- DATABASE FUNCTIONS FOR BIO-AI
-- ============================================

-- Function: Strengthen memory based on access
CREATE OR REPLACE FUNCTION strengthen_memory(memory_id UUID, boost DECIMAL DEFAULT 0.1)
RETURNS void AS $$
BEGIN
  UPDATE ai_memories
  SET
    strength = LEAST(1.0, strength + boost),
    last_accessed = NOW()
  WHERE id = memory_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Decay unused memories (run periodically)
CREATE OR REPLACE FUNCTION decay_memories()
RETURNS INTEGER AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  WITH decayed AS (
    UPDATE ai_memories
    SET strength = GREATEST(0.0, strength - 0.01)
    WHERE last_accessed < NOW() - INTERVAL '7 days'
      AND type = 'short_term'
    RETURNING id
  )
  SELECT COUNT(*) INTO affected_count FROM decayed;

  -- Delete memories with 0 strength
  DELETE FROM ai_memories WHERE strength = 0;

  RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get strongest memories for user
CREATE OR REPLACE FUNCTION get_strongest_memories(
  p_user_id UUID,
  p_category VARCHAR DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  category VARCHAR,
  content JSONB,
  strength DECIMAL,
  last_accessed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.category,
    m.content,
    m.strength,
    m.last_accessed
  FROM ai_memories m
  WHERE m.user_id = p_user_id
    AND (p_category IS NULL OR m.category = p_category)
  ORDER BY m.strength DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Strengthen synaptic connection (learning)
CREATE OR REPLACE FUNCTION strengthen_synapse(
  p_user_id UUID,
  p_pre_concept VARCHAR,
  p_post_concept VARCHAR,
  p_boost DECIMAL DEFAULT 0.05
)
RETURNS void AS $$
BEGIN
  INSERT INTO synaptic_connections (user_id, pre_concept, post_concept, strength, connection_type)
  VALUES (p_user_id, p_pre_concept, p_post_concept, 0.5, 'excitatory')
  ON CONFLICT (user_id, pre_concept, post_concept)
  DO UPDATE SET
    strength = LEAST(1.0, synaptic_connections.strength + p_boost),
    times_activated = synaptic_connections.times_activated + 1,
    last_activated = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get related concepts via synaptic connections
CREATE OR REPLACE FUNCTION get_related_concepts(
  p_user_id UUID,
  p_concept VARCHAR,
  p_min_strength DECIMAL DEFAULT 0.3
)
RETURNS TABLE (
  related_concept VARCHAR,
  connection_strength DECIMAL,
  connection_type VARCHAR,
  times_used INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.post_concept,
    s.strength,
    s.connection_type,
    s.times_activated
  FROM synaptic_connections s
  WHERE s.user_id = p_user_id
    AND s.pre_concept = p_concept
    AND s.strength >= p_min_strength
  ORDER BY s.strength DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Calculate daily nutrition summary
CREATE OR REPLACE FUNCTION calculate_daily_nutrition(
  p_household_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_calories INTEGER,
  total_protein INTEGER,
  total_carbs INTEGER,
  total_fat INTEGER,
  total_fiber INTEGER,
  food_count INTEGER,
  avg_freshness INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM((n.nutrients->>'calories')::INTEGER), 0)::INTEGER as total_calories,
    COALESCE(SUM((n.nutrients->>'protein')::INTEGER), 0)::INTEGER as total_protein,
    COALESCE(SUM((n.nutrients->>'carbs')::INTEGER), 0)::INTEGER as total_carbs,
    COALESCE(SUM((n.nutrients->>'fat')::INTEGER), 0)::INTEGER as total_fat,
    COALESCE(SUM((n.nutrients->>'fiber')::INTEGER), 0)::INTEGER as total_fiber,
    COUNT(*)::INTEGER as food_count,
    COALESCE(AVG(n.freshness)::INTEGER, 0) as avg_freshness
  FROM nutrition_logs n
  WHERE n.household_id = p_household_id
    AND DATE(n.logged_at) = p_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get waste reduction insights
CREATE OR REPLACE FUNCTION get_waste_insights(
  p_household_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  item_name VARCHAR,
  waste_count BIGINT,
  total_wasted DECIMAL,
  common_reason VARCHAR,
  estimated_loss DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.item_name,
    COUNT(*) as waste_count,
    SUM(w.quantity) as total_wasted,
    MODE() WITHIN GROUP (ORDER BY w.reason) as common_reason,
    SUM(COALESCE(w.estimated_cost, 0)) as estimated_loss
  FROM food_waste_log w
  WHERE w.household_id = p_household_id
    AND w.eliminated_at > NOW() - (p_days || ' days')::INTERVAL
  GROUP BY w.item_name
  ORDER BY waste_count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log bio-AI system health
CREATE OR REPLACE FUNCTION log_bio_ai_health(
  p_user_id UUID,
  p_household_id UUID,
  p_health_data JSONB
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO bio_ai_logs (user_id, household_id, event_type, data)
  VALUES (p_user_id, p_household_id, 'health_check', p_health_data)
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get bio-AI system stats
CREATE OR REPLACE FUNCTION get_bio_ai_stats(p_user_id UUID)
RETURNS TABLE (
  total_memories BIGINT,
  strong_memories BIGINT,
  synapse_count BIGINT,
  recent_signals BIGINT,
  api_success_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM ai_memories WHERE user_id = p_user_id) as total_memories,
    (SELECT COUNT(*) FROM ai_memories WHERE user_id = p_user_id AND strength > 0.7) as strong_memories,
    (SELECT COUNT(*) FROM synaptic_connections WHERE user_id = p_user_id) as synapse_count,
    (SELECT COUNT(*) FROM neural_signals WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '24 hours') as recent_signals,
    (SELECT
      CASE WHEN COUNT(*) > 0
        THEN (SUM(CASE WHEN success THEN 1 ELSE 0 END)::DECIMAL / COUNT(*) * 100)
        ELSE 100
      END
     FROM api_breath_logs
     WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '24 hours'
    ) as api_success_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SCHEDULED JOBS (for automated maintenance)
-- Run these via Supabase Edge Functions or external cron
-- ============================================

-- Example: Daily memory decay job
-- CALL decay_memories();  -- Run daily

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- Enable realtime for bio-AI tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE ai_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE neural_signals;
ALTER PUBLICATION supabase_realtime ADD TABLE circulation_events;
