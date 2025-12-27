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

// GET /api/meal-plans - Get meal plans for a household
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('household_id')
    const weekStart = searchParams.get('week_start')

    if (!householdId) {
      return NextResponse.json({ error: 'household_id is required' }, { status: 400 })
    }

    let query = supabase
      .from('meal_plans')
      .select(`
        *,
        planned_meals (
          *,
          recipes (*)
        )
      `)
      .eq('household_id', householdId)
      .order('week_start_date', { ascending: false })

    if (weekStart) {
      query = query.eq('week_start_date', weekStart)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching meal plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    )
  }
}

// POST /api/meal-plans - Create a new meal plan
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { household_id, week_start_date } = body

    if (!household_id || !week_start_date) {
      return NextResponse.json(
        { error: 'household_id and week_start_date are required' },
        { status: 400 }
      )
    }

    // Check if meal plan already exists for this week
    const { data: existing } = await supabase
      .from('meal_plans')
      .select('id')
      .eq('household_id', household_id)
      .eq('week_start_date', week_start_date)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Meal plan already exists for this week', data: existing },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        household_id,
        week_start_date
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating meal plan:', error)
    return NextResponse.json(
      { error: 'Failed to create meal plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/meal-plans - Delete a meal plan
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
      .from('meal_plans')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting meal plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete meal plan' },
      { status: 500 }
    )
  }
}
