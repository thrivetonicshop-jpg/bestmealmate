import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

function getSupabase(authHeader: string | null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {}
    }
  })
}

// GET /api/recipes - Get recipes (system + household)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('household_id')
    const mealType = searchParams.get('meal_type')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const quickMealsOnly = searchParams.get('quick_meals') === 'true'
    const kidFriendlyOnly = searchParams.get('kid_friendly') === 'true'

    let query = supabase
      .from('recipes')
      .select('*')
      .order('name')

    // Get system recipes (null household_id) and household recipes
    if (householdId) {
      query = query.or(`household_id.is.null,household_id.eq.${householdId}`)
    } else {
      query = query.is('household_id', null)
    }

    if (mealType && ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'].includes(mealType)) {
      query = query.eq('meal_type', mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert')
    }

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      query = query.eq('difficulty', difficulty as 'easy' | 'medium' | 'hard')
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (quickMealsOnly) {
      query = query.eq('is_quick_meal', true)
    }

    if (kidFriendlyOnly) {
      query = query.eq('is_kid_friendly', true)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const {
      household_id,
      name,
      description,
      cuisine,
      meal_type,
      prep_time_minutes,
      cook_time_minutes,
      difficulty,
      servings,
      image_url,
      source_url,
      is_kid_friendly,
      is_batch_cook,
      is_one_pot,
      is_freezer_friendly,
      is_quick_meal
    } = body

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const totalTime = (prep_time_minutes || 0) + (cook_time_minutes || 0)

    const { data, error } = await supabase
      .from('recipes')
      .insert({
        household_id: household_id || null,
        name,
        description: description || null,
        cuisine: cuisine || null,
        meal_type: meal_type || null,
        prep_time_minutes: prep_time_minutes || null,
        cook_time_minutes: cook_time_minutes || null,
        total_time_minutes: totalTime || null,
        difficulty: difficulty || 'medium',
        servings: servings || 4,
        image_url: image_url || null,
        source_url: source_url || null,
        is_kid_friendly: is_kid_friendly || false,
        is_batch_cook: is_batch_cook || false,
        is_one_pot: is_one_pot || false,
        is_freezer_friendly: is_freezer_friendly || false,
        is_quick_meal: is_quick_meal || totalTime <= 30
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}

// PUT /api/recipes - Update a recipe
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Recalculate total time if times are updated
    if (updates.prep_time_minutes !== undefined || updates.cook_time_minutes !== undefined) {
      const { data: existing } = await supabase
        .from('recipes')
        .select('prep_time_minutes, cook_time_minutes')
        .eq('id', id)
        .single()

      const prepTime = updates.prep_time_minutes ?? existing?.prep_time_minutes ?? 0
      const cookTime = updates.cook_time_minutes ?? existing?.cook_time_minutes ?? 0
      updates.total_time_minutes = prepTime + cookTime
    }

    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes - Delete a recipe
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}
