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

// GET /api/household - Get current user's household
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find household through family_members
    const { data: member, error: memberError } = await supabase
      .from('family_members')
      .select('household_id')
      .eq('user_id', user.id)
      .single()

    if (memberError || !member) {
      return NextResponse.json({ data: null })
    }

    // Get household details
    const { data: household, error: householdError } = await supabase
      .from('households')
      .select('*')
      .eq('id', member.household_id)
      .single()

    if (householdError) throw householdError

    return NextResponse.json({ data: household })
  } catch (error) {
    console.error('Error fetching household:', error)
    return NextResponse.json(
      { error: 'Failed to fetch household' },
      { status: 500 }
    )
  }
}

// POST /api/household - Create a new household
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, timezone, preferred_grocery_store } = body

    // Create household
    const { data: household, error: householdError } = await supabase
      .from('households')
      .insert({
        name: name || 'My Household',
        timezone: timezone || 'America/New_York',
        preferred_grocery_store: preferred_grocery_store || null
      })
      .select()
      .single()

    if (householdError) throw householdError

    // Create family member for current user as admin
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        household_id: household.id,
        user_id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Me',
        role: 'admin'
      })

    if (memberError) throw memberError

    return NextResponse.json({ data: household }, { status: 201 })
  } catch (error) {
    console.error('Error creating household:', error)
    return NextResponse.json(
      { error: 'Failed to create household' },
      { status: 500 }
    )
  }
}

// PUT /api/household - Update household
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
      .from('households')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating household:', error)
    return NextResponse.json(
      { error: 'Failed to update household' },
      { status: 500 }
    )
  }
}
