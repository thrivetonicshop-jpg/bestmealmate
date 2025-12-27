# CLAUDE.md - BestMealMate Project Guide

## Project Overview

BestMealMate is a family-first meal planning application with the tagline: **"Family-First. Fridge-First. Zero Decision Fatigue."** It helps families plan meals based on what they have in their pantry, dietary restrictions, and preferences.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: Claude API (Anthropic) - using `claude-sonnet-4-20250514`
- **Payments**: Stripe (subscription-based)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Hosting**: Vercel

## Project Structure

```
bestmealmate/
├── bestmealmate/           # Main Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── ai-chef/route.ts      # Claude AI integration
│   │   │   │   └── stripe/
│   │   │   │       ├── checkout/route.ts  # Create checkout sessions
│   │   │   │       └── webhook/route.ts   # Handle Stripe webhooks
│   │   │   ├── auth/callback/route.ts    # OAuth callback
│   │   │   ├── dashboard/page.tsx        # Main app dashboard
│   │   │   ├── login/page.tsx            # Authentication
│   │   │   ├── onboarding/page.tsx       # New user flow
│   │   │   ├── page.tsx                  # Landing page
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   └── lib/
│   │       ├── supabase.ts               # Supabase client (browser + admin)
│   │       └── database.types.ts         # Auto-generated TypeScript types
│   ├── supabase/
│   │   └── schema.sql                    # Complete database schema + RLS
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── tsconfig.json
└── README.md
```

## Common Commands

```bash
# Development
cd bestmealmate && npm run dev      # Start dev server at localhost:3000

# Build
cd bestmealmate && npm run build    # Production build

# Lint
cd bestmealmate && npm run lint     # ESLint check
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PREMIUM_PRICE_ID` - Stripe price ID for Premium tier
- `STRIPE_FAMILY_PRICE_ID` - Stripe price ID for Family tier
- `ANTHROPIC_API_KEY` - Claude API key
- `NEXT_PUBLIC_APP_URL` - Application URL

## Database Schema (Supabase)

Key tables:
- **households** - Family accounts with subscription tier (free/premium/family)
- **family_members** - Individual profiles linked to auth.users
- **dietary_restrictions** - Vegetarian, vegan, halal, kosher, keto, paleo, etc.
- **allergies** - With severity levels (mild/moderate/severe)
- **food_dislikes** - Per family member food preferences
- **ingredients** - Master ingredient catalog
- **pantry_items** - What's in the household (with location: fridge/freezer/pantry)
- **recipes** - System recipes (household_id NULL) and user recipes
- **recipe_ingredients**, **recipe_steps**, **recipe_tags**
- **meal_plans** - Weekly plans by week_start_date
- **planned_meals** - Individual meal assignments (breakfast/lunch/dinner/snack)
- **meal_attendees** - Which family members are eating each meal
- **grocery_lists** - Auto-generated shopping lists
- **grocery_list_items** - Items with purchase tracking
- **recipe_ratings** - Family ratings and cook history
- **waste_log** - Track food waste for insights

Row Level Security (RLS) is enabled on all tables - users only see their household data.

## Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 family member, basic plans, 5 recipes/week |
| Premium | $9.99/mo | 4 members, AI chef, smart grocery, pantry |
| Family | $14.99/mo | Unlimited members, calendar sync, cooking mode |

## API Routes

- `POST /api/ai-chef` - Get AI meal suggestions from Claude
  - Body: `{ message: string, context: object }`
  - Returns: `{ reply: string }`

- `POST /api/stripe/checkout` - Create Stripe checkout session

- `POST /api/stripe/webhook` - Handle Stripe events
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

## AI Chef Integration

The AI Chef (`/api/ai-chef/route.ts`) uses Claude to:
1. Suggest meals based on available pantry ingredients
2. Prioritize items expiring soon
3. Respect all family dietary restrictions and allergies
4. Provide recipes with step-by-step instructions

## Key Patterns

- **Supabase Client**: Use `supabase` for browser-side, `supabaseAdmin` for server-side with service role
- **TypeScript**: All files use TypeScript with types from `database.types.ts`
- **App Router**: Uses Next.js 14 App Router conventions (not pages)
- **API Routes**: Located in `src/app/api/*/route.ts` using Next.js Route Handlers

## Phase 2 Features (Planned)

- AI food scanner (camera recognition)
- Instacart integration
- Calendar sync (Google, Apple)
- Hands-free cooking mode
- Expiry notifications
- Waste tracking dashboard
