'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  ChevronRight,
  Play,
  FileText,
  Smartphone,
  CreditCard,
  Users,
  ShoppingCart,
  Utensils,
  Settings,
  Shield,
  Zap
} from 'lucide-react'

interface HelpCategory {
  id: string
  title: string
  description: string
  icon: React.ElementType
  articles: { title: string; slug: string }[]
}

const categories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of BestMealMate',
    icon: Zap,
    articles: [
      { title: 'Creating your account', slug: 'creating-account' },
      { title: 'Setting up your family', slug: 'family-setup' },
      { title: 'Adding dietary preferences', slug: 'dietary-preferences' },
      { title: 'Your first meal plan', slug: 'first-meal-plan' },
      { title: 'Installing the app', slug: 'install-pwa' },
    ]
  },
  {
    id: 'meal-planning',
    title: 'Meal Planning',
    description: 'Create and manage meal plans',
    icon: Utensils,
    articles: [
      { title: 'How AI meal planning works', slug: 'ai-meal-planning' },
      { title: 'Customizing suggestions', slug: 'customize-suggestions' },
      { title: 'Weekly vs daily planning', slug: 'planning-frequency' },
      { title: 'Saving favorite meals', slug: 'favorite-meals' },
      { title: 'Meal plan history', slug: 'meal-history' },
    ]
  },
  {
    id: 'pantry',
    title: 'Pantry & Inventory',
    description: 'Track what you have at home',
    icon: ShoppingCart,
    articles: [
      { title: 'Adding items to pantry', slug: 'add-pantry-items' },
      { title: 'Using the food scanner', slug: 'food-scanner' },
      { title: 'Barcode scanning', slug: 'barcode-scanning' },
      { title: 'Tracking expiration dates', slug: 'expiration-tracking' },
      { title: 'Reducing food waste', slug: 'reduce-waste' },
    ]
  },
  {
    id: 'family',
    title: 'Family & Diets',
    description: 'Manage family members and dietary needs',
    icon: Users,
    articles: [
      { title: 'Adding family members', slug: 'add-family-members' },
      { title: 'Setting dietary restrictions', slug: 'dietary-restrictions' },
      { title: 'Managing allergies', slug: 'managing-allergies' },
      { title: 'Kid-friendly options', slug: 'kid-friendly' },
      { title: 'Multiple diet support', slug: 'multiple-diets' },
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    description: 'Manage your subscription and payments',
    icon: CreditCard,
    articles: [
      { title: 'Subscription plans explained', slug: 'subscription-plans' },
      { title: 'Upgrading your plan', slug: 'upgrade-plan' },
      { title: 'Canceling subscription', slug: 'cancel-subscription' },
      { title: 'Payment methods', slug: 'payment-methods' },
      { title: 'Viewing invoices', slug: 'view-invoices' },
    ]
  },
  {
    id: 'account',
    title: 'Account & Privacy',
    description: 'Account settings and data privacy',
    icon: Shield,
    articles: [
      { title: 'Changing your password', slug: 'change-password' },
      { title: 'Exporting your data', slug: 'export-data' },
      { title: 'Deleting your account', slug: 'delete-account' },
      { title: 'Privacy settings', slug: 'privacy-settings' },
      { title: 'Two-factor authentication', slug: 'two-factor-auth' },
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App',
    description: 'Using BestMealMate on your phone',
    icon: Smartphone,
    articles: [
      { title: 'Installing on iPhone', slug: 'install-iphone' },
      { title: 'Installing on Android', slug: 'install-android' },
      { title: 'Offline access', slug: 'offline-access' },
      { title: 'Push notifications', slug: 'push-notifications' },
      { title: 'Syncing across devices', slug: 'device-sync' },
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: Settings,
    articles: [
      { title: 'App not loading', slug: 'app-not-loading' },
      { title: 'Login problems', slug: 'login-problems' },
      { title: 'Scanner not working', slug: 'scanner-issues' },
      { title: 'Sync issues', slug: 'sync-issues' },
      { title: 'Report a bug', slug: 'report-bug' },
    ]
  },
]

const popularArticles = [
  { title: 'How to get started with meal planning', category: 'Getting Started', slug: 'first-meal-plan' },
  { title: 'Setting up dietary restrictions', category: 'Family & Diets', slug: 'dietary-restrictions' },
  { title: 'Using the barcode scanner', category: 'Pantry', slug: 'barcode-scanning' },
  { title: 'Canceling your subscription', category: 'Billing', slug: 'cancel-subscription' },
  { title: 'Installing the mobile app', category: 'Mobile', slug: 'install-pwa' },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(cat =>
    searchQuery === '' ||
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.articles.some(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-600 to-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Link href="/" className="text-white/80 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-xl text-white/80 mb-8">
            Search our help center or browse categories below
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/30 outline-none"
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <Link href="/faq" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all">
            <div className="p-3 bg-brand-100 rounded-lg">
              <Book className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-500">Common questions</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contact Us</h3>
              <p className="text-sm text-gray-500">Get in touch</p>
            </div>
          </Link>

          <a href="mailto:hello@bestmealmate.com" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-500">hello@bestmealmate.com</p>
            </div>
          </a>
        </div>

        {/* Popular Articles */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Articles</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={`/help/${article.slug}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{article.title}</p>
                    <p className="text-sm text-gray-500">{article.category}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-100 rounded-lg">
                      <category.icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {category.articles.slice(0, 3).map((article, index) => (
                    <Link
                      key={index}
                      href={`/help/${article.slug}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{article.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                  {category.articles.length > 3 && (
                    <Link
                      href={`/help/category/${category.id}`}
                      className="block px-4 py-3 text-sm text-brand-600 font-medium hover:bg-brand-50 transition-colors"
                    >
                      View all {category.articles.length} articles →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Getting Started Guide', duration: '5:30' },
              { title: 'Setting Up Your Family', duration: '3:45' },
              { title: 'Using the Food Scanner', duration: '2:15' },
            ].map((video, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-emerald-500/20" />
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-brand-600 ml-1" />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900">{video.title}</p>
                  <p className="text-sm text-gray-500">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mt-12 bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Link>
            <a
              href="mailto:hello@bestmealmate.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 BestMealMate. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-brand-600">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-600">Terms</Link>
            <Link href="/faq" className="hover:text-brand-600">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
