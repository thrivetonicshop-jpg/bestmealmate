# Deployment Guide - BestMealMate

Complete step-by-step guide to deploy BestMealMate to production.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts created for:
  - [Supabase](https://supabase.com) (database & auth)
  - [Stripe](https://stripe.com) (payments)
  - [Anthropic](https://console.anthropic.com) (AI)
  - [Vercel](https://vercel.com) (hosting)

---

## Step 1: Supabase Setup

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Enter project details:
   - **Name:** `bestmealmate`
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users
4. Click **Create new project** and wait for setup

### 1.2 Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click **Run**
5. Verify tables were created in **Table Editor**

### 1.3 Configure Authentication

1. Go to **Authentication** > **Providers**
2. Email is enabled by default
3. To enable Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth credentials
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

### 1.4 Get API Keys

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** -> `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## Step 2: Stripe Setup

### 2.1 Create Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete business verification (for production)

### 2.2 Create Products

1. Go to **Products** > **Add Product**
2. Create **Premium** product:
   - **Name:** Premium
   - **Price:** $9.99/month recurring
   - Copy the Price ID -> `STRIPE_PREMIUM_PRICE_ID`

3. Create **Family** product:
   - **Name:** Family
   - **Price:** $14.99/month recurring
   - Copy the Price ID -> `STRIPE_FAMILY_PRICE_ID`

### 2.3 Get API Keys

1. Go to **Developers** > **API keys**
2. Copy:
   - **Publishable key** -> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** -> `STRIPE_SECRET_KEY`

### 2.4 Configure Webhook

1. Go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy **Signing secret** -> `STRIPE_WEBHOOK_SECRET`

---

## Step 3: Anthropic Setup

### 3.1 Get API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or sign in
3. Go to **API Keys**
4. Create new key
5. Copy -> `ANTHROPIC_API_KEY`

---

## Step 4: Environment Configuration

### 4.1 Create Environment File

Create `.env.local` in your project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_FAMILY_PRICE_ID=price_...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=https://www.bestmealmate.com
```

### 4.2 Validate Configuration

```bash
# Test locally
npm run dev

# Visit http://localhost:3000
# Test login, signup, and basic features
```

---

## Step 5: Deploy to Vercel

### 5.1 Connect Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **New Project**
4. Import your GitHub repository
5. Select the `bestmealmate` directory as root

### 5.2 Configure Environment Variables

In Vercel project settings > Environment Variables, add all variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Your webhook secret |
| `STRIPE_PREMIUM_PRICE_ID` | Premium price ID |
| `STRIPE_FAMILY_PRICE_ID` | Family price ID |
| `ANTHROPIC_API_KEY` | Your Anthropic key |
| `NEXT_PUBLIC_APP_URL` | Your production URL |

### 5.3 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Visit your deployed URL

### 5.4 Update Webhook URL

After deployment:

1. Go to Stripe Dashboard > Webhooks
2. Update endpoint URL to your Vercel URL:
   `https://your-app.vercel.app/api/stripe/webhook`

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add `www.bestmealmate.com`
3. Follow DNS instructions

### 6.2 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain.

### 6.3 Update Supabase

1. Go to Supabase > Authentication > URL Configuration
2. Add your custom domain to **Site URL**
3. Add to **Redirect URLs**: `https://www.bestmealmate.com/auth/callback`

### 6.4 Update Stripe

Update webhook endpoint to use custom domain.

---

## Post-Deployment Checklist

### Authentication

- [ ] Email signup works
- [ ] Email login works
- [ ] Google OAuth works (if configured)
- [ ] Password reset works
- [ ] Logout works

### Core Features

- [ ] Dashboard loads correctly
- [ ] Pantry page shows/adds/edits/deletes items
- [ ] Recipes page displays recipes
- [ ] Grocery list functionality works
- [ ] Family member management works
- [ ] Settings page saves changes

### Payments

- [ ] Stripe checkout redirects correctly
- [ ] Subscription activates after payment
- [ ] Webhook updates subscription tier
- [ ] Cancellation downgrades to free

### AI Features

- [ ] AI Chef responds to queries
- [ ] Context (pantry, family) is included
- [ ] Error handling works

### Mobile

- [ ] Responsive design works on mobile
- [ ] Bottom navigation functions
- [ ] Touch interactions work

---

## Monitoring & Maintenance

### Vercel Analytics

1. Enable in Project Settings > Analytics
2. View real-time traffic and performance

### Supabase Monitoring

1. Go to **Reports** in Supabase dashboard
2. Monitor database size and API requests

### Stripe Dashboard

1. Monitor payments, subscriptions, and failures
2. Set up email alerts for failed payments

### Error Tracking (Optional)

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Scaling Considerations

### Database

- Enable connection pooling in Supabase for high traffic
- Add read replicas if needed
- Optimize queries with proper indexes

### Caching

- Enable Vercel Edge caching for static assets
- Consider Redis for session/data caching

### CDN

- Vercel automatically serves from edge locations
- Use Supabase Storage CDN for images

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

1. Check Supabase project is running
2. Verify environment variables
3. Check RLS policies aren't blocking queries

### Stripe Webhook Failures

1. Verify webhook secret is correct
2. Check endpoint URL matches exactly
3. View webhook logs in Stripe Dashboard

### AI Chef Not Working

1. Verify Anthropic API key is valid
2. Check API usage/limits
3. View error logs in Vercel

---

## Environment Summary

### Development

```
URL: http://localhost:3000
Database: Supabase (development project)
Payments: Stripe test mode
```

### Staging (Optional)

```
URL: https://staging.bestmealmate.com
Database: Supabase (staging project)
Payments: Stripe test mode
```

### Production

```
URL: https://www.bestmealmate.com
Database: Supabase (production project)
Payments: Stripe live mode
```

---

## Security Checklist

- [ ] Service role key is only used server-side
- [ ] All sensitive keys are in environment variables
- [ ] RLS is enabled on all tables
- [ ] HTTPS is enforced
- [ ] CORS is configured correctly
- [ ] Rate limiting is in place
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Supabase handles this)
- [ ] XSS prevention (React handles this)

---

## Backup & Recovery

### Database Backups

Supabase provides automatic daily backups on Pro plan.

For manual backup:

```bash
# Using pg_dump
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Code Repository

Ensure code is pushed to GitHub with:
- Main branch protection
- Required pull request reviews
- CI/CD pipeline

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Anthropic Docs:** https://docs.anthropic.com
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
