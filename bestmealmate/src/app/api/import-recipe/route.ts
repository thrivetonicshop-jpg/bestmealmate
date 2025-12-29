import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BestMealMate/1.0; +https://bestmealmate.com)',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch recipe page' }, { status: 400 })
    }

    const html = await response.text()

    // Use Claude to extract recipe data
    const anthropic = getAnthropic()
    const extractionResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: `You are a recipe extraction assistant. Extract recipe information from HTML content and return it as a valid JSON object. Be thorough and accurate.`,
      messages: [
        {
          role: 'user',
          content: `Extract the recipe from this HTML and return ONLY a valid JSON object with these fields:
{
  "name": "Recipe name",
  "description": "Brief description",
  "cuisine": "Cuisine type (American, Italian, Mexican, etc.)",
  "meal_type": "breakfast, lunch, dinner, snack, or dessert",
  "prep_time": number in minutes,
  "cook_time": number in minutes,
  "servings": number,
  "difficulty": "Easy", "Medium", or "Hard",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "dietary": ["vegetarian", "vegan", "gluten-free", etc. - only include if applicable],
  "calories": estimated calories per serving (number),
  "image_url": "image URL if found in the HTML"
}

HTML content:
${html.slice(0, 50000)}` // Limit HTML to avoid token limits
        }
      ]
    })

    const textContent = extractionResponse.content.find(block => block.type === 'text')
    const extractedText = textContent ? textContent.text : ''

    // Parse the JSON from Claude's response
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not extract recipe data' }, { status: 400 })
    }

    const recipe = JSON.parse(jsonMatch[0])

    // Add metadata
    recipe.id = `imported-${Date.now()}`
    recipe.source_url = url
    recipe.imported_at = new Date().toISOString()
    recipe.rating = 0
    recipe.reviews = 0

    return NextResponse.json({
      success: true,
      recipe
    })
  } catch (error) {
    console.error('Recipe import error:', error)
    return NextResponse.json({
      error: 'Failed to import recipe. Please check the URL and try again.',
      success: false
    }, { status: 500 })
  }
}
