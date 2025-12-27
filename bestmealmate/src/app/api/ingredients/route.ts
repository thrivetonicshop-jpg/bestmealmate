import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch all ingredients (for autocomplete)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = supabase
      .from('ingredients')
      .select('*')
      .order('name')

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query.limit(50)

    if (error) throw error

    return NextResponse.json({ ingredients: data })
  } catch (error: any) {
    console.error('Ingredients GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new ingredient
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { name, category, defaultUnit, avgShelfLifeDays } = body

    if (!name) {
      return NextResponse.json({ error: 'Ingredient name required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ingredients')
      .insert({
        name,
        category: category || null,
        default_unit: defaultUnit || null,
        avg_shelf_life_days: avgShelfLifeDays || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ ingredient: data })
  } catch (error: any) {
    console.error('Ingredients POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
