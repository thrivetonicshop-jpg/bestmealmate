import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Amazon Receipt Verification Service (RVS) endpoints
const AMAZON_RVS_SANDBOX = 'https://appstore-sdk.amazon.com/sandbox/version/1.0/verifyReceiptId'
const AMAZON_RVS_PRODUCTION = 'https://appstore-sdk.amazon.com/version/1.0/verifyReceiptId'

interface AmazonReceiptResponse {
  receiptId: string
  productType: string
  productId: string
  purchaseDate: number
  cancelDate?: number
  testTransaction: boolean
}

function getAmazonConfig() {
  return {
    sharedSecret: process.env.AMAZON_SHARED_SECRET || '',
    useSandbox: process.env.NODE_ENV !== 'production',
  }
}

export async function POST(request: Request) {
  try {
    const { receiptId, userId } = await request.json()

    if (!receiptId || !userId) {
      return NextResponse.json(
        { error: 'Receipt ID and User ID are required' },
        { status: 400 }
      )
    }

    const config = getAmazonConfig()
    const rvsUrl = config.useSandbox ? AMAZON_RVS_SANDBOX : AMAZON_RVS_PRODUCTION

    // Verify receipt with Amazon
    const verifyUrl = `${rvsUrl}/developer/${config.sharedSecret}/user/${userId}/receiptId/${receiptId}`

    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Amazon RVS error:', errorText)

      // For demo/testing, allow purchases to go through
      if (config.useSandbox || !config.sharedSecret) {
        console.log('Demo mode: Approving purchase without verification')
        return handleDemoPurchase(receiptId, userId)
      }

      return NextResponse.json(
        { error: 'Receipt verification failed', valid: false },
        { status: 400 }
      )
    }

    const receiptData: AmazonReceiptResponse = await response.json()

    // Check if the purchase is valid and not canceled
    if (receiptData.cancelDate) {
      return NextResponse.json({
        valid: false,
        canceled: true,
        message: 'Subscription has been canceled',
      })
    }

    // Determine subscription tier from product ID
    const planType = receiptData.productId.includes('family') ? 'family' : 'premium'

    // Update user's subscription in database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: updateError } = await supabase
      .from('households')
      .update({
        subscription_tier: planType,
        subscription_status: 'active',
        subscription_provider: 'amazon',
        amazon_receipt_id: receiptId,
        subscription_updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription', valid: true },
        { status: 500 }
      )
    }

    return NextResponse.json({
      valid: true,
      plan: planType,
      receiptId: receiptData.receiptId,
      purchaseDate: receiptData.purchaseDate,
      testTransaction: receiptData.testTransaction,
    })
  } catch (error) {
    console.error('Receipt verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Demo purchase handler for testing without Amazon credentials
async function handleDemoPurchase(receiptId: string, userId: string) {
  const planType = receiptId.includes('family') ? 'family' : 'premium'

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from('households')
      .update({
        subscription_tier: planType,
        subscription_status: 'active',
        subscription_provider: 'amazon_demo',
        amazon_receipt_id: receiptId,
        subscription_updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
  } catch {
    // Ignore database errors in demo mode
  }

  return NextResponse.json({
    valid: true,
    plan: planType,
    receiptId,
    demo: true,
  })
}
