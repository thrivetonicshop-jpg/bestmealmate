export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          subscription_tier: 'free' | 'premium' | 'family'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          timezone: string
          preferred_grocery_store: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string
          subscription_tier?: 'free' | 'premium' | 'family'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          timezone?: string
          preferred_grocery_store?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subscription_tier?: 'free' | 'premium' | 'family'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          timezone?: string
          preferred_grocery_store?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          household_id: string
          user_id: string | null
          name: string
          age: number | null
          role: 'admin' | 'member' | 'child'
          avatar_url: string | null
          is_picky_eater: boolean
          calorie_goal: number | null
          protein_goal: number | null
          carb_goal: number | null
          fat_goal: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id?: string | null
          name: string
          age?: number | null
          role?: 'admin' | 'member' | 'child'
          avatar_url?: string | null
          is_picky_eater?: boolean
          calorie_goal?: number | null
          protein_goal?: number | null
          carb_goal?: number | null
          fat_goal?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          user_id?: string | null
          name?: string
          age?: number | null
          role?: 'admin' | 'member' | 'child'
          avatar_url?: string | null
          is_picky_eater?: boolean
          calorie_goal?: number | null
          protein_goal?: number | null
          carb_goal?: number | null
          fat_goal?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      dietary_restrictions: {
        Row: {
          id: string
          family_member_id: string
          restriction_type: string
          created_at: string
        }
        Insert: {
          id?: string
          family_member_id: string
          restriction_type: string
          created_at?: string
        }
        Update: {
          id?: string
          family_member_id?: string
          restriction_type?: string
          created_at?: string
        }
      }
      allergies: {
        Row: {
          id: string
          family_member_id: string
          allergen: string
          severity: 'mild' | 'moderate' | 'severe'
          created_at: string
        }
        Insert: {
          id?: string
          family_member_id: string
          allergen: string
          severity?: 'mild' | 'moderate' | 'severe'
          created_at?: string
        }
        Update: {
          id?: string
          family_member_id?: string
          allergen?: string
          severity?: 'mild' | 'moderate' | 'severe'
          created_at?: string
        }
      }
      food_dislikes: {
        Row: {
          id: string
          family_member_id: string
          food_name: string
          created_at: string
        }
        Insert: {
          id?: string
          family_member_id: string
          food_name: string
          created_at?: string
        }
        Update: {
          id?: string
          family_member_id?: string
          food_name?: string
          created_at?: string
        }
      }
      pantry_items: {
        Row: {
          id: string
          household_id: string
          ingredient_id: string
          quantity: number
          unit: string | null
          location: 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'
          expiry_date: string | null
          added_date: string
          is_staple: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          ingredient_id: string
          quantity?: number
          unit?: string | null
          location?: 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'
          expiry_date?: string | null
          added_date?: string
          is_staple?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string | null
          location?: 'fridge' | 'freezer' | 'pantry' | 'spice_rack' | 'other'
          expiry_date?: string | null
          added_date?: string
          is_staple?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          household_id: string | null
          name: string
          description: string | null
          cuisine: string | null
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null
          prep_time_minutes: number | null
          cook_time_minutes: number | null
          total_time_minutes: number | null
          difficulty: 'easy' | 'medium' | 'hard'
          servings: number
          calories_per_serving: number | null
          protein_per_serving: number | null
          carbs_per_serving: number | null
          fat_per_serving: number | null
          image_url: string | null
          source_url: string | null
          is_kid_friendly: boolean
          is_batch_cook: boolean
          is_one_pot: boolean
          is_freezer_friendly: boolean
          is_quick_meal: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id?: string | null
          name: string
          description?: string | null
          cuisine?: string | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          total_time_minutes?: number | null
          difficulty?: 'easy' | 'medium' | 'hard'
          servings?: number
          calories_per_serving?: number | null
          protein_per_serving?: number | null
          carbs_per_serving?: number | null
          fat_per_serving?: number | null
          image_url?: string | null
          source_url?: string | null
          is_kid_friendly?: boolean
          is_batch_cook?: boolean
          is_one_pot?: boolean
          is_freezer_friendly?: boolean
          is_quick_meal?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string | null
          name?: string
          description?: string | null
          cuisine?: string | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null
          prep_time_minutes?: number | null
          cook_time_minutes?: number | null
          total_time_minutes?: number | null
          difficulty?: 'easy' | 'medium' | 'hard'
          servings?: number
          calories_per_serving?: number | null
          protein_per_serving?: number | null
          carbs_per_serving?: number | null
          fat_per_serving?: number | null
          image_url?: string | null
          source_url?: string | null
          is_kid_friendly?: boolean
          is_batch_cook?: boolean
          is_one_pot?: boolean
          is_freezer_friendly?: boolean
          is_quick_meal?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          household_id: string
          week_start_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          week_start_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          week_start_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      planned_meals: {
        Row: {
          id: string
          meal_plan_id: string
          recipe_id: string | null
          meal_date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          servings: number
          status: 'planned' | 'cooked' | 'skipped'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          recipe_id?: string | null
          meal_date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          servings?: number
          status?: 'planned' | 'cooked' | 'skipped'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          recipe_id?: string | null
          meal_date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          servings?: number
          status?: 'planned' | 'cooked' | 'skipped'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grocery_lists: {
        Row: {
          id: string
          household_id: string
          meal_plan_id: string | null
          name: string
          status: 'active' | 'shopping' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          meal_plan_id?: string | null
          name?: string
          status?: 'active' | 'shopping' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          meal_plan_id?: string | null
          name?: string
          status?: 'active' | 'shopping' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      grocery_list_items: {
        Row: {
          id: string
          grocery_list_id: string
          ingredient_id: string
          quantity: number
          unit: string | null
          aisle: string | null
          is_purchased: boolean
          purchased_by: string | null
          purchased_at: string | null
          estimated_price: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          grocery_list_id: string
          ingredient_id: string
          quantity: number
          unit?: string | null
          aisle?: string | null
          is_purchased?: boolean
          purchased_by?: string | null
          purchased_at?: string | null
          estimated_price?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          grocery_list_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string | null
          aisle?: string | null
          is_purchased?: boolean
          purchased_by?: string | null
          purchased_at?: string | null
          estimated_price?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ingredients: {
        Row: {
          id: string
          name: string
          category: string | null
          default_unit: string | null
          calories_per_unit: number | null
          protein_per_unit: number | null
          carbs_per_unit: number | null
          fat_per_unit: number | null
          barcode: string | null
          image_url: string | null
          avg_shelf_life_days: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          default_unit?: string | null
          calories_per_unit?: number | null
          protein_per_unit?: number | null
          carbs_per_unit?: number | null
          fat_per_unit?: number | null
          barcode?: string | null
          image_url?: string | null
          avg_shelf_life_days?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          default_unit?: string | null
          calories_per_unit?: number | null
          protein_per_unit?: number | null
          carbs_per_unit?: number | null
          fat_per_unit?: number | null
          barcode?: string | null
          image_url?: string | null
          avg_shelf_life_days?: number | null
          created_at?: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit: string | null
          notes: string | null
          is_optional: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          unit?: string | null
          notes?: string | null
          is_optional?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          ingredient_id?: string
          quantity?: number
          unit?: string | null
          notes?: string | null
          is_optional?: boolean
          created_at?: string
        }
      }
      recipe_steps: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          instruction: string
          timer_minutes: number | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          instruction: string
          timer_minutes?: number | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          step_number?: number
          instruction?: string
          timer_minutes?: number | null
          image_url?: string | null
          created_at?: string
        }
      }
      recipe_tags: {
        Row: {
          id: string
          recipe_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          tag?: string
          created_at?: string
        }
      }
      meal_attendees: {
        Row: {
          id: string
          planned_meal_id: string
          family_member_id: string
          created_at: string
        }
        Insert: {
          id?: string
          planned_meal_id: string
          family_member_id: string
          created_at?: string
        }
        Update: {
          id?: string
          planned_meal_id?: string
          family_member_id?: string
          created_at?: string
        }
      }
      grocery_item_sources: {
        Row: {
          id: string
          grocery_list_item_id: string
          planned_meal_id: string
          quantity_needed: number | null
          created_at: string
        }
        Insert: {
          id?: string
          grocery_list_item_id: string
          planned_meal_id: string
          quantity_needed?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          grocery_list_item_id?: string
          planned_meal_id?: string
          quantity_needed?: number | null
          created_at?: string
        }
      }
      recipe_ratings: {
        Row: {
          id: string
          household_id: string
          recipe_id: string
          rating: number | null
          notes: string | null
          cooked_count: number
          last_cooked_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          recipe_id: string
          rating?: number | null
          notes?: string | null
          cooked_count?: number
          last_cooked_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          recipe_id?: string
          rating?: number | null
          notes?: string | null
          cooked_count?: number
          last_cooked_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      waste_log: {
        Row: {
          id: string
          household_id: string
          ingredient_id: string | null
          ingredient_name: string | null
          quantity: number | null
          unit: string | null
          reason: string | null
          wasted_at: string
          estimated_cost: number | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          ingredient_id?: string | null
          ingredient_name?: string | null
          quantity?: number | null
          unit?: string | null
          reason?: string | null
          wasted_at?: string
          estimated_cost?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          ingredient_id?: string | null
          ingredient_name?: string | null
          quantity?: number | null
          unit?: string | null
          reason?: string | null
          wasted_at?: string
          estimated_cost?: number | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Household = Database['public']['Tables']['households']['Row']
export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type Recipe = Database['public']['Tables']['recipes']['Row']
export type PantryItem = Database['public']['Tables']['pantry_items']['Row']
export type MealPlan = Database['public']['Tables']['meal_plans']['Row']
export type PlannedMeal = Database['public']['Tables']['planned_meals']['Row']
export type GroceryList = Database['public']['Tables']['grocery_lists']['Row']
export type GroceryListItem = Database['public']['Tables']['grocery_list_items']['Row']
export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type Allergy = Database['public']['Tables']['allergies']['Row']
export type DietaryRestriction = Database['public']['Tables']['dietary_restrictions']['Row']
export type FoodDislike = Database['public']['Tables']['food_dislikes']['Row']
