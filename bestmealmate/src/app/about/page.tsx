'use client'

import Link from 'next/link'
import { ChefHat, ArrowLeft, Heart, Users, Leaf, Target, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Making family meals <span className="text-gradient">simple again</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We started BestMealMate because we believe no family should stress about what&apos;s for dinner.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
            <p className="text-gray-600 mb-6">
              Every family knows the struggle: It&apos;s 5 PM, everyone&apos;s hungry, and you&apos;re staring at a fridge full of ingredients with no idea what to make. Dad&apos;s on keto, the kids won&apos;t eat vegetables, and that chicken you bought on Tuesday is about to expire.
            </p>
            <p className="text-gray-600 mb-6">
              We built BestMealMate to solve this exact problem. Our AI understands your family&apos;s unique dietary needs, tracks what&apos;s in your pantry, and suggests meals that everyone can enjoy together.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-12">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We&apos;re on a mission to help families eat better, waste less, and spend more quality time together. No more decision fatigue. No more food going bad. No more separate meals for different family members.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Family First</h3>
              <p className="text-gray-600 text-sm">Every feature is designed with real families in mind. Different diets, picky eaters, busy schedules - we get it.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Zero Waste</h3>
              <p className="text-gray-600 text-sm">We help you use what you have before it goes bad. Good for your wallet, great for the planet.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Simplicity</h3>
              <p className="text-gray-600 text-sm">AI that works for you, not the other way around. Complex technology, simple experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gradient">50K+</p>
              <p className="text-gray-600 text-sm">Families</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient">2M+</p>
              <p className="text-gray-600 text-sm">Meals Planned</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient">40%</p>
              <p className="text-gray-600 text-sm">Less Food Waste</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient">4.9</p>
              <p className="text-gray-600 text-sm">App Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to simplify meal time?</h2>
          <p className="text-white/90 mb-8">Join 50,000+ families who&apos;ve reclaimed their dinner time.</p>
          <Link href="/onboarding" className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">BestMealMate</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 BestMealMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
