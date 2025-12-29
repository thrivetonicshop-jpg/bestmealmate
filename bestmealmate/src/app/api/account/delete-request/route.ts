import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, reason } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Log the deletion request for manual processing
    console.log('Account deletion request received:', {
      email,
      reason: reason || 'Not provided',
      timestamp: new Date().toISOString(),
    })

    // In production, this would:
    // 1. Send a confirmation email to the user
    // 2. Create a ticket in your support system
    // 3. Schedule the account for deletion

    return NextResponse.json({
      success: true,
      message: 'Deletion request received. You will receive a confirmation email.',
    })
  } catch (error) {
    console.error('Error processing deletion request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
