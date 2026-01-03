import Link from 'next/link'
import { ChefHat, Calendar, Clock, ArrowLeft, ArrowRight, Share2, Twitter, Facebook, Linkedin } from 'lucide-react'
import { Metadata } from 'next'

// Blog post data
const blogPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  image: string
  author: string
  keywords: string[]
}> = {
  'best-meal-planning-app-families-2025': {
    title: 'Best Meal Planning App for Families in 2025: Complete Guide',
    excerpt: 'Discover why families with multiple dietary needs are switching to AI-powered meal planning. Compare top apps and find the perfect fit.',
    category: 'Guides',
    date: '2025-01-15',
    readTime: '8 min',
    image: '🍽️',
    author: 'BestMealMate Team',
    keywords: ['best meal planning app', 'family meal planner', 'meal planning app 2025'],
    content: `
# Best Meal Planning App for Families in 2025

If you're tired of the nightly "what's for dinner?" struggle, you're not alone. **73% of parents** say meal planning is one of their biggest daily stressors. But here's the good news: the right meal planning app can transform your family's eating habits.

## Why Families Need a Dedicated Meal Planning App

Unlike single-user apps, **family meal planning apps** need to handle:

- **Multiple dietary restrictions** (keto, vegetarian, allergies)
- **Different taste preferences** (picky eaters, adventurous eaters)
- **Various serving sizes** (toddler portions vs. teen appetites)
- **Shared grocery lists** that the whole family can access
- **Budget considerations** for feeding 4+ people

## Top Meal Planning Apps for Families in 2025

### 1. BestMealMate (Best Overall)
**Rating: 4.9/5**

BestMealMate stands out as the only app designed specifically for families with different diets. Dad can be on keto while mom is vegetarian, and the kids can have their nut allergies tracked—all in one unified meal plan.

**Key Features:**
- Unlimited family profiles with individual dietary needs
- AI-powered recipe suggestions that work for everyone
- Smart pantry tracking with expiration alerts
- Automatic grocery list generation
- Zero food waste tracking

**Pricing:** Free tier available, Premium $9.99/mo, Family $14.99/mo

### 2. Mealime
**Rating: 4.5/5**

Good for individuals, but limited family support. Only allows one dietary profile per account.

### 3. Yummly
**Rating: 4.3/5**

Great recipe database but no family meal planning features. Better for recipe discovery than planning.

### 4. Paprika
**Rating: 4.4/5**

Excellent recipe manager but requires manual entry. No AI suggestions or family profiles.

## What to Look for in a Family Meal Planning App

1. **Multiple Profile Support** - Can each family member have their own dietary preferences?
2. **Allergy Tracking** - Does it flag allergens in recipes?
3. **Flexible Serving Sizes** - Can you adjust portions for each person?
4. **Grocery Integration** - Does it create shopping lists automatically?
5. **Pantry Management** - Does it track what you already have?

## The Verdict

For families in 2025, **BestMealMate** offers the most comprehensive solution. It's the only app that truly understands that families don't eat the same diet—and that's okay.

**Ready to try it?** [Start your free trial today](/login) and see how much easier meal planning can be.
    `,
  },
  'mealime-vs-bestmealmate': {
    title: 'Mealime vs BestMealMate: Which Is Better for Families?',
    excerpt: 'An honest comparison of Mealime and BestMealMate. See which app handles multiple diets, allergies, and picky eaters better.',
    category: 'Comparisons',
    date: '2025-01-12',
    readTime: '6 min',
    image: '⚖️',
    author: 'BestMealMate Team',
    keywords: ['mealime alternative', 'mealime vs bestmealmate', 'better than mealime'],
    content: `
# Mealime vs BestMealMate: The Complete Comparison

Both Mealime and BestMealMate are popular meal planning apps, but they serve different audiences. Let's break down which one is right for your family.

## Quick Comparison Table

| Feature | Mealime | BestMealMate |
|---------|---------|--------------|
| Family Profiles | 1 diet only | Unlimited profiles |
| Serving Sizes | 2, 4, or 6 | Any number |
| Pantry Tracking | ❌ No | ✅ Yes |
| Expiration Alerts | ❌ No | ✅ Yes |
| AI Suggestions | Basic | Advanced |
| Grocery List | ✅ Yes | ✅ Yes (smarter) |
| Wearable Sync | ❌ No | ✅ Yes |
| Price | Free / $5.99 | Free / $9.99 |

## The Big Difference: Family Support

**Mealime's Limitation:**
Mealime only supports ONE dietary profile per account. If you're a single person eating clean, it's great. But what happens when:
- Your spouse is keto and you're vegetarian?
- Your kids have different allergies?
- Grandma visits and needs low-sodium meals?

You'd need separate accounts—and separate grocery lists.

**BestMealMate's Solution:**
Create unlimited family profiles. Each person gets their own:
- Dietary preferences
- Allergies and restrictions
- Calorie goals
- Food likes and dislikes

The AI then suggests recipes that work for everyone, or provides easy modifications.

## Grocery List Comparison

**Mealime:** Creates a basic list from your meal plan. If you edit the plan, the list resets.

**BestMealMate:** Creates a smart list that:
- Merges duplicate ingredients
- Organizes by store aisle
- Excludes items already in your pantry
- Stays intact when you edit meals

## The Verdict

**Choose Mealime if:**
- You're single or everyone eats the same diet
- You want the cheapest option
- Basic meal planning is enough

**Choose BestMealMate if:**
- Your family has different dietary needs
- You want to reduce food waste
- You need smart pantry tracking
- You want AI that actually understands your family

[Try BestMealMate free for 7 days](/login) and see the difference yourself.
    `,
  },
  'meal-planning-multiple-diets': {
    title: 'How to Meal Plan When Everyone Eats Different',
    excerpt: 'Dad is keto, mom is vegetarian, kids have allergies? Learn the secret to planning meals that work for everyone.',
    category: 'Tips',
    date: '2025-01-10',
    readTime: '5 min',
    image: '👨‍👩‍👧‍👦',
    author: 'BestMealMate Team',
    keywords: ['multiple diet meal planner', 'family with different diets', 'meal planning for families'],
    content: `
# How to Meal Plan When Everyone Eats Different

Picture this: Dad's doing keto, Mom's vegetarian, one kid is gluten-free, and the other won't eat anything green. Sound familiar?

You're not alone. **68% of families** report having at least two different dietary preferences at their dinner table.

## The Traditional Approach (And Why It Fails)

Most families try one of these strategies:

1. **Make separate meals** - Exhausting and expensive
2. **Force everyone to eat the same** - Leads to arguments and wasted food
3. **Give up and order takeout** - Hard on the wallet and waistline

There's a better way.

## The Modular Meal Strategy

The secret is building meals with **swappable components**:

### Base + Protein + Toppings

**Example: Taco Night**
- Base: Lettuce wraps (keto) OR corn tortillas (regular) OR flour tortillas
- Protein: Ground beef OR black beans (vegetarian) OR chicken
- Toppings: Everyone picks their own

**Example: Buddha Bowls**
- Base: Cauliflower rice (keto) OR quinoa OR regular rice
- Protein: Grilled chicken OR tofu OR salmon
- Veggies: Roasted vegetables everyone can share
- Sauce: Various options on the side

## How BestMealMate Makes This Easy

Instead of planning everything manually, BestMealMate:

1. **Stores everyone's preferences** - Enter once, never forget
2. **Suggests modular recipes** - Designed for easy swaps
3. **Generates personalized portions** - Dad gets his macros, kids get their nutrients
4. **Creates one grocery list** - With all the variations included

## 5 Family-Friendly Meals That Work for Any Diet

1. **Build-Your-Own Grain Bowls** - Swap grains and proteins freely
2. **Sheet Pan Fajitas** - Easy to customize toppings
3. **Soup + Salad Bar** - Base soup with add-your-own proteins
4. **Homemade Pizza Night** - Personal pizzas with different toppings
5. **Stir-Fry Station** - Same veggies, different proteins

## Start Planning Smarter

Ready to end the "what's for dinner" battle? [Try BestMealMate free](/login) and create your family's first unified meal plan in under 5 minutes.
    `,
  },
  'reduce-food-waste-meal-planning': {
    title: '7 Ways to Cut Food Waste by 40% With Smart Meal Planning',
    excerpt: 'The average family throws away $1,500 in food yearly. Here\'s how to stop wasting money and start eating better.',
    category: 'Tips',
    date: '2025-01-08',
    readTime: '7 min',
    image: '♻️',
    author: 'BestMealMate Team',
    keywords: ['reduce food waste', 'food waste meal planning', 'smart pantry'],
    content: `
# 7 Ways to Cut Food Waste by 40% With Smart Meal Planning

The average American family throws away **$1,500 worth of food** every year. That's not just bad for your wallet—it's bad for the planet.

But here's the surprising truth: **meal planning alone can reduce food waste by 40%**.

## Why We Waste Food

- **Buying too much** - No plan means impulse purchases
- **Forgetting what we have** - That lettuce hiding in the back of the fridge
- **Not using leftovers** - "I'll eat it tomorrow" (you won't)
- **Expiration surprises** - Didn't know the milk was about to turn

## 7 Strategies That Actually Work

### 1. Plan Before You Shop (Obviously)
But here's the key: plan based on what you already have. Check your fridge first, then fill in the gaps.

### 2. Use a Smart Pantry System
Track what's in your fridge and pantry. Apps like BestMealMate can alert you when items are about to expire.

### 3. "Eat First" List
Every week, identify 3-5 items that need to be used ASAP. Build your meal plan around these first.

### 4. Embrace Ugly Produce
Those slightly soft apples? Perfect for applesauce. Wilting spinach? Into the smoothie it goes.

### 5. Master the "Clean Out" Meal
Once a week, make a meal using only what's left:
- Frittatas (any vegetables + eggs)
- Fried rice (any protein + vegetables)
- Soup (literally anything)

### 6. Proper Storage Matters
- Herbs in water like flowers
- Berries unwashed until use
- Bananas away from other fruit

### 7. Track Your Waste
Keep a "waste log" for one week. You'll be shocked—and motivated to change.

## How BestMealMate Helps

Our Smart Pantry feature:
- **Tracks expiration dates** automatically
- **Prioritizes ingredients** about to expire in recipe suggestions
- **Shows your waste reduction** over time
- **Calculates money saved** from reduced waste

One user reported saving **$200/month** just by using the Smart Pantry feature.

## Start Saving Today

[Try BestMealMate free](/login) and see how much you can save. Your wallet (and the planet) will thank you.
    `,
  },
  'keto-meal-planning-beginners': {
    title: 'Keto Meal Planning for Beginners: 7-Day Starter Guide',
    excerpt: 'Start your keto journey the right way. Includes shopping list, meal prep tips, and family-friendly recipes.',
    category: 'Guides',
    date: '2025-01-05',
    readTime: '10 min',
    image: '🥑',
    author: 'BestMealMate Team',
    keywords: ['keto meal planner', 'keto meal plan app', 'keto for beginners'],
    content: `
# Keto Meal Planning for Beginners: Your 7-Day Starter Guide

Starting keto can feel overwhelming. What can you eat? What about your family who isn't doing keto? How do you meal prep?

This guide covers everything you need to know.

## Keto Basics in 60 Seconds

**The goal:** 70% fat, 25% protein, 5% carbs (under 20-50g net carbs daily)

**Eat freely:**
- Meat, fish, eggs
- Above-ground vegetables
- Full-fat dairy
- Nuts and seeds
- Healthy oils

**Avoid:**
- Sugar and sweets
- Grains and starches
- Most fruits
- Legumes

## 7-Day Keto Meal Plan

### Day 1
- **Breakfast:** Scrambled eggs with avocado
- **Lunch:** Caesar salad with grilled chicken (no croutons)
- **Dinner:** Salmon with roasted broccoli

### Day 2
- **Breakfast:** Keto smoothie (avocado, spinach, almond butter)
- **Lunch:** Lettuce wrap burgers
- **Dinner:** Chicken stir-fry with cauliflower rice

### Day 3
- **Breakfast:** Bacon and eggs
- **Lunch:** Tuna salad stuffed avocado
- **Dinner:** Beef tacos in cheese shells

### Day 4
- **Breakfast:** Greek yogurt with nuts
- **Lunch:** Cobb salad
- **Dinner:** Pork chops with green beans

### Day 5
- **Breakfast:** Keto pancakes (almond flour)
- **Lunch:** Egg salad lettuce cups
- **Dinner:** Shrimp scampi with zucchini noodles

### Day 6
- **Breakfast:** Bulletproof coffee + hard boiled eggs
- **Lunch:** Chicken soup (no noodles)
- **Dinner:** Steak with mushrooms and asparagus

### Day 7
- **Breakfast:** Veggie omelet
- **Lunch:** Leftover steak salad
- **Dinner:** Baked chicken thighs with roasted vegetables

## Keto When Your Family Isn't

Here's the secret: **make modular meals**.

Cook a protein + vegetables that everyone eats, then:
- You skip the starch
- Family adds rice, pasta, or bread

BestMealMate automatically suggests recipes that work for keto AND non-keto eaters in the same household.

## Your Keto Shopping List

**Proteins:** Chicken, beef, pork, salmon, eggs, bacon

**Vegetables:** Broccoli, cauliflower, spinach, zucchini, asparagus

**Fats:** Avocados, olive oil, butter, cheese, nuts

**Pantry:** Almond flour, coconut flour, sugar-free sweeteners

## Start Your Keto Journey

[Try BestMealMate free](/login) and get personalized keto meal plans that work for your whole family—even if they're not doing keto.
    `,
  },
  'weekly-meal-prep-busy-parents': {
    title: 'Weekly Meal Prep for Busy Parents: The 2-Hour Method',
    excerpt: 'Spend just 2 hours on Sunday to have healthy dinners ready all week. Step-by-step guide with recipes.',
    category: 'Guides',
    date: '2025-01-02',
    readTime: '9 min',
    image: '⏰',
    author: 'BestMealMate Team',
    keywords: ['meal prep for families', 'weekly meal prep', 'busy parent meal planning'],
    content: `
# Weekly Meal Prep for Busy Parents: The 2-Hour Method

What if you could spend just **2 hours on Sunday** and have healthy dinners ready for your entire week?

No more 6 PM panic. No more expensive takeout. No more kitchen chaos on school nights.

Here's exactly how to do it.

## The 2-Hour Meal Prep Framework

### Hour 1: Proteins & Grains (60 minutes)

**Cook 2-3 proteins simultaneously:**
- Oven: Sheet pan chicken thighs (40 min)
- Stovetop: Ground beef or turkey (15 min)
- Instant Pot: Shredded pork or chicken (30 min)

**While proteins cook, make grains:**
- Rice cooker: Big batch of rice
- Stovetop: Quinoa

### Hour 2: Vegetables & Assembly (60 minutes)

**Roast vegetables:**
- Sheet pan 1: Broccoli, cauliflower
- Sheet pan 2: Sweet potatoes, carrots

**Prep raw vegetables:**
- Wash and chop salad ingredients
- Cut veggies for snacks
- Make salad dressings

**Assembly:**
- Portion into containers
- Label with dates

## Sample Week Using Prepped Ingredients

### Monday: Chicken + Rice + Roasted Broccoli
Just reheat and serve. 10 minutes.

### Tuesday: Ground Beef Tacos
Prepped beef + tortillas + fresh toppings. 15 minutes.

### Wednesday: Buddha Bowls
Prepped quinoa + roasted veggies + shredded pork + sauce. 10 minutes.

### Thursday: Chicken Stir-Fry
Sliced prepped chicken + fresh stir-fry veggies. 20 minutes.

### Friday: Rice Bowls
Whatever's left + fried egg + sriracha. 10 minutes.

## The Game-Changer: Prep Based on Your Plan

Here's where most people fail: they prep random ingredients without a plan.

**The right way:**
1. Plan your 5 weeknight dinners first
2. Identify common ingredients
3. Prep ONLY what you need

BestMealMate does this automatically:
- Suggests recipes with overlapping ingredients
- Creates a prep checklist
- Tells you exactly what to cook on Sunday

## Pro Tips from Real Parents

1. **Prep doesn't mean boring** - Same ingredients, different sauces = different meals
2. **Involve the kids** - They're more likely to eat food they helped prepare
3. **Don't over-prep** - 5 dinners is plenty. Leave room for leftovers and flexibility.
4. **Invest in containers** - Glass containers with locking lids are worth it

## Start Your Meal Prep Journey

[Try BestMealMate free](/login) and get a personalized prep checklist based on your family's meal plan. Sunday prep has never been easier.
    `,
  },
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-brand-600 hover:underline">
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  const postSlugs = Object.keys(blogPosts)
  const currentIndex = postSlugs.indexOf(slug)
  const prevPost = currentIndex > 0 ? postSlugs[currentIndex - 1] : null
  const nextPost = currentIndex < postSlugs.length - 1 ? postSlugs[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <Link
                href="/login"
                className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-brand-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all articles
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="h-64 bg-gradient-to-br from-brand-100 to-brand-50 rounded-2xl flex items-center justify-center mb-8">
          <span className="text-8xl">{post.image}</span>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-brand-600 prose-strong:text-gray-900 prose-li:text-gray-600"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />

        {/* Share */}
        <div className="border-t border-b py-6 my-8">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-600">
              <Share2 className="w-5 h-5" />
              Share this article
            </span>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.bestmealmate.com/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-600" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.bestmealmate.com/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Facebook className="w-5 h-5 text-gray-600" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://www.bestmealmate.com/blog/${slug}`)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost}`}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous article
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost}`}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-600"
            >
              Next article
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </article>

      {/* CTA */}
      <section className="bg-brand-500 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to try BestMealMate?
          </h2>
          <p className="text-white/90 mb-8">
            Join thousands of families who&apos;ve simplified their meal planning.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 BestMealMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function sanitizeUrl(url: string): string {
  // Only allow safe URL protocols to prevent javascript: XSS attacks
  const trimmedUrl = url.trim()

  // Allow relative URLs starting with /
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl
  }

  // Allow safe protocols
  const safeProtocols = ['http:', 'https:', 'mailto:']
  try {
    const parsed = new URL(trimmedUrl)
    if (safeProtocols.includes(parsed.protocol)) {
      return trimmedUrl
    }
  } catch {
    // If URL parsing fails and it's not a relative URL, block it
  }

  // Block unsafe URLs (javascript:, data:, vbscript:, etc.)
  return '#'
}

function escapeHtml(text: string): string {
  // Escape HTML special characters to prevent XSS in text content
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatContent(content: string): string {
  // Simple markdown to HTML conversion with XSS protection
  return content
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-4">$&</ul>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
      const safeUrl = sanitizeUrl(url)
      const safeText = escapeHtml(text)
      return `<a href="${safeUrl}" class="text-brand-600 hover:underline">${safeText}</a>`
    })
    .replace(/\n\n/g, '</p><p class="my-4">')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      return '<tr>' + cells.map(c => `<td class="border px-4 py-2">${escapeHtml(c.trim())}</td>`).join('') + '</tr>'
    })
}
