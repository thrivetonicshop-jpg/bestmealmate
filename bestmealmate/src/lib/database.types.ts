export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "family_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "dietary_restrictions_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "allergies_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "food_dislikes_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "pantry_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pantry_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "meal_plans_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "planned_meals_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "grocery_lists_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grocery_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "grocery_list_items_grocery_list_id_fkey"
            columns: ["grocery_list_id"]
            isOneToOne: false
            referencedRelation: "grocery_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grocery_list_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience type aliases
export type Household = Tables<'households'>
export type FamilyMember = Tables<'family_members'>
export type Recipe = Tables<'recipes'>
export type PantryItem = Tables<'pantry_items'>
export type MealPlan = Tables<'meal_plans'>
export type PlannedMeal = Tables<'planned_meals'>
export type GroceryList = Tables<'grocery_lists'>
export type GroceryListItem = Tables<'grocery_list_items'>
export type Ingredient = Tables<'ingredients'>
export type Allergy = Tables<'allergies'>
export type DietaryRestriction = Tables<'dietary_restrictions'>
export type FoodDislike = Tables<'food_dislikes'>
