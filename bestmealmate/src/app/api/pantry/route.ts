import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch pantry items for a household
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('pantry_items')
      .select(`
        *,
        ingredient:ingredients(*)
      `)
      .eq('household_id', householdId)
      .order('expiry_date', { ascending: true, nullsFirst: false })

    if (error) throw error

    return NextResponse.json({ items: data })
  } catch (error: any) {
    console.error('Pantry GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Add a pantry item
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { householdId, ingredientId, ingredientName, quantity, unit, location, expiryDate, isStaple, notes } = body

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    let finalIngredientId = ingredientId

    // If no ingredient ID but we have a name, create or find the ingredient
    if (!ingredientId && ingredientName) {
      // Try to find existing ingredient
      const { data: existingIngredient } = await supabase
        .from('ingredients')
        .select('id')
        .ilike('name', ingredientName)
        .single()

      if (existingIngredient) {
        finalIngredientId = existingIngredient.id
      } else {
        // Create new ingredient
        const { data: newIngredient, error: ingredientError } = await supabase
          .from('ingredients')
          .insert({ name: ingredientName })
          .select()
          .single()

        if (ingredientError) throw ingredientError
        finalIngredientId = newIngredient.id
      }
    }

    if (!finalIngredientId) {
      return NextResponse.json({ error: 'Ingredient required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('pantry_items')
      .insert({
        household_id: householdId,
        ingredient_id: finalIngredientId,
        quantity: quantity || 1,
        unit: unit || null,
        location: location || 'pantry',
        expiry_date: expiryDate || null,
        is_staple: isStaple || false,
        notes: notes || null,
      })
      .select(`
        *,
        ingredient:ingredients(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error: any) {
    console.error('Pantry POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update a pantry item
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { id, quantity, unit, location, expiryDate, isStaple, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const updates: any = {}
    if (quantity !== undefined) updates.quantity = quantity
    if (unit !== undefined) updates.unit = unit
    if (location !== undefined) updates.location = location
    if (expiryDate !== undefined) updates.expiry_date = expiryDate
    if (isStaple !== undefined) updates.is_staple = isStaple
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabase
      .from('pantry_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        ingredient:ingredients(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error: any) {
    console.error('Pantry PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove a pantry item
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('pantry_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Pantry DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
