import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

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
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${message}`)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get the household ID from metadata
        const householdId = session.metadata?.household_id
        const tier = session.metadata?.tier as 'premium' | 'family'

        if (householdId && tier) {
          // Update household subscription
          await supabaseAdmin
            .from('households')
            .update({
              subscription_tier: tier,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', householdId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Find household by stripe_customer_id
        const { data: household } = await supabaseAdmin
          .from('households')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single()

        if (household) {
          // Determine tier based on price
          let tier: 'free' | 'premium' | 'family' = 'free'
          const priceId = subscription.items.data[0]?.price.id

          if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
            tier = 'premium'
          } else if (priceId === process.env.STRIPE_FAMILY_PRICE_ID) {
            tier = 'family'
          }

          await supabaseAdmin
            .from('households')
            .update({
              subscription_tier: subscription.status === 'active' ? tier : 'free',
              stripe_subscription_id: subscription.id,
            })
            .eq('id', household.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Downgrade to free tier
        await supabaseAdmin
          .from('households')
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', subscription.customer as string)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Could send email notification here
        console.log(`Payment failed for customer: ${invoice.customer}`)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
