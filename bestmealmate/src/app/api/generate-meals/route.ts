import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface FamilyMember {
  id: string
  name: string
  calorie_goal?: number
  protein_goal?: number
  carb_goal?: number
  fat_goal?: number
  dietary_restrictions?: string[]
  allergies?: Array<{ name: string; severity: string }>
  food_dislikes?: string[]
}

interface PantryItem {
  name: string
  quantity: number
  unit: string
  expiry_date?: string
  location?: string
}

interface FrozenMeal {
  id: string
  name: string
  portions: number
  frozenDate: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface GenerateMealsRequest {
  householdId: string
  familyMembers: FamilyMember[]
  pantryItems?: PantryItem[]
  frozenMeals?: FrozenMeal[]
  date?: string
  mealTypes?: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'>
  preferences?: {
    maxPrepTime?: number
    cuisinePreferences?: string[]
    cookingSkill?: 'beginner' | 'intermediate' | 'advanced'
    preferBatchCooking?: boolean
    preferOnePort?: boolean
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMealsRequest = await request.json()
    const {
      familyMembers,
      pantryItems = [],
      frozenMeals = [],
      mealTypes = ['breakfast', 'lunch', 'dinner'],
      preferences = {}
    } = body

    // Calculate household nutrition goals (average of family members)
    const totalMembers = familyMembers.length || 1
    const householdGoals = {
      dailyCalories: familyMembers.reduce((sum, m) => sum + (m.calorie_goal || 2000), 0) / totalMembers,
      dailyProtein: familyMembers.reduce((sum, m) => sum + (m.protein_goal || 50), 0) / totalMembers,
      dailyCarbs: familyMembers.reduce((sum, m) => sum + (m.carb_goal || 250), 0) / totalMembers,
      dailyFat: familyMembers.reduce((sum, m) => sum + (m.fat_goal || 70), 0) / totalMembers
    }

    // Collect all dietary restrictions
    const allRestrictions = [...new Set(familyMembers.flatMap(m => m.dietary_restrictions || []))]
    const allAllergies = [...new Set(familyMembers.flatMap(m => (m.allergies || []).map(a => a.name)))]
    const allDislikes = [...new Set(familyMembers.flatMap(m => m.food_dislikes || []))]

    // Find expiring items (within 3 days)
    const expiringItems = pantryItems.filter(item => {
      if (!item.expiry_date) return false
      const expiry = new Date(item.expiry_date)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 3
    })

    // Build prompt for Claude
    const systemPrompt = `You are a professional meal planning AI. Generate personalized meal plans that:
1. Match the household's nutrition goals
2. Respect ALL dietary restrictions and allergies (CRITICAL for safety)
3. Avoid foods the family dislikes
4. Prioritize using ingredients that are expiring soon
5. Consider frozen batch-cooked meals for quick options
6. Provide 3 alternatives for each meal slot

IMPORTANT: For EACH meal, you must provide complete nutrition info and detailed instructions.

Return your response as a valid JSON object with this exact structure:
{
  "meals": [
    {
      "mealType": "breakfast" | "lunch" | "dinner" | "snack",
      "scheduledTime": "HH:MM AM/PM",
      "selectedMeal": {
        "id": "unique-id",
        "name": "Meal Name",
        "description": "Brief description",
        "emoji": "appropriate food emoji",
        "prepTime": "X min",
        "cookTime": "X min",
        "totalTime": "X min",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "servings": number,
        "ingredients": [{ "name": "ingredient", "amount": "quantity" }],
        "instructions": ["Step 1", "Step 2", ...],
        "tags": ["vegetarian", "quick", etc],
        "matchScore": 0-100 (how well it matches goals)
      },
      "alternatives": [... same structure as selectedMeal, 2-3 items ...],
      "portionMultiplier": number (1.0 is standard, adjust based on goals)
    }
  ],
  "dailyTotals": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "groceryNeeded": [{ "name": "item", "amount": "quantity" }]
}`

    const userPrompt = `Generate a complete meal plan for today with ${mealTypes.join(', ')}.

HOUSEHOLD INFO:
- Family members: ${familyMembers.map(m => m.name).join(', ')} (${totalMembers} people)
- Daily calorie goal: ${householdGoals.dailyCalories} kcal per person
- Daily protein goal: ${householdGoals.dailyProtein}g per person
- Daily carbs goal: ${householdGoals.dailyCarbs}g per person
- Daily fat goal: ${householdGoals.dailyFat}g per person

DIETARY REQUIREMENTS:
${allRestrictions.length > 0 ? `- Restrictions: ${allRestrictions.join(', ')}` : '- No dietary restrictions'}
${allAllergies.length > 0 ? `- ALLERGIES (MUST AVOID): ${allAllergies.join(', ')}` : ''}
${allDislikes.length > 0 ? `- Dislikes (avoid if possible): ${allDislikes.join(', ')}` : ''}

AVAILABLE INGREDIENTS:
${pantryItems.length > 0 ? pantryItems.map(i => `- ${i.quantity} ${i.unit} ${i.name}`).join('\n') : 'No pantry items specified'}

EXPIRING SOON (prioritize these):
${expiringItems.length > 0 ? expiringItems.map(i => `- ${i.name} (expires soon)`).join('\n') : 'None expiring soon'}

FROZEN BATCH MEALS AVAILABLE:
${frozenMeals.length > 0 ? frozenMeals.map(m => `- ${m.name}: ${m.portions} portions (${m.calories} cal each)`).join('\n') : 'None available'}

PREFERENCES:
- Max prep time: ${preferences.maxPrepTime || 45} minutes
- Cooking skill: ${preferences.cookingSkill || 'intermediate'}
- Preferred cuisines: ${preferences.cuisinePreferences?.join(', ') || 'Any'}
${preferences.preferBatchCooking ? '- Interested in batch cooking' : ''}
${preferences.preferOnePort ? '- Prefers one-pot meals' : ''}

Generate the meal plan now. Ensure calories are distributed appropriately across meals (breakfast ~25%, lunch ~35%, dinner ~35%, snacks ~5%).`

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
      mealPlan = generateFallbackMealPlan(mealTypes, householdGoals, totalMembers)
    }

    // Add attendees to each meal
    const mealsWithAttendees = mealPlan.meals.map((meal: Record<string, unknown>) => ({
      ...meal,
      id: crypto.randomUUID(),
      status: 'ready',
      attendees: familyMembers.map(m => ({
        id: m.id,
        name: m.name,
        avatar: '👤'
      }))
    }))

    return NextResponse.json({
      success: true,
      meals: mealsWithAttendees,
      dailyTotals: mealPlan.dailyTotals,
      groceryNeeded: mealPlan.groceryNeeded || [],
      userGoals: householdGoals
    })

  } catch (error) {
    console.error('Error generating meals:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal plan', success: false },
      { status: 500 }
    )
  }
}

function generateFallbackMealPlan(
  mealTypes: string[],
  goals: { dailyCalories: number; dailyProtein: number; dailyCarbs: number; dailyFat: number },
  servings: number
) {
  const fallbackMeals: Record<string, {
    selectedMeal: Record<string, unknown>
    alternatives: Record<string, unknown>[]
    scheduledTime: string
    portionMultiplier: number
  }> = {
    breakfast: {
      selectedMeal: {
        id: 'breakfast-1',
        name: 'Greek Yogurt Parfait',
        description: 'Creamy Greek yogurt layered with fresh berries and crunchy granola',
        emoji: '🥣',
        prepTime: '5 min',
        cookTime: '0 min',
        totalTime: '5 min',
        calories: Math.round(goals.dailyCalories * 0.25),
        protein: Math.round(goals.dailyProtein * 0.25),
        carbs: Math.round(goals.dailyCarbs * 0.25),
        fat: Math.round(goals.dailyFat * 0.25),
        servings,
        ingredients: [
          { name: 'Greek yogurt', amount: `${servings} cups` },
          { name: 'Mixed berries', amount: `${servings} cups` },
          { name: 'Granola', amount: `${servings / 2} cups` },
          { name: 'Honey', amount: `${servings} tbsp` }
        ],
        instructions: [
          'Scoop Greek yogurt into serving bowls',
          'Add a layer of mixed berries',
          'Top with crunchy granola',
          'Drizzle with honey',
          'Serve immediately'
        ],
        tags: ['quick', 'healthy', 'vegetarian'],
        matchScore: 85
      },
      alternatives: [
        {
          id: 'breakfast-2',
          name: 'Avocado Toast with Eggs',
          description: 'Whole grain toast topped with mashed avocado and poached eggs',
          emoji: '🥑',
          prepTime: '5 min',
          cookTime: '10 min',
          totalTime: '15 min',
          calories: Math.round(goals.dailyCalories * 0.25),
          protein: Math.round(goals.dailyProtein * 0.3),
          carbs: Math.round(goals.dailyCarbs * 0.2),
          fat: Math.round(goals.dailyFat * 0.3),
          servings,
          ingredients: [
            { name: 'Whole grain bread', amount: `${servings * 2} slices` },
            { name: 'Ripe avocado', amount: `${servings}` },
            { name: 'Eggs', amount: `${servings * 2}` }
          ],
          instructions: [
            'Toast the bread until golden',
            'Mash avocado with salt and pepper',
            'Poach eggs in simmering water',
            'Spread avocado on toast',
            'Top with poached eggs'
          ],
          tags: ['high-protein', 'vegetarian'],
          matchScore: 90
        }
      ],
      scheduledTime: '7:00 AM',
      portionMultiplier: 1
    },
    lunch: {
      selectedMeal: {
        id: 'lunch-1',
        name: 'Mediterranean Quinoa Bowl',
        description: 'Fluffy quinoa with cucumber, tomatoes, olives, and feta cheese',
        emoji: '🥗',
        prepTime: '10 min',
        cookTime: '15 min',
        totalTime: '25 min',
        calories: Math.round(goals.dailyCalories * 0.35),
        protein: Math.round(goals.dailyProtein * 0.35),
        carbs: Math.round(goals.dailyCarbs * 0.35),
        fat: Math.round(goals.dailyFat * 0.35),
        servings,
        ingredients: [
          { name: 'Quinoa', amount: `${servings} cups` },
          { name: 'Cucumber', amount: '1 large' },
          { name: 'Cherry tomatoes', amount: `${servings} cups` },
          { name: 'Kalamata olives', amount: `${servings / 2} cups` },
          { name: 'Feta cheese', amount: `${servings / 2} cups` },
          { name: 'Olive oil', amount: `${servings * 2} tbsp` }
        ],
        instructions: [
          'Cook quinoa according to package directions',
          'Dice cucumber and halve tomatoes',
          'Let quinoa cool slightly',
          'Combine all vegetables with quinoa',
          'Top with feta and drizzle olive oil',
          'Season with salt, pepper, and lemon juice'
        ],
        tags: ['vegetarian', 'mediterranean', 'meal-prep-friendly'],
        matchScore: 88
      },
      alternatives: [
        {
          id: 'lunch-2',
          name: 'Chicken Wrap',
          description: 'Grilled chicken with fresh vegetables in a whole wheat wrap',
          emoji: '🌯',
          prepTime: '10 min',
          cookTime: '15 min',
          totalTime: '25 min',
          calories: Math.round(goals.dailyCalories * 0.35),
          protein: Math.round(goals.dailyProtein * 0.4),
          carbs: Math.round(goals.dailyCarbs * 0.3),
          fat: Math.round(goals.dailyFat * 0.3),
          servings,
          ingredients: [
            { name: 'Chicken breast', amount: `${servings * 150}g` },
            { name: 'Whole wheat wraps', amount: `${servings}` },
            { name: 'Mixed greens', amount: `${servings * 2} cups` }
          ],
          instructions: [
            'Season and grill chicken breast',
            'Slice chicken into strips',
            'Layer wraps with greens and chicken',
            'Add your favorite sauce',
            'Roll tightly and serve'
          ],
          tags: ['high-protein', 'portable'],
          matchScore: 92
        }
      ],
      scheduledTime: '12:00 PM',
      portionMultiplier: 1
    },
    dinner: {
      selectedMeal: {
        id: 'dinner-1',
        name: 'Sheet Pan Salmon with Vegetables',
        description: 'Tender salmon fillet with roasted seasonal vegetables',
        emoji: '🐟',
        prepTime: '10 min',
        cookTime: '25 min',
        totalTime: '35 min',
        calories: Math.round(goals.dailyCalories * 0.35),
        protein: Math.round(goals.dailyProtein * 0.4),
        carbs: Math.round(goals.dailyCarbs * 0.3),
        fat: Math.round(goals.dailyFat * 0.35),
        servings,
        ingredients: [
          { name: 'Salmon fillets', amount: `${servings * 6} oz` },
          { name: 'Broccoli', amount: `${servings} cups` },
          { name: 'Sweet potato', amount: `${servings}` },
          { name: 'Olive oil', amount: `${servings * 2} tbsp` },
          { name: 'Lemon', amount: '1' },
          { name: 'Garlic', amount: '4 cloves' }
        ],
        instructions: [
          'Preheat oven to 400°F (200°C)',
          'Cut sweet potatoes into cubes',
          'Arrange vegetables on sheet pan with olive oil',
          'Roast vegetables for 15 minutes',
          'Add salmon fillets to the pan',
          'Roast for another 12-15 minutes until salmon is cooked',
          'Squeeze lemon over everything before serving'
        ],
        tags: ['omega-3', 'sheet-pan', 'gluten-free'],
        matchScore: 95
      },
      alternatives: [
        {
          id: 'dinner-2',
          name: 'Teriyaki Chicken Stir Fry',
          description: 'Quick stir-fried chicken with colorful vegetables in teriyaki sauce',
          emoji: '🍗',
          prepTime: '15 min',
          cookTime: '15 min',
          totalTime: '30 min',
          calories: Math.round(goals.dailyCalories * 0.35),
          protein: Math.round(goals.dailyProtein * 0.4),
          carbs: Math.round(goals.dailyCarbs * 0.35),
          fat: Math.round(goals.dailyFat * 0.3),
          servings,
          ingredients: [
            { name: 'Chicken thighs', amount: `${servings * 150}g` },
            { name: 'Bell peppers', amount: '2' },
            { name: 'Broccoli', amount: `${servings} cups` },
            { name: 'Teriyaki sauce', amount: `${servings / 2} cup` },
            { name: 'Rice', amount: `${servings} cups` }
          ],
          instructions: [
            'Cook rice according to package',
            'Cut chicken into bite-sized pieces',
            'Stir-fry chicken until golden',
            'Add vegetables and stir-fry 3-4 minutes',
            'Pour teriyaki sauce and toss',
            'Serve over rice'
          ],
          tags: ['asian', 'quick', 'family-friendly'],
          matchScore: 88
        }
      ],
      scheduledTime: '6:00 PM',
      portionMultiplier: 1
    },
    snack: {
      selectedMeal: {
        id: 'snack-1',
        name: 'Apple Slices with Almond Butter',
        description: 'Fresh apple slices paired with creamy almond butter',
        emoji: '🍎',
        prepTime: '3 min',
        cookTime: '0 min',
        totalTime: '3 min',
        calories: Math.round(goals.dailyCalories * 0.05),
        protein: Math.round(goals.dailyProtein * 0.05),
        carbs: Math.round(goals.dailyCarbs * 0.1),
        fat: Math.round(goals.dailyFat * 0.1),
        servings,
        ingredients: [
          { name: 'Apple', amount: `${servings}` },
          { name: 'Almond butter', amount: `${servings * 2} tbsp` }
        ],
        instructions: [
          'Slice apples into wedges',
          'Serve with almond butter for dipping'
        ],
        tags: ['quick', 'healthy', 'vegan'],
        matchScore: 80
      },
      alternatives: [],
      scheduledTime: '3:00 PM',
      portionMultiplier: 1
    }
  }

  const meals = mealTypes.map(type => ({
    mealType: type,
    ...fallbackMeals[type]
  }))

  const dailyTotals = meals.reduce((acc, meal) => {
    const m = meal.selectedMeal as { calories: number; protein: number; carbs: number; fat: number }
    return {
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return { meals, dailyTotals, groceryNeeded: [] }
}
