/**
 * Stripe Integration Test Script
 *
 * This script tests the Stripe checkout and webhook endpoints.
 * Run with: npx ts-node scripts/test-stripe.ts
 *
 * Prerequisites:
 * - Set STRIPE_SECRET_KEY in .env.local
 * - Set STRIPE_PREMIUM_PRICE_ID and STRIPE_FAMILY_PRICE_ID
 * - Run the dev server: npm run dev
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface CheckoutResponse {
  url?: string
  error?: string
}

async function testCheckoutEndpoint(tier: 'premium' | 'family'): Promise<void> {
  console.log(`\n🧪 Testing ${tier} checkout...`)

  try {
    const response = await fetch(`${BASE_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        householdId: 'test-household-123',
        tier: tier,
        email: 'test@example.com',
      }),
    })

    const data: CheckoutResponse = await response.json()

    if (response.ok && data.url) {
      console.log(`✅ ${tier.charAt(0).toUpperCase() + tier.slice(1)} checkout session created`)
      console.log(`   Checkout URL: ${data.url.substring(0, 60)}...`)
    } else {
      console.log(`❌ ${tier} checkout failed: ${data.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.log(`❌ ${tier} checkout error:`, error instanceof Error ? error.message : error)
  }
}

async function testWebhookEndpoint(): Promise<void> {
  console.log('\n🧪 Testing webhook endpoint (signature validation)...')

  try {
    const response = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test_signature',
      },
      body: JSON.stringify({ type: 'test' }),
    })

    if (response.status === 400) {
      console.log('✅ Webhook correctly rejects invalid signatures')
    } else {
      console.log(`⚠️  Unexpected webhook response: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Webhook test error:', error instanceof Error ? error.message : error)
  }
}

async function runTests(): Promise<void> {
  console.log('🚀 Stripe Integration Tests')
  console.log('===========================')
  console.log(`Base URL: ${BASE_URL}`)

  await testCheckoutEndpoint('premium')
  await testCheckoutEndpoint('family')
  await testWebhookEndpoint()

  console.log('\n===========================')
  console.log('📋 Test Summary Complete')
  console.log('\nStripe Test Cards:')
  console.log('  Success: 4242 4242 4242 4242')
  console.log('  Decline: 4000 0000 0000 0002')
  console.log('  Auth Required: 4000 0025 0000 3155')
}

runTests().catch(console.error)
