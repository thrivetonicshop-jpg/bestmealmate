import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'BestMealMate - Family Meal Planning Made Easy',
  description: 'The smart meal planning app that knows your family. One plan. Everyone eats. Nothing wasted.',
  keywords: 'meal planning, family meals, grocery list, recipe planner, food waste, meal prep',
  openGraph: {
    title: 'BestMealMate - Family Meal Planning Made Easy',
    description: 'The smart meal planning app that knows your family.',
    url: 'https://www.bestmealmate.com',
    siteName: 'BestMealMate',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
