import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key, {
    apiVersion: '2023-10-16',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { householdId, tier, email } = await request.json()

    // Validate required fields
    if (!householdId || !tier || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: householdId, tier, and email are required' },
        { status: 400 }
      )
    }

    // Validate tier
    if (!['premium', 'family'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "premium" or "family"' },
        { status: 400 }
      )
    }

    const priceId = tier === 'family'
      ? process.env.STRIPE_FAMILY_PRICE_ID
      : process.env.STRIPE_PREMIUM_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier' },
        { status: 500 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        household_id: householdId,
        tier: tier,
      },
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/dashboard/settings`,
      subscription_data: {
        trial_period_days: 14,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
