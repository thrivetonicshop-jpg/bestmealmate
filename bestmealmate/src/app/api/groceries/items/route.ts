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

// POST /api/groceries/items - Add item to grocery list
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { grocery_list_id, ingredient_id, quantity, unit, aisle, notes } = body

    if (!grocery_list_id || !ingredient_id) {
      return NextResponse.json(
        { error: 'grocery_list_id and ingredient_id are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('grocery_list_items')
      .insert({
        grocery_list_id,
        ingredient_id,
        quantity: quantity || 1,
        unit: unit || null,
        aisle: aisle || null,
        notes: notes || null,
        is_purchased: false
      })
      .select(`
        *,
        ingredients (*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error adding grocery item:', error)
    return NextResponse.json(
      { error: 'Failed to add grocery item' },
      { status: 500 }
    )
  }
}

// PUT /api/groceries/items - Update grocery item (toggle purchased, etc.)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // If marking as purchased, set purchased_at
    if (updates.is_purchased === true) {
      updates.purchased_at = new Date().toISOString()
    } else if (updates.is_purchased === false) {
      updates.purchased_at = null
    }

    const { data, error } = await supabase
      .from('grocery_list_items')
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
    console.error('Error updating grocery item:', error)
    return NextResponse.json(
      { error: 'Failed to update grocery item' },
      { status: 500 }
    )
  }
}

// DELETE /api/groceries/items - Delete grocery item
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
      .from('grocery_list_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting grocery item:', error)
    return NextResponse.json(
      { error: 'Failed to delete grocery item' },
      { status: 500 }
    )
  }
}
