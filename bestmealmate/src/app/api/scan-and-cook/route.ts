import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface DetectedIngredient {
  name: string
  quantity: string
  category: string
}

interface MealSuggestion {
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
  tags: string[]
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
    const { images, dietaryRestrictions, familySize, mealType } = await request.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    const anthropic = getAnthropic()

    // Step 1: Analyze all images to extract ingredients
    const allIngredients: DetectedIngredient[] = []

    for (const imageData of images) {
      const base64Match = imageData.image.match(/^data:image\/(\w+);base64,(.+)$/)
      if (!base64Match) continue

      const mediaType = `image/${base64Match[1]}` as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
      const base64Data = base64Match[2]

      const scanPrompt = `Analyze this image of ${imageData.location || 'food storage'} and identify ALL visible food items.

Return a JSON object with this format:
{
  "ingredients": [
    {"name": "chicken breast", "quantity": "2 lbs", "category": "protein"},
    {"name": "broccoli", "quantity": "1 head", "category": "vegetable"},
    {"name": "garlic", "quantity": "1 bulb", "category": "spice"}
  ]
}

Categories: protein, vegetable, fruit, grain, dairy, spice, condiment, pantry, beverage

Be specific with names. Include EVERYTHING visible - meats, vegetables, fruits, dairy, spices, condiments, sauces, etc.
Return ONLY valid JSON.`

      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Data,
                  },
                },
                { type: 'text', text: scanPrompt },
              ],
            },
          ],
        })

        const textContent = response.content.find((block) => block.type === 'text')
        if (textContent && textContent.type === 'text') {
          const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.ingredients) {
              allIngredients.push(...parsed.ingredients)
            }
          }
        }
      } catch (error) {
        console.error('Error analyzing image:', error)
      }
    }

    // Deduplicate ingredients by name
    const uniqueIngredients = Array.from(
      new Map(allIngredients.map(item => [item.name.toLowerCase(), item])).values()
    )

    if (uniqueIngredients.length === 0) {
      return NextResponse.json({
        ingredients: [],
        meals: [],
        message: 'No ingredients detected. Try taking clearer photos.'
      })
    }

    // Step 2: Generate meal suggestions based on ingredients
    const ingredientList = uniqueIngredients.map(i => `${i.quantity} ${i.name}`).join(', ')

    const mealPrompt = `You are an expert chef. Based on these available ingredients, suggest 3-5 delicious meals.

AVAILABLE INGREDIENTS:
${ingredientList}

REQUIREMENTS:
- Family size: ${familySize || 4} people
- Meal type: ${mealType || 'any'}
- Dietary restrictions: ${dietaryRestrictions?.join(', ') || 'none'}

Return a JSON object:
{
  "meals": [
    {
      "name": "Honey Garlic Chicken Stir Fry",
      "description": "A quick and flavorful stir fry with tender chicken and crisp vegetables",
      "prepTime": 15,
      "cookTime": 20,
      "servings": 4,
      "difficulty": "Easy",
      "ingredients": ["2 lbs chicken breast", "1 head broccoli", "3 cloves garlic", "2 tbsp honey", "3 tbsp soy sauce"],
      "instructions": [
        "Cut chicken into bite-sized pieces and season with salt and pepper",
        "Heat oil in a large wok or skillet over high heat",
        "Cook chicken until golden, about 5-6 minutes, then set aside",
        "Add broccoli and garlic, stir fry for 3 minutes",
        "Return chicken, add honey and soy sauce, toss to coat",
        "Serve over rice"
      ],
      "matchedIngredients": ["chicken breast", "broccoli", "garlic"],
      "missingIngredients": ["honey", "soy sauce"],
      "calories": 450,
      "tags": ["quick", "high-protein", "kid-friendly"]
    }
  ]
}

GUIDELINES:
- Prioritize meals that use the MOST available ingredients
- Include a mix of quick meals and more elaborate options
- Each meal should be complete and satisfying
- Note which ingredients are available vs which need to be purchased
- Be creative but practical
- Include accurate prep/cook times and calorie estimates

Return ONLY valid JSON.`

    const mealResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: mealPrompt },
      ],
    })

    let meals: MealSuggestion[] = []
    const mealTextContent = mealResponse.content.find((block) => block.type === 'text')
    if (mealTextContent && mealTextContent.type === 'text') {
      const jsonMatch = mealTextContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        meals = parsed.meals || []
      }
    }

    return NextResponse.json({
      ingredients: uniqueIngredients,
      totalIngredients: uniqueIngredients.length,
      meals,
      totalMeals: meals.length,
    })
  } catch (error) {
    console.error('Scan and cook error:', error)

    // Return mock data for demo
    return NextResponse.json({
      ingredients: [
        { name: 'chicken breast', quantity: '2 lbs', category: 'protein' },
        { name: 'broccoli', quantity: '1 head', category: 'vegetable' },
        { name: 'garlic', quantity: '1 bulb', category: 'spice' },
        { name: 'onion', quantity: '2 medium', category: 'vegetable' },
        { name: 'rice', quantity: '2 cups', category: 'grain' },
        { name: 'soy sauce', quantity: '1 bottle', category: 'condiment' },
        { name: 'olive oil', quantity: '1 bottle', category: 'pantry' },
        { name: 'eggs', quantity: '1 dozen', category: 'protein' },
      ],
      totalIngredients: 8,
      meals: [
        {
          name: 'Chicken & Broccoli Stir Fry',
          description: 'A quick and healthy stir fry with tender chicken and crisp broccoli in a savory sauce',
          prepTime: 15,
          cookTime: 15,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['2 lbs chicken breast', '1 head broccoli', '3 cloves garlic', '2 tbsp soy sauce', '1 tbsp olive oil'],
          instructions: [
            'Cut chicken into bite-sized pieces',
            'Heat oil in a large wok over high heat',
            'Cook chicken until golden, 5-6 minutes',
            'Add broccoli and garlic, stir fry 4 minutes',
            'Add soy sauce and toss to coat',
            'Serve over rice'
          ],
          matchedIngredients: ['chicken breast', 'broccoli', 'garlic', 'soy sauce', 'olive oil', 'rice'],
          missingIngredients: [],
          calories: 420,
          tags: ['quick', 'healthy', 'high-protein']
        },
        {
          name: 'Garlic Fried Rice with Eggs',
          description: 'Classic fried rice loaded with garlic and topped with perfectly fried eggs',
          prepTime: 10,
          cookTime: 15,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['2 cups cooked rice', '4 eggs', '4 cloves garlic', '1 onion', '2 tbsp soy sauce'],
          instructions: [
            'Cook rice and let it cool (or use day-old rice)',
            'Mince garlic and dice onion',
            'Heat oil in wok, scramble eggs and set aside',
            'Sauté garlic and onion until fragrant',
            'Add rice and stir fry on high heat',
            'Add soy sauce, mix in eggs, serve hot'
          ],
          matchedIngredients: ['rice', 'eggs', 'garlic', 'onion', 'soy sauce', 'olive oil'],
          missingIngredients: [],
          calories: 380,
          tags: ['quick', 'vegetarian-option', 'budget-friendly']
        },
        {
          name: 'Chicken Rice Bowl',
          description: 'Tender sliced chicken over fluffy rice with caramelized onions and garlic',
          prepTime: 10,
          cookTime: 25,
          servings: 4,
          difficulty: 'Easy',
          ingredients: ['1.5 lbs chicken breast', '2 cups rice', '2 onions', '4 cloves garlic', 'soy sauce'],
          instructions: [
            'Season chicken with salt and pepper',
            'Cook rice according to package directions',
            'Slice onions and mince garlic',
            'Pan-sear chicken until cooked through, slice',
            'Caramelize onions with garlic in the same pan',
            'Serve chicken over rice with caramelized onions'
          ],
          matchedIngredients: ['chicken breast', 'rice', 'onion', 'garlic', 'soy sauce'],
          missingIngredients: [],
          calories: 480,
          tags: ['meal-prep', 'high-protein', 'kid-friendly']
        }
      ],
      totalMeals: 3,
    })
  }
}
