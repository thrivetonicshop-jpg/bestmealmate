import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCanceledEmail,
  sendInvoicePaidEmail,
} from '@/lib/email'

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
          // Calculate trial end date (14 days from now)
          const trialEndsAt = new Date()
          trialEndsAt.setDate(trialEndsAt.getDate() + 14)

          // Update household subscription with trial info
          await supabaseAdmin
            .from('households')
            .update({
              subscription_tier: tier,
              subscription_status: 'trialing',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              trial_ends_at: trialEndsAt.toISOString(),
            })
            .eq('id', householdId)

          // Send welcome email
          if (session.customer_email) {
            await sendWelcomeEmail(session.customer_email, tier)
          }
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

          // Map Stripe status to our status
          type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
          const statusMap: Record<string, SubscriptionStatus> = {
            active: 'active',
            trialing: 'trialing',
            past_due: 'past_due',
            canceled: 'canceled',
            incomplete: 'incomplete',
            incomplete_expired: 'canceled',
            unpaid: 'past_due',
          }

          await supabaseAdmin
            .from('households')
            .update({
              subscription_tier: ['active', 'trialing'].includes(subscription.status) ? tier : 'free',
              subscription_status: statusMap[subscription.status] || 'active',
              stripe_subscription_id: subscription.id,
              trial_ends_at: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
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
            subscription_status: 'canceled',
            stripe_subscription_id: null,
            trial_ends_at: null,
          })
          .eq('stripe_customer_id', subscription.customer as string)

        // Get customer email and send notification
        const stripe = getStripe()
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (customer && !customer.deleted && customer.email) {
          await sendSubscriptionCanceledEmail(customer.email)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        console.log(`Payment failed for customer: ${invoice.customer}`)

        // Update subscription status
        await supabaseAdmin
          .from('households')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', invoice.customer as string)

        // Send payment failed email
        if (invoice.customer_email) {
          await sendPaymentFailedEmail(invoice.customer_email)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === 'string'
          ? invoice.parent.subscription_details.subscription
          : null

        // Update subscription status to active if payment succeeded
        if (subscriptionId) {
          await supabaseAdmin
            .from('households')
            .update({ subscription_status: 'active' })
            .eq('stripe_subscription_id', subscriptionId)
        }

        // Send receipt email
        if (invoice.customer_email && invoice.amount_paid && invoice.amount_paid > 0) {
          await sendInvoicePaidEmail(
            invoice.customer_email,
            invoice.amount_paid,
            invoice.currency || 'usd'
          )
        }
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
