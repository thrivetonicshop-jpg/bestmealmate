import Link from 'next/link'
import { ChefHat, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ChefHat className="w-12 h-12 text-brand-600" />
        </div>

        <h1 className="text-6xl font-bold text-brand-600 mb-2">404</h1>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have gone missing from our kitchen.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-12 text-6xl">
          <span role="img" aria-label="cooking">
            🍳
          </span>
        </div>
      </div>
    </div>
  )
}
