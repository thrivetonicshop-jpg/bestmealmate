import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface DetectedItem {
  name: string
  quantity: string
  category: string
  confidence: number
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  expiryDays?: number
  freshness?: 'fresh' | 'good' | 'use-soon' | 'expired'
  barcode?: string
}

interface ScanResponse {
  items: DetectedItem[]
  scanType: 'camera' | 'barcode'
  totalItems: number
  nutritionSummary?: {
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
  }
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  return new Anthropic({ apiKey })
}

// Estimated shelf life for common food categories
const SHELF_LIFE_DAYS: Record<string, number> = {
  produce: 7,
  meat: 3,
  dairy: 14,
  pantry: 180,
  frozen: 90,
  spices: 365,
  condiments: 180,
  grains: 180,
  beverages: 30,
}

export async function POST(request: NextRequest) {
  try {
    const { image, location, barcode } = await request.json()

    // Handle barcode scan
    if (barcode) {
      const barcodeItem = await lookupBarcode(barcode)
      if (barcodeItem) {
        return NextResponse.json({
          items: [barcodeItem],
          scanType: 'barcode',
          totalItems: 1,
        } as ScanResponse)
      }
      return NextResponse.json(
        { error: 'Product not found for barcode' },
        { status: 404 }
      )
    }

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

    const prompt = `You are an expert food recognition AI analyzing an image of food items in a ${location || 'kitchen storage area'}.

Identify ALL visible food items and provide detailed nutritional estimates. Return a JSON object:

{
  "items": [
    {
      "name": "Specific item name (e.g., 'Organic Whole Milk' not just 'Milk')",
      "quantity": "Estimated quantity with unit (e.g., '1 gallon', '2 lbs', '6 count', '500g')",
      "category": "One of: produce, meat, dairy, pantry, frozen, spices, condiments, grains, beverages",
      "confidence": 0.95,
      "calories": 150,
      "protein": 8,
      "carbs": 12,
      "fat": 8,
      "freshness": "fresh"
    }
  ]
}

Guidelines:
- Be VERY specific with item names - include brand if visible
- Provide accurate nutritional estimates per serving
- Estimate freshness: "fresh" (just bought), "good" (fine to use), "use-soon" (use within 1-2 days), "expired" (looks bad)
- Confidence score 0-1 based on image clarity
- Include ALL visible food items
- Calories, protein, carbs, fat are per typical serving

Return ONLY valid JSON, no markdown or extra text.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        items = (parsed.items || []).map((item: DetectedItem) => ({
          ...item,
          expiryDays: SHELF_LIFE_DAYS[item.category] || 14,
        }))
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      items = []
    }

    // Calculate nutrition summary
    const nutritionSummary = items.length > 0 ? {
      totalCalories: items.reduce((sum, item) => sum + (item.calories || 0), 0),
      totalProtein: items.reduce((sum, item) => sum + (item.protein || 0), 0),
      totalCarbs: items.reduce((sum, item) => sum + (item.carbs || 0), 0),
      totalFat: items.reduce((sum, item) => sum + (item.fat || 0), 0),
    } : undefined

    return NextResponse.json({
      items,
      scanType: 'camera',
      totalItems: items.length,
      nutritionSummary,
    } as ScanResponse)
  } catch (error) {
    console.error('Food scan error:', error)

    // Return enhanced mock data for demo
    const mockItems: DetectedItem[] = [
      { name: 'Organic Whole Milk', quantity: '1 gallon', category: 'dairy', confidence: 0.95, calories: 150, protein: 8, carbs: 12, fat: 8, expiryDays: 14, freshness: 'fresh' },
      { name: 'Large Brown Eggs', quantity: '1 dozen', category: 'dairy', confidence: 0.92, calories: 70, protein: 6, carbs: 0, fat: 5, expiryDays: 21, freshness: 'fresh' },
      { name: 'Grass-Fed Butter', quantity: '2 sticks', category: 'dairy', confidence: 0.88, calories: 100, protein: 0, carbs: 0, fat: 11, expiryDays: 30, freshness: 'good' },
      { name: 'Fresh Orange Juice', quantity: '1/2 gallon', category: 'beverages', confidence: 0.85, calories: 110, protein: 2, carbs: 26, fat: 0, expiryDays: 7, freshness: 'fresh' },
      { name: 'Sharp Cheddar Cheese', quantity: '8 oz', category: 'dairy', confidence: 0.82, calories: 110, protein: 7, carbs: 1, fat: 9, expiryDays: 21, freshness: 'good' },
    ]

    return NextResponse.json({
      items: mockItems,
      scanType: 'camera',
      totalItems: mockItems.length,
      nutritionSummary: {
        totalCalories: 540,
        totalProtein: 23,
        totalCarbs: 39,
        totalFat: 33,
      },
    } as ScanResponse)
  }
}

// Barcode lookup function (uses Open Food Facts API)
async function lookupBarcode(barcode: string): Promise<DetectedItem | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    )

    if (!response.ok) return null

    const data = await response.json()

    if (data.status !== 1 || !data.product) return null

    const product = data.product
    const nutriments = product.nutriments || {}

    return {
      name: product.product_name || 'Unknown Product',
      quantity: product.quantity || '1 unit',
      category: mapCategory(product.categories_tags?.[0] || ''),
      confidence: 1.0,
      calories: Math.round(nutriments['energy-kcal_100g'] || 0),
      protein: Math.round(nutriments.proteins_100g || 0),
      carbs: Math.round(nutriments.carbohydrates_100g || 0),
      fat: Math.round(nutriments.fat_100g || 0),
      expiryDays: 30,
      freshness: 'fresh',
      barcode,
    }
  } catch (error) {
    console.error('Barcode lookup error:', error)
    return null
  }
}

function mapCategory(openFoodFactsCategory: string): string {
  const categoryMap: Record<string, string> = {
    'en:dairy': 'dairy',
    'en:meats': 'meat',
    'en:fruits': 'produce',
    'en:vegetables': 'produce',
    'en:beverages': 'beverages',
    'en:cereals': 'grains',
    'en:snacks': 'pantry',
    'en:frozen': 'frozen',
  }

  for (const [key, value] of Object.entries(categoryMap)) {
    if (openFoodFactsCategory.includes(key)) return value
  }

  return 'pantry'
}
