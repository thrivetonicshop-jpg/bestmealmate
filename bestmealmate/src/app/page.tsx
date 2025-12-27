'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
  Leaf,
  Heart,
  Star,
  Zap,
  Shield,
  TrendingDown,
  Menu,
  X,
  Play,
  Quote
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Users,
      title: "Family Profiles",
      desc: "Each person gets their own profile with allergies, restrictions, and preferences. AI plans meals that work for everyone.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Refrigerator,
      title: "Smart Pantry",
      desc: "Track your fridge inventory. We'll prioritize expiring ingredients and never add staples you already have.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "AI Chef",
      desc: "Open the app at 5pm. Get tonight's dinner suggestion instantly. No decisions required.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: ShoppingCart,
      title: "Smart Grocery List",
      desc: "Auto-generated, consolidated, organized by aisle. One-tap ordering with your favorite grocery service.",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: Calendar,
      title: "Schedule-Aware",
      desc: "Busy Tuesday? We'll suggest a 20-minute meal. Sunday? Time for batch cooking.",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: Leaf,
      title: "Zero Waste",
      desc: "Track what you throw away. Watch your waste go down. Save money every month.",
      gradient: "from-green-500 to-emerald-500"
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mom of 3",
      content: "Finally, an app that understands my son's nut allergy AND my husband's keto diet. Dinner time went from stressful to enjoyable!",
      avatar: "S"
    },
    {
      name: "Michael R.",
      role: "Busy Professional",
      content: "I used to throw away $100+ of groceries every month. Now I rarely waste anything. This app literally pays for itself.",
      avatar: "M"
    },
    {
      name: "Emma L.",
      role: "Health Coach",
      content: "I recommend BestMealMate to all my clients. The nutritional tracking and family features are unmatched.",
      avatar: "E"
    }
  ]

  const stats = [
    { value: "50K+", label: "Happy Families" },
    { value: "2M+", label: "Meals Planned" },
    { value: "40%", label: "Less Food Waste" },
    { value: "4.9", label: "App Store Rating" }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="btn-ghost">
                Sign In
              </Link>
              <Link href="/onboarding" className="btn-primary flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-dark border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">How it Works</a>
              <a href="#pricing" className="block py-2 text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link href="/login" className="block w-full btn-secondary text-center">Sign In</Link>
                <Link href="/onboarding" className="block w-full btn-primary text-center">Get Started Free</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                AI-Powered Meal Planning
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 animate-slide-up">
                Meal planning for
                <span className="text-gradient block">real families</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up animate-delay-100">
                Different tastes. Allergies. Picky eaters. Expiring food. The endless "what's for dinner?" question.
                <span className="font-semibold text-gray-900"> We solve all of it.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animate-delay-200">
                <Link href="/onboarding" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 shadow-glow">
                  Start Planning Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <p className="mt-6 text-sm text-gray-500 flex items-center gap-4 justify-center lg:justify-start animate-fade-in animate-delay-300">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-brand-600" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-brand-600" />
                  Free forever for 1 person
                </span>
              </p>
            </div>

            {/* Right content - Hero Image/Illustration */}
            <div className="relative hidden lg:block animate-float">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Tonight's Dinner</p>
                      <p className="text-sm text-gray-500">Ready in 35 min</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-4 mb-4">
                    <p className="font-semibold text-gray-900 text-lg">Honey Garlic Salmon</p>
                    <p className="text-sm text-gray-600">with roasted vegetables</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-brand-600">4 servings</span>
                      <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-brand-600">500 cal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {['👨', '👩', '👧', '👦'].map((emoji, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-brand-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      All ingredients ready
                    </span>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-lg p-4 animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Saved recipes</p>
                      <p className="text-gray-500">24 favorites</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Grocery list</p>
                      <p className="text-gray-500">12 items ready</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/4 left-0 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-2xl shadow-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI suggestions ready!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 lg:py-28 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Sound familiar?</h2>
            <p className="section-subtitle">
              You're not a bad cook. You're just juggling too much.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Different diets", desc: "Dad wants keto, kids hate vegetables, grandma needs low-sodium", color: "rose" },
              { icon: Refrigerator, title: "Food goes bad", desc: "Bought chicken Tuesday. It's Thursday. Is it still good?", color: "amber" },
              { icon: Clock, title: "No time to plan", desc: "By 5pm your brain is fried. Deciding dinner feels impossible.", color: "blue" },
              { icon: ShoppingCart, title: "Grocery chaos", desc: "You bought onions. You already had onions. Now you have 12 onions.", color: "purple" },
            ].map((item, i) => (
              <div
                key={i}
                className="card-interactive p-6 hover:scale-[1.02]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-100 flex items-center justify-center mb-4`}>
                  <item.icon className={`w-7 h-7 text-${item.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="section-title">BestMealMate handles everything</h2>
            <p className="section-subtitle">
              Tell us about your family. We'll do the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Get started in under 2 minutes. It's really that simple.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Tell us about your family",
                desc: "Add each family member with their dietary needs, allergies, and food preferences.",
                icon: Users
              },
              {
                step: "02",
                title: "Get personalized meal plans",
                desc: "Our AI creates weekly meal plans that work for everyone in your household.",
                icon: Calendar
              },
              {
                step: "03",
                title: "Cook, shop, repeat",
                desc: "Follow easy recipes, use smart grocery lists, and enjoy stress-free dinners.",
                icon: ChefHat
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center">
                      <item.icon className="w-10 h-10 text-brand-600" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-brand-200 to-transparent" style={{ width: 'calc(100% - 5rem)', left: 'calc(50% + 2.5rem)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Loved by families
            </div>
            <h2 className="section-title">What our users say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card p-8 relative">
                <Quote className="w-10 h-10 text-brand-200 absolute top-6 right-6" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{testimonial.content}</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Simple Pricing
            </div>
            <h2 className="section-title">Choose your plan</h2>
            <p className="section-subtitle">
              Start free. Upgrade when your family needs more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="card p-8 hover:scale-[1.02] transition-transform">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["1 family member", "Basic meal plans", "Manual grocery list", "5 recipes per week", "Community support"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="block w-full btn-secondary text-center">
                Get Started
              </Link>
            </div>

            {/* Premium */}
            <div className="relative card p-8 border-2 border-brand-500 scale-[1.02] shadow-glow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-full shadow-lg">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">For couples and small families</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["Up to 4 family members", "AI chef suggestions", "Smart grocery list", "Pantry tracking", "Unlimited recipes", "Priority support"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=premium" className="block w-full btn-primary text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Family */}
            <div className="card p-8 hover:scale-[1.02] transition-transform">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Family</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-gray-900">$14.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">For large households</p>
              </div>
              <ul className="space-y-4 mb-8">
                {["Unlimited family members", "Calendar sync", "Hands-free cooking mode", "Batch cook planning", "Nutritional tracking", "24/7 priority support"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding?plan=family" className="block w-full btn-secondary text-center">
                Start Free Trial
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700" />
        <div className="blob blob-1 opacity-20" style={{ background: 'white' }} />
        <div className="blob blob-2 opacity-20" style={{ background: 'white' }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to end the dinner struggle?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Set up your family in 2 minutes. Get your first meal plan instantly.
            Join 50,000+ families who've reclaimed their dinner time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-6 text-white/70 text-sm">
            No credit card required • Free forever for 1 person
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">BestMealMate</span>
              </div>
              <p className="text-gray-400">
                One app. Everyone eats. Nothing wasted.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Recipes', 'Mobile App'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 BestMealMate. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
