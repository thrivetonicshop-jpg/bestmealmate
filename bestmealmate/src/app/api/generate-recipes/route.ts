import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface MealSuggestion {
  id: string
  name: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
  instructions: string[]
  matchedIngredients: string[]
  missingIngredients: string[]
  calories: number
  matchScore: number
  tags: string[]
  cuisine: string
  mealType: string
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  return new Anthropic({ apiKey })
}

export async function POST(request: NextRequest) {
  try {
    const { ingredients, count = 10 } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ recipes: [], message: 'No ingredients provided' })
    }

    const ingredientList = ingredients.map((i: { name: string; quantity: string }) =>
      `${i.quantity} ${i.name}`
    ).join(', ')

    const anthropic = getAnthropic()

    const prompt = `You are an expert chef. Generate ${count} diverse recipes using these available ingredients.

AVAILABLE INGREDIENTS:
${ingredientList}

Generate recipes that MAXIMIZE use of available ingredients. Include a mix of:
- Quick meals (under 30 min)
- Family dinners
- Different cuisines (Italian, Mexican, Asian, American, etc.)
- Different meal types (breakfast, lunch, dinner, snacks)

Return a JSON object:
{
  "recipes": [
    {
      "id": "recipe-1",
      "name": "Honey Garlic Chicken Stir Fry",
      "description": "Quick and flavorful stir fry",
      "prepTime": 10,
      "cookTime": 15,
      "servings": 4,
      "difficulty": "Easy",
      "ingredients": ["2 lbs chicken breast", "1 head broccoli", "3 cloves garlic"],
      "instructions": ["Step 1...", "Step 2..."],
      "matchedIngredients": ["chicken breast", "broccoli", "garlic"],
      "missingIngredients": ["honey", "soy sauce"],
      "calories": 420,
      "matchScore": 85,
      "tags": ["quick", "high-protein", "kid-friendly"],
      "cuisine": "Asian",
      "mealType": "dinner"
    }
  ]
}

matchScore: percentage of recipe ingredients that are available (0-100)
Prioritize recipes with HIGHEST matchScore.
Include complete, detailed instructions.
Return ONLY valid JSON.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })

    let recipes: MealSuggestion[] = []
    const textContent = response.content.find((block) => block.type === 'text')

    if (textContent && textContent.type === 'text') {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        recipes = (parsed.recipes || []).sort((a: MealSuggestion, b: MealSuggestion) =>
          b.matchScore - a.matchScore
        )
      }
    }

    return NextResponse.json({
      recipes,
      total: recipes.length,
      ingredientCount: ingredients.length
    })
  } catch (error) {
    console.error('Generate recipes error:', error)

    // Return mock recipes for demo
    return NextResponse.json({
      recipes: [
        {
          id: 'recipe-1',
          name: 'Garlic Butter Chicken',
          description: 'Juicy pan-seared chicken in a rich garlic butter sauce',
          prepTime: 10,
          cookTime: 20,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['2 lbs chicken breast', '6 cloves garlic', '4 tbsp butter', 'Fresh parsley'],
          instructions: [
            'Season chicken with salt and pepper',
            'Heat butter in a large skillet over medium-high heat',
            'Cook chicken 6-7 minutes per side until golden',
            'Add minced garlic in the last 2 minutes',
            'Let rest 5 minutes, then slice and serve with pan juices'
          ],
          matchedIngredients: ['chicken breast', 'garlic', 'butter'],
          missingIngredients: ['parsley'],
          calories: 380,
          matchScore: 90,
          tags: ['quick', 'high-protein', 'keto-friendly'],
          cuisine: 'American',
          mealType: 'dinner'
        },
        {
          id: 'recipe-2',
          name: 'Chicken Broccoli Stir Fry',
          description: 'Healthy stir fry with crisp vegetables and savory sauce',
          prepTime: 15,
          cookTime: 12,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['1.5 lbs chicken breast', '2 heads broccoli', '4 cloves garlic', 'Soy sauce', 'Sesame oil'],
          instructions: [
            'Cut chicken into bite-sized pieces',
            'Blanch broccoli for 2 minutes, drain',
            'Stir fry chicken in hot oil until cooked through',
            'Add garlic and broccoli, toss 2 minutes',
            'Add soy sauce and sesame oil, serve over rice'
          ],
          matchedIngredients: ['chicken breast', 'broccoli', 'garlic'],
          missingIngredients: ['soy sauce', 'sesame oil'],
          calories: 320,
          matchScore: 85,
          tags: ['quick', 'healthy', 'meal-prep'],
          cuisine: 'Asian',
          mealType: 'dinner'
        },
        {
          id: 'recipe-3',
          name: 'Egg Fried Rice',
          description: 'Classic comfort food with fluffy eggs and aromatic garlic',
          prepTime: 5,
          cookTime: 10,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['4 cups cooked rice', '4 eggs', '4 cloves garlic', '2 green onions', 'Soy sauce'],
          instructions: [
            'Beat eggs and scramble in hot wok, set aside',
            'Sauté garlic until fragrant',
            'Add cold rice and stir fry on high heat',
            'Add eggs back, season with soy sauce',
            'Garnish with green onions'
          ],
          matchedIngredients: ['eggs', 'rice', 'garlic'],
          missingIngredients: ['green onions', 'soy sauce'],
          calories: 340,
          matchScore: 80,
          tags: ['quick', 'budget-friendly', 'kid-friendly'],
          cuisine: 'Chinese',
          mealType: 'dinner'
        },
        {
          id: 'recipe-4',
          name: 'Roasted Garlic Broccoli',
          description: 'Caramelized broccoli with crispy garlic chips',
          prepTime: 5,
          cookTime: 20,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['2 heads broccoli', '6 cloves garlic', '3 tbsp olive oil', 'Parmesan cheese'],
          instructions: [
            'Cut broccoli into florets, slice garlic thin',
            'Toss with olive oil, salt, and pepper',
            'Spread on baking sheet',
            'Roast at 425°F for 18-20 minutes',
            'Top with shaved parmesan'
          ],
          matchedIngredients: ['broccoli', 'garlic', 'olive oil'],
          missingIngredients: ['parmesan'],
          calories: 120,
          matchScore: 85,
          tags: ['vegetarian', 'low-carb', 'side-dish'],
          cuisine: 'Italian',
          mealType: 'side'
        },
        {
          id: 'recipe-5',
          name: 'Creamy Garlic Pasta',
          description: 'Rich and creamy pasta with roasted garlic',
          prepTime: 10,
          cookTime: 20,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['1 lb pasta', '8 cloves garlic', '1 cup heavy cream', '1 cup parmesan', 'Fresh basil'],
          instructions: [
            'Cook pasta according to package directions',
            'Roast garlic in butter until golden',
            'Add cream and simmer 5 minutes',
            'Toss with pasta and parmesan',
            'Garnish with fresh basil'
          ],
          matchedIngredients: ['pasta', 'garlic', 'butter'],
          missingIngredients: ['heavy cream', 'parmesan', 'basil'],
          calories: 520,
          matchScore: 60,
          tags: ['comfort-food', 'vegetarian', 'date-night'],
          cuisine: 'Italian',
          mealType: 'dinner'
        },
        {
          id: 'recipe-6',
          name: 'Scrambled Eggs with Veggies',
          description: 'Fluffy scrambled eggs loaded with fresh vegetables',
          prepTime: 5,
          cookTime: 8,
          servings: 2,
          difficulty: 'Easy',
          ingredients: ['4 eggs', '1/2 cup diced vegetables', '2 tbsp butter', 'Salt and pepper'],
          instructions: [
            'Whisk eggs with a splash of milk',
            'Sauté vegetables in butter until tender',
            'Pour in eggs and gently scramble',
            'Remove from heat while still slightly wet',
            'Season and serve immediately'
          ],
          matchedIngredients: ['eggs', 'butter', 'vegetables'],
          missingIngredients: [],
          calories: 280,
          matchScore: 95,
          tags: ['breakfast', 'quick', 'high-protein'],
          cuisine: 'American',
          mealType: 'breakfast'
        },
        {
          id: 'recipe-7',
          name: 'One-Pan Chicken & Rice',
          description: 'Complete meal cooked in a single pan',
          prepTime: 10,
          cookTime: 35,
          servings: 4,
          difficulty: 'Medium',
          ingredients: ['4 chicken thighs', '1.5 cups rice', 'Chicken broth', 'Onion', 'Garlic'],
          instructions: [
            'Season and brown chicken in oven-safe pan',
            'Remove chicken, sauté onion and garlic',
            'Add rice and broth, stir well',
            'Nestle chicken on top',
            'Cover and bake at 375°F for 30 minutes'
          ],
          matchedIngredients: ['chicken', 'rice', 'onion', 'garlic'],
          missingIngredients: ['chicken broth'],
          calories: 450,
          matchScore: 80,
          tags: ['one-pan', 'meal-prep', 'family-dinner'],
          cuisine: 'American',
          mealType: 'dinner'
        },
        {
          id: 'recipe-8',
          name: 'Garlic Butter Shrimp',
          description: 'Succulent shrimp in a garlicky butter sauce',
          prepTime: 10,
          cookTime: 8,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['1 lb shrimp', '6 cloves garlic', '4 tbsp butter', 'Lemon', 'Parsley'],
          instructions: [
            'Pat shrimp dry and season',
            'Melt butter in large skillet',
            'Add garlic and cook 30 seconds',
            'Add shrimp, cook 2-3 minutes per side',
            'Finish with lemon juice and parsley'
          ],
          matchedIngredients: ['garlic', 'butter'],
          missingIngredients: ['shrimp', 'lemon', 'parsley'],
          calories: 280,
          matchScore: 40,
          tags: ['quick', 'seafood', 'keto'],
          cuisine: 'Mediterranean',
          mealType: 'dinner'
        },
        {
          id: 'recipe-9',
          name: 'Veggie Omelette',
          description: 'Fluffy omelette stuffed with colorful vegetables',
          prepTime: 5,
          cookTime: 5,
          servings: 1,
          difficulty: 'Easy',
          ingredients: ['3 eggs', 'Mixed vegetables', 'Cheese', 'Butter'],
          instructions: [
            'Beat eggs with salt and pepper',
            'Cook vegetables briefly in butter',
            'Pour eggs over vegetables',
            'Cook until set, add cheese',
            'Fold and serve immediately'
          ],
          matchedIngredients: ['eggs', 'vegetables', 'butter'],
          missingIngredients: ['cheese'],
          calories: 320,
          matchScore: 85,
          tags: ['breakfast', 'quick', 'low-carb'],
          cuisine: 'French',
          mealType: 'breakfast'
        },
        {
          id: 'recipe-10',
          name: 'Chicken Caesar Salad',
          description: 'Classic salad with grilled chicken and creamy dressing',
          prepTime: 15,
          cookTime: 12,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['2 chicken breasts', 'Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan'],
          instructions: [
            'Season and grill chicken until cooked',
            'Let rest, then slice',
            'Chop romaine lettuce',
            'Toss with dressing and parmesan',
            'Top with chicken and croutons'
          ],
          matchedIngredients: ['chicken breast'],
          missingIngredients: ['lettuce', 'caesar dressing', 'croutons', 'parmesan'],
          calories: 380,
          matchScore: 35,
          tags: ['healthy', 'high-protein', 'lunch'],
          cuisine: 'American',
          mealType: 'lunch'
        }
      ],
      total: 10,
      ingredientCount: 0
    })
  }
}
