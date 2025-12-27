import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch household details
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const userId = searchParams.get('userId')

    if (householdId) {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single()

      if (error) throw error
      return NextResponse.json({ household: data })
    }

    if (userId) {
      // Find household by user's family membership
      const { data: member } = await supabase
        .from('family_members')
        .select('household_id')
        .eq('user_id', userId)
        .single()

      if (!member) {
        return NextResponse.json({ household: null })
      }

      const { data: household, error } = await supabase
        .from('households')
        .select('*')
        .eq('id', member.household_id)
        .single()

      if (error) throw error
      return NextResponse.json({ household })
    }

    return NextResponse.json({ error: 'Household ID or User ID required' }, { status: 400 })
  } catch (error: any) {
    console.error('Household GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new household (during onboarding)
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { name, userId, userName, userAge, timezone } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Create household
    const { data: household, error: householdError } = await supabase
      .from('households')
      .insert({
        name: name || 'My Household',
        timezone: timezone || 'America/New_York',
        subscription_tier: 'free',
      })
      .select()
      .single()

    if (householdError) throw householdError

    // Create first family member (the user)
    const { data: member, error: memberError } = await supabase
      .from('family_members')
      .insert({
        household_id: household.id,
        user_id: userId,
        name: userName || 'Me',
        age: userAge || null,
        role: 'admin',
      })
      .select()
      .single()

    if (memberError) throw memberError

    return NextResponse.json({ household, member })
  } catch (error: any) {
    console.error('Household POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update household settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { id, name, timezone, preferredGroceryStore } = body

    if (!id) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (timezone !== undefined) updates.timezone = timezone
    if (preferredGroceryStore !== undefined) updates.preferred_grocery_store = preferredGroceryStore

    const { data, error } = await supabase
      .from('households')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ household: data })
  } catch (error: any) {
    console.error('Household PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
