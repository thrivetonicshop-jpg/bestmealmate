// Wearable Device Integration for BestMealMate
// Supports Apple Health, Fitbit, Garmin, Google Fit

export type WearableProvider = 'apple_health' | 'fitbit' | 'garmin' | 'google_fit' | 'samsung_health'

export interface WearableConnection {
  id: string
  family_member_id: string
  provider: WearableProvider
  access_token: string | null
  refresh_token: string | null
  expires_at: string | null
  is_active: boolean
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

export interface HealthMetric {
  id: string
  family_member_id: string
  wearable_connection_id: string
  metric_type: MetricType
  value: number
  unit: string
  recorded_at: string
  source: WearableProvider
  created_at: string
}

export type MetricType =
  | 'steps'
  | 'calories_burned'
  | 'active_minutes'
  | 'heart_rate'
  | 'heart_rate_resting'
  | 'sleep_hours'
  | 'sleep_quality'
  | 'weight'
  | 'body_fat_percentage'
  | 'water_intake'
  | 'distance_km'
  | 'floors_climbed'

export interface DailyHealthSummary {
  date: string
  family_member_id: string
  steps: number | null
  calories_burned: number | null
  active_minutes: number | null
  sleep_hours: number | null
  avg_heart_rate: number | null
  water_intake_ml: number | null
  weight_kg: number | null
}

export interface NutritionGoalAdjustment {
  family_member_id: string
  date: string
  base_calorie_goal: number
  calories_burned: number
  adjusted_calorie_goal: number
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  recommendation: string
}

// Provider configuration
export const WEARABLE_PROVIDERS: Record<WearableProvider, {
  name: string
  icon: string
  color: string
  authUrl?: string
  apiBaseUrl?: string
  scopes?: string[]
}> = {
  apple_health: {
    name: 'Apple Health',
    icon: '🍎',
    color: '#FF2D55',
  },
  fitbit: {
    name: 'Fitbit',
    icon: '⌚',
    color: '#00B0B9',
    authUrl: 'https://www.fitbit.com/oauth2/authorize',
    apiBaseUrl: 'https://api.fitbit.com',
    scopes: ['activity', 'heartrate', 'sleep', 'weight', 'nutrition'],
  },
  garmin: {
    name: 'Garmin',
    icon: '🏃',
    color: '#007CC3',
    authUrl: 'https://connect.garmin.com/oauthConfirm',
    apiBaseUrl: 'https://apis.garmin.com',
  },
  google_fit: {
    name: 'Google Fit',
    icon: '💪',
    color: '#4285F4',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    apiBaseUrl: 'https://www.googleapis.com/fitness/v1',
    scopes: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.heart_rate.read',
      'https://www.googleapis.com/auth/fitness.sleep.read',
    ],
  },
  samsung_health: {
    name: 'Samsung Health',
    icon: '📱',
    color: '#1428A0',
  },
}

// Calculate activity level based on steps
export function calculateActivityLevel(steps: number): 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' {
  if (steps < 5000) return 'sedentary'
  if (steps < 7500) return 'light'
  if (steps < 10000) return 'moderate'
  if (steps < 12500) return 'active'
  return 'very_active'
}

// Activity multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

// Calculate adjusted calorie goal based on activity
export function calculateAdjustedCalorieGoal(
  baseCalorieGoal: number,
  caloriesBurned: number,
  steps: number
): NutritionGoalAdjustment['adjusted_calorie_goal'] {
  const activityLevel = calculateActivityLevel(steps)
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]

  // Base metabolic adjustment + activity bonus
  const activityBonus = Math.round(caloriesBurned * 0.5) // Eat back 50% of burned calories
  return baseCalorieGoal + activityBonus
}

// Generate meal recommendation based on health data
export function generateMealRecommendation(summary: DailyHealthSummary): string {
  const recommendations: string[] = []

  if (summary.steps && summary.steps > 10000) {
    recommendations.push('Great activity today! Consider adding extra protein to support muscle recovery.')
  }

  if (summary.sleep_hours && summary.sleep_hours < 7) {
    recommendations.push('You slept less than optimal. Foods rich in magnesium like leafy greens may help improve sleep quality.')
  }

  if (summary.calories_burned && summary.calories_burned > 500) {
    recommendations.push('High calorie burn detected. Make sure to stay hydrated and replenish with nutrient-dense meals.')
  }

  if (summary.water_intake_ml && summary.water_intake_ml < 2000) {
    recommendations.push('Consider increasing water intake. Try adding water-rich foods like cucumbers and watermelon.')
  }

  if (recommendations.length === 0) {
    return 'Keep up the great work! Your health metrics look balanced today.'
  }

  return recommendations.join(' ')
}

// Format metric value with unit
export function formatMetricValue(type: MetricType, value: number): string {
  switch (type) {
    case 'steps':
      return `${value.toLocaleString()} steps`
    case 'calories_burned':
      return `${value.toLocaleString()} cal`
    case 'active_minutes':
      return `${value} min`
    case 'heart_rate':
    case 'heart_rate_resting':
      return `${value} bpm`
    case 'sleep_hours':
      return `${value.toFixed(1)} hrs`
    case 'sleep_quality':
      return `${value}%`
    case 'weight':
      return `${value.toFixed(1)} kg`
    case 'body_fat_percentage':
      return `${value.toFixed(1)}%`
    case 'water_intake':
      return `${value} ml`
    case 'distance_km':
      return `${value.toFixed(2)} km`
    case 'floors_climbed':
      return `${value} floors`
    default:
      return `${value}`
  }
}

// Get metric icon
export function getMetricIcon(type: MetricType): string {
  const icons: Record<MetricType, string> = {
    steps: '👟',
    calories_burned: '🔥',
    active_minutes: '⏱️',
    heart_rate: '❤️',
    heart_rate_resting: '💗',
    sleep_hours: '😴',
    sleep_quality: '🌙',
    weight: '⚖️',
    body_fat_percentage: '📊',
    water_intake: '💧',
    distance_km: '📍',
    floors_climbed: '🪜',
  }
  return icons[type] || '📈'
}
