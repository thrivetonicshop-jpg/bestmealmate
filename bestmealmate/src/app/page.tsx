'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ChefHat, 
  Users, 
  ShoppingCart, 
  Calendar, 
  Sparkles, 
  Check,
  ArrowRight,
  Refrigerator,
  Clock,
  Leaf
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-brand-600" />
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
              <Link 
                href="/onboarding" 
                className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Meal planning for
            <span className="text-brand-600"> real families</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Different tastes. Allergies. Picky eaters. Expiring food. The endless "what's for dinner?" question. 
            <span className="font-semibold text-gray-900"> We solve all of it.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/onboarding" 
              className="bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Planning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required • Free forever for 1 person</p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Sound familiar?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            You're not a bad cook. You're just juggling too much.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Different diets", desc: "Dad wants keto, kids hate vegetables, grandma needs low-sodium" },
              { icon: Refrigerator, title: "Food goes bad", desc: "Bought chicken Tuesday. It's Thursday. Is it still good?" },
              { icon: Clock, title: "No time to plan", desc: "By 5pm your brain is fried. Deciding dinner feels impossible." },
              { icon: ShoppingCart, title: "Grocery chaos", desc: "You bought onions. You already had onions. Now you have 12 onions." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              BestMealMate handles everything
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us about your family. We'll do the rest.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Family Profiles",
                desc: "Each person gets their own profile with allergies, restrictions, and preferences. AI plans meals that work for everyone.",
                color: "brand"
              },
              {
                icon: Refrigerator,
                title: "Smart Pantry",
                desc: "Scan your fridge. We'll prioritize expiring ingredients and never add staples you already have to your list.",
                color: "blue"
              },
              {
                icon: Sparkles,
                title: "AI Chef",
                desc: "Open the app at 5pm. Get tonight's dinner suggestion instantly. No decisions required.",
                color: "purple"
              },
              {
                icon: ShoppingCart,
                title: "Smart Grocery List",
                desc: "Auto-generated, consolidated, organized by aisle. Syncs with Instacart for one-tap ordering.",
                color: "orange"
              },
              {
                icon: Calendar,
                title: "Schedule-Aware",
                desc: "Busy Tuesday? We'll suggest a 20-minute meal. Sunday? Time for batch cooking.",
                color: "pink"
              },
              {
                icon: Leaf,
                title: "Zero Waste",
                desc: "Track what you throw away. See your waste go down. Save money every month.",
                color: "green"
              },
            ].map((item, i) => (
              <div key={i} className="relative p-6 rounded-2xl border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing</h2>
            <p className="text-gray-600">Start free. Upgrade when your family needs more.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                {["1 family member", "Basic meal plans", "Manual grocery list", "5 recipes per week"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="block w-full py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Get Started
              </Link>
            </div>
            
            {/* Premium */}
            <div className="bg-white p-8 rounded-2xl border-2 border-brand-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">For couples and small families</p>
              <ul className="space-y-3 mb-8">
                {["Up to 4 family members", "AI chef suggestions", "Smart grocery list", "Pantry tracking", "Unlimited recipes"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=premium" className="block w-full py-3 text-center bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                Start Free Trial
              </Link>
            </div>
            
            {/* Family */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Family</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">For large households</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited family members", "Calendar sync", "Hands-free cooking mode", "Batch cook planning", "Priority support"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=family" className="block w-full py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to end the dinner struggle?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Set up your family in 2 minutes. Get your first meal plan instantly.
          </p>
          <Link 
            href="/onboarding" 
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-brand-600" />
              <span className="font-semibold text-gray-900">BestMealMate</span>
            </div>
            <p className="text-gray-500 text-sm">
              One app. Everyone eats. Nothing wasted.
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 BestMealMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
