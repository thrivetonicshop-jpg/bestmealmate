import { NextRequest, NextResponse } from 'next/server'

// Instacart Developer Platform Integration
// Following Instacart Developer Guidelines: https://docs.instacart.com/developer_platform_api/

interface InstacartItem {
  name: string
  quantity: number
  unit?: string
}

interface InstacartCartRequest {
  items: InstacartItem[]
  postalCode?: string
}

// Get Instacart client - lazy initialization for build
function getInstacartConfig() {
  return {
    apiKey: process.env.INSTACART_API_KEY,
    baseUrl: process.env.INSTACART_API_URL || 'https://connect.instacart.com/v2',
  }
}

// POST - Create Instacart shopping cart and get checkout URL
export async function POST(request: NextRequest) {
  try {
    const body: InstacartCartRequest = await request.json()
    const { items, postalCode } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    const config = getInstacartConfig()

    // If API key is configured, use real Instacart API
    if (config.apiKey) {
      // Real Instacart API integration
      const response = await fetch(`${config.baseUrl}/fulfillment/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          locale: 'en-US',
          postal_code: postalCode || '94105',
          line_items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit || 'each',
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Instacart API error:', errorData)
        return NextResponse.json(
          { error: 'Failed to create Instacart cart', details: errorData },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json({
        success: true,
        checkoutUrl: data.checkout_url,
        cartId: data.cart_id,
        // Per Instacart guidelines: "Delivery in as fast as one hour"
        estimatedDelivery: 'Delivery in as fast as one hour',
        // Per guidelines: Cannot say "Free Delivery", use "$0 Delivery Fee" with disclaimer
        deliveryInfo: '$0 Delivery Fee*',
        disclaimer: 'Service fees apply.',
      })
    }

    // Demo mode - return mock checkout URL for development/testing
    // This allows the integration to be tested without API keys
    const mockCartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Build a search URL for Instacart with the items
    const searchTerms = items.slice(0, 5).map(i => i.name).join(' ')
    const instacartSearchUrl = `https://www.instacart.com/store/search/${encodeURIComponent(searchTerms)}`

    return NextResponse.json({
      success: true,
      checkoutUrl: instacartSearchUrl,
      cartId: mockCartId,
      estimatedDelivery: 'Delivery in as fast as one hour',
      deliveryInfo: '$0 Delivery Fee*',
      disclaimer: 'Service fees apply.',
      demoMode: true,
      itemCount: items.length,
    })
  } catch (error) {
    console.error('Instacart integration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get nearby retailers (for future use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postalCode = searchParams.get('postalCode') || '94105'

    const config = getInstacartConfig()

    if (config.apiKey) {
      const response = await fetch(
        `${config.baseUrl}/fulfillment/retailers?postal_code=${postalCode}`,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Accept': 'application/json',
          },
        }
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch retailers' },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json({
        success: true,
        retailers: data.retailers,
      })
    }

    // Demo mode - return mock retailers
    return NextResponse.json({
      success: true,
      retailers: [
        { id: 'demo_1', name: 'Local Grocery Store', logo: null },
        { id: 'demo_2', name: 'Organic Market', logo: null },
        { id: 'demo_3', name: 'Wholesale Club', logo: null },
      ],
      demoMode: true,
    })
  } catch (error) {
    console.error('Instacart retailers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
