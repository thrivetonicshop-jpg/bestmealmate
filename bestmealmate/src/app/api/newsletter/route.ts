import { NextRequest, NextResponse } from 'next/server'

/**
 * Mailchimp Newsletter Signup API
 * Subscribes users to the BestMealMate mailing list
 */

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER || 'us21' // e.g., us21

interface SubscribeRequest {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json()
    const { email, firstName, lastName, tags } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', success: false },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', success: false },
        { status: 400 }
      )
    }

    // Check if Mailchimp is configured
    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.log('Mailchimp not configured, simulating signup for:', email)
      // Return success for demo/development
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed! (Demo mode)',
        demo: true
      })
    }

    // Mailchimp API endpoint
    const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`

    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || ''
      },
      tags: tags || ['website-signup']
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to our newsletter!'
      })
    }

    // Handle already subscribed
    if (result.title === 'Member Exists') {
      return NextResponse.json({
        success: true,
        message: 'You\'re already subscribed!'
      })
    }

    // Handle other errors
    console.error('Mailchimp error:', result)
    return NextResponse.json(
      {
        error: result.detail || 'Failed to subscribe',
        success: false
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription', success: false },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    name: 'Newsletter Signup API',
    version: '1.0.0',
    description: 'Subscribe to BestMealMate newsletter via Mailchimp',
    configured: !!(MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID),
    usage: {
      method: 'POST',
      body: {
        email: 'string (required)',
        firstName: 'string (optional)',
        lastName: 'string (optional)',
        tags: 'string[] (optional)'
      }
    }
  })
}
