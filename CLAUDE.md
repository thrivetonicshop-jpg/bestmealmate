# CLAUDE.md - BestMealMate

## Project Overview

BestMealMate is a family-focused meal planning application that helps reduce food waste and decision fatigue. The app uses AI to suggest meals based on what's in the pantry, dietary restrictions, and expiring ingredients.

**Tagline**: Family-First. Fridge-First. Zero Decision Fatigue.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI**: React 18 + Tailwind CSS
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Payments**: Stripe (subscriptions)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Hosting**: Vercel

## Project Structure

```
bestmealmate/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-chef/route.ts       # Claude AI endpoint
│   │   │   └── stripe/                 # Payment webhooks
│   │   ├── auth/callback/              # OAuth callback
│   │   ├── dashboard/                  # Main app pages
│   │   │   ├── family/                 # Family member management
│   │   │   ├── groceries/              # Shopping lists
│   │   │   ├── pantry/                 # Pantry inventory
│   │   │   ├── recipes/                # Recipe browser
│   │   │   └── settings/               # User settings
│   │   ├── login/                      # Auth pages
│   │   ├── onboarding/                 # New user flow
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page
│   │   └── globals.css                 # Global styles
│   └── lib/
│       ├── supabase.ts                 # Supabase client config
│       └── database.types.ts           # TypeScript types from DB
└── supabase/
    └── schema.sql                      # Database schema with RLS
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_PREMIUM_PRICE_ID` - Stripe price ID for Premium tier
- `STRIPE_FAMILY_PRICE_ID` - Stripe price ID for Family tier
- `ANTHROPIC_API_KEY` - Claude API key
- `NEXT_PUBLIC_APP_URL` - Application URL

## Code Conventions

### API Routes
- Use Next.js App Router route handlers (`route.ts`)
- Return `NextResponse.json()` for all responses
- Wrap handlers in try-catch with appropriate error responses
- Use server-side Supabase admin client for privileged operations

### Database
- All tables have Row Level Security (RLS) enabled
- Use `supabase` client for client-side queries (respects RLS)
- Use `supabaseAdmin` for server-side operations that bypass RLS
- Types are generated in `database.types.ts`

### Components
- Use Tailwind CSS for styling (no CSS modules)
- Use `clsx` and `tailwind-merge` for conditional classes
- Use Lucide React for icons
- Use Framer Motion for animations

### State Management
- Zustand for global client state
- React state for local component state

## Key Database Tables

- `households` - Family accounts with subscription tier
- `family_members` - Individual profiles (dietary restrictions, allergies)
- `pantry_items` - Inventory tracking with expiry dates
- `recipes` - System and user-created recipes
- `meal_plans` - Weekly meal planning
- `planned_meals` - Individual meal assignments
- `grocery_lists` / `grocery_items` - Shopping list management

## AI Integration

The AI Chef endpoint (`/api/ai-chef`) uses Claude to:
- Suggest meals based on pantry contents
- Respect dietary restrictions and allergies
- Prioritize expiring ingredients
- Provide cooking instructions

Context passed to Claude includes: family members, dietary restrictions, pantry items, and recent meals.

## Subscription Tiers

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 1 family member, 5 recipes/week |
| Premium | $9.99/mo | 4 members, AI chef, smart grocery |
| Family | $14.99/mo | Unlimited members, all features |

## Testing

Currently no test framework configured. When adding tests:
- Use Jest + React Testing Library for components
- Use Jest for API route testing
- Mock Supabase and Stripe clients

## Troubleshooting

### Build Issues
- Supabase clients use placeholder values during build when env vars unavailable
- Use `getSupabase()` / `getSupabaseAdmin()` helpers for runtime safety

### Common Issues
- Ensure all Stripe webhooks are configured for the correct events
- Check RLS policies if queries return unexpected empty results
- Verify CORS settings in Supabase for client-side requests

## Documentation

Comprehensive documentation is available in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [docs/FILES_INDEX.md](docs/FILES_INDEX.md) | Master file index with all source files |
| [docs/CODE_SHOWCASE.md](docs/CODE_SHOWCASE.md) | Detailed code examples by feature |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Complete API reference |
| [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Production deployment steps |
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | End-user documentation |
| [docs/FINAL_CHECKLIST.md](docs/FINAL_CHECKLIST.md) | Pre-launch verification checklist |

## Code Statistics

| Category | Files | Lines |
|----------|-------|-------|
| Frontend Pages | 10 | ~3,500 |
| API Routes | 4 | ~235 |
| Library/Utils | 2 | ~640 |
| Database Schema | 1 | ~470 |
| Config | 5 | ~180 |
| **Total** | **22** | **~5,000** |
