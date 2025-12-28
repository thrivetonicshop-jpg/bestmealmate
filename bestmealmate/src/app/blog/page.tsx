'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, ChefHat, Search } from 'lucide-react'
import { useState } from 'react'

const blogPosts = [
  {
    slug: 'best-meal-planning-app-families-2025',
    title: 'Best Meal Planning App for Families in 2025: Complete Guide',
    excerpt: 'Discover why families with multiple dietary needs are switching to AI-powered meal planning. Compare top apps and find the perfect fit.',
    category: 'Guides',
    date: '2025-01-15',
    readTime: '8 min',
    image: '🍽️',
    featured: true,
  },
  {
    slug: 'mealime-vs-bestmealmate',
    title: 'Mealime vs BestMealMate: Which Is Better for Families?',
    excerpt: 'An honest comparison of Mealime and BestMealMate. See which app handles multiple diets, allergies, and picky eaters better.',
    category: 'Comparisons',
    date: '2025-01-12',
    readTime: '6 min',
    image: '⚖️',
    featured: true,
  },
  {
    slug: 'meal-planning-multiple-diets',
    title: 'How to Meal Plan When Everyone Eats Different',
    excerpt: 'Dad is keto, mom is vegetarian, kids have allergies? Learn the secret to planning meals that work for everyone.',
    category: 'Tips',
    date: '2025-01-10',
    readTime: '5 min',
    image: '👨‍👩‍👧‍👦',
    featured: false,
  },
  {
    slug: 'reduce-food-waste-meal-planning',
    title: '7 Ways to Cut Food Waste by 40% With Smart Meal Planning',
    excerpt: 'The average family throws away $1,500 in food yearly. Here\'s how to stop wasting money and start eating better.',
    category: 'Tips',
    date: '2025-01-08',
    readTime: '7 min',
    image: '♻️',
    featured: false,
  },
  {
    slug: 'keto-meal-planning-beginners',
    title: 'Keto Meal Planning for Beginners: 7-Day Starter Guide',
    excerpt: 'Start your keto journey the right way. Includes shopping list, meal prep tips, and family-friendly recipes.',
    category: 'Guides',
    date: '2025-01-05',
    readTime: '10 min',
    image: '🥑',
    featured: false,
  },
  {
    slug: 'weekly-meal-prep-busy-parents',
    title: 'Weekly Meal Prep for Busy Parents: The 2-Hour Method',
    excerpt: 'Spend just 2 hours on Sunday to have healthy dinners ready all week. Step-by-step guide with recipes.',
    category: 'Guides',
    date: '2025-01-02',
    readTime: '9 min',
    image: '⏰',
    featured: false,
  },
]

const categories = ['All', 'Guides', 'Comparisons', 'Tips', 'Recipes']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </Link>
            <Link
              href="/login"
              className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Meal Planning Tips & Guides
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Expert advice for families who want to eat better, waste less, and save time
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                  <span className="text-7xl">{post.image}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-brand-600 font-medium">
                    Read more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* All Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-brand-200 transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <span className="text-5xl">{post.image}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  <span>{post.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found. Try a different search or category.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to simplify meal planning?
          </h2>
          <p className="text-white/90 mb-8">
            Join thousands of families who save time, money, and stress with BestMealMate.
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
