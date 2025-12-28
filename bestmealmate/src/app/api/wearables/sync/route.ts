import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  WearableProvider,
  MetricType,
  calculateActivityLevel,
  calculateAdjustedCalorieGoal,
  generateMealRecommendation,
  DailyHealthSummary
} from '@/lib/wearables'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// POST - Sync health data from a wearable device
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
    const { connection_id, metrics } = body

    if (!connection_id) {
      return NextResponse.json({ error: 'Connection ID required' }, { status: 400 })
    }

    // Get family member
    const { data: familyMember } = await supabase
      .from('family_members')
      .select('id, calorie_goal')
      .eq('user_id', user.id)
      .single()

    if (!familyMember) {
      return NextResponse.json({ error: 'Family member not found' }, { status: 404 })
    }

    // Verify connection belongs to user
    const { data: connection } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('id', connection_id)
      .eq('family_member_id', familyMember.id)
      .single()

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
    }

    // Insert health metrics
    if (metrics && Array.isArray(metrics)) {
      const metricsToInsert = metrics.map((metric: {
        metric_type: MetricType
        value: number
        unit: string
        recorded_at: string
      }) => ({
        family_member_id: familyMember.id,
        wearable_connection_id: connection_id,
        metric_type: metric.metric_type,
        value: metric.value,
        unit: metric.unit,
        recorded_at: metric.recorded_at,
        source: connection.provider,
      }))

      const { error: insertError } = await supabase
        .from('health_metrics')
        .insert(metricsToInsert)

      if (insertError) {
        console.error('Error inserting health metrics:', insertError)
        return NextResponse.json({ error: 'Failed to save metrics' }, { status: 500 })
      }
    }

    // Update last sync time
    await supabase
      .from('wearable_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connection_id)

    // Get today's summary for recommendations
    const today = new Date().toISOString().split('T')[0]
    const { data: todayMetrics } = await supabase
      .from('health_metrics')
      .select('metric_type, value')
      .eq('family_member_id', familyMember.id)
      .gte('recorded_at', `${today}T00:00:00`)
      .lte('recorded_at', `${today}T23:59:59`)

    // Aggregate today's data
    const summary: DailyHealthSummary = {
      date: today,
      family_member_id: familyMember.id,
      steps: null,
      calories_burned: null,
      active_minutes: null,
      sleep_hours: null,
      avg_heart_rate: null,
      water_intake_ml: null,
      weight_kg: null,
    }

    if (todayMetrics) {
      for (const metric of todayMetrics) {
        switch (metric.metric_type) {
          case 'steps':
            summary.steps = (summary.steps || 0) + metric.value
            break
          case 'calories_burned':
            summary.calories_burned = (summary.calories_burned || 0) + metric.value
            break
          case 'active_minutes':
            summary.active_minutes = (summary.active_minutes || 0) + metric.value
            break
          case 'sleep_hours':
            summary.sleep_hours = metric.value
            break
          case 'heart_rate':
            summary.avg_heart_rate = metric.value
            break
          case 'water_intake':
            summary.water_intake_ml = (summary.water_intake_ml || 0) + metric.value
            break
          case 'weight':
            summary.weight_kg = metric.value
            break
        }
      }
    }

    // Calculate adjusted nutrition goals
    const baseCalorieGoal = familyMember.calorie_goal || 2000
    const adjustedCalorieGoal = calculateAdjustedCalorieGoal(
      baseCalorieGoal,
      summary.calories_burned || 0,
      summary.steps || 0
    )

    const activityLevel = calculateActivityLevel(summary.steps || 0)
    const recommendation = generateMealRecommendation(summary)

    return NextResponse.json({
      message: 'Sync completed successfully',
      summary,
      nutrition_adjustment: {
        base_calorie_goal: baseCalorieGoal,
        calories_burned: summary.calories_burned || 0,
        adjusted_calorie_goal: adjustedCalorieGoal,
        activity_level: activityLevel,
        recommendation,
      },
    })
  } catch (error) {
    console.error('Wearables sync error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Get health summary and recommendations
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

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const days = parseInt(searchParams.get('days') || '7')

    // Get family member
    const { data: familyMember } = await supabase
      .from('family_members')
      .select('id, calorie_goal, protein_goal, carb_goal, fat_goal')
      .eq('user_id', user.id)
      .single()

    if (!familyMember) {
      return NextResponse.json({ error: 'Family member not found' }, { status: 404 })
    }

    // Get metrics for the past N days
    const startDate = new Date(date)
    startDate.setDate(startDate.getDate() - days + 1)

    const { data: metrics, error: metricsError } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('family_member_id', familyMember.id)
      .gte('recorded_at', startDate.toISOString())
      .lte('recorded_at', `${date}T23:59:59`)
      .order('recorded_at', { ascending: false })

    if (metricsError) {
      console.error('Error fetching health metrics:', metricsError)
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
    }

    // Group metrics by date
    const dailySummaries: Record<string, DailyHealthSummary> = {}

    for (const metric of metrics || []) {
      const metricDate = metric.recorded_at.split('T')[0]

      if (!dailySummaries[metricDate]) {
        dailySummaries[metricDate] = {
          date: metricDate,
          family_member_id: familyMember.id,
          steps: null,
          calories_burned: null,
          active_minutes: null,
          sleep_hours: null,
          avg_heart_rate: null,
          water_intake_ml: null,
          weight_kg: null,
        }
      }

      const summary = dailySummaries[metricDate]

      switch (metric.metric_type) {
        case 'steps':
          summary.steps = Math.max(summary.steps || 0, metric.value)
          break
        case 'calories_burned':
          summary.calories_burned = Math.max(summary.calories_burned || 0, metric.value)
          break
        case 'active_minutes':
          summary.active_minutes = Math.max(summary.active_minutes || 0, metric.value)
          break
        case 'sleep_hours':
          summary.sleep_hours = metric.value
          break
        case 'heart_rate':
          summary.avg_heart_rate = metric.value
          break
        case 'water_intake':
          summary.water_intake_ml = Math.max(summary.water_intake_ml || 0, metric.value)
          break
        case 'weight':
          summary.weight_kg = metric.value
          break
      }
    }

    // Calculate averages
    const summaryList = Object.values(dailySummaries)
    const avgSteps = summaryList.reduce((sum, s) => sum + (s.steps || 0), 0) / summaryList.length
    const avgCaloriesBurned = summaryList.reduce((sum, s) => sum + (s.calories_burned || 0), 0) / summaryList.length
    const avgActiveMinutes = summaryList.reduce((sum, s) => sum + (s.active_minutes || 0), 0) / summaryList.length

    // Get today's recommendation
    const todaySummary = dailySummaries[date] || {
      date,
      family_member_id: familyMember.id,
      steps: 0,
      calories_burned: 0,
      active_minutes: 0,
      sleep_hours: null,
      avg_heart_rate: null,
      water_intake_ml: null,
      weight_kg: null,
    }

    const baseCalorieGoal = familyMember.calorie_goal || 2000
    const adjustedCalorieGoal = calculateAdjustedCalorieGoal(
      baseCalorieGoal,
      todaySummary.calories_burned || 0,
      todaySummary.steps || 0
    )

    return NextResponse.json({
      today: todaySummary,
      daily_summaries: summaryList.sort((a, b) => b.date.localeCompare(a.date)),
      averages: {
        steps: Math.round(avgSteps),
        calories_burned: Math.round(avgCaloriesBurned),
        active_minutes: Math.round(avgActiveMinutes),
      },
      nutrition_goals: {
        base_calorie_goal: baseCalorieGoal,
        adjusted_calorie_goal: adjustedCalorieGoal,
        protein_goal: familyMember.protein_goal,
        carb_goal: familyMember.carb_goal,
        fat_goal: familyMember.fat_goal,
      },
      activity_level: calculateActivityLevel(todaySummary.steps || 0),
      recommendation: generateMealRecommendation(todaySummary),
    })
  } catch (error) {
    console.error('Health summary GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
