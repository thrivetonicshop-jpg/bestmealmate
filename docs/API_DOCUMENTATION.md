# API Documentation - BestMealMate

Complete API reference for the BestMealMate backend services.

## Base URL

```
Development: http://localhost:3000/api
Production:  https://www.bestmealmate.com/api
```

## Authentication

All API routes (except public endpoints) require authentication via Supabase Auth.

### Headers

```http
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

---

## Endpoints

### 1. AI Chef

#### POST `/api/ai-chef`

Get AI-powered meal suggestions based on pantry contents and family preferences.

**Request Body:**

```json
{
  "message": "What can I make for dinner tonight?",
  "context": {
    "family_members": [
      {
        "name": "Sarah",
        "dietary_restrictions": ["vegetarian"],
        "allergies": []
      },
      {
        "name": "Jake",
        "dietary_restrictions": [],
        "allergies": ["peanuts", "tree_nuts"]
      }
    ],
    "pantry_items": [
      {
        "name": "Chicken Breast",
        "quantity": 2,
        "unit": "lb",
        "expiry_date": "2025-12-28",
        "location": "fridge"
      },
      {
        "name": "Broccoli",
        "quantity": 1,
        "unit": "head",
        "expiry_date": "2025-12-29",
        "location": "fridge"
      }
    ],
    "recent_meals": [
      "Pasta Primavera",
      "Beef Tacos"
    ]
  }
}
```

**Success Response (200):**

```json
{
  "reply": "Based on your pantry, I suggest **Sheet Pan Chicken & Vegetables**! Here's why it's perfect:\n\n1. Uses the chicken breast expiring tomorrow\n2. Safe for everyone (no nuts, and we'll make a vegetarian portion for Sarah)\n3. Takes only 35 minutes\n\nWould you like the full recipe?"
}
```

**Error Response (500):**

```json
{
  "error": "Failed to get AI response"
}
```

---

### 2. Stripe Checkout

#### POST `/api/stripe/checkout`

Create a Stripe Checkout session for subscription upgrade.

**Request Body:**

```json
{
  "householdId": "uuid-household-id",
  "tier": "premium",
  "email": "user@example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `householdId` | string | Yes | UUID of the household |
| `tier` | string | Yes | Either `"premium"` or `"family"` |
| `email` | string | Yes | Customer email address |

**Success Response (200):**

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Error Response (500):**

```json
{
  "error": "Failed to create checkout session"
}
```

**Usage Example:**

```typescript
const response = await fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    householdId: 'abc-123',
    tier: 'premium',
    email: 'user@example.com'
  })
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe Checkout
```

---

### 3. Stripe Webhook

#### POST `/api/stripe/webhook`

Handle Stripe webhook events for subscription management.

**Headers:**

```http
stripe-signature: <webhook_signature>
```

**Supported Events:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Upgrade household subscription tier |
| `customer.subscription.updated` | Update subscription status |
| `customer.subscription.deleted` | Downgrade to free tier |
| `invoice.payment_failed` | Log payment failure |

**Response (200):**

```json
{
  "received": true
}
```

**Error Response (400):**

```json
{
  "error": "Invalid signature"
}
```

---

### 4. Auth Callback

#### GET `/auth/callback`

Handle OAuth callback from Supabase Auth (Google, etc.).

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | string | OAuth authorization code |

**Response:**

Redirects to `/dashboard` on success.

---

## Database API (Supabase)

All database operations use the Supabase client. Here are the main tables and operations:

### Households

```typescript
// Get household
const { data } = await supabase
  .from('households')
  .select('*')
  .eq('id', householdId)
  .single()

// Update household
await supabase
  .from('households')
  .update({ name: 'New Name', timezone: 'America/Chicago' })
  .eq('id', householdId)
```

### Family Members

```typescript
// Get all family members
const { data } = await supabase
  .from('family_members')
  .select(`
    *,
    dietary_restrictions (*),
    allergies (*),
    food_dislikes (*)
  `)
  .eq('household_id', householdId)

// Add family member
await supabase
  .from('family_members')
  .insert({
    household_id: householdId,
    name: 'New Member',
    age: 25,
    role: 'member'
  })

// Delete family member
await supabase
  .from('family_members')
  .delete()
  .eq('id', memberId)
```

### Pantry Items

```typescript
// Get pantry items with ingredients
const { data } = await supabase
  .from('pantry_items')
  .select(`
    *,
    ingredients (*)
  `)
  .eq('household_id', householdId)
  .order('expiry_date', { ascending: true })

// Add pantry item
await supabase
  .from('pantry_items')
  .insert({
    household_id: householdId,
    ingredient_id: ingredientId,
    quantity: 2,
    unit: 'lb',
    location: 'fridge',
    expiry_date: '2025-12-30'
  })

// Update pantry item
await supabase
  .from('pantry_items')
  .update({ quantity: 1 })
  .eq('id', itemId)
```

### Recipes

```typescript
// Get all recipes (system + household)
const { data } = await supabase
  .from('recipes')
  .select(`
    *,
    recipe_ingredients (*, ingredients (*)),
    recipe_steps (*),
    recipe_tags (*)
  `)
  .or(`household_id.is.null,household_id.eq.${householdId}`)
  .order('name')

// Get recipes by meal type
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('meal_type', 'dinner')
  .eq('difficulty', 'easy')
```

### Meal Plans

```typescript
// Get current week's meal plan
const { data } = await supabase
  .from('meal_plans')
  .select(`
    *,
    planned_meals (
      *,
      recipes (*)
    )
  `)
  .eq('household_id', householdId)
  .gte('week_start_date', startOfWeek)
  .single()

// Add meal to plan
await supabase
  .from('planned_meals')
  .insert({
    meal_plan_id: planId,
    recipe_id: recipeId,
    meal_date: '2025-12-28',
    meal_type: 'dinner',
    servings: 4
  })
```

### Grocery Lists

```typescript
// Get active grocery list
const { data } = await supabase
  .from('grocery_lists')
  .select(`
    *,
    grocery_list_items (
      *,
      ingredients (*)
    )
  `)
  .eq('household_id', householdId)
  .eq('status', 'active')
  .single()

// Toggle item purchased
await supabase
  .from('grocery_list_items')
  .update({
    is_purchased: true,
    purchased_at: new Date().toISOString()
  })
  .eq('id', itemId)
```

---

## Error Handling

All API routes follow a consistent error format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid auth |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| AI Chef | 50 requests/hour (Premium), 10/hour (Free) |
| Stripe Checkout | 10 requests/minute |
| Database Operations | 1000 requests/minute |

---

## Webhooks

### Stripe Webhook Configuration

**Endpoint:** `https://yourdomain.com/api/stripe/webhook`

**Events to subscribe:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

**Setup:**

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint with your production URL
3. Select the events above
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Environment Variables

Required for API functionality:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_FAMILY_PRICE_ID=price_...

# Anthropic (AI Chef)
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=https://www.bestmealmate.com
```

---

## SDK Usage Examples

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('/api/ai-chef', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    message: 'What should I cook?',
    context: { /* ... */ }
  })
})

const { reply } = await response.json()
```

### React Hook Example

```typescript
import { useState } from 'react'

function useAIChef() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  async function askChef(message: string, context: any) {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      })
      const data = await res.json()
      setResponse(data.reply)
      return data.reply
    } catch (error) {
      console.error('AI Chef error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { askChef, loading, response }
}
```

---

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test AI Chef endpoint
curl -X POST http://localhost:3000/api/ai-chef \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "context": {}}'

# Test Stripe webhook (use Stripe CLI)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Integration Tests

```typescript
import { describe, it, expect } from 'vitest'

describe('AI Chef API', () => {
  it('returns a meal suggestion', async () => {
    const response = await fetch('http://localhost:3000/api/ai-chef', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Suggest a quick dinner',
        context: { pantry_items: [] }
      })
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.reply).toBeDefined()
  })
})
```
