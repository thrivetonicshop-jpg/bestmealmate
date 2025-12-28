import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bestmealmate.com'),
  title: {
    default: 'BestMealMate - AI Meal Planning for Families | Multiple Diets, Zero Waste',
    template: '%s | BestMealMate'
  },
  description: 'The only meal planning app that handles your whole family. Dad\'s keto, kid\'s allergies, grandma\'s low-sodium — all in one plan. AI-powered recipes, smart grocery lists, and zero food waste. Better than Mealime, Yummly, and Paprika combined.',
  keywords: [
    'meal planning app',
    'family meal planner',
    'AI meal planning',
    'grocery list app',
    'recipe planner',
    'food waste tracker',
    'meal prep app',
    'dietary restrictions app',
    'allergy-friendly recipes',
    'keto meal planner',
    'family dinner ideas',
    'weekly meal plan',
    'smart pantry',
    'expiring food recipes',
    'mealime alternative',
    'yummly alternative',
    'paprika alternative',
    'best meal planning app 2025',
    'family meal planning app',
    'multiple diet meal planner'
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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
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
  logo: 'https://www.bestmealmate.com/logo.png',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <AuthProvider>
          {children}
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
      </body>
    </html>
  )
}
