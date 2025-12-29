// Recipe Generator - Creates 1,000,000+ unique recipes programmatically

const cuisines = [
  'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian', 'French',
  'Greek', 'Spanish', 'Korean', 'Vietnamese', 'Mediterranean', 'Middle Eastern', 'Brazilian',
  'Cajun', 'Caribbean', 'Ethiopian', 'Moroccan', 'German', 'British', 'Irish', 'Polish',
  'Russian', 'Turkish', 'Lebanese', 'Israeli', 'Filipino', 'Indonesian', 'Malaysian',
  'Peruvian', 'Argentine', 'Cuban', 'Jamaican', 'Hawaiian', 'Tex-Mex', 'Soul Food',
  'Southern', 'New England', 'Pacific Northwest', 'Southwestern'
]

const mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert')[] = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']

const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']

const proteins = [
  'chicken', 'beef', 'pork', 'salmon', 'shrimp', 'tofu', 'tempeh', 'lamb', 'turkey',
  'duck', 'cod', 'tuna', 'tilapia', 'halibut', 'crab', 'lobster', 'scallops', 'mussels',
  'eggs', 'chickpeas', 'lentils', 'black beans', 'kidney beans', 'white beans', 'edamame',
  'seitan', 'ground beef', 'ground turkey', 'ground pork', 'bacon', 'sausage', 'ham',
  'prosciutto', 'pancetta', 'chorizo', 'andouille', 'brisket', 'ribeye', 'sirloin',
  'flank steak', 'chicken thighs', 'chicken breast', 'chicken wings', 'pulled pork'
]

const vegetables = [
  'broccoli', 'spinach', 'kale', 'carrots', 'bell peppers', 'onions', 'garlic', 'tomatoes',
  'zucchini', 'squash', 'eggplant', 'mushrooms', 'asparagus', 'green beans', 'peas',
  'corn', 'potatoes', 'sweet potatoes', 'cauliflower', 'cabbage', 'brussels sprouts',
  'celery', 'cucumber', 'lettuce', 'arugula', 'chard', 'beets', 'radishes', 'turnips',
  'parsnips', 'leeks', 'scallions', 'shallots', 'artichokes', 'fennel', 'bok choy',
  'snap peas', 'edamame', 'okra', 'jalapeños', 'poblanos', 'serranos', 'habaneros'
]

const grains = [
  'rice', 'pasta', 'quinoa', 'couscous', 'bulgur', 'farro', 'barley', 'oats',
  'bread', 'noodles', 'tortillas', 'pita', 'naan', 'polenta', 'grits', 'cornmeal',
  'soba noodles', 'udon noodles', 'rice noodles', 'egg noodles', 'orzo', 'risotto',
  'spaghetti', 'penne', 'rigatoni', 'linguine', 'fettuccine', 'lasagna sheets'
]

const cookingMethods = [
  'grilled', 'roasted', 'baked', 'fried', 'sautéed', 'steamed', 'braised', 'poached',
  'smoked', 'broiled', 'pan-seared', 'stir-fried', 'slow-cooked', 'pressure-cooked',
  'air-fried', 'blackened', 'charred', 'caramelized', 'glazed', 'stuffed', 'wrapped'
]

const flavors = [
  'garlic', 'lemon', 'honey', 'teriyaki', 'barbecue', 'buffalo', 'cajun', 'herb',
  'Mediterranean', 'Asian-inspired', 'spicy', 'tangy', 'sweet and sour', 'smoky',
  'citrus', 'ginger', 'sesame', 'pesto', 'marinara', 'alfredo', 'curry', 'tikka masala',
  'kung pao', 'General Tso', 'orange', 'mango', 'pineapple', 'chipotle', 'adobo',
  'miso', 'wasabi', 'sriracha', 'harissa', 'chimichurri', 'romesco', 'tahini'
]

const tags = [
  'vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_free', 'keto', 'paleo',
  'low_carb', 'low_sodium', 'high_protein', 'whole30', 'mediterranean', 'heart_healthy'
]

const breakfastItems = [
  'pancakes', 'waffles', 'french toast', 'eggs benedict', 'omelette', 'frittata',
  'breakfast burrito', 'breakfast sandwich', 'smoothie bowl', 'acai bowl', 'granola',
  'overnight oats', 'avocado toast', 'bagel', 'muffins', 'scones', 'croissants',
  'quiche', 'shakshuka', 'huevos rancheros', 'breakfast tacos', 'hash', 'crepes'
]

const desserts = [
  'chocolate cake', 'cheesecake', 'brownies', 'cookies', 'ice cream', 'tiramisu',
  'crème brûlée', 'panna cotta', 'mousse', 'pie', 'tart', 'cobbler', 'crisp',
  'pudding', 'parfait', 'sorbet', 'gelato', 'macarons', 'churros', 'baklava',
  'cannoli', 'eclairs', 'profiteroles', 'flan', 'tres leches', 'mochi', 'dango'
]

const snacks = [
  'hummus with veggies', 'guacamole', 'salsa', 'trail mix', 'energy balls',
  'protein bites', 'spring rolls', 'dumplings', 'bruschetta', 'caprese skewers',
  'deviled eggs', 'stuffed mushrooms', 'cheese board', 'flatbread', 'nachos',
  'quesadillas', 'sliders', 'wings', 'popcorn', 'chips', 'pretzels', 'crackers'
]

// Seeded random number generator for consistent results
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function pickFromArray<T>(arr: T[], seed: number): T {
  const index = Math.floor(seededRandom(seed) * arr.length)
  return arr[index]
}

function pickMultipleFromArray<T>(arr: T[], count: number, seed: number): T[] {
  const result: T[] = []
  const used = new Set<number>()
  let s = seed
  while (result.length < count && used.size < arr.length) {
    const index = Math.floor(seededRandom(s) * arr.length)
    if (!used.has(index)) {
      used.add(index)
      result.push(arr[index])
    }
    s++
  }
  return result
}

function generateRecipeName(id: number): { name: string; description: string; mealType: typeof mealTypes[number] } {
  const seed = id * 7919 // Prime number for better distribution

  // Determine meal type based on id distribution
  const mealType = mealTypes[id % 5]

  let name: string
  let description: string

  if (mealType === 'breakfast') {
    const item = pickFromArray(breakfastItems, seed)
    const flavor = pickFromArray(flavors, seed + 1)
    const style = pickFromArray(['Classic', 'Homestyle', 'Gourmet', 'Quick', 'Weekend', 'Healthy'], seed + 2)
    name = `${style} ${flavor.charAt(0).toUpperCase() + flavor.slice(1)} ${item.charAt(0).toUpperCase() + item.slice(1)}`
    description = `Start your day right with this delicious ${item} featuring ${flavor} flavors.`
  } else if (mealType === 'dessert') {
    const item = pickFromArray(desserts, seed)
    const style = pickFromArray(['Decadent', 'Rich', 'Light', 'Classic', 'Gourmet', 'Homemade'], seed + 1)
    const flavor = pickFromArray(['chocolate', 'vanilla', 'caramel', 'berry', 'citrus', 'coffee'], seed + 2)
    name = `${style} ${flavor.charAt(0).toUpperCase() + flavor.slice(1)} ${item.charAt(0).toUpperCase() + item.slice(1)}`
    description = `Indulge in this ${style.toLowerCase()} ${item} with hints of ${flavor}.`
  } else if (mealType === 'snack') {
    const item = pickFromArray(snacks, seed)
    const style = pickFromArray(['Crispy', 'Savory', 'Spicy', 'Loaded', 'Party', 'Healthy'], seed + 1)
    name = `${style} ${item.charAt(0).toUpperCase() + item.slice(1)}`
    description = `Perfect for any occasion, these ${style.toLowerCase()} ${item} are always a hit.`
  } else {
    // Lunch and Dinner
    const protein = pickFromArray(proteins, seed)
    const method = pickFromArray(cookingMethods, seed + 1)
    const flavor = pickFromArray(flavors, seed + 2)
    const veggie = pickFromArray(vegetables, seed + 3)
    const grain = pickFromArray(grains, seed + 4)

    const patterns = [
      `${method.charAt(0).toUpperCase() + method.slice(1)} ${flavor} ${protein}`,
      `${flavor.charAt(0).toUpperCase() + flavor.slice(1)} ${method} ${protein} with ${veggie}`,
      `${protein.charAt(0).toUpperCase() + protein.slice(1)} ${grain} Bowl`,
      `${method.charAt(0).toUpperCase() + method.slice(1)} ${protein} and ${veggie}`,
      `${flavor.charAt(0).toUpperCase() + flavor.slice(1)} ${protein} Stir Fry`,
      `${protein.charAt(0).toUpperCase() + protein.slice(1)} with ${flavor} ${veggie}`,
      `One-Pan ${flavor} ${protein}`,
      `Sheet Pan ${method} ${protein}`,
      `Slow Cooker ${flavor} ${protein}`,
      `${protein.charAt(0).toUpperCase() + protein.slice(1)} ${flavor} ${grain}`
    ]

    name = pickFromArray(patterns, seed + 5)
    description = `A delicious ${method} ${protein} dish featuring ${flavor} flavors, served with ${veggie} and ${grain}.`
  }

  return { name, description, mealType }
}

export interface GeneratedRecipe {
  id: string
  name: string
  description: string
  cuisine: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  prep_time_minutes: number
  cook_time_minutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  image_url: string
  is_kid_friendly: boolean
  is_quick_meal: boolean
  tags: string[]
  rating: number
  is_favorite: boolean
  calories: number
  ingredients: string[]
  instructions: string[]
}

export function generateRecipe(id: number): GeneratedRecipe {
  const seed = id * 7919
  const { name, description, mealType } = generateRecipeName(id)

  const cuisine = pickFromArray(cuisines, seed + 10)
  const difficulty = pickFromArray(difficulties, seed + 11)

  const prepTime = [5, 10, 15, 20, 25, 30][Math.floor(seededRandom(seed + 12) * 6)]
  const cookTime = [10, 15, 20, 25, 30, 35, 40, 45, 60][Math.floor(seededRandom(seed + 13) * 9)]

  const servings = [2, 4, 6, 8][Math.floor(seededRandom(seed + 14) * 4)]
  const rating = Math.round((3.5 + seededRandom(seed + 15) * 1.5) * 10) / 10
  const calories = Math.round(200 + seededRandom(seed + 16) * 600)

  const recipeTags = pickMultipleFromArray(tags, Math.floor(seededRandom(seed + 17) * 4), seed + 18)

  const isKidFriendly = seededRandom(seed + 19) > 0.6
  const isQuickMeal = prepTime + cookTime <= 30

  // Generate image URL using placeholder with seed for consistency
  const imageCategories = ['food', 'dinner', 'lunch', 'breakfast', 'meal']
  const imgCategory = pickFromArray(imageCategories, seed + 20)
  const imageUrl = `https://source.unsplash.com/400x300/?${imgCategory},${cuisine.toLowerCase().replace(' ', '-')}&sig=${id}`

  // Generate ingredients
  const numIngredients = 5 + Math.floor(seededRandom(seed + 21) * 8)
  const ingredientsList: string[] = []
  const allIngredients = [...proteins, ...vegetables, ...grains]
  const selectedIngredients = pickMultipleFromArray(allIngredients, numIngredients, seed + 22)

  selectedIngredients.forEach((ing, i) => {
    const amounts = ['1 cup', '2 cups', '1/2 cup', '1 lb', '2 lbs', '1/4 cup', '3 tbsp', '2 tbsp', '1 tsp', '4 oz', '8 oz']
    const amount = pickFromArray(amounts, seed + 23 + i)
    ingredientsList.push(`${amount} ${ing}`)
  })

  // Generate instructions
  const numSteps = 4 + Math.floor(seededRandom(seed + 30) * 5)
  const instructionTemplates = [
    'Preheat oven to 400°F (200°C).',
    'Season the protein with salt, pepper, and your chosen spices.',
    'Heat oil in a large pan over medium-high heat.',
    'Cook until golden brown on all sides, about 5-7 minutes.',
    'Add the vegetables and sauté for 3-4 minutes.',
    'Stir in the sauce and bring to a simmer.',
    'Reduce heat and cook for 10-15 minutes until tender.',
    'Garnish with fresh herbs and serve hot.',
    'Let rest for 5 minutes before slicing.',
    'Transfer to a serving dish and enjoy immediately.',
    'Season to taste with salt and pepper.',
    'Sprinkle with your favorite toppings.',
    'Serve over rice or with crusty bread.',
    'Store leftovers in an airtight container for up to 3 days.'
  ]

  const instructions = pickMultipleFromArray(instructionTemplates, numSteps, seed + 31)

  return {
    id: `recipe-${id}`,
    name,
    description,
    cuisine,
    meal_type: mealType,
    prep_time_minutes: prepTime,
    cook_time_minutes: cookTime,
    difficulty,
    servings,
    image_url: imageUrl,
    is_kid_friendly: isKidFriendly,
    is_quick_meal: isQuickMeal,
    tags: recipeTags,
    rating,
    is_favorite: seededRandom(seed + 40) > 0.9,
    calories,
    ingredients: ingredientsList,
    instructions
  }
}

export function generateRecipes(page: number, limit: number = 50): GeneratedRecipe[] {
  const startId = page * limit
  const recipes: GeneratedRecipe[] = []

  for (let i = 0; i < limit; i++) {
    recipes.push(generateRecipe(startId + i))
  }

  return recipes
}

export function searchRecipes(query: string, page: number = 0, limit: number = 50): GeneratedRecipe[] {
  const results: GeneratedRecipe[] = []
  const queryLower = query.toLowerCase()
  let checked = 0
  let id = page * limit * 10 // Start further in to find matches

  while (results.length < limit && checked < 100000) {
    const recipe = generateRecipe(id)
    if (
      recipe.name.toLowerCase().includes(queryLower) ||
      recipe.description.toLowerCase().includes(queryLower) ||
      recipe.cuisine.toLowerCase().includes(queryLower) ||
      recipe.tags.some(t => t.toLowerCase().includes(queryLower))
    ) {
      results.push(recipe)
    }
    id++
    checked++
  }

  return results
}

export function filterRecipes(
  filters: {
    cuisine?: string
    mealType?: string
    difficulty?: string
    maxTime?: number
    tags?: string[]
    kidFriendly?: boolean
  },
  page: number = 0,
  limit: number = 50
): GeneratedRecipe[] {
  const results: GeneratedRecipe[] = []
  let id = page * limit * 5
  let checked = 0

  while (results.length < limit && checked < 50000) {
    const recipe = generateRecipe(id)
    let matches = true

    if (filters.cuisine && recipe.cuisine !== filters.cuisine) matches = false
    if (filters.mealType && recipe.meal_type !== filters.mealType) matches = false
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) matches = false
    if (filters.maxTime && (recipe.prep_time_minutes + recipe.cook_time_minutes) > filters.maxTime) matches = false
    if (filters.kidFriendly && !recipe.is_kid_friendly) matches = false
    if (filters.tags && filters.tags.length > 0) {
      const hasAllTags = filters.tags.every(t => recipe.tags.includes(t))
      if (!hasAllTags) matches = false
    }

    if (matches) results.push(recipe)
    id++
    checked++
  }

  return results
}

export const TOTAL_RECIPES = 1000000
