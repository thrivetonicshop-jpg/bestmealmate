-- BestMealMate Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HOUSEHOLDS
-- ============================================
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL DEFAULT 'My Household',
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'family')),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  preferred_grocery_store VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FAMILY MEMBERS
-- ============================================
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'child')),
  avatar_url TEXT,
  is_picky_eater BOOLEAN DEFAULT FALSE,
  calorie_goal INTEGER,
  protein_goal INTEGER,
  carb_goal INTEGER,
  fat_goal INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DIETARY RESTRICTIONS (per family member)
-- ============================================
CREATE TABLE dietary_restrictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  restriction_type VARCHAR(50) NOT NULL,
  -- Types: vegetarian, vegan, halal, kosher, keto, paleo, gluten_free, dairy_free, low_sodium, low_sugar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ALLERGIES (per family member)
-- ============================================
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  allergen VARCHAR(100) NOT NULL,
  -- Common: nuts, peanuts, dairy, eggs, shellfish, fish, soy, wheat, sesame
  severity VARCHAR(20) DEFAULT 'moderate' CHECK (severity IN ('mild', 'moderate', 'severe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FOOD DISLIKES (per family member)
-- ============================================
CREATE TABLE food_dislikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  food_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INGREDIENTS (master list)
-- ============================================
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  -- Categories: produce, meat, dairy, pantry, frozen, spices, condiments, grains, beverages
  default_unit VARCHAR(50),
  calories_per_unit DECIMAL(10,2),
  protein_per_unit DECIMAL(10,2),
  carbs_per_unit DECIMAL(10,2),
  fat_per_unit DECIMAL(10,2),
  barcode VARCHAR(100),
  image_url TEXT,
  avg_shelf_life_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PANTRY ITEMS (what's in the house)
-- ============================================
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit VARCHAR(50),
  location VARCHAR(50) DEFAULT 'pantry' CHECK (location IN ('fridge', 'freezer', 'pantry', 'spice_rack', 'other')),
  expiry_date DATE,
  added_date DATE DEFAULT CURRENT_DATE,
  is_staple BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RECIPES
-- ============================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  -- NULL household_id = system recipe, available to all
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cuisine VARCHAR(100),
  meal_type VARCHAR(50) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  total_time_minutes INTEGER,
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  servings INTEGER DEFAULT 4,
  calories_per_serving INTEGER,
  protein_per_serving INTEGER,
  carbs_per_serving INTEGER,
  fat_per_serving INTEGER,
  image_url TEXT,
  source_url TEXT,
  is_kid_friendly BOOLEAN DEFAULT FALSE,
  is_batch_cook BOOLEAN DEFAULT FALSE,
  is_one_pot BOOLEAN DEFAULT FALSE,
  is_freezer_friendly BOOLEAN DEFAULT FALSE,
  is_quick_meal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RECIPE INGREDIENTS
-- ============================================
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50),
  notes VARCHAR(255),
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RECIPE STEPS
-- ============================================
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  timer_minutes INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RECIPE TAGS (for dietary compatibility)
-- ============================================
CREATE TABLE recipe_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  -- Tags: vegetarian, vegan, gluten_free, dairy_free, nut_free, keto, paleo, low_sodium, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEAL PLANS
-- ============================================
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PLANNED MEALS
-- ============================================
CREATE TABLE planned_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(50) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  servings INTEGER DEFAULT 4,
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'cooked', 'skipped')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEAL ATTENDEES (who's eating this meal)
-- ============================================
CREATE TABLE meal_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  planned_meal_id UUID REFERENCES planned_meals(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GROCERY LISTS
-- ============================================
CREATE TABLE grocery_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  name VARCHAR(255) DEFAULT 'Weekly Groceries',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'shopping', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GROCERY LIST ITEMS
-- ============================================
CREATE TABLE grocery_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grocery_list_id UUID REFERENCES grocery_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50),
  aisle VARCHAR(100),
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by UUID REFERENCES family_members(id) ON DELETE SET NULL,
  purchased_at TIMESTAMP WITH TIME ZONE,
  estimated_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GROCERY ITEM SOURCES (which recipes need this)
-- ============================================
CREATE TABLE grocery_item_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grocery_list_item_id UUID REFERENCES grocery_list_items(id) ON DELETE CASCADE,
  planned_meal_id UUID REFERENCES planned_meals(id) ON DELETE CASCADE,
  quantity_needed DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FAMILY RECIPE RATINGS
-- ============================================
CREATE TABLE recipe_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  cooked_count INTEGER DEFAULT 1,
  last_cooked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, recipe_id)
);

-- ============================================
-- WASTE TRACKING
-- ============================================
CREATE TABLE waste_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
  ingredient_name VARCHAR(255),
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  reason VARCHAR(100),
  -- Reasons: expired, spoiled, overcooked, didnt_like, too_much
  wasted_at DATE DEFAULT CURRENT_DATE,
  estimated_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_family_members_household ON family_members(household_id);
CREATE INDEX idx_pantry_items_household ON pantry_items(household_id);
CREATE INDEX idx_pantry_items_expiry ON pantry_items(expiry_date);
CREATE INDEX idx_recipes_meal_type ON recipes(meal_type);
CREATE INDEX idx_recipes_household ON recipes(household_id);
CREATE INDEX idx_planned_meals_date ON planned_meals(meal_date);
CREATE INDEX idx_planned_meals_plan ON planned_meals(meal_plan_id);
CREATE INDEX idx_grocery_list_items_list ON grocery_list_items(grocery_list_id);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_dislikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_item_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (users can only see their household data)
-- ============================================

-- Households: users can see households they belong to
CREATE POLICY "Users can view own household" ON households
  FOR SELECT USING (
    id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own household" ON households
  FOR UPDATE USING (
    id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Family members: users can see members in their household
CREATE POLICY "Users can view household members" ON family_members
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage household members" ON family_members
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Pantry items: household access
CREATE POLICY "Users can manage pantry" ON pantry_items
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Recipes: users can see system recipes (NULL household_id) and their own
CREATE POLICY "Users can view recipes" ON recipes
  FOR SELECT USING (
    household_id IS NULL OR
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own recipes" ON recipes
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Meal plans: household access
CREATE POLICY "Users can manage meal plans" ON meal_plans
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Grocery lists: household access
CREATE POLICY "Users can manage grocery lists" ON grocery_lists
  FOR ALL USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pantry_items_updated_at BEFORE UPDATE ON pantry_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_planned_meals_updated_at BEFORE UPDATE ON planned_meals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_grocery_lists_updated_at BEFORE UPDATE ON grocery_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_grocery_list_items_updated_at BEFORE UPDATE ON grocery_list_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_recipe_ratings_updated_at BEFORE UPDATE ON recipe_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED SOME COMMON INGREDIENTS
-- ============================================
INSERT INTO ingredients (name, category, default_unit, avg_shelf_life_days) VALUES
-- Produce
('Chicken Breast', 'meat', 'lb', 3),
('Ground Beef', 'meat', 'lb', 2),
('Salmon', 'meat', 'lb', 2),
('Eggs', 'dairy', 'dozen', 21),
('Milk', 'dairy', 'gallon', 7),
('Butter', 'dairy', 'stick', 30),
('Cheddar Cheese', 'dairy', 'oz', 21),
('Onion', 'produce', 'whole', 30),
('Garlic', 'produce', 'head', 14),
('Tomato', 'produce', 'whole', 7),
('Bell Pepper', 'produce', 'whole', 7),
('Broccoli', 'produce', 'head', 5),
('Carrots', 'produce', 'lb', 21),
('Spinach', 'produce', 'oz', 5),
('Lettuce', 'produce', 'head', 7),
('Potato', 'produce', 'lb', 21),
('Rice', 'grains', 'lb', 365),
('Pasta', 'grains', 'lb', 365),
('Bread', 'grains', 'loaf', 7),
('Olive Oil', 'pantry', 'bottle', 365),
('Salt', 'spices', 'container', 1825),
('Black Pepper', 'spices', 'container', 365),
('Garlic Powder', 'spices', 'container', 365),
('Cumin', 'spices', 'container', 365),
('Paprika', 'spices', 'container', 365),
('Soy Sauce', 'condiments', 'bottle', 365),
('Ketchup', 'condiments', 'bottle', 180),
('Mustard', 'condiments', 'bottle', 365),
('Chicken Broth', 'pantry', 'can', 365),
('Canned Tomatoes', 'pantry', 'can', 730),
('Black Beans', 'pantry', 'can', 730),
('Flour', 'pantry', 'lb', 365),
('Sugar', 'pantry', 'lb', 730),
('Honey', 'pantry', 'bottle', 730),
('Lemon', 'produce', 'whole', 14),
('Lime', 'produce', 'whole', 14),
('Avocado', 'produce', 'whole', 4),
('Banana', 'produce', 'whole', 5),
('Apple', 'produce', 'whole', 21);

-- ============================================
-- WEARABLE DEVICE CONNECTIONS
-- ============================================
CREATE TABLE wearable_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('apple_health', 'fitbit', 'garmin', 'google_fit', 'samsung_health')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_member_id, provider)
);

-- ============================================
-- HEALTH METRICS (from wearable devices)
-- ============================================
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  wearable_connection_id UUID REFERENCES wearable_connections(id) ON DELETE SET NULL,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN (
    'steps', 'calories_burned', 'active_minutes', 'heart_rate', 'heart_rate_resting',
    'sleep_hours', 'sleep_quality', 'weight', 'body_fat_percentage', 'water_intake',
    'distance_km', 'floors_climbed'
  )),
  value DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DAILY HEALTH SUMMARIES (aggregated data)
-- ============================================
CREATE TABLE daily_health_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  steps INTEGER,
  calories_burned INTEGER,
  active_minutes INTEGER,
  sleep_hours DECIMAL(4,2),
  avg_heart_rate INTEGER,
  resting_heart_rate INTEGER,
  water_intake_ml INTEGER,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_member_id, date)
);

-- Indexes for wearable tables
CREATE INDEX idx_wearable_connections_member ON wearable_connections(family_member_id);
CREATE INDEX idx_health_metrics_member ON health_metrics(family_member_id);
CREATE INDEX idx_health_metrics_recorded ON health_metrics(recorded_at);
CREATE INDEX idx_health_metrics_type ON health_metrics(metric_type);
CREATE INDEX idx_daily_health_summaries_member ON daily_health_summaries(family_member_id);
CREATE INDEX idx_daily_health_summaries_date ON daily_health_summaries(date);

-- RLS for wearable tables
ALTER TABLE wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health_summaries ENABLE ROW LEVEL SECURITY;

-- Policies for wearable connections
CREATE POLICY "Users can manage own wearable connections" ON wearable_connections
  FOR ALL USING (
    family_member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Policies for health metrics
CREATE POLICY "Users can manage own health metrics" ON health_metrics
  FOR ALL USING (
    family_member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Policies for daily health summaries
CREATE POLICY "Users can manage own health summaries" ON daily_health_summaries
  FOR ALL USING (
    family_member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_wearable_connections_updated_at BEFORE UPDATE ON wearable_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_daily_health_summaries_updated_at BEFORE UPDATE ON daily_health_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SUPABASE STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase Dashboard > Storage

-- Create storage buckets (run in SQL Editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('food-scans', 'food-scans', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('recipes', 'recipes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-plans', 'meal-plans', true);

-- Storage policies for food-scans bucket
CREATE POLICY "Users can upload food scans" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'food-scans' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view food scans" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'food-scans'
  );

CREATE POLICY "Users can delete own food scans" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'food-scans' AND
    auth.uid() IS NOT NULL
  );

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars'
  );

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

-- Storage policies for recipes bucket
CREATE POLICY "Users can upload recipe images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipes' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view recipe images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'recipes'
  );

CREATE POLICY "Users can update recipe images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipes' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete recipe images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipes' AND
    auth.uid() IS NOT NULL
  );

-- Storage policies for meal-plans bucket
CREATE POLICY "Users can upload meal plan images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'meal-plans' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view meal plan images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'meal-plans'
  );

CREATE POLICY "Users can update meal plan images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'meal-plans' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete meal plan images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'meal-plans' AND
    auth.uid() IS NOT NULL
  );

-- ============================================
-- EMAIL SUBSCRIBERS (for marketing/newsletter)
-- ============================================
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  source VARCHAR(100) DEFAULT 'landing_page',
  -- Sources: landing_page, onboarding, settings, referral, popup
  is_verified BOOLEAN DEFAULT FALSE,
  is_subscribed BOOLEAN DEFAULT TRUE,
  verification_token UUID DEFAULT uuid_generate_v4(),
  verified_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{"weekly_tips": true, "new_features": true, "promotions": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_verified ON email_subscribers(is_verified);

-- ============================================
-- USER PREFERENCES & MEMORY (remember user info)
-- ============================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  -- UI Preferences
  theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(10) DEFAULT 'en',
  -- Meal Preferences
  favorite_cuisines TEXT[] DEFAULT '{}',
  cooking_skill_level VARCHAR(20) DEFAULT 'intermediate' CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')),
  max_prep_time_minutes INTEGER DEFAULT 60,
  default_servings INTEGER DEFAULT 4,
  prefer_batch_cooking BOOLEAN DEFAULT FALSE,
  prefer_one_pot_meals BOOLEAN DEFAULT FALSE,
  -- Shopping Preferences
  preferred_grocery_stores TEXT[] DEFAULT '{}',
  budget_per_week DECIMAL(10,2),
  prefer_organic BOOLEAN DEFAULT FALSE,
  prefer_local BOOLEAN DEFAULT FALSE,
  -- AI Memory (what the AI remembers about the user)
  ai_memory JSONB DEFAULT '{}'::jsonb,
  -- Example: {"last_meal_request": "quick weeknight dinners", "cooking_style": "simple", "flavor_preferences": ["spicy", "savory"]}
  -- Notification Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  meal_reminder_time TIME DEFAULT '17:00',
  grocery_reminder_day INTEGER DEFAULT 0, -- 0 = Sunday
  -- Last Activity
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_meal_plan_at TIMESTAMP WITH TIME ZONE,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_household ON user_preferences(household_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AI GENERATED MEALS (save generated meal suggestions)
-- ============================================
CREATE TABLE ai_generated_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Meal Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meal_type VARCHAR(50) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'any')),
  cuisine VARCHAR(100),
  prep_time VARCHAR(50),
  cook_time VARCHAR(50),
  total_time VARCHAR(50),
  servings INTEGER DEFAULT 4,
  -- Ingredients & Instructions
  ingredients JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"name": "chicken", "amount": "1 lb", "notes": "boneless"}]
  instructions JSONB DEFAULT '[]'::jsonb,
  -- Example: ["Preheat oven to 400°F", "Season chicken..."]
  -- Nutrition
  calories_per_serving INTEGER,
  protein_per_serving INTEGER,
  carbs_per_serving INTEGER,
  fat_per_serving INTEGER,
  -- AI Context
  prompt_used TEXT,
  dietary_restrictions TEXT[] DEFAULT '{}',
  pantry_items_used TEXT[] DEFAULT '{}',
  -- User Feedback
  is_saved BOOLEAN DEFAULT FALSE,
  is_cooked BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  cooked_at TIMESTAMP WITH TIME ZONE,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_generated_meals_household ON ai_generated_meals(household_id);
CREATE INDEX idx_ai_generated_meals_user ON ai_generated_meals(user_id);
CREATE INDEX idx_ai_generated_meals_saved ON ai_generated_meals(is_saved);
CREATE INDEX idx_ai_generated_meals_created ON ai_generated_meals(created_at);

ALTER TABLE ai_generated_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generated meals" ON ai_generated_meals
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert generated meals" ON ai_generated_meals
  FOR INSERT WITH CHECK (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own generated meals" ON ai_generated_meals
  FOR UPDATE USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own generated meals" ON ai_generated_meals
  FOR DELETE USING (
    household_id IN (
      SELECT household_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE TRIGGER update_ai_generated_meals_updated_at BEFORE UPDATE ON ai_generated_meals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- USER PROFILE BACKUPS (stores complete profile snapshots)
-- ============================================
CREATE TABLE user_profile_backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  -- Backup Data
  backup_data JSONB NOT NULL,
  -- Contains: household info, family members, dietary restrictions, allergies, preferences
  backup_type VARCHAR(50) DEFAULT 'auto' CHECK (backup_type IN ('auto', 'manual', 'before_delete')),
  backup_size_bytes INTEGER,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profile_backups_user ON user_profile_backups(user_id);
CREATE INDEX idx_user_profile_backups_created ON user_profile_backups(created_at);

ALTER TABLE user_profile_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own backups" ON user_profile_backups
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- LOGIN HISTORY (track user logins for security)
-- ============================================
CREATE TABLE login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  login_method VARCHAR(50) DEFAULT 'email',
  -- Methods: email, google, apple, magic_link
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(50),
  -- Types: mobile, tablet, desktop
  browser VARCHAR(100),
  os VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100),
  is_successful BOOLEAN DEFAULT TRUE,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_created ON login_history(created_at);
CREATE INDEX idx_login_history_email ON login_history(email);

ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own login history" ON login_history
  FOR SELECT USING (user_id = auth.uid());

-- Insert policy for login tracking (allow inserts during auth)
CREATE POLICY "Allow login tracking" ON login_history
  FOR INSERT WITH CHECK (true);
