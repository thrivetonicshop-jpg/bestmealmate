import { NextRequest, NextResponse } from 'next/server'
import { getUsageStats } from '@/lib/usage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')

    if (!householdId) {
      return NextResponse.json(
        { error: 'householdId is required', success: false },
        { status: 400 }
      )
    }

    const usage = await getUsageStats(householdId)

    if (!usage) {
      return NextResponse.json(
        { error: 'Household not found', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      usage,
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Failed to get usage stats', success: false },
      { status: 500 }
    )
  }
}
