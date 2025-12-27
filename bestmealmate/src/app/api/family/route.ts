import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch family members for a household
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('family_members')
      .select(`
        *,
        allergies:allergies(*),
        dietary_restrictions:dietary_restrictions(*)
      `)
      .eq('household_id', householdId)
      .order('created_at')

    if (error) throw error

    return NextResponse.json({ members: data })
  } catch (error: any) {
    console.error('Family GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Add a family member
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { householdId, name, age, role, isPickyEater, allergies, restrictions } = body

    if (!householdId || !name) {
      return NextResponse.json({ error: 'Household ID and name required' }, { status: 400 })
    }

    // Create family member
    const { data: member, error: memberError } = await supabase
      .from('family_members')
      .insert({
        household_id: householdId,
        name,
        age: age || null,
        role: role || 'member',
        is_picky_eater: isPickyEater || false,
      })
      .select()
      .single()

    if (memberError) throw memberError

    // Add allergies
    if (allergies?.length > 0) {
      const allergyInserts = allergies.map((a: any) => ({
        family_member_id: member.id,
        allergen: a.allergen || a,
        severity: a.severity || 'moderate',
      }))

      await supabase.from('allergies').insert(allergyInserts)
    }

    // Add dietary restrictions
    if (restrictions?.length > 0) {
      const restrictionInserts = restrictions.map((r: string) => ({
        family_member_id: member.id,
        restriction_type: r,
      }))

      await supabase.from('dietary_restrictions').insert(restrictionInserts)
    }

    // Fetch complete member data
    const { data: completeMember } = await supabase
      .from('family_members')
      .select(`
        *,
        allergies:allergies(*),
        dietary_restrictions:dietary_restrictions(*)
      `)
      .eq('id', member.id)
      .single()

    return NextResponse.json({ member: completeMember })
  } catch (error: any) {
    console.error('Family POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update a family member
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { id, name, age, role, isPickyEater, allergies, restrictions } = body

    if (!id) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
    }

    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (age !== undefined) updates.age = age
    if (role !== undefined) updates.role = role
    if (isPickyEater !== undefined) updates.is_picky_eater = isPickyEater

    const { error: memberError } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', id)

    if (memberError) throw memberError

    // Update allergies if provided
    if (allergies !== undefined) {
      // Delete existing
      await supabase.from('allergies').delete().eq('family_member_id', id)

      // Add new
      if (allergies.length > 0) {
        const allergyInserts = allergies.map((a: any) => ({
          family_member_id: id,
          allergen: a.allergen || a,
          severity: a.severity || 'moderate',
        }))

        await supabase.from('allergies').insert(allergyInserts)
      }
    }

    // Update restrictions if provided
    if (restrictions !== undefined) {
      // Delete existing
      await supabase.from('dietary_restrictions').delete().eq('family_member_id', id)

      // Add new
      if (restrictions.length > 0) {
        const restrictionInserts = restrictions.map((r: string) => ({
          family_member_id: id,
          restriction_type: r,
        }))

        await supabase.from('dietary_restrictions').insert(restrictionInserts)
      }
    }

    // Fetch updated member
    const { data: member } = await supabase
      .from('family_members')
      .select(`
        *,
        allergies:allergies(*),
        dietary_restrictions:dietary_restrictions(*)
      `)
      .eq('id', id)
      .single()

    return NextResponse.json({ member })
  } catch (error: any) {
    console.error('Family PUT error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remove a family member
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Family DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
