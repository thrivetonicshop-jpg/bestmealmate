import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

interface FamilyMemberInput {
  name: string
  age: string
  isPicky: boolean
  allergies: string[]
  restrictions: string[]
  dislikes: string[]
}

interface OnboardingData {
  email: string
  password: string
  householdName: string
  familyMembers: FamilyMemberInput[]
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const body: OnboardingData = await request.json()
    const { email, password, householdName, familyMembers } = body

    // Validate input
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    if (!familyMembers || familyMembers.length === 0) {
      return NextResponse.json(
        { error: 'At least one family member is required' },
        { status: 400 }
      )
    }

    // 1. Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // 2. Create household
    const householdData = {
      name: householdName || `${familyMembers[0].name}'s Family`,
      subscription_tier: 'free' as const,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    const { data: household, error: householdError } = await supabase
      .from('households')
      .insert(householdData as any)
      .select()
      .single()

    if (householdError || !household) {
      console.error('Household creation error:', householdError)
      return NextResponse.json(
        { error: 'Failed to create household' },
        { status: 500 }
      )
    }

    const householdId = (household as { id: string }).id

    // 3. Create family members with their allergies and restrictions
    for (let i = 0; i < familyMembers.length; i++) {
      const member = familyMembers[i]

      // Determine role - first member is admin
      const role = i === 0 ? 'admin' : (parseInt(member.age) < 13 ? 'child' : 'member')

      const memberData = {
        household_id: householdId,
        user_id: i === 0 ? authData.user.id : null,
        name: member.name,
        age: member.age ? parseInt(member.age) : null,
        role: role as 'admin' | 'member' | 'child',
        is_picky_eater: member.isPicky,
      }

      const { data: familyMember, error: memberError } = await supabase
        .from('family_members')
        .insert(memberData as any)
        .select()
        .single()

      if (memberError || !familyMember) {
        console.error('Family member creation error:', memberError)
        continue
      }

      const familyMemberId = (familyMember as { id: string }).id

      // Add allergies
      if (member.allergies.length > 0) {
        const allergyInserts = member.allergies.map(allergen => ({
          family_member_id: familyMemberId,
          allergen,
          severity: 'moderate' as const,
        }))

        await supabase.from('allergies').insert(allergyInserts as any)
      }

      // Add dietary restrictions
      if (member.restrictions.length > 0) {
        const restrictionInserts = member.restrictions.map(restriction_type => ({
          family_member_id: familyMemberId,
          restriction_type,
        }))

        await supabase.from('dietary_restrictions').insert(restrictionInserts as any)
      }

      // Add food dislikes
      if (member.dislikes && member.dislikes.length > 0) {
        const dislikeInserts = member.dislikes.map(food_name => ({
          family_member_id: familyMemberId,
          food_name,
        }))

        await supabase.from('food_dislikes').insert(dislikeInserts as any)
      }
    }

    // 4. Create default grocery list
    await supabase
      .from('grocery_lists')
      .insert({
        household_id: householdId,
        name: 'Shopping List',
        status: 'active',
      } as any)

    return NextResponse.json({
      success: true,
      householdId,
      userId: authData.user.id,
      emailConfirmationRequired: !authData.session,
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Something went wrong during onboarding' },
      { status: 500 }
    )
  }
}
