import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { householdId, tier, email } = await request.json()

    const priceId = tier === 'family'
      ? process.env.STRIPE_FAMILY_PRICE_ID
      : process.env.STRIPE_PREMIUM_PRICE_ID

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
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
