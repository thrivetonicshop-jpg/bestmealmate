import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing')
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
  }
  return supabaseClient
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, source = 'landing_page', preferences } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // Check if email already exists
    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id, is_subscribed')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      if (existing.is_subscribed) {
        return NextResponse.json(
          { message: 'You are already subscribed!', already_subscribed: true },
          { status: 200 }
        )
      } else {
        // Re-subscribe
        const { error: updateError } = await supabase
          .from('email_subscribers')
          .update({
            is_subscribed: true,
            unsubscribed_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (updateError) throw updateError

        return NextResponse.json({
          message: 'Welcome back! You have been re-subscribed.',
          resubscribed: true
        })
      }
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        source,
        preferences: preferences || {
          weekly_tips: true,
          new_features: true,
          promotions: false
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Subscription error:', error)
      throw error
    }

    return NextResponse.json({
      message: 'Successfully subscribed! Check your email for confirmation.',
      subscriber: {
        id: data.id,
        email: data.email
      }
    })
  } catch (error) {
    console.error('Subscribe API error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // Find subscriber
    const { data: subscriber } = await supabase
      .from('email_subscribers')
      .select('id, verification_token')
      .eq('email', email.toLowerCase())
      .single()

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    // Verify token if provided
    if (token && subscriber.verification_token !== token) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 403 }
      )
    }

    // Update subscriber
    const { error } = await supabase
      .from('email_subscribers')
      .update({
        is_subscribed: false,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)

    if (error) throw error

    return NextResponse.json({
      message: 'Successfully unsubscribed. We\'re sorry to see you go!'
    })
  } catch (error) {
    console.error('Unsubscribe API error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    )
  }
}

// Get subscriber count (for social proof)
export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { count, error } = await supabase
      .from('email_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_subscribed', true)

    if (error) throw error

    return NextResponse.json({
      subscriber_count: count || 0
    })
  } catch (error) {
    console.error('Get subscribers count error:', error)
    return NextResponse.json(
      { subscriber_count: 0 },
      { status: 200 }
    )
  }
}
