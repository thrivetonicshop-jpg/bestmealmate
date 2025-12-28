import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  WearableProvider,
  WEARABLE_PROVIDERS,
  calculateActivityLevel,
  calculateAdjustedCalorieGoal,
  generateMealRecommendation
} from '@/lib/wearables'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET - List connected wearables for a family member
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get family member for this user
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('id, household_id')
      .eq('user_id', user.id)
      .single()

    if (memberError || !familyMember) {
      return NextResponse.json({ error: 'Family member not found' }, { status: 404 })
    }

    // Get connected wearables
    const { data: connections, error: connError } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('family_member_id', familyMember.id)
      .order('created_at', { ascending: false })

    if (connError) {
      console.error('Error fetching wearable connections:', connError)
      return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
    }

    // Enrich with provider info
    const enrichedConnections = (connections || []).map(conn => ({
      ...conn,
      provider_info: WEARABLE_PROVIDERS[conn.provider as WearableProvider],
    }))

    return NextResponse.json({
      connections: enrichedConnections,
      available_providers: Object.entries(WEARABLE_PROVIDERS).map(([key, value]) => ({
        id: key,
        ...value,
      })),
    })
  } catch (error) {
    console.error('Wearables GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Connect a new wearable device
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { provider, access_token, refresh_token, expires_at } = body

    if (!provider || !WEARABLE_PROVIDERS[provider as WearableProvider]) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Get family member
    const { data: familyMember, error: memberError } = await supabase
      .from('family_members')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (memberError || !familyMember) {
      return NextResponse.json({ error: 'Family member not found' }, { status: 404 })
    }

    // Check if already connected
    const { data: existing } = await supabase
      .from('wearable_connections')
      .select('id')
      .eq('family_member_id', familyMember.id)
      .eq('provider', provider)
      .single()

    if (existing) {
      // Update existing connection
      const { data: updated, error: updateError } = await supabase
        .from('wearable_connections')
        .update({
          access_token,
          refresh_token,
          expires_at,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 })
      }

      return NextResponse.json({ connection: updated, message: 'Connection updated' })
    }

    // Create new connection
    const { data: connection, error: insertError } = await supabase
      .from('wearable_connections')
      .insert({
        family_member_id: familyMember.id,
        provider,
        access_token,
        refresh_token,
        expires_at,
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating wearable connection:', insertError)
      return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 })
    }

    return NextResponse.json({
      connection,
      message: `Successfully connected to ${WEARABLE_PROVIDERS[provider as WearableProvider].name}`,
    }, { status: 201 })
  } catch (error) {
    console.error('Wearables POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Disconnect a wearable device
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const connectionId = searchParams.get('id')

    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID required' }, { status: 400 })
    }

    // Get family member
    const { data: familyMember } = await supabase
      .from('family_members')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!familyMember) {
      return NextResponse.json({ error: 'Family member not found' }, { status: 404 })
    }

    // Delete connection (only if it belongs to this user)
    const { error: deleteError } = await supabase
      .from('wearable_connections')
      .delete()
      .eq('id', connectionId)
      .eq('family_member_id', familyMember.id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Device disconnected successfully' })
  } catch (error) {
    console.error('Wearables DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
