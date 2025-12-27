# BestMealMate

**Family-First. Fridge-First. Zero Decision Fatigue.**

The smart meal planning app that knows your family. One plan. Everyone eats. Nothing wasted.

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: Claude API (Anthropic)
- **Payments**: Stripe
- **Hosting**: Vercel

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/bestmealmate.git
cd bestmealmate
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Go to Authentication > Providers and enable:
   - Email (enabled by default)
   - Google (optional - add OAuth credentials)
4. Copy your project URL and keys from Settings > API

### 3. Set Up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Create two Products with monthly pricing:
   - **Premium**: $9.99/month
   - **Family**: $14.99/month
3. Copy the Price IDs
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`

### 4. Get Claude API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key

### 5. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_FAMILY_PRICE_ID=price_...

# Claude AI
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Project Structure

```
bestmealmate/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-chef/          # Claude AI integration
│   │   │   └── stripe/           # Payment webhooks
│   │   ├── auth/
│   │   │   └── callback/         # OAuth callback
│   │   ├── dashboard/            # Main app
│   │   ├── login/                # Auth pages
│   │   ├── onboarding/           # New user flow
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       └── database.types.ts     # TypeScript types
├── supabase/
│   └── schema.sql                # Database schema
├── package.json
├── tailwind.config.js
└── README.md
```

## Features

### MVP (Phase 1)
- [x] Family profile system with dietary restrictions
- [x] AI-powered meal suggestions (Claude API)
- [x] Basic pantry tracking
- [x] Smart grocery list generation
- [x] Weekly meal planning calendar
- [x] Problem-reaction-solution onboarding
- [x] Stripe subscription payments

### Coming Soon (Phase 2)
- [ ] AI food scanner (camera recognition)
- [ ] Instacart integration
- [ ] Calendar sync (Google, Apple)
- [ ] Hands-free cooking mode
- [ ] Expiry notifications
- [ ] Waste tracking dashboard

## Database Schema

Key tables:
- `households` - Family accounts with subscription info
- `family_members` - Individual profiles with dietary needs
- `pantry_items` - What's in the fridge/pantry
- `recipes` - System and user recipes
- `meal_plans` - Weekly plans
- `planned_meals` - Individual meal assignments
- `grocery_lists` - Auto-generated shopping lists

See `supabase/schema.sql` for complete schema with RLS policies.

## API Routes

- `POST /api/ai-chef` - Get meal suggestions from Claude
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe events

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 family member, basic plans, 5 recipes/week |
| Premium | $9.99/mo | 4 members, AI chef, smart grocery, pantry |
| Family | $14.99/mo | Unlimited members, calendar sync, cooking mode |

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT

---

Built with ❤️ for families who are tired of the "what's for dinner?" question.

**www.bestmealmate.com**
