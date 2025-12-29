import { NextRequest, NextResponse } from 'next/server'

// Walmart Developer API Integration
// Docs: https://developer.walmart.com/

interface WalmartItem {
  name: string
  quantity: number
  unit?: string
}

interface WalmartCartRequest {
  items: WalmartItem[]
  storeId?: string
}

// Get Walmart config - lazy initialization for build
function getWalmartConfig() {
  return {
    consumerId: process.env.WALMART_CONSUMER_ID,
    privateKey: process.env.WALMART_PRIVATE_KEY,
    baseUrl: process.env.WALMART_API_URL || 'https://developer.api.walmart.com',
  }
}

// POST - Create Walmart shopping list and redirect to Walmart
export async function POST(request: NextRequest) {
  try {
    const body: WalmartCartRequest = await request.json()
    const { items, storeId } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    const config = getWalmartConfig()

    // If API credentials are configured, use real Walmart API
    if (config.consumerId && config.privateKey) {
      // Real Walmart API integration
      // Walmart uses affiliate links for cart creation
      const searchQuery = items.map(i => i.name).join(' ')

      const response = await fetch(`${config.baseUrl}/v3/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'WM_CONSUMER.ID': config.consumerId,
          'WM_SEC.KEY_VERSION': '1',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Walmart API error:', errorData)
        return NextResponse.json(
          { error: 'Failed to search Walmart', details: errorData },
          { status: response.status }
        )
      }

      const data = await response.json()

      // Build cart URL with found items
      const cartItems = data.items?.slice(0, items.length) || []
      const cartUrl = `https://www.walmart.com/cart?items=${cartItems.map((i: { itemId: string }) => i.itemId).join(',')}`

      return NextResponse.json({
        success: true,
        cartUrl,
        items: cartItems,
        itemCount: items.length,
      })
    }

    // Demo mode - return Walmart search URL for development/testing
    const searchTerms = items.slice(0, 5).map(i => i.name).join(' ')
    const walmartSearchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(searchTerms)}`

    return NextResponse.json({
      success: true,
      cartUrl: walmartSearchUrl,
      itemCount: items.length,
      demoMode: true,
    })
  } catch (error) {
    console.error('Walmart integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Search for products or get store info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const zipCode = searchParams.get('zipCode')

    const config = getWalmartConfig()

    if (config.consumerId && query) {
      const response = await fetch(
        `${config.baseUrl}/v3/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'WM_CONSUMER.ID': config.consumerId,
            'WM_SEC.KEY_VERSION': '1',
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to search Walmart' },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json({
        success: true,
        items: data.items,
        totalResults: data.totalResults,
      })
    }

    // Demo mode - return mock results
    return NextResponse.json({
      success: true,
      items: [],
      demoMode: true,
      message: 'Configure WALMART_CONSUMER_ID for live search',
    })
  } catch (error) {
    console.error('Walmart search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
