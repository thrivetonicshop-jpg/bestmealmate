import { NextRequest, NextResponse } from 'next/server'
import {
  searchExternalRecipes,
  getRandomRecipes,
  searchByIngredients,
  RecipeSearchParams
} from '@/lib/recipe-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const mode = searchParams.get('mode') || 'search' // search, random, ingredients

    if (mode === 'random') {
      const count = parseInt(searchParams.get('count') || '10')
      const tags = searchParams.get('tags') || undefined

      const recipes = await getRandomRecipes(count, tags)

      return NextResponse.json({
        success: true,
        recipes,
        source: process.env.SPOONACULAR_API_KEY ? 'spoonacular' : 'internal'
      })
    }

    if (mode === 'ingredients') {
      const ingredientsParam = searchParams.get('ingredients')
      if (!ingredientsParam) {
        return NextResponse.json(
          { error: 'Missing ingredients parameter' },
          { status: 400 }
        )
      }

      const ingredients = ingredientsParam.split(',').map(i => i.trim())
      const count = parseInt(searchParams.get('count') || '10')

      const recipes = await searchByIngredients(ingredients, count)

      return NextResponse.json({
        success: true,
        recipes,
        source: process.env.SPOONACULAR_API_KEY ? 'spoonacular' : 'internal'
      })
    }

    // Default: search mode
    const params: RecipeSearchParams = {
      query: searchParams.get('query') || undefined,
      cuisine: searchParams.get('cuisine') || undefined,
      diet: searchParams.get('diet') || undefined,
      intolerances: searchParams.get('intolerances') || undefined,
      type: searchParams.get('type') || undefined,
      maxReadyTime: searchParams.get('maxReadyTime')
        ? parseInt(searchParams.get('maxReadyTime')!)
        : undefined,
      number: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    }

    const result = await searchExternalRecipes(params)

    return NextResponse.json({
      success: true,
      ...result,
      source: process.env.SPOONACULAR_API_KEY ? 'spoonacular' : 'internal'
    })
  } catch (error) {
    console.error('Recipe discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients, count = 10 } = body

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Invalid ingredients array' },
        { status: 400 }
      )
    }

    const recipes = await searchByIngredients(ingredients, count)

    return NextResponse.json({
      success: true,
      recipes,
      matchedIngredients: ingredients,
      source: process.env.SPOONACULAR_API_KEY ? 'spoonacular' : 'internal'
    })
  } catch (error) {
    console.error('Recipe discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}
