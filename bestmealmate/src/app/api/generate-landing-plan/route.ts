import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface LandingPlanRequest {
  name: string
  familySize: number
  dietaryPreferences: string[]
  healthGoal: string
  cuisines: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: LandingPlanRequest = await request.json()
    const { name, familySize, dietaryPreferences, healthGoal, cuisines } = body

    // Map health goals to descriptions
    const goalMap: Record<string, string> = {
      'weight-loss': 'weight loss (lower calorie, high protein)',
      'muscle-gain': 'muscle building (high protein, moderate carbs)',
      'maintenance': 'weight maintenance (balanced macros)',
      'energy': 'energy boost (complex carbs, moderate protein)'
    }

    const systemPrompt = `You are a professional meal planning AI. Generate a personalized 7-day meal plan based on user preferences.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{
  "weekPlan": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "Breakfast",
          "name": "Meal Name",
          "time": "X min",
          "emoji": "🍳",
          "calories": number,
          "description": "Brief description"
        },
        {
          "type": "Lunch",
          "name": "Meal Name",
          "time": "X min",
          "emoji": "🥗",
          "calories": number,
          "description": "Brief description"
        },
        {
          "type": "Dinner",
          "name": "Meal Name",
          "time": "X min",
          "emoji": "🍝",
          "calories": number,
          "description": "Brief description"
        }
      ]
    }
  ],
  "weeklyStats": {
    "totalMeals": 21,
    "avgCaloriesPerDay": number,
    "estimatedGroceryCost": "$XX",
    "prepTimeTotal": "X hours"
  },
  "topIngredients": ["ingredient1", "ingredient2", "ingredient3", "ingredient4", "ingredient5"]
}`

    const userPrompt = `Create a 7-day meal plan for ${name}'s family.

FAMILY INFO:
- Family size: ${familySize} people
- Health goal: ${goalMap[healthGoal] || 'balanced nutrition'}

DIETARY PREFERENCES:
${dietaryPreferences.length > 0 ? dietaryPreferences.map(p => `- ${p}`).join('\n') : '- No specific restrictions'}

FAVORITE CUISINES:
${cuisines.map(c => `- ${c}`).join('\n')}

Generate the meal plan now. Include breakfast, lunch, and dinner for each day. Make meals realistic, delicious, and aligned with preferences.`

    let mealPlan

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        system: systemPrompt
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type')
      }

      // Parse the JSON response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        mealPlan = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse meal plan JSON')
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      // Return fallback meal plan
      mealPlan = generateFallbackPlan(name, familySize, cuisines, healthGoal)
    }

    return NextResponse.json({
      success: true,
      ...mealPlan,
      userName: name,
      familySize
    })

  } catch (error) {
    console.error('Error generating landing meal plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal plan', success: false },
      { status: 500 }
    )
  }
}

function generateFallbackPlan(name: string, familySize: number, cuisines: string[], healthGoal: string) {
  const calorieTargets: Record<string, number> = {
    'weight-loss': 1600,
    'muscle-gain': 2400,
    'maintenance': 2000,
    'energy': 2200
  }

  const targetCalories = calorieTargets[healthGoal] || 2000
  const breakfastCal = Math.round(targetCalories * 0.25)
  const lunchCal = Math.round(targetCalories * 0.35)
  const dinnerCal = Math.round(targetCalories * 0.4)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const mealOptions = {
    breakfast: [
      { name: 'Greek Yogurt Parfait', time: '5 min', emoji: '🥣', description: 'Creamy yogurt with berries and granola' },
      { name: 'Avocado Toast', time: '10 min', emoji: '🥑', description: 'Whole grain toast with mashed avocado and eggs' },
      { name: 'Overnight Oats', time: '5 min', emoji: '🥣', description: 'Oats soaked in milk with fruits and nuts' },
      { name: 'Veggie Omelette', time: '15 min', emoji: '🍳', description: 'Fluffy eggs with bell peppers and cheese' },
      { name: 'Smoothie Bowl', time: '8 min', emoji: '🫐', description: 'Blended fruits topped with granola' },
      { name: 'Banana Pancakes', time: '20 min', emoji: '🥞', description: 'Fluffy pancakes with fresh banana' },
      { name: 'Breakfast Burrito', time: '15 min', emoji: '🌯', description: 'Scrambled eggs with beans and salsa' }
    ],
    lunch: [
      { name: 'Mediterranean Quinoa Bowl', time: '25 min', emoji: '🥗', description: 'Quinoa with veggies, feta, and olives' },
      { name: 'Chicken Caesar Wrap', time: '15 min', emoji: '🌯', description: 'Grilled chicken with romaine and parmesan' },
      { name: 'Asian Noodle Salad', time: '20 min', emoji: '🍜', description: 'Rice noodles with peanut dressing' },
      { name: 'Turkey Club Sandwich', time: '10 min', emoji: '🥪', description: 'Triple decker with bacon and avocado' },
      { name: 'Buddha Bowl', time: '25 min', emoji: '🥙', description: 'Roasted chickpeas with tahini dressing' },
      { name: 'Tuna Poke Bowl', time: '15 min', emoji: '🍣', description: 'Fresh tuna over rice with edamame' },
      { name: 'Caprese Panini', time: '12 min', emoji: '🥪', description: 'Mozzarella, tomato, and basil grilled' }
    ],
    dinner: [
      { name: 'Honey Garlic Salmon', time: '30 min', emoji: '🐟', description: 'Pan-seared salmon with roasted vegetables' },
      { name: 'Turkey Taco Night', time: '25 min', emoji: '🌮', description: 'Seasoned turkey with fresh toppings' },
      { name: 'Sheet Pan Chicken', time: '35 min', emoji: '🍗', description: 'Herb chicken with potatoes and veggies' },
      { name: 'Pasta Primavera', time: '25 min', emoji: '🍝', description: 'Penne with seasonal vegetables' },
      { name: 'Beef Stir Fry', time: '20 min', emoji: '🥩', description: 'Tender beef with colorful vegetables' },
      { name: 'Grilled Shrimp Skewers', time: '25 min', emoji: '🦐', description: 'Marinated shrimp with lemon herb rice' },
      { name: 'Sunday Roast', time: '60 min', emoji: '🥩', description: 'Classic roast with all the trimmings' }
    ]
  }

  const weekPlan = days.map((day, i) => ({
    day,
    meals: [
      { type: 'Breakfast', ...mealOptions.breakfast[i], calories: breakfastCal },
      { type: 'Lunch', ...mealOptions.lunch[i], calories: lunchCal },
      { type: 'Dinner', ...mealOptions.dinner[i], calories: dinnerCal }
    ]
  }))

  return {
    weekPlan,
    weeklyStats: {
      totalMeals: 21,
      avgCaloriesPerDay: targetCalories,
      estimatedGroceryCost: `$${Math.round(familySize * 50)}`,
      prepTimeTotal: '4.5 hours'
    },
    topIngredients: ['Chicken', 'Olive Oil', 'Eggs', 'Rice', 'Fresh Vegetables']
  }
}
