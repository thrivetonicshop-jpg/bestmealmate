import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch grocery lists and items
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const listId = searchParams.get('listId')

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    // Fetch lists
    const { data: lists, error: listsError } = await supabase
      .from('grocery_lists')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false })

    if (listsError) throw listsError

    // If specific list requested, fetch its items
    if (listId) {
      const { data: items, error: itemsError } = await supabase
        .from('grocery_list_items')
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .eq('grocery_list_id', listId)
        .order('is_purchased', { ascending: true })
        .order('aisle')
        .order('created_at')

      if (itemsError) throw itemsError

      return NextResponse.json({ lists, items })
    }

    // Get items for the most recent active list
    const activeList = lists?.find(l => l.status === 'active') || lists?.[0]
    let items: any[] = []

    if (activeList) {
      const { data: listItems, error: itemsError } = await supabase
        .from('grocery_list_items')
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .eq('grocery_list_id', activeList.id)
        .order('is_purchased', { ascending: true })
        .order('aisle')
        .order('created_at')

      if (itemsError) throw itemsError
      items = listItems || []
    }

    return NextResponse.json({ lists, items, currentList: activeList })
  } catch (error: any) {
    console.error('Groceries GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a grocery list or add item
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { action, householdId, listId, name, ingredientId, ingredientName, quantity, unit, aisle, notes } = body

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    // Create new list
    if (action === 'createList') {
      const { data, error } = await supabase
        .from('grocery_lists')
        .insert({
          household_id: householdId,
          name: name || 'Weekly Groceries',
          status: 'active',
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ list: data })
    }

    // Add item to list
    if (action === 'addItem') {
      if (!listId) {
        return NextResponse.json({ error: 'List ID required' }, { status: 400 })
      }

      let finalIngredientId = ingredientId

      // If no ingredient ID but we have a name, create or find the ingredient
      if (!ingredientId && ingredientName) {
        const { data: existingIngredient } = await supabase
          .from('ingredients')
          .select('id')
          .ilike('name', ingredientName)
          .single()

        if (existingIngredient) {
          finalIngredientId = existingIngredient.id
        } else {
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
        .from('grocery_list_items')
        .insert({
          grocery_list_id: listId,
          ingredient_id: finalIngredientId,
          quantity: quantity || 1,
          unit: unit || null,
          aisle: aisle || null,
          notes: notes || null,
        })
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .single()

      if (error) throw error
      return NextResponse.json({ item: data })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Groceries POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update grocery item or list
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { action, id, isPurchased, quantity, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    // Toggle item purchased
    if (action === 'toggleItem') {
      const { data, error } = await supabase
        .from('grocery_list_items')
        .update({
          is_purchased: isPurchased,
          purchased_at: isPurchased ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .single()

      if (error) throw error
      return NextResponse.json({ item: data })
    }

    // Update item quantity
    if (action === 'updateQuantity') {
      const { data, error } = await supabase
        .from('grocery_list_items')
        .update({ quantity })
        .eq('id', id)
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .single()

      if (error) throw error
      return NextResponse.json({ item: data })
    }

    // Update list status
    if (action === 'updateListStatus') {
      const { data, error } = await supabase
        .from('grocery_lists')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ list: data })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Groceries PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove grocery item or list
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') || 'item'

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    if (type === 'list') {
      const { error } = await supabase
        .from('grocery_lists')
        .delete()
        .eq('id', id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('grocery_list_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Groceries DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
