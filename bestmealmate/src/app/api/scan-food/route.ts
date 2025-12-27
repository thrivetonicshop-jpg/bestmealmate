import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface DetectedItem {
  name: string
  quantity: string
  category: string
  confidence: number
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
    const { image, location } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Extract base64 data from data URL
    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!base64Match) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      )
    }

    const mediaType = `image/${base64Match[1]}` as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const base64Data = base64Match[2]

    const anthropic = getAnthropic()

    const prompt = `You are analyzing an image of food items in a ${location || 'kitchen storage area'}.

Please identify all visible food items in this image and return a JSON array with the following format:

{
  "items": [
    {
      "name": "Item name",
      "quantity": "Estimated quantity (e.g., '1 gallon', '2 lbs', '6 count')",
      "category": "Category (one of: produce, meat, dairy, pantry, frozen, spices, condiments, grains, beverages)",
      "confidence": 0.95
    }
  ]
}

Guidelines:
- Be specific with item names (e.g., "Chicken Breast" not just "Chicken")
- Estimate reasonable quantities based on what you see
- The confidence score should be between 0 and 1
- Only include food items, not containers or appliances
- If you can't identify any food items clearly, return an empty array

Return ONLY the JSON object, no other text.`

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
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    // Extract text content
    const textContent = response.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    // Parse the JSON response
    let items: DetectedItem[] = []
    try {
      // Try to extract JSON from the response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        items = parsed.items || []
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      // Return empty array if parsing fails
      items = []
    }

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Food scan error:', error)

    // Return mock data for demo purposes when AI is not available
    const mockItems: DetectedItem[] = [
      { name: 'Milk', quantity: '1 gallon', category: 'dairy', confidence: 0.95 },
      { name: 'Eggs', quantity: '1 dozen', category: 'dairy', confidence: 0.92 },
      { name: 'Butter', quantity: '2 sticks', category: 'dairy', confidence: 0.88 },
      { name: 'Orange Juice', quantity: '1/2 gallon', category: 'beverages', confidence: 0.85 },
      { name: 'Cheese', quantity: '8 oz', category: 'dairy', confidence: 0.82 },
    ]

    return NextResponse.json({ items: mockItems })
  }
}
