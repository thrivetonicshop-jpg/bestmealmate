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

// GET /api/family - Get all family members for a household
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('household_id')

    if (!householdId) {
      return NextResponse.json({ error: 'household_id is required' }, { status: 400 })
    }

    // Get family members with their dietary info
    const { data: members, error: membersError } = await supabase
      .from('family_members')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at')

    if (membersError) throw membersError

    // Get dietary restrictions for all members
    const memberIds = members?.map(m => m.id) || []

    const [restrictionsResult, allergiesResult, dislikesResult] = await Promise.all([
      supabase
        .from('dietary_restrictions')
        .select('*')
        .in('family_member_id', memberIds),
      supabase
        .from('allergies')
        .select('*')
        .in('family_member_id', memberIds),
      supabase
        .from('food_dislikes')
        .select('*')
        .in('family_member_id', memberIds)
    ])

    // Combine data
    const enrichedMembers = members?.map(member => ({
      ...member,
      dietary_restrictions: restrictionsResult.data?.filter(r => r.family_member_id === member.id) || [],
      allergies: allergiesResult.data?.filter(a => a.family_member_id === member.id) || [],
      food_dislikes: dislikesResult.data?.filter(d => d.family_member_id === member.id) || []
    }))

    return NextResponse.json({ data: enrichedMembers })
  } catch (error) {
    console.error('Error fetching family members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch family members' },
      { status: 500 }
    )
  }
}

// POST /api/family - Add a new family member
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const {
      household_id,
      name,
      age,
      role,
      avatar_url,
      is_picky_eater,
      dietary_restrictions,
      allergies,
      food_dislikes
    } = body

    if (!household_id || !name) {
      return NextResponse.json(
        { error: 'household_id and name are required' },
        { status: 400 }
      )
    }

    // Create family member
    const { data: member, error: memberError } = await supabase
      .from('family_members')
      .insert({
        household_id,
        name,
        age: age || null,
        role: role || 'member',
        avatar_url: avatar_url || null,
        is_picky_eater: is_picky_eater || false
      })
      .select()
      .single()

    if (memberError) throw memberError

    // Add dietary restrictions
    if (dietary_restrictions?.length > 0) {
      await supabase
        .from('dietary_restrictions')
        .insert(
          dietary_restrictions.map((r: string) => ({
            family_member_id: member.id,
            restriction_type: r
          }))
        )
    }

    // Add allergies
    if (allergies?.length > 0) {
      await supabase
        .from('allergies')
        .insert(
          allergies.map((a: { name: string; severity: string }) => ({
            family_member_id: member.id,
            allergen: a.name,
            severity: a.severity || 'moderate'
          }))
        )
    }

    // Add food dislikes
    if (food_dislikes?.length > 0) {
      await supabase
        .from('food_dislikes')
        .insert(
          food_dislikes.map((d: string) => ({
            family_member_id: member.id,
            food_name: d
          }))
        )
    }

    return NextResponse.json({ data: member }, { status: 201 })
  } catch (error) {
    console.error('Error adding family member:', error)
    return NextResponse.json(
      { error: 'Failed to add family member' },
      { status: 500 }
    )
  }
}

// PUT /api/family - Update a family member
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const body = await request.json()
    const {
      id,
      dietary_restrictions,
      allergies,
      food_dislikes,
      ...memberUpdates
    } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Update member
    const { data: member, error: memberError } = await supabase
      .from('family_members')
      .update(memberUpdates)
      .eq('id', id)
      .select()
      .single()

    if (memberError) throw memberError

    // Update dietary restrictions (delete and recreate)
    if (dietary_restrictions !== undefined) {
      await supabase
        .from('dietary_restrictions')
        .delete()
        .eq('family_member_id', id)

      if (dietary_restrictions.length > 0) {
        await supabase
          .from('dietary_restrictions')
          .insert(
            dietary_restrictions.map((r: string) => ({
              family_member_id: id,
              restriction_type: r
            }))
          )
      }
    }

    // Update allergies
    if (allergies !== undefined) {
      await supabase
        .from('allergies')
        .delete()
        .eq('family_member_id', id)

      if (allergies.length > 0) {
        await supabase
          .from('allergies')
          .insert(
            allergies.map((a: { name: string; severity: string }) => ({
              family_member_id: id,
              allergen: a.name,
              severity: a.severity || 'moderate'
            }))
          )
      }
    }

    // Update food dislikes
    if (food_dislikes !== undefined) {
      await supabase
        .from('food_dislikes')
        .delete()
        .eq('family_member_id', id)

      if (food_dislikes.length > 0) {
        await supabase
          .from('food_dislikes')
          .insert(
            food_dislikes.map((d: string) => ({
              family_member_id: id,
              food_name: d
            }))
          )
      }
    }

    return NextResponse.json({ data: member })
  } catch (error) {
    console.error('Error updating family member:', error)
    return NextResponse.json(
      { error: 'Failed to update family member' },
      { status: 500 }
    )
  }
}

// DELETE /api/family - Delete a family member
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const supabase = getSupabase(authHeader)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Cascade deletes will handle related records
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting family member:', error)
    return NextResponse.json(
      { error: 'Failed to delete family member' },
      { status: 500 }
    )
  }
}
