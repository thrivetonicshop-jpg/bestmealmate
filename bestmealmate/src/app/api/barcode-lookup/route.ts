import { NextRequest, NextResponse } from 'next/server'

/**
 * Barcode Lookup API
 * Looks up product information from barcode databases
 */

interface ProductInfo {
  barcode: string
  name: string
  brand?: string
  category?: string
  quantity?: string
  imageUrl?: string
  nutrition?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
}

// Common product database for demo/fallback
const productDatabase: Record<string, ProductInfo> = {
  // Dairy
  '070470496528': {
    barcode: '070470496528',
    name: 'Whole Milk',
    brand: 'Organic Valley',
    category: 'Dairy',
    quantity: '1 gallon',
    nutrition: { calories: 150, protein: 8, carbs: 12, fat: 8 }
  },
  '041303024447': {
    barcode: '041303024447',
    name: 'Large Brown Eggs',
    brand: 'Eggland\'s Best',
    category: 'Dairy',
    quantity: '1 dozen',
    nutrition: { calories: 70, protein: 6, carbs: 0, fat: 5 }
  },
  '021130126026': {
    barcode: '021130126026',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    category: 'Dairy',
    quantity: '32 oz',
    nutrition: { calories: 100, protein: 17, carbs: 6, fat: 0 }
  },
  // Produce
  '4011': {
    barcode: '4011',
    name: 'Bananas',
    category: 'Produce',
    quantity: '1 lb',
    nutrition: { calories: 105, protein: 1, carbs: 27, fat: 0 }
  },
  '4065': {
    barcode: '4065',
    name: 'Green Peppers',
    category: 'Produce',
    quantity: '1 each',
    nutrition: { calories: 24, protein: 1, carbs: 5, fat: 0 }
  },
  // Meat
  '023700043733': {
    barcode: '023700043733',
    name: 'Chicken Breast',
    brand: 'Tyson',
    category: 'Meat',
    quantity: '2.5 lbs',
    nutrition: { calories: 165, protein: 31, carbs: 0, fat: 4 }
  },
  '036800309364': {
    barcode: '036800309364',
    name: 'Ground Beef 80/20',
    brand: 'Great Value',
    category: 'Meat',
    quantity: '1 lb',
    nutrition: { calories: 287, protein: 19, carbs: 0, fat: 23 }
  },
  // Pantry
  '038000596452': {
    barcode: '038000596452',
    name: 'Cheerios',
    brand: 'General Mills',
    category: 'Pantry',
    quantity: '18 oz',
    nutrition: { calories: 100, protein: 3, carbs: 20, fat: 2 }
  },
  '041196910704': {
    barcode: '041196910704',
    name: 'Pasta',
    brand: 'Barilla',
    category: 'Pantry',
    quantity: '16 oz',
    nutrition: { calories: 200, protein: 7, carbs: 42, fat: 1 }
  },
  '051500255155': {
    barcode: '051500255155',
    name: 'Tomato Sauce',
    brand: 'Hunt\'s',
    category: 'Pantry',
    quantity: '15 oz',
    nutrition: { calories: 20, protein: 1, carbs: 4, fat: 0 }
  },
  // Beverages
  '049000006582': {
    barcode: '049000006582',
    name: 'Coca-Cola',
    brand: 'Coca-Cola',
    category: 'Beverages',
    quantity: '12 oz',
    nutrition: { calories: 140, protein: 0, carbs: 39, fat: 0 }
  },
  '012000001536': {
    barcode: '012000001536',
    name: 'Pepsi',
    brand: 'Pepsi',
    category: 'Beverages',
    quantity: '12 oz',
    nutrition: { calories: 150, protein: 0, carbs: 41, fat: 0 }
  },
  // Frozen
  '072586000378': {
    barcode: '072586000378',
    name: 'Frozen Pizza',
    brand: 'DiGiorno',
    category: 'Frozen',
    quantity: '1 pizza',
    nutrition: { calories: 310, protein: 12, carbs: 35, fat: 14 }
  },
  '013120001234': {
    barcode: '013120001234',
    name: 'Ice Cream',
    brand: 'Ben & Jerry\'s',
    category: 'Frozen',
    quantity: '16 oz',
    nutrition: { calories: 260, protein: 4, carbs: 28, fat: 15 }
  },
}

export async function POST(request: NextRequest) {
  try {
    const { barcode } = await request.json()

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 }
      )
    }

    console.log('Looking up barcode:', barcode)

    // First check our local database
    const localProduct = productDatabase[barcode]
    if (localProduct) {
      return NextResponse.json({
        success: true,
        source: 'local',
        product: localProduct
      })
    }

    // Try Open Food Facts API (free, no API key required)
    try {
      const openFoodFactsUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      const response = await fetch(openFoodFactsUrl, {
        headers: {
          'User-Agent': 'BestMealMate/1.0 (https://bestmealmate.com)'
        }
      })

      if (response.ok) {
        const data = await response.json()

        if (data.status === 1 && data.product) {
          const p = data.product
          const product: ProductInfo = {
            barcode,
            name: p.product_name || p.generic_name || 'Unknown Product',
            brand: p.brands,
            category: p.categories?.split(',')[0]?.trim() || 'Other',
            quantity: p.quantity || '1',
            imageUrl: p.image_url || p.image_front_url,
            nutrition: {
              calories: Math.round(p.nutriments?.['energy-kcal_100g'] || 0),
              protein: Math.round(p.nutriments?.proteins_100g || 0),
              carbs: Math.round(p.nutriments?.carbohydrates_100g || 0),
              fat: Math.round(p.nutriments?.fat_100g || 0)
            }
          }

          return NextResponse.json({
            success: true,
            source: 'openfoodfacts',
            product
          })
        }
      }
    } catch (error) {
      console.log('Open Food Facts lookup failed:', error)
    }

    // Generate a generic product if not found
    const genericProduct: ProductInfo = {
      barcode,
      name: `Product ${barcode}`,
      category: 'Other',
      quantity: '1'
    }

    return NextResponse.json({
      success: true,
      source: 'generated',
      product: genericProduct,
      message: 'Product not found in database. Using generic entry.'
    })

  } catch (error) {
    console.error('Barcode lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to lookup barcode', success: false },
      { status: 500 }
    )
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    name: 'Barcode Lookup API',
    version: '1.0.0',
    description: 'Look up product information from barcodes',
    usage: {
      method: 'POST',
      body: {
        barcode: 'string - UPC/EAN barcode number'
      }
    },
    sources: [
      'Local product database',
      'Open Food Facts (openfoodfacts.org)'
    ],
    example: {
      barcode: '070470496528'
    }
  })
}
