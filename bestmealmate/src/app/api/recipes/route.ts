import { NextRequest, NextResponse } from 'next/server'
import { generateRecipes, searchRecipes, filterRecipes, generateRecipe, TOTAL_RECIPES } from '@/lib/recipe-generator'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') || '0')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const query = searchParams.get('q') || searchParams.get('query')
  const id = searchParams.get('id')

  // Get single recipe by ID
  if (id) {
    const recipeId = parseInt(id.replace('recipe-', ''))
    if (isNaN(recipeId) || recipeId < 0 || recipeId >= TOTAL_RECIPES) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    const recipe = generateRecipe(recipeId)
    return NextResponse.json({ recipe })
  }

  // Search recipes
  if (query) {
    const recipes = searchRecipes(query, page, limit)
    return NextResponse.json({
      recipes,
      page,
      limit,
      total: TOTAL_RECIPES,
      hasMore: recipes.length === limit
    })
  }

  // Filter recipes
  const cuisine = searchParams.get('cuisine')
  const mealType = searchParams.get('mealType')
  const difficulty = searchParams.get('difficulty')
  const maxTime = searchParams.get('maxTime') ? parseInt(searchParams.get('maxTime')!) : undefined
  const kidFriendly = searchParams.get('kidFriendly') === 'true'
  const tags = searchParams.get('tags')?.split(',').filter(Boolean)

  if (cuisine || mealType || difficulty || maxTime || kidFriendly || tags?.length) {
    const recipes = filterRecipes(
      { cuisine: cuisine || undefined, mealType: mealType || undefined, difficulty: difficulty || undefined, maxTime, kidFriendly: kidFriendly || undefined, tags },
      page,
      limit
    )
    return NextResponse.json({
      recipes,
      page,
      limit,
      total: TOTAL_RECIPES,
      hasMore: recipes.length === limit
    })
  }

  // Default: paginated list
  const recipes = generateRecipes(page, limit)
  return NextResponse.json({
    recipes,
    page,
    limit,
    total: TOTAL_RECIPES,
    hasMore: (page + 1) * limit < TOTAL_RECIPES
  })
}
