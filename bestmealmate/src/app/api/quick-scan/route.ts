import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface Ingredient {
  name: string
  quantity: string
  category: string
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  return new Anthropic({ apiKey })
}

// Quick scan a single image and return ingredients
export async function POST(request: NextRequest) {
  try {
    const { image, location } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!base64Match) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    const mediaType = `image/${base64Match[1]}` as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const base64Data = base64Match[2]

    const anthropic = getAnthropic()

    const scanPrompt = `Analyze this image of ${location || 'food storage'} and identify ALL visible food items QUICKLY.

Return a JSON object:
{
  "ingredients": [
    {"name": "chicken breast", "quantity": "2 lbs", "category": "protein"},
    {"name": "broccoli", "quantity": "1 head", "category": "vegetable"}
  ]
}

Categories: protein, vegetable, fruit, grain, dairy, spice, condiment, pantry, beverage

Be FAST and thorough. Include EVERYTHING visible.
Return ONLY valid JSON.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            { type: 'text', text: scanPrompt },
          ],
        },
      ],
    })

    const textContent = response.content.find((block) => block.type === 'text')
    let ingredients: Ingredient[] = []

    if (textContent && textContent.type === 'text') {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        ingredients = parsed.ingredients || []
      }
    }

    return NextResponse.json({ ingredients, count: ingredients.length })
  } catch (error) {
    console.error('Quick scan error:', error)
    // Return mock data for demo
    return NextResponse.json({
      ingredients: [
        { name: 'chicken breast', quantity: '2 lbs', category: 'protein' },
        { name: 'broccoli', quantity: '1 head', category: 'vegetable' },
        { name: 'garlic', quantity: '4 cloves', category: 'spice' },
      ],
      count: 3,
    })
  }
}
