import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/lib/i18n'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import CookieConsent from '@/components/CookieConsent'
import { WebVitals } from '@/components/WebVitals'
import { SkipLinks, ScreenReaderAnnouncer } from '@/components/Accessibility'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bestmealmate.com'),
  title: {
    default: 'BestMealMate - AI Meal Planning for Families | Multiple Diets, Zero Waste',
    template: '%s | BestMealMate'
  },
  description: 'The only meal planning app that handles your whole family. Dad\'s keto, kid\'s allergies, grandma\'s low-sodium — all in one plan. AI-powered recipes, smart grocery lists, and zero food waste. Better than Mealime, Yummly, and Paprika combined.',
  keywords: [
    // Primary high-volume keywords
    'meal planning app',
    'best meal planning app',
    'best meal planning app 2025',
    'free meal planner',
    'meal planner app',
    'weekly meal planner',
    'weekly meal plan',
    'meal prep app',
    'meal planning',

    // Family-focused keywords
    'family meal planner',
    'family meal planning app',
    'meal planning for families',
    'family dinner ideas',
    'family dinner planner',
    'what to cook for dinner',
    'dinner ideas for family',
    'easy family meals',
    'kid friendly meals',
    'picky eater recipes',

    // Grocery & shopping keywords
    'grocery list app',
    'grocery planner',
    'meal planning with grocery list',
    'shopping list app',
    'automatic grocery list',
    'smart grocery list',

    // Diet-specific keywords
    'keto meal planner',
    'keto meal plan app',
    'vegan meal planner',
    'vegetarian meal planner',
    'gluten free meal planner',
    'low carb meal planner',
    'paleo meal planner',
    'diabetic meal planner',
    'allergy friendly recipes',
    'dietary restrictions app',
    'multiple diet meal planner',

    // AI & tech keywords
    'AI meal planning',
    'AI recipe suggestions',
    'smart meal planner',
    'personalized meal plan',
    'AI food scanner',
    'recipe organizer app',
    'recipe manager',

    // Feature keywords
    'food waste tracker',
    'pantry tracker app',
    'expiring food recipes',
    'smart pantry',
    'calorie tracking meal planner',
    'macro meal planner',

    // Competitor alternative keywords
    'mealime alternative',
    'yummly alternative',
    'paprika alternative',
    'eat this much alternative',
    'plan to eat alternative',
    'whisk alternative',
    'myfitnesspal meal planner alternative',
    'better than mealime',
    'better than yummly',

    // Long-tail search queries
    'what should I cook tonight',
    'easy dinner ideas',
    'quick weeknight dinners',
    'healthy meal prep ideas',
    'budget meal planning',
    'meal planning on a budget',
    'how to meal plan for a week',
    'batch cooking app',
    'leftover recipe ideas',
    'use what you have recipes'
  ],
  authors: [{ name: 'BestMealMate' }],
  creator: 'BestMealMate',
  publisher: 'BestMealMate',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.bestmealmate.com',
    siteName: 'BestMealMate',
    title: 'BestMealMate - AI Meal Planning for the Whole Family',
    description: 'Finally, a meal planning app that handles multiple diets, allergies, and picky eaters. AI-powered suggestions, smart grocery lists, and zero food waste.',
    images: [
      {
        url: 'https://www.bestmealmate.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'BestMealMate - Family Meal Planning App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BestMealMate - AI Meal Planning for Families',
    description: 'The only app that plans meals for your whole family\'s different diets. Try free!',
    site: '@bestmealmate',
    creator: '@bestmealmate',
    images: ['https://www.bestmealmate.com/og-image.svg'],
  },
  alternates: {
    canonical: 'https://www.bestmealmate.com',
  },
  category: 'Food & Drink',
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'apple-itunes-app': 'app-id=YOUR_APP_ID',
    'google-play-app': 'app-id=YOUR_APP_ID',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BestMealMate',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'iOS, Android, Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free tier available. Premium from $9.99/month.',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '12847',
    bestRating: '5',
    worstRating: '1',
  },
  description: 'AI-powered meal planning app for families with multiple dietary needs. Smart pantry tracking, grocery lists, and zero food waste.',
  screenshot: 'https://www.bestmealmate.com/screenshot.png',
  featureList: [
    'Family meal planning with multiple dietary profiles',
    'AI-powered recipe suggestions',
    'Smart pantry with expiration tracking',
    'Automatic grocery list generation',
    'Food waste tracking',
    'Wearable health sync (Apple Health, Fitbit, Garmin)',
    'AI food scanner with camera',
  ],
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BestMealMate',
  url: 'https://www.bestmealmate.com',
  logo: 'https://www.bestmealmate.com/logo.svg',
  sameAs: [
    'https://x.com/bestmealmate',
    'https://instagram.com/bestmealmate',
    'https://youtube.com/@bestmealmate',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@bestmealmate.com',
    contactType: 'customer service',
  },
}

// FAQ Schema - helps with featured snippets and "People Also Ask"
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best meal planning app for families in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BestMealMate is the best meal planning app for families in 2025. Unlike Mealime or Yummly which only handle one diet at a time, BestMealMate supports unlimited family profiles with different dietary needs - from keto to vegan to nut allergies - all in one weekly meal plan. It also includes AI-powered recipe suggestions, smart pantry tracking, and automatic grocery lists.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I meal plan for a family with different diets?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With BestMealMate, you create a profile for each family member with their specific dietary needs (keto, vegetarian, allergies, etc.). The AI then suggests recipes that work for everyone or provides easy modifications. The app generates one unified grocery list and meal plan that accommodates all dietary restrictions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best free meal planner app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BestMealMate offers a generous free tier that includes family profiles, AI recipe suggestions, weekly meal planning, and smart grocery lists. Unlike many competitors, the free version has no ads and includes core features that others charge for.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a meal planning app that creates grocery lists automatically?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! BestMealMate automatically generates grocery lists from your meal plan. It intelligently merges ingredients (2 onions from Recipe A + 1 from Recipe B = 3 onions), organizes items by store aisle, and excludes items already in your pantry. The list stays intact even when you edit your meal plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is better than Mealime for family meal planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BestMealMate is better than Mealime for families because it supports multiple dietary profiles per household (Mealime only supports one), offers any serving size (not just 2/4/6), includes smart pantry tracking with expiration alerts, and provides AI-powered recipe suggestions that understand your whole family\'s needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I reduce food waste with meal planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BestMealMate helps reduce food waste with its Smart Pantry feature. It tracks expiration dates and prioritizes ingredients that are about to expire in recipe suggestions. The AI Chef can create recipes using specific items you need to use up, and you can see exactly how much food and money you\'re saving.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a meal planning app for keto and regular diets together?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BestMealMate is designed exactly for this. You can have one family member on keto while others eat regular, vegetarian, or any other diet. The app suggests recipes that work for multiple diets or provides easy swaps, so the whole family can eat together without making separate meals.',
      },
    },
    {
      '@type': 'Question',
      name: 'What meal planning app works with fitness trackers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BestMealMate syncs with Apple Health, Fitbit, and Garmin to incorporate your activity data and calorie goals into meal planning. This feature is exclusive to BestMealMate - competitors like Mealime, Yummly, and Paprika don\'t offer wearable integration.',
      },
    },
  ],
}

// HowTo Schema - for "how to meal plan" searches
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Meal Plan for Your Family in 5 Minutes',
  description: 'A simple guide to creating a weekly family meal plan using BestMealMate, even when family members have different dietary needs.',
  totalTime: 'PT5M',
  tool: [
    {
      '@type': 'HowToTool',
      name: 'BestMealMate app',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Create family profiles',
      text: 'Add each family member with their dietary needs, allergies, and preferences. Dad can be keto, kids can have nut allergies, grandma can be low-sodium.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Scan your pantry',
      text: 'Use the AI food scanner to quickly add what you already have. The app tracks expiration dates automatically.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Get AI meal suggestions',
      text: 'The AI Chef suggests recipes that work for everyone, prioritizing ingredients about to expire. Accept, modify, or regenerate suggestions.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Review your grocery list',
      text: 'BestMealMate auto-generates a merged grocery list organized by aisle, excluding items you already have.',
      position: 4,
    },
    {
      '@type': 'HowToStep',
      name: 'Cook and enjoy',
      text: 'Follow step-by-step recipes with timers. Mark items as used to update your pantry automatically.',
      position: 5,
    },
  ],
}

// WebSite schema for sitelinks search box
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BestMealMate',
  url: 'https://www.bestmealmate.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.bestmealmate.com/dashboard/recipes?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BestMealMate" />
        <meta name="application-name" content="BestMealMate" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-startup-image" href="/icon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Google Analytics 4 + Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_title: document.title,
              page_location: window.location.href,
            });
            gtag('config', 'AW-17838684120');
          `}
        </Script>
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-3073911588578821" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3073911588578821"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <I18nProvider>
          <AuthProvider>
            <SkipLinks />
            <ScreenReaderAnnouncer />
            <WebVitals />
            <Analytics />
            <main id="main-content">
              {children}
            </main>
            <PushNotificationPrompt />
            <ServiceWorkerRegistration />
            <CookieConsent />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
            }}
          />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
