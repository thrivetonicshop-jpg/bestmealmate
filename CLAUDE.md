# BestMealMate - Claude Code Guide

## Project Overview
BestMealMate is a family-first meal planning app that uses AI to suggest meals based on what's in your fridge/pantry. Features include family profiles, dietary restrictions, AI chef, food scanning, and Stripe subscriptions.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Anthropic Claude API
- **Payments**: Stripe (Premium $9.99/mo, Family $14.99/mo)
- **Hosting**: Vercel

## Directory Structure
```
bestmealmate/              # Main Next.js app (Vercel Root Directory)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-chef/        # Claude AI meal suggestions
│   │   │   ├── scan-food/      # Food image recognition
│   │   │   └── stripe/         # Checkout & webhooks
│   │   ├── auth/callback/      # OAuth callback
│   │   ├── dashboard/          # Main app pages
│   │   │   ├── family/         # Family member management
│   │   │   ├── groceries/      # Grocery lists
│   │   │   ├── pantry/         # Pantry inventory + food scanner
│   │   │   ├── recipes/        # Recipe suggestions
│   │   │   └── settings/       # User settings
│   │   ├── login/              # Auth pages
│   │   ├── onboarding/         # New user setup
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Tailwind styles
│   ├── components/
│   │   └── FoodScanner.tsx     # Camera-based food detection
│   └── lib/
│       ├── supabase.ts         # Supabase client & helpers
│       ├── auth-context.tsx    # Auth state provider
│       └── database.types.ts   # TypeScript types
├── supabase/
│   └── schema.sql              # Database schema
├── middleware.ts               # Route protection
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variables template
```

## Key Files
- `src/lib/supabase.ts` - Supabase client with helper functions
- `src/lib/auth-context.tsx` - React context for auth state
- `src/middleware.ts` - Protects /dashboard routes
- `src/app/onboarding/page.tsx` - Multi-step user registration
- `src/components/FoodScanner.tsx` - Camera + AI food detection
- `src/app/api/scan-food/route.ts` - Claude vision API for food
- `src/app/api/stripe/checkout/route.ts` - Creates Stripe sessions
- `src/app/api/stripe/webhook/route.ts` - Handles Stripe events

## Environment Variables
Required in `.env.local` and Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PREMIUM_PRICE_ID=price_xxx
STRIPE_FAMILY_PRICE_ID=price_xxx
ANTHROPIC_API_KEY=sk-ant-xxx
NEXT_PUBLIC_APP_URL=https://www.bestmealmate.com
```

## Development Commands
```bash
cd bestmealmate
npm install
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Vercel Deployment
**Important**: Set Root Directory to `bestmealmate` in Vercel settings (Build and Deployment).

## Database
Key tables (see `supabase/schema.sql`):
- `households` - Family accounts with subscription
- `family_members` - Individual profiles
- `pantry_items` - Fridge/pantry inventory
- `recipes` - System and user recipes
- `meal_plans` - Weekly plans
- `grocery_lists` - Shopping lists

## Common Tasks

### Add a new API route
Create `src/app/api/[route-name]/route.ts` with POST/GET handlers.

### Add a new dashboard page
Create `src/app/dashboard/[page-name]/page.tsx`.

### Modify auth flow
Edit `src/lib/auth-context.tsx` and `src/middleware.ts`.

### Update Stripe pricing
1. Create new Price in Stripe Dashboard
2. Update `STRIPE_PREMIUM_PRICE_ID` or `STRIPE_FAMILY_PRICE_ID`
3. Update price display in `src/app/onboarding/page.tsx`

## Stripe Webhook Events
- `checkout.session.completed` - Subscription started
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Cancelled
- `invoice.payment_failed` - Payment failed

## Testing
Use Stripe test mode with `sk_test_` keys. Test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
