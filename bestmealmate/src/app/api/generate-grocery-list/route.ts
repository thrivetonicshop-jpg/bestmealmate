import { NextRequest, NextResponse } from 'next/server'

interface MealIngredient {
  name: string
  amount: string
  notes?: string
}

interface PlannedMeal {
  name: string
  ingredients: MealIngredient[]
  servings: number
}

interface GenerateGroceryListRequest {
  householdId: string
  meals: PlannedMeal[]
  pantryItems?: Array<{ name: string; quantity: number; unit: string }>
  excludeStaples?: boolean
}

interface GroceryItem {
  name: string
  amount: string
  aisle: string
  needed: boolean
  sources: string[] // Which meals need this ingredient
}

// Categorize ingredients by aisle
function getAisle(ingredientName: string): string {
  const name = ingredientName.toLowerCase()

  // Produce
  if (['lettuce', 'spinach', 'kale', 'arugula', 'tomato', 'onion', 'garlic', 'pepper', 'carrot',
       'celery', 'cucumber', 'zucchini', 'squash', 'broccoli', 'cauliflower', 'cabbage', 'mushroom',
       'avocado', 'lemon', 'lime', 'apple', 'banana', 'orange', 'berry', 'grape', 'melon',
       'potato', 'sweet potato', 'ginger', 'herbs', 'basil', 'cilantro', 'parsley', 'mint'].some(p => name.includes(p))) {
    return 'Produce'
  }

  // Meat & Seafood
  if (['chicken', 'beef', 'pork', 'lamb', 'turkey', 'salmon', 'fish', 'shrimp', 'crab', 'lobster',
       'bacon', 'sausage', 'ham', 'steak', 'ground'].some(p => name.includes(p))) {
    return 'Meat & Seafood'
  }

  // Dairy
  if (['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'sour cream', 'cottage'].some(p => name.includes(p))) {
    return 'Dairy & Eggs'
  }

  // Bakery
  if (['bread', 'roll', 'bun', 'tortilla', 'pita', 'bagel', 'croissant', 'muffin'].some(p => name.includes(p))) {
    return 'Bakery'
  }

  // Frozen
  if (['frozen', 'ice cream'].some(p => name.includes(p))) {
    return 'Frozen'
  }

  // Grains & Pasta
  if (['rice', 'pasta', 'noodle', 'quinoa', 'oat', 'cereal', 'flour', 'couscous', 'barley'].some(p => name.includes(p))) {
    return 'Grains & Pasta'
  }

  // Canned & Jarred
  if (['canned', 'can of', 'jar', 'tomato sauce', 'paste', 'beans', 'chickpea', 'lentil', 'broth', 'stock'].some(p => name.includes(p))) {
    return 'Canned & Jarred'
  }

  // Condiments & Sauces
  if (['sauce', 'ketchup', 'mustard', 'mayo', 'dressing', 'vinegar', 'soy sauce', 'teriyaki',
       'hot sauce', 'salsa', 'honey', 'syrup', 'jam'].some(p => name.includes(p))) {
    return 'Condiments & Sauces'
  }

  // Oils & Spices
  if (['oil', 'olive', 'vegetable', 'coconut', 'salt', 'pepper', 'spice', 'cumin', 'paprika',
       'oregano', 'thyme', 'rosemary', 'cinnamon', 'nutmeg', 'curry'].some(p => name.includes(p))) {
    return 'Oils & Spices'
  }

  // Snacks
  if (['chip', 'cracker', 'cookie', 'snack', 'nut', 'almond', 'peanut', 'granola'].some(p => name.includes(p))) {
    return 'Snacks'
  }

  // Beverages
  if (['juice', 'soda', 'water', 'coffee', 'tea', 'wine', 'beer'].some(p => name.includes(p))) {
    return 'Beverages'
  }

  return 'Other'
}

// Normalize ingredient name for comparison
function normalizeIngredient(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Check if ingredient is in pantry
function isInPantry(ingredientName: string, pantryItems: Array<{ name: string; quantity: number; unit: string }>): boolean {
  const normalized = normalizeIngredient(ingredientName)
  return pantryItems.some(item => {
    const pantryNormalized = normalizeIngredient(item.name)
    return normalized.includes(pantryNormalized) || pantryNormalized.includes(normalized)
  })
}

// Common staples that most people have
const COMMON_STAPLES = [
  'salt', 'pepper', 'water', 'oil', 'olive oil', 'vegetable oil',
  'sugar', 'flour', 'baking soda', 'baking powder'
]

function isStaple(ingredientName: string): boolean {
  const normalized = normalizeIngredient(ingredientName)
  return COMMON_STAPLES.some(staple => normalized.includes(staple))
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateGroceryListRequest = await request.json()
    const { meals, pantryItems = [], excludeStaples = true } = body

    // Aggregate all ingredients from all meals
    const ingredientMap = new Map<string, GroceryItem>()

    for (const meal of meals) {
      for (const ingredient of meal.ingredients) {
        const normalizedName = normalizeIngredient(ingredient.name)
        const existing = ingredientMap.get(normalizedName)

        if (existing) {
          // Add this meal as a source
          if (!existing.sources.includes(meal.name)) {
            existing.sources.push(meal.name)
          }
          // Combine amounts (simplified - just concatenate for now)
          if (!existing.amount.includes(ingredient.amount)) {
            existing.amount = `${existing.amount}, ${ingredient.amount}`
          }
        } else {
          // Check if in pantry
          const inPantry = isInPantry(ingredient.name, pantryItems)
          const isStapleItem = excludeStaples && isStaple(ingredient.name)

          ingredientMap.set(normalizedName, {
            name: ingredient.name,
            amount: ingredient.amount,
            aisle: getAisle(ingredient.name),
            needed: !inPantry && !isStapleItem,
            sources: [meal.name]
          })
        }
      }
    }

    // Convert to array and sort by aisle
    const groceryItems = Array.from(ingredientMap.values())
      .filter(item => item.needed)
      .sort((a, b) => a.aisle.localeCompare(b.aisle))

    // Group by aisle
    const groupedByAisle = groceryItems.reduce((acc, item) => {
      if (!acc[item.aisle]) {
        acc[item.aisle] = []
      }
      acc[item.aisle].push(item)
      return acc
    }, {} as Record<string, GroceryItem[]>)

    // Calculate summary
    const summary = {
      totalItems: groceryItems.length,
      byAisle: Object.entries(groupedByAisle).map(([aisle, items]) => ({
        aisle,
        count: items.length
      })),
      mealsIncluded: meals.length,
      itemsInPantry: Array.from(ingredientMap.values()).filter(item => !item.needed).length
    }

    return NextResponse.json({
      success: true,
      groceryList: {
        items: groceryItems,
        groupedByAisle,
        summary
      }
    })

  } catch (error) {
    console.error('Error generating grocery list:', error)
    return NextResponse.json(
      { error: 'Failed to generate grocery list', success: false },
      { status: 500 }
    )
  }
}
