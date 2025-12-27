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

// GET /api/groceries - Get all grocery lists for a household
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('household_id')

    if (!householdId) {
      return NextResponse.json({ error: 'household_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('grocery_lists')
      .select(`
        *,
        grocery_list_items (
          *,
          ingredients (*)
        )
      `)
      .eq('household_id', householdId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching grocery lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grocery lists' },
      { status: 500 }
    )
  }
}

// POST /api/groceries - Create a new grocery list
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { household_id, name, meal_plan_id } = body

    if (!household_id) {
      return NextResponse.json({ error: 'household_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('grocery_lists')
      .insert({
        household_id,
        name: name || 'Shopping List',
        meal_plan_id: meal_plan_id || null,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating grocery list:', error)
    return NextResponse.json(
      { error: 'Failed to create grocery list' },
      { status: 500 }
    )
  }
}

// PUT /api/groceries - Update a grocery list
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('grocery_lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating grocery list:', error)
    return NextResponse.json(
      { error: 'Failed to update grocery list' },
      { status: 500 }
    )
  }
}

// DELETE /api/groceries - Delete a grocery list
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
      .from('grocery_lists')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting grocery list:', error)
    return NextResponse.json(
      { error: 'Failed to delete grocery list' },
      { status: 500 }
    )
  }
}
