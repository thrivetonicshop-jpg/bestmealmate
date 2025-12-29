import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Referral Program API
 * Manage referral codes, track referrals, and award credits
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase configuration')
  }
  return createClient(url, key)
}

// Generate a unique referral code
function generateReferralCode(userId: string): string {
  const prefix = 'BMM'
  const hash = userId.substring(0, 6).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${hash}-${random}`
}

// Referral rewards configuration
const REFERRAL_REWARDS = {
  referrer: {
    type: 'credit',
    amount: 500, // $5.00 in cents
    description: '$5 credit for each successful referral'
  },
  referred: {
    type: 'trial_extension',
    days: 14,
    description: '14 extra days free trial'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, referralCode, email } = await request.json()

    switch (action) {
      case 'generate': {
        // Generate a new referral code for user
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required', success: false },
            { status: 400 }
          )
        }

        const code = generateReferralCode(userId)

        // In production, save to database
        // await supabase.from('referral_codes').insert({ user_id: userId, code, created_at: new Date() })

        return NextResponse.json({
          success: true,
          referralCode: code,
          shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?ref=${code}`,
          rewards: REFERRAL_REWARDS
        })
      }

      case 'validate': {
        // Validate a referral code
        if (!referralCode) {
          return NextResponse.json(
            { error: 'Referral code is required', success: false },
            { status: 400 }
          )
        }

        // Check if code exists and is valid
        // In production: const { data } = await supabase.from('referral_codes').select().eq('code', referralCode).single()

        // For demo, accept any code starting with BMM
        const isValid = referralCode.startsWith('BMM-')

        return NextResponse.json({
          success: true,
          valid: isValid,
          reward: isValid ? REFERRAL_REWARDS.referred : null
        })
      }

      case 'redeem': {
        // Redeem a referral code
        if (!referralCode || !userId) {
          return NextResponse.json(
            { error: 'Referral code and user ID are required', success: false },
            { status: 400 }
          )
        }

        // In production:
        // 1. Validate the code
        // 2. Check if user hasn't already used a referral
        // 3. Award benefits to both parties
        // 4. Mark code as used by this user

        return NextResponse.json({
          success: true,
          message: 'Referral code redeemed successfully!',
          reward: REFERRAL_REWARDS.referred
        })
      }

      case 'stats': {
        // Get referral statistics for a user
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required', success: false },
            { status: 400 }
          )
        }

        // In production, fetch from database
        const stats = {
          totalReferrals: 0,
          successfulReferrals: 0,
          pendingReferrals: 0,
          totalEarnings: 0,
          referralCode: generateReferralCode(userId)
        }

        return NextResponse.json({
          success: true,
          stats
        })
      }

      case 'invite': {
        // Send referral invite email
        if (!email || !userId) {
          return NextResponse.json(
            { error: 'Email and user ID are required', success: false },
            { status: 400 }
          )
        }

        const code = generateReferralCode(userId)
        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?ref=${code}`

        // In production, send email via Mailchimp/SendGrid
        console.log(`Sending referral invite to ${email} with link: ${inviteUrl}`)

        return NextResponse.json({
          success: true,
          message: `Invitation sent to ${email}`,
          inviteUrl
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Referral API error:', error)
    return NextResponse.json(
      { error: 'Failed to process referral request', success: false },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    name: 'Referral Program API',
    version: '1.0.0',
    description: 'Manage referral codes and track referrals',
    rewards: REFERRAL_REWARDS,
    actions: {
      generate: 'Create a referral code for a user',
      validate: 'Check if a referral code is valid',
      redeem: 'Redeem a referral code',
      stats: 'Get referral statistics',
      invite: 'Send referral invite email'
    },
    usage: {
      method: 'POST',
      body: {
        action: 'string (required)',
        userId: 'string (required for most actions)',
        referralCode: 'string (for validate/redeem)',
        email: 'string (for invite)'
      }
    }
  })
}
