/**
 * External Recipe API Integration
 * Integrates with Spoonacular API for real recipe discovery
 * Falls back to internal generator when API is unavailable
 */

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com'

export interface ExternalRecipe {
  id: number
  title: string
  image: string
  imageType?: string
  servings: number
  readyInMinutes: number
  sourceUrl?: string
  summary?: string
  cuisines: string[]
  dishTypes: string[]
  diets: string[]
  instructions?: string
  extendedIngredients?: {
    id: number
    name: string
    amount: number
    unit: string
    original: string
  }[]
  nutrition?: {
    nutrients: {
      name: string
      amount: number
      unit: string
    }[]
  }
}

export interface RecipeSearchResult {
  results: ExternalRecipe[]
  offset: number
  number: number
  totalResults: number
}

export interface RecipeSearchParams {
  query?: string
  cuisine?: string
  diet?: string
  intolerances?: string
  type?: string // meal type: main course, side dish, dessert, etc.
  maxReadyTime?: number
  minCalories?: number
  maxCalories?: number
  number?: number
  offset?: number
  addRecipeInformation?: boolean
  fillIngredients?: boolean
}

/**
 * Search recipes from Spoonacular API
 */
export async function searchExternalRecipes(
  params: RecipeSearchParams,
  apiKey?: string
): Promise<RecipeSearchResult> {
  const key = apiKey || process.env.SPOONACULAR_API_KEY

  if (!key) {
    console.warn('Spoonacular API key not configured, using fallback')
    return getFallbackRecipes(params)
  }

  try {
    const searchParams = new URLSearchParams()
    searchParams.set('apiKey', key)
    searchParams.set('number', String(params.number || 20))
    searchParams.set('offset', String(params.offset || 0))
    searchParams.set('addRecipeInformation', 'true')
    searchParams.set('fillIngredients', 'true')

    if (params.query) searchParams.set('query', params.query)
    if (params.cuisine) searchParams.set('cuisine', params.cuisine)
    if (params.diet) searchParams.set('diet', params.diet)
    if (params.intolerances) searchParams.set('intolerances', params.intolerances)
    if (params.type) searchParams.set('type', params.type)
    if (params.maxReadyTime) searchParams.set('maxReadyTime', String(params.maxReadyTime))

    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching from Spoonacular:', error)
    return getFallbackRecipes(params)
  }
}

/**
 * Get random recipes for discovery
 */
export async function getRandomRecipes(
  count: number = 10,
  tags?: string,
  apiKey?: string
): Promise<ExternalRecipe[]> {
  const key = apiKey || process.env.SPOONACULAR_API_KEY

  if (!key) {
    return getFallbackRandomRecipes(count)
  }

  try {
    const searchParams = new URLSearchParams()
    searchParams.set('apiKey', key)
    searchParams.set('number', String(count))
    if (tags) searchParams.set('tags', tags)

    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/random?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }
    )

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    const data = await response.json()
    return data.recipes || []
  } catch (error) {
    console.error('Error fetching random recipes:', error)
    return getFallbackRandomRecipes(count)
  }
}

/**
 * Get recipe details by ID
 */
export async function getRecipeById(
  id: number,
  apiKey?: string
): Promise<ExternalRecipe | null> {
  const key = apiKey || process.env.SPOONACULAR_API_KEY

  if (!key) {
    return null
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${key}&includeNutrition=true`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    return null
  }
}

/**
 * Search recipes by ingredients you have
 */
export async function searchByIngredients(
  ingredients: string[],
  count: number = 10,
  apiKey?: string
): Promise<ExternalRecipe[]> {
  const key = apiKey || process.env.SPOONACULAR_API_KEY

  if (!key) {
    return getFallbackRandomRecipes(count)
  }

  try {
    const searchParams = new URLSearchParams()
    searchParams.set('apiKey', key)
    searchParams.set('ingredients', ingredients.join(','))
    searchParams.set('number', String(count))
    searchParams.set('ranking', '2') // Maximize used ingredients
    searchParams.set('ignorePantry', 'true')

    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?${searchParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 1800 },
      }
    )

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error searching by ingredients:', error)
    return getFallbackRandomRecipes(count)
  }
}

/**
 * Get similar recipes
 */
export async function getSimilarRecipes(
  recipeId: number,
  count: number = 5,
  apiKey?: string
): Promise<ExternalRecipe[]> {
  const key = apiKey || process.env.SPOONACULAR_API_KEY

  if (!key) {
    return getFallbackRandomRecipes(count)
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/similar?apiKey=${key}&number=${count}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 },
      }
    )

    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching similar recipes:', error)
    return getFallbackRandomRecipes(count)
  }
}

// Fallback to internal recipe generator
import { generateRecipes, searchRecipes } from './recipe-generator'

function getFallbackRecipes(params: RecipeSearchParams): RecipeSearchResult {
  const page = Math.floor((params.offset || 0) / (params.number || 20))
  const limit = params.number || 20

  let recipes
  if (params.query) {
    recipes = searchRecipes(params.query, page, limit)
  } else {
    recipes = generateRecipes(page, limit)
  }

  // Convert to external format
  const results: ExternalRecipe[] = recipes.map(r => ({
    id: parseInt(r.id.replace('recipe-', '')),
    title: r.name,
    image: r.image_url,
    servings: r.servings,
    readyInMinutes: r.prep_time_minutes + r.cook_time_minutes,
    cuisines: [r.cuisine],
    dishTypes: [r.meal_type],
    diets: r.tags,
    summary: r.description,
    extendedIngredients: r.ingredients.map((ing, i) => ({
      id: i,
      name: ing,
      amount: 1,
      unit: '',
      original: ing
    }))
  }))

  return {
    results,
    offset: params.offset || 0,
    number: results.length,
    totalResults: 1000000 // Our generator can produce unlimited
  }
}

function getFallbackRandomRecipes(count: number): ExternalRecipe[] {
  const randomPage = Math.floor(Math.random() * 10000)
  const recipes = generateRecipes(randomPage, count)

  return recipes.map(r => ({
    id: parseInt(r.id.replace('recipe-', '')),
    title: r.name,
    image: r.image_url,
    servings: r.servings,
    readyInMinutes: r.prep_time_minutes + r.cook_time_minutes,
    cuisines: [r.cuisine],
    dishTypes: [r.meal_type],
    diets: r.tags,
    summary: r.description
  }))
}

/**
 * Available cuisines for filtering
 */
export const CUISINES = [
  'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
  'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian',
  'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
  'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern',
  'Spanish', 'Thai', 'Vietnamese'
]

/**
 * Available diets for filtering
 */
export const DIETS = [
  'gluten free', 'ketogenic', 'vegetarian', 'lacto-vegetarian',
  'ovo-vegetarian', 'vegan', 'pescetarian', 'paleo', 'primal', 'whole30'
]

/**
 * Common intolerances
 */
export const INTOLERANCES = [
  'dairy', 'egg', 'gluten', 'grain', 'peanut', 'seafood',
  'sesame', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat'
]

/**
 * Meal types
 */
export const MEAL_TYPES = [
  'main course', 'side dish', 'dessert', 'appetizer', 'salad',
  'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade',
  'fingerfood', 'snack', 'drink'
]
