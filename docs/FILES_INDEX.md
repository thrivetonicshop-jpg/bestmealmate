# BestMealMate - Complete File Index

Master index of all files in the BestMealMate codebase.

---

## Quick Links

| Document | Description |
|----------|-------------|
| [CODE_SHOWCASE.md](./CODE_SHOWCASE.md) | Detailed code examples |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Production deployment |
| [USER_GUIDE.md](./USER_GUIDE.md) | End-user documentation |
| [FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md) | Launch checklist |
| [CLAUDE.md](../CLAUDE.md) | Project context for AI |

---

## Project Structure

```
bestmealmate/
├── docs/                           # Documentation
│   ├── API_DOCUMENTATION.md        # API reference
│   ├── CODE_SHOWCASE.md            # Code examples
│   ├── DEPLOYMENT_GUIDE.md         # Deployment guide
│   ├── FILES_INDEX.md              # This file
│   ├── FINAL_CHECKLIST.md          # Launch checklist
│   └── USER_GUIDE.md               # User documentation
│
├── bestmealmate/                   # Next.js application
│   ├── src/
│   │   ├── app/                    # App Router pages & routes
│   │   └── lib/                    # Shared utilities
│   ├── supabase/                   # Database schema
│   ├── public/                     # Static assets
│   └── package.json                # Dependencies
│
├── CLAUDE.md                       # AI context file
└── README.md                       # Project overview
```

---

## Source Files

### Frontend Pages

| File | Lines | Description |
|------|-------|-------------|
| `src/app/page.tsx` | ~200 | Landing page with hero, features, pricing |
| `src/app/login/page.tsx` | ~200 | Login and signup forms |
| `src/app/onboarding/page.tsx` | ~300 | Multi-step onboarding wizard |
| `src/app/dashboard/page.tsx` | ~350 | Main dashboard with meal plan |
| `src/app/dashboard/pantry/page.tsx` | ~900 | Pantry management CRUD |
| `src/app/dashboard/recipes/page.tsx` | ~480 | Recipe browser with filters |
| `src/app/dashboard/groceries/page.tsx` | ~420 | Grocery list management |
| `src/app/dashboard/family/page.tsx` | ~400 | Family member management |
| `src/app/dashboard/settings/page.tsx` | ~385 | Settings and subscription |

### API Routes

| File | Lines | Description |
|------|-------|-------------|
| `src/app/api/ai-chef/route.ts` | ~50 | Claude AI integration |
| `src/app/api/stripe/checkout/route.ts` | ~50 | Stripe checkout session |
| `src/app/api/stripe/webhook/route.ts` | ~115 | Stripe webhook handler |
| `src/app/auth/callback/route.ts` | ~20 | OAuth callback handler |

### Library Files

| File | Lines | Description |
|------|-------|-------------|
| `src/lib/supabase.ts` | ~40 | Supabase client config |
| `src/lib/database.types.ts` | ~600 | TypeScript types from DB |

### Configuration

| File | Lines | Description |
|------|-------|-------------|
| `package.json` | ~40 | Dependencies & scripts |
| `tsconfig.json` | ~30 | TypeScript config |
| `tailwind.config.ts` | ~80 | Tailwind CSS config |
| `next.config.js` | ~15 | Next.js config |
| `.env.example` | ~15 | Environment template |

### Database

| File | Lines | Description |
|------|-------|-------------|
| `supabase/schema.sql` | ~470 | Complete database schema |

### Styles

| File | Lines | Description |
|------|-------|-------------|
| `src/app/globals.css` | ~100 | Global styles & Tailwind |
| `src/app/layout.tsx` | ~30 | Root layout with fonts |

---

## Database Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `households` | Family accounts | name, subscription_tier, stripe_customer_id |
| `family_members` | Individual profiles | name, age, role, dietary restrictions |
| `dietary_restrictions` | Restrictions per member | restriction_type |
| `allergies` | Allergies per member | allergen, severity |
| `food_dislikes` | Dislikes per member | food_name |
| `ingredients` | Master ingredient list | name, category, avg_shelf_life_days |
| `pantry_items` | Household inventory | quantity, location, expiry_date |
| `recipes` | Recipe definitions | name, meal_type, prep_time, difficulty |
| `recipe_ingredients` | Recipe -> Ingredient mapping | quantity, unit, is_optional |
| `recipe_steps` | Cooking instructions | step_number, instruction |
| `recipe_tags` | Recipe dietary tags | tag |
| `meal_plans` | Weekly meal plans | week_start_date |
| `planned_meals` | Individual meal assignments | meal_date, meal_type, status |
| `meal_attendees` | Who's eating each meal | planned_meal_id, family_member_id |
| `grocery_lists` | Shopping lists | name, status |
| `grocery_list_items` | Shopping list items | quantity, is_purchased |
| `grocery_item_sources` | Which meals need each item | quantity_needed |
| `recipe_ratings` | Family recipe ratings | rating, cooked_count |
| `waste_log` | Food waste tracking | reason, estimated_cost |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai-chef` | POST | Get AI meal suggestions |
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |
| `/auth/callback` | GET | OAuth callback handler |

---

## Environment Variables

### Client-Side (Public)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
```

### Server-Side (Secret)

```
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PREMIUM_PRICE_ID
STRIPE_FAMILY_PRICE_ID
ANTHROPIC_API_KEY
```

---

## Dependencies

### Production

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` | UI library |
| `@supabase/supabase-js` | Database client |
| `@anthropic-ai/sdk` | AI integration |
| `stripe` | Payment processing |
| `tailwindcss` | CSS framework |
| `lucide-react` | Icons |
| `framer-motion` | Animations |
| `zustand` | State management |
| `react-hot-toast` | Notifications |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | Type checking |
| `eslint` | Linting |
| `prettier` | Formatting |

---

## Code Statistics

| Metric | Count |
|--------|-------|
| Total Source Files | 22 |
| Total Lines of Code | ~5,000 |
| TypeScript Files | 18 |
| SQL Files | 1 |
| Config Files | 6 |
| Documentation Files | 6 |

### By Category

| Category | Files | Lines |
|----------|-------|-------|
| Frontend Pages | 10 | ~3,500 |
| API Routes | 4 | ~235 |
| Library/Utils | 2 | ~640 |
| Database | 1 | ~470 |
| Config | 5 | ~180 |

---

## Features by File

### Authentication
- `src/app/login/page.tsx` - Email/password & OAuth
- `src/app/auth/callback/route.ts` - OAuth callback
- `src/lib/supabase.ts` - Auth client

### Meal Planning
- `src/app/dashboard/page.tsx` - Weekly meal view
- `src/app/dashboard/recipes/page.tsx` - Recipe browser

### Pantry Management
- `src/app/dashboard/pantry/page.tsx` - Full CRUD

### Grocery Lists
- `src/app/dashboard/groceries/page.tsx` - List management

### Family Management
- `src/app/dashboard/family/page.tsx` - Member profiles
- `src/app/onboarding/page.tsx` - Initial setup

### AI Integration
- `src/app/api/ai-chef/route.ts` - Claude API

### Payments
- `src/app/api/stripe/checkout/route.ts` - Checkout
- `src/app/api/stripe/webhook/route.ts` - Webhooks
- `src/app/dashboard/settings/page.tsx` - Subscription UI

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## File Naming Conventions

| Pattern | Usage |
|---------|-------|
| `page.tsx` | Next.js page component |
| `route.ts` | Next.js API route handler |
| `layout.tsx` | Next.js layout component |
| `*.types.ts` | TypeScript type definitions |
| `*.sql` | Database schema files |
| `*.md` | Documentation |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Landing │ │Dashboard│ │ Pantry  │ │ Recipes │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
│       │           │           │           │             │
│       └───────────┼───────────┼───────────┘             │
│                   │           │                         │
│              ┌────┴────┐ ┌────┴────┐                   │
│              │ Zustand │ │ Supabase│                   │
│              │ (State) │ │ (Client)│                   │
│              └─────────┘ └────┬────┘                   │
└───────────────────────────────┼─────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
              ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
              │  Supabase │ │Stripe │ │ Anthropic │
              │(Database) │ │(Pay)  │ │   (AI)    │
              └───────────┘ └───────┘ └───────────┘
```

---

*Last updated: December 2025*
