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

// GET /api/pantry - Get all pantry items for a household
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
      .from('pantry_items')
      .select(`
        *,
        ingredients (*)
      `)
      .eq('household_id', householdId)
      .order('expiry_date', { ascending: true, nullsFirst: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching pantry items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pantry items' },
      { status: 500 }
    )
  }
}

// POST /api/pantry - Add a new pantry item
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { household_id, ingredient_id, quantity, unit, location, expiry_date, is_staple, notes } = body

    if (!household_id || !ingredient_id) {
      return NextResponse.json(
        { error: 'household_id and ingredient_id are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('pantry_items')
      .insert({
        household_id,
        ingredient_id,
        quantity: quantity || 1,
        unit: unit || null,
        location: location || 'pantry',
        expiry_date: expiry_date || null,
        is_staple: is_staple || false,
        notes: notes || null
      })
      .select(`
        *,
        ingredients (*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error adding pantry item:', error)
    return NextResponse.json(
      { error: 'Failed to add pantry item' },
      { status: 500 }
    )
  }
}

// PUT /api/pantry - Update a pantry item
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
      .from('pantry_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        ingredients (*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating pantry item:', error)
    return NextResponse.json(
      { error: 'Failed to update pantry item' },
      { status: 500 }
    )
  }
}

// DELETE /api/pantry - Delete a pantry item
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
      .from('pantry_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pantry item:', error)
    return NextResponse.json(
      { error: 'Failed to delete pantry item' },
      { status: 500 }
    )
  }
}
