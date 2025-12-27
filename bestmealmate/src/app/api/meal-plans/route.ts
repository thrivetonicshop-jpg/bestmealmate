import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { startOfWeek, format } from 'date-fns'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch meal plans and planned meals
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const weekStart = searchParams.get('weekStart')

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    // Get or create meal plan for the week
    const weekStartDate = weekStart || format(startOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd')

    let { data: mealPlan, error: planError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('household_id', householdId)
      .eq('week_start_date', weekStartDate)
      .single()

    if (planError && planError.code === 'PGRST116') {
      // No plan exists, create one
      const { data: newPlan, error: createError } = await supabase
        .from('meal_plans')
        .insert({
          household_id: householdId,
          week_start_date: weekStartDate,
        })
        .select()
        .single()

      if (createError) throw createError
      mealPlan = newPlan
    } else if (planError) {
      throw planError
    }

    // Fetch planned meals with recipes
    const { data: plannedMeals, error: mealsError } = await supabase
      .from('planned_meals')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('meal_plan_id', mealPlan.id)
      .order('meal_date')
      .order('meal_type')

    if (mealsError) throw mealsError

    return NextResponse.json({ mealPlan, plannedMeals })
  } catch (error: any) {
    console.error('Meal Plans GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Add a planned meal
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { mealPlanId, recipeId, recipeName, mealDate, mealType, servings, notes } = body

    if (!mealPlanId || !mealDate || !mealType) {
      return NextResponse.json({ error: 'Meal plan ID, date, and type required' }, { status: 400 })
    }

    let finalRecipeId = recipeId

    // If no recipe ID but we have a name, create a simple recipe
    if (!recipeId && recipeName) {
      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({ name: recipeName })
        .select()
        .single()

      if (recipeError) throw recipeError
      finalRecipeId = newRecipe.id
    }

    const { data, error } = await supabase
      .from('planned_meals')
      .insert({
        meal_plan_id: mealPlanId,
        recipe_id: finalRecipeId || null,
        meal_date: mealDate,
        meal_type: mealType,
        servings: servings || 4,
        notes: notes || null,
      })
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ plannedMeal: data })
  } catch (error: any) {
    console.error('Meal Plans POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update a planned meal
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { id, recipeId, status, servings, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Planned meal ID required' }, { status: 400 })
    }

    const updates: any = {}
    if (recipeId !== undefined) updates.recipe_id = recipeId
    if (status !== undefined) updates.status = status
    if (servings !== undefined) updates.servings = servings
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabase
      .from('planned_meals')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ plannedMeal: data })
  } catch (error: any) {
    console.error('Meal Plans PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove a planned meal
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Planned meal ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('planned_meals')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Meal Plans DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
