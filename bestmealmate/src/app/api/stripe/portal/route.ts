import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

/**
 * Stripe Customer Portal API
 * Creates a session for customers to manage their subscription
 */

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key, {
    apiVersion: '2025-12-15.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, returnUrl } = await request.json()

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required', success: false },
        { status: 400 }
      )
    }

    // Create a portal session
    const stripe = getStripe()
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    })

    return NextResponse.json({
      success: true,
      url: portalSession.url
    })

  } catch (error) {
    console.error('Stripe portal error:', error)

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message, success: false },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create portal session', success: false },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    name: 'Stripe Customer Portal API',
    version: '1.0.0',
    description: 'Create Stripe billing portal sessions for subscription management',
    features: [
      'Update payment method',
      'View invoices and receipts',
      'Cancel or pause subscription',
      'Change subscription plan',
      'Update billing information'
    ],
    usage: {
      method: 'POST',
      body: {
        customerId: 'string (required) - Stripe customer ID',
        returnUrl: 'string (optional) - URL to return to after portal'
      }
    }
  })
}
