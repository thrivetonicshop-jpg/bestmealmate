import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch recipes
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const search = searchParams.get('search')
    const mealType = searchParams.get('mealType')
    const difficulty = searchParams.get('difficulty')
    const recipeId = searchParams.get('id')

    // Fetch single recipe with full details
    if (recipeId) {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients:recipe_ingredients(
            *,
            ingredient:ingredients(*)
          ),
          recipe_steps:recipe_steps(*),
          recipe_tags:recipe_tags(*)
        `)
        .eq('id', recipeId)
        .single()

      if (recipeError) throw recipeError
      return NextResponse.json({ recipe })
    }

    // Build query for listing recipes
    let query = supabase
      .from('recipes')
      .select('*')
      .order('name')

    // Include system recipes (null household_id) and household-specific
    if (householdId) {
      query = query.or(`household_id.is.null,household_id.eq.${householdId}`)
    } else {
      query = query.is('household_id', null)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (mealType && mealType !== 'all') {
      query = query.eq('meal_type', mealType)
    }

    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query.limit(100)

    if (error) throw error

    return NextResponse.json({ recipes: data })
  } catch (error: any) {
    console.error('Recipes GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const {
      householdId,
      name,
      description,
      cuisine,
      mealType,
      prepTimeMinutes,
      cookTimeMinutes,
      difficulty,
      servings,
      caloriesPerServing,
      imageUrl,
      isKidFriendly,
      isBatchCook,
      isOnePot,
      isFreezerFriendly,
      isQuickMeal,
      ingredients,
      steps,
      tags
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Recipe name required' }, { status: 400 })
    }

    // Calculate total time
    const totalTimeMinutes = (prepTimeMinutes || 0) + (cookTimeMinutes || 0)

    // Create recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        household_id: householdId || null,
        name,
        description: description || null,
        cuisine: cuisine || null,
        meal_type: mealType || null,
        prep_time_minutes: prepTimeMinutes || null,
        cook_time_minutes: cookTimeMinutes || null,
        total_time_minutes: totalTimeMinutes || null,
        difficulty: difficulty || 'medium',
        servings: servings || 4,
        calories_per_serving: caloriesPerServing || null,
        image_url: imageUrl || null,
        is_kid_friendly: isKidFriendly || false,
        is_batch_cook: isBatchCook || false,
        is_one_pot: isOnePot || false,
        is_freezer_friendly: isFreezerFriendly || false,
        is_quick_meal: isQuickMeal || (totalTimeMinutes <= 30),
      })
      .select()
      .single()

    if (recipeError) throw recipeError

    // Add ingredients
    if (ingredients?.length > 0) {
      const ingredientInserts = ingredients.map((ing: any) => ({
        recipe_id: recipe.id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
        unit: ing.unit || null,
        notes: ing.notes || null,
        is_optional: ing.isOptional || false,
      }))

      await supabase.from('recipe_ingredients').insert(ingredientInserts)
    }

    // Add steps
    if (steps?.length > 0) {
      const stepInserts = steps.map((step: any, index: number) => ({
        recipe_id: recipe.id,
        step_number: index + 1,
        instruction: step.instruction,
        timer_minutes: step.timerMinutes || null,
      }))

      await supabase.from('recipe_steps').insert(stepInserts)
    }

    // Add tags
    if (tags?.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        recipe_id: recipe.id,
        tag,
      }))

      await supabase.from('recipe_tags').insert(tagInserts)
    }

    return NextResponse.json({ recipe })
  } catch (error: any) {
    console.error('Recipes POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update a recipe
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    const dbUpdates: any = {}
    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.cuisine !== undefined) dbUpdates.cuisine = updates.cuisine
    if (updates.mealType !== undefined) dbUpdates.meal_type = updates.mealType
    if (updates.prepTimeMinutes !== undefined) dbUpdates.prep_time_minutes = updates.prepTimeMinutes
    if (updates.cookTimeMinutes !== undefined) dbUpdates.cook_time_minutes = updates.cookTimeMinutes
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty
    if (updates.servings !== undefined) dbUpdates.servings = updates.servings
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl

    const { data, error } = await supabase
      .from('recipes')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ recipe: data })
  } catch (error: any) {
    console.error('Recipes PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove a recipe
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Recipe ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Recipes DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
