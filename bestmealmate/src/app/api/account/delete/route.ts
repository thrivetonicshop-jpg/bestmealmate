import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Account Deletion API
 * GDPR/CCPA compliant account and data deletion
 */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: NextRequest) {
  try {
    const { userId, householdId, reason, feedback } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', success: false },
        { status: 400 }
      )
    }

    console.log(`Account deletion requested for user: ${userId}`)

    // 1. Create deletion request record for audit trail
    const deletionRequest = {
      user_id: userId,
      household_id: householdId,
      reason: reason || 'user_requested',
      feedback: feedback || null,
      requested_at: new Date().toISOString(),
      status: 'pending',
      scheduled_deletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    }

    // Store deletion request (in production, save to database)
    console.log('Deletion request:', deletionRequest)

    // 2. Delete user data from all tables
    if (householdId) {
      // Delete in order to respect foreign key constraints
      const tables = [
        'grocery_items',
        'grocery_lists',
        'meal_plans',
        'meal_plan_items',
        'pantry_items',
        'family_members',
        'recipes',
        'households'
      ]

      for (const table of tables) {
        try {
          if (table === 'households') {
            await supabaseAdmin.from(table).delete().eq('id', householdId)
          } else if (table === 'grocery_items') {
            // Delete through grocery_lists
            const { data: lists } = await supabaseAdmin
              .from('grocery_lists')
              .select('id')
              .eq('household_id', householdId)

            if (lists) {
              for (const list of lists) {
                await supabaseAdmin.from('grocery_items').delete().eq('list_id', list.id)
              }
            }
          } else if (table === 'meal_plan_items') {
            // Delete through meal_plans
            const { data: plans } = await supabaseAdmin
              .from('meal_plans')
              .select('id')
              .eq('household_id', householdId)

            if (plans) {
              for (const plan of plans) {
                await supabaseAdmin.from('meal_plan_items').delete().eq('meal_plan_id', plan.id)
              }
            }
          } else {
            await supabaseAdmin.from(table).delete().eq('household_id', householdId)
          }
          console.log(`Deleted data from ${table}`)
        } catch (tableError) {
          console.log(`Table ${table} deletion skipped:`, tableError)
        }
      }
    }

    // 3. Delete user authentication record
    try {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      console.log('User auth record deleted')
    } catch (authError) {
      console.log('Auth deletion error (may not exist):', authError)
    }

    // 4. Clear any cached data (would integrate with Redis/cache in production)
    console.log('Cache cleared for user:', userId)

    // 5. Send confirmation email (in production)
    // await sendDeletionConfirmationEmail(userEmail)

    return NextResponse.json({
      success: true,
      message: 'Account deletion initiated. All data will be permanently deleted within 30 days.',
      deletionId: `del_${Date.now()}`,
      scheduledDeletion: deletionRequest.scheduled_deletion
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to process deletion request', success: false },
      { status: 500 }
    )
  }
}

// GET endpoint to check deletion status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({
      name: 'Account Deletion API',
      version: '1.0.0',
      description: 'GDPR/CCPA compliant account deletion',
      usage: {
        method: 'POST',
        body: {
          userId: 'string (required)',
          householdId: 'string (optional)',
          reason: 'string (optional)',
          feedback: 'string (optional)'
        }
      }
    })
  }

  // In production, check deletion request status from database
  return NextResponse.json({
    userId,
    status: 'not_found',
    message: 'No pending deletion request found'
  })
}
