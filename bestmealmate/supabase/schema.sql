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
