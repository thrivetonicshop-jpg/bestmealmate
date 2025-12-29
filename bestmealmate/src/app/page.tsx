'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import EmailCapture from '@/components/EmailCapture'
import NewsletterSignup from '@/components/NewsletterSignup'
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
  Quote,
  Award,
  BadgeCheck,
  Trophy,
  ThumbsUp,
  XCircle,
  Watch,
  Camera,
  Smartphone,
  DollarSign,
  ChevronDown,
  HelpCircle
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDemoVideo, setShowDemoVideo] = useState(false)
  const [showSocialProof, setShowSocialProof] = useState(false)
  const [currentProof, setCurrentProof] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showMealPlanModal, setShowMealPlanModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMeal, setGeneratedMeal] = useState<{name: string, time: string, description: string, ingredients: string[]} | null>(null)

  const mealSuggestions = [
    { name: "Honey Garlic Chicken", time: "30 min", description: "Tender chicken thighs glazed with a sweet and savory honey garlic sauce, served with steamed broccoli.", ingredients: ["Chicken thighs", "Honey", "Garlic", "Soy sauce", "Broccoli"] },
    { name: "Sheet Pan Salmon", time: "25 min", description: "Perfectly roasted salmon with lemon herb butter, surrounded by colorful roasted vegetables.", ingredients: ["Salmon fillets", "Lemon", "Butter", "Asparagus", "Cherry tomatoes"] },
    { name: "One-Pot Pasta Primavera", time: "20 min", description: "Creamy pasta loaded with fresh seasonal vegetables in a light garlic parmesan sauce.", ingredients: ["Penne pasta", "Zucchini", "Bell peppers", "Parmesan", "Heavy cream"] },
    { name: "Turkey Taco Bowls", time: "25 min", description: "Flavorful seasoned ground turkey over rice with all your favorite taco toppings.", ingredients: ["Ground turkey", "Taco seasoning", "Rice", "Black beans", "Avocado"] },
    { name: "Teriyaki Stir Fry", time: "20 min", description: "Quick and healthy stir fry with crisp vegetables and your choice of protein in homemade teriyaki sauce.", ingredients: ["Chicken or tofu", "Broccoli", "Snap peas", "Carrots", "Teriyaki sauce"] }
  ]

  const generateMealPlan = async () => {
    setShowMealPlanModal(true)
    setIsGenerating(true)
    setGeneratedMeal(null)

    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Pick a random meal
    const randomMeal = mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)]
    setGeneratedMeal(randomMeal)
    setIsGenerating(false)
  }

  const socialProofNotifications = [
    { name: "Sarah from Texas", action: "just signed up", time: "2 minutes ago", emoji: "👩" },
    { name: "Mike from California", action: "saved $127 this month", time: "5 minutes ago", emoji: "👨" },
    { name: "The Johnson Family", action: "planned 7 meals", time: "8 minutes ago", emoji: "👨‍👩‍👧‍👦" },
    { name: "Emma from New York", action: "reduced food waste by 45%", time: "12 minutes ago", emoji: "👩‍🍳" },
    { name: "David from Florida", action: "just upgraded to Premium", time: "15 minutes ago", emoji: "🎉" },
  ]

  useEffect(() => {
    // Show social proof notification after 5 seconds
    const showTimer = setTimeout(() => setShowSocialProof(true), 5000)

    // Cycle through notifications
    const cycleTimer = setInterval(() => {
      setShowSocialProof(false)
      setTimeout(() => {
        setCurrentProof(prev => (prev + 1) % socialProofNotifications.length)
        setShowSocialProof(true)
      }, 500)
    }, 8000)

    return () => {
      clearTimeout(showTimer)
      clearInterval(cycleTimer)
    }
  }, [socialProofNotifications.length])

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
      title: "Unlimited Family Profiles",
      desc: "Dad's keto, kid's nut allergy, grandma's low-sodium — all handled. Unlike apps that only support one diet at a time.",
      gradient: "from-emerald-500 to-teal-500",
      badge: "Unlike Mealime"
    },
    {
      icon: Refrigerator,
      title: "Smart Pantry + Expiry Alerts",
      desc: "Know what's expiring and get recipe suggestions to use it first. Grocery list auto-excludes what you already have.",
      gradient: "from-blue-500 to-cyan-500",
      badge: "Unlike Eat This Much"
    },
    {
      icon: Sparkles,
      title: "True AI Chef",
      desc: "Not just recipe search — real AI that understands your whole family's needs and suggests meals everyone can eat together.",
      gradient: "from-purple-500 to-pink-500",
      badge: "Unlike Paprika"
    },
    {
      icon: ShoppingCart,
      title: "Smart Grocery Merging",
      desc: "2 onions from recipe A + 1 from recipe B = 3 onions. Organized by aisle. List stays intact when you edit your plan.",
      gradient: "from-orange-500 to-amber-500",
      badge: "Unlike Mealime"
    },
    {
      icon: Calendar,
      title: "Any Serving Size",
      desc: "1, 3, 5, 7 — any number works. Not locked to 2/4/6 like other apps. Perfect for odd-sized families.",
      gradient: "from-rose-500 to-pink-500",
      badge: "Unlike Mealime"
    },
    {
      icon: Leaf,
      title: "Waste Tracking Built-In",
      desc: "See exactly how much food (and money) you're saving. Most apps make you download a separate waste tracker.",
      gradient: "from-green-500 to-emerald-500",
      badge: "Unlike BigOven"
    },
  ]

  const competitorComparison = [
    { feature: "Multiple family dietary profiles", us: true, mealime: false, yummly: false, paprika: false },
    { feature: "AI understands whole family context", us: true, mealime: false, yummly: false, paprika: false },
    { feature: "Smart pantry with expiry tracking", us: true, mealime: false, yummly: false, paprika: true },
    { feature: "Grocery list merges ingredients", us: true, mealime: false, yummly: true, paprika: true },
    { feature: "Any serving size (not just 2/4/6)", us: true, mealime: false, yummly: true, paprika: true },
    { feature: "Wearable health sync", us: true, mealime: false, yummly: false, paprika: false },
    { feature: "AI food scanner (camera)", us: true, mealime: false, yummly: false, paprika: false },
    { feature: "No ads in free tier", us: true, mealime: true, yummly: false, paprika: true },
    { feature: "Easy cancellation", us: true, mealime: true, yummly: false, paprika: true },
  ]

  const uniqueFeatures = [
    {
      icon: Users,
      title: "Whole-Family AI",
      desc: "The only app where AI plans meals considering everyone's diet simultaneously — not just filtering recipes.",
      color: "brand"
    },
    {
      icon: Watch,
      title: "Health Wearable Sync",
      desc: "Connect Apple Health, Fitbit, or Garmin. Calorie goals sync automatically with your meal plans.",
      color: "purple"
    },
    {
      icon: Camera,
      title: "AI Food Scanner",
      desc: "Point your camera at groceries or your fridge. AI identifies items and adds them to your pantry instantly.",
      color: "blue"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      desc: "Built for phones first, not desktop. Plan meals on the go without clunky interfaces.",
      color: "green"
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mom of 3",
      content: "Finally, an app that understands my son's nut allergy AND my husband's keto diet. Dinner time went from stressful to enjoyable!",
      avatar: "S",
      rating: 5,
      verified: true,
      date: "2 weeks ago",
      helpful: 47
    },
    {
      name: "Michael R.",
      role: "Busy Professional",
      content: "I used to throw away $100+ of groceries every month. Now I rarely waste anything. This app literally pays for itself.",
      avatar: "M",
      rating: 5,
      verified: true,
      date: "1 week ago",
      helpful: 83
    },
    {
      name: "Emma L.",
      role: "Health Coach",
      content: "I recommend BestMealMate to all my clients. The nutritional tracking and family features are unmatched.",
      avatar: "E",
      rating: 5,
      verified: true,
      date: "3 days ago",
      helpful: 62
    }
  ]

  const awards = [
    { title: "Best Meal Planning App", org: "App Store", year: "2024", icon: Trophy },
    { title: "Editor's Choice", org: "Google Play", year: "2024", icon: Award },
    { title: "Top Rated", org: "Product Hunt", year: "#1 Product", icon: Trophy },
    { title: "Family Favorite", org: "Parents Magazine", year: "2024", icon: Award },
  ]

  const pressLogos = [
    { name: "TechCrunch", logo: "TC" },
    { name: "Forbes", logo: "Forbes" },
    { name: "Wired", logo: "WIRED" },
    { name: "The Verge", logo: "▲" },
    { name: "Mashable", logo: "M" },
  ]

  const stats = [
    { value: "50K+", label: "Happy Families" },
    { value: "2M+", label: "Meals Planned" },
    { value: "40%", label: "Less Food Waste" },
    { value: "4.9", label: "App Store Rating" }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Email Capture Popup */}
      <EmailCapture />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center"
                alt="BestMealMate"
                width={40}
                height={40}
                className="rounded-xl object-cover shadow-md"
              />
              <span className="text-xl font-bold text-gray-900">BestMealMate</span>
            </Link>

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
                Different tastes. Allergies. Picky eaters. Expiring food. The endless &quot;what&apos;s for dinner?&quot; question.
                <span className="font-semibold text-gray-900"> We solve all of it.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animate-delay-200">
                <Link href="/onboarding" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 shadow-glow">
                  Start Planning Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={generateMealPlan}
                  className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate My Meal Plan
                </button>
              </div>

              <button
                onClick={() => setShowDemoVideo(true)}
                className="mt-4 text-brand-600 font-medium flex items-center gap-2 justify-center lg:justify-start hover:text-brand-700 transition-colors animate-fade-in animate-delay-300"
              >
                <Play className="w-4 h-4" />
                Watch 60-second demo
              </button>

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
                      <p className="font-semibold text-gray-900">Tonight&apos;s Dinner</p>
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

      {/* Trust Badges & Awards Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Awards */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              Award Winning
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trusted by families worldwide</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {awards.map((award, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                {/* Gold badge ribbon */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <award.icon className="w-6 h-6 text-white" />
                </div>
                <div className="pr-8">
                  <p className="font-bold text-gray-900 text-sm mb-1">{award.title}</p>
                  <p className="text-xs text-gray-500">{award.org}</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    {award.year}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Press Logos */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">As featured in</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {pressLogos.map((press, i) => (
                <div
                  key={i}
                  className="text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-default"
                  title={press.name}
                >
                  {press.logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 lg:py-28 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Sound familiar?</h2>
            <p className="section-subtitle">
              You&apos;re not a bad cook. You&apos;re just juggling too much.
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
              Tell us about your family. We&apos;ll do the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {item.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                    {item.badge}
                  </span>
                )}
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

      {/* Why Switch Section - Competitor Comparison */}
      <section className="py-20 lg:py-28 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 text-brand-400 text-sm font-medium mb-4">
              <TrendingDown className="w-4 h-4" />
              Why Families Switch
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Tired of apps that don&apos;t <span className="text-gradient">get it?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Other apps handle one person. BestMealMate handles your whole family.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                    <th className="p-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500 text-white rounded-full text-sm font-bold">
                        <ChefHat className="w-4 h-4" />
                        Us
                      </div>
                    </th>
                    <th className="p-4 text-center text-gray-500 text-sm">Mealime</th>
                    <th className="p-4 text-center text-gray-500 text-sm">Yummly</th>
                    <th className="p-4 text-center text-gray-500 text-sm">Paprika</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((row, i) => (
                    <tr key={i} className={i < competitorComparison.length - 1 ? 'border-b border-gray-700/50' : ''}>
                      <td className="p-4 text-white text-sm">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.us ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.mealime ? (
                          <Check className="w-5 h-5 text-gray-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.yummly ? (
                          <Check className="w-5 h-5 text-gray-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.paprika ? (
                          <Check className="w-5 h-5 text-gray-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Honest Pros & Cons */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="bg-green-900/20 rounded-2xl p-6 border border-green-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-400">Pros</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Handles multiple dietary restrictions simultaneously</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>AI-powered food scanner saves hours of manual entry</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Smart grocery lists merge ingredients automatically</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Syncs with health wearables for calorie goals</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>No ads, even in the free tier</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Cancel anytime with no hidden fees</span>
                </li>
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-orange-900/20 rounded-2xl p-6 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-400">Cons</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-300">
                  <XCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                  <span>Newer app with smaller recipe database than established competitors</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <XCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                  <span>Premium features require subscription ($9.99-$14.99/mo)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <XCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                  <span>AI suggestions depend on internet connection</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <XCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                  <span>Limited international recipe options currently</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <XCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                  <span>No desktop app (web and mobile only)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  <XCircle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                  <span>Grocery store integration coming soon (not yet available)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Switch CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">Ready to try something that actually works for your whole family?</p>
            <Link href="/onboarding" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Switch to BestMealMate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Unique Features - What Only We Have */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-brand-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Exclusive Features
            </div>
            <h2 className="section-title">What only BestMealMate has</h2>
            <p className="section-subtitle">
              Features you won&apos;t find in any other meal planning app
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueFeatures.map((feature, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-brand-400 transition-colors group">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  NEW
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Database Section */}
      <section id="recipes" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
              <ChefHat className="w-4 h-4" />
              100,000+ Recipes
            </div>
            <h2 className="section-title">The largest family-friendly recipe database</h2>
            <p className="section-subtitle">
              Every recipe works for multiple diets. Filter once, feed everyone.
            </p>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: "100K+", label: "Recipes", sub: "Growing daily" },
              { value: "15+", label: "Diet Types", sub: "Keto to vegan" },
              { value: "200+", label: "Allergens Tracked", sub: "Beyond the big 8" },
              { value: "30 min", label: "Avg Cook Time", sub: "Quick by default" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                <p className="font-semibold text-gray-900 text-sm">{stat.label}</p>
                <p className="text-gray-500 text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Diet Filter Pills */}
          <div className="mb-12">
            <p className="text-center text-gray-600 mb-6 font-medium">Filter by any combination of diets:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Keto", color: "bg-purple-100 text-purple-700 border-purple-200" },
                { name: "Vegetarian", color: "bg-green-100 text-green-700 border-green-200" },
                { name: "Vegan", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                { name: "Gluten-Free", color: "bg-amber-100 text-amber-700 border-amber-200" },
                { name: "Dairy-Free", color: "bg-blue-100 text-blue-700 border-blue-200" },
                { name: "Nut-Free", color: "bg-red-100 text-red-700 border-red-200" },
                { name: "Low-Sodium", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
                { name: "Paleo", color: "bg-orange-100 text-orange-700 border-orange-200" },
                { name: "Whole30", color: "bg-rose-100 text-rose-700 border-rose-200" },
                { name: "Low-FODMAP", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
                { name: "Pescatarian", color: "bg-teal-100 text-teal-700 border-teal-200" },
                { name: "Diabetic-Friendly", color: "bg-pink-100 text-pink-700 border-pink-200" },
              ].map((diet, i) => (
                <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium border ${diet.color} cursor-default hover:scale-105 transition-transform`}>
                  {diet.name}
                </span>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm mt-4">
              Other apps: pick ONE diet. BestMealMate: combine ANY.
            </p>
          </div>

          {/* Sample Recipe Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: "Honey Garlic Salmon",
                time: "25 min",
                calories: "420 cal",
                diets: ["Keto", "Gluten-Free", "Dairy-Free"],
                rating: 4.9,
                reviews: 2847,
                image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
                color: "from-orange-400 to-red-400"
              },
              {
                name: "Thai Basil Chicken",
                time: "20 min",
                calories: "380 cal",
                diets: ["Low-Carb", "Dairy-Free", "Nut-Free"],
                rating: 4.8,
                reviews: 1923,
                image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop",
                color: "from-green-400 to-emerald-500"
              },
              {
                name: "Mediterranean Bowl",
                time: "15 min",
                calories: "520 cal",
                diets: ["Vegetarian", "Nut-Free"],
                rating: 4.9,
                reviews: 3102,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
                color: "from-blue-400 to-cyan-500"
              },
              {
                name: "One-Pan Fajitas",
                time: "30 min",
                calories: "450 cal",
                diets: ["Keto", "Gluten-Free", "Whole30"],
                rating: 4.7,
                reviews: 2156,
                image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
                color: "from-yellow-400 to-orange-500"
              },
            ].map((recipe, i) => (
              <div key={i} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="h-40 relative overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${recipe.color} opacity-20`} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">{recipe.rating}</span>
                    <span className="text-xs text-gray-400">({recipe.reviews.toLocaleString()})</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{recipe.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.time}
                    </span>
                    <span>{recipe.calories}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.diets.map((diet, j) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recipe Categories */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { name: "Quick Weeknight", icon: "⚡", count: "12,400+" },
              { name: "Batch Cooking", icon: "🍲", count: "8,200+" },
              { name: "Kid Approved", icon: "👶", count: "15,600+" },
              { name: "Budget Friendly", icon: "💰", count: "18,900+" },
              { name: "One-Pot Meals", icon: "🥘", count: "9,800+" },
              { name: "Air Fryer", icon: "🌡️", count: "6,300+" },
            ].map((cat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 transition-colors cursor-pointer group">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-brand-600">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.count} recipes</p>
              </div>
            ))}
          </div>

          {/* AI Recipe Features */}
          <div className="bg-gradient-to-r from-brand-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">AI-Powered Recipe Magic</h3>
                <p className="text-white/80 mb-6">
                  Our AI doesn&apos;t just search recipes — it understands your family and creates meals that work.
                </p>
                <ul className="space-y-3">
                  {[
                    "\"Make it spicier\" — AI adjusts recipes on demand",
                    "\"Use the chicken expiring tomorrow\" — prioritizes your pantry",
                    "\"Something the kids will actually eat\" — learns preferences",
                    "\"Swap salmon for chicken\" — instant ingredient substitutions",
                    "\"Cheaper version\" — budget-aware alternatives",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">AI Chef</p>
                    <p className="text-xs text-white/60">Thinking...</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-white/80">Based on your family&apos;s profiles:</p>
                    <p className="text-xs text-white/60 mt-1">Dad (Keto) • Mom (No dairy) • Kids (Picky)</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-white/80">Tonight&apos;s suggestion:</p>
                    <p className="font-semibold mt-1">Sheet Pan Chicken Fajitas</p>
                    <p className="text-xs text-white/60">Works for everyone • Uses expiring peppers • 25 min</p>
                  </div>
                  <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl p-3">
                    <p className="text-amber-200 text-xs font-medium">✨ 3 ingredients expiring soon used in this recipe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/onboarding" className="inline-flex items-center gap-2 btn-primary text-lg px-8 py-4">
              Explore All Recipes
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">Free to browse. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">
              Get started in under 2 minutes. It&apos;s really that simple.
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

      {/* Food Gallery / Inspiration Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-4">
              <Camera className="w-4 h-4" />
              Food Inspiration
            </div>
            <h2 className="section-title">Beautiful meals made by our community</h2>
            <p className="section-subtitle">Real families cooking real food - every single day</p>
          </div>

          {/* Masonry-style Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Row 1 */}
            <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=800&fit=crop"
                alt="Family dinner"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-lg">Family Roast Dinner</p>
                <p className="text-sm opacity-80">Made by Sarah T.</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
                alt="Healthy salad"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop"
                alt="Fresh pasta"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&h=400&fit=crop"
                alt="Grilled steak"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop"
                alt="Vegetable bowl"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Row 2 */}
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=400&fit=crop"
                alt="Breakfast spread"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop"
                alt="Gourmet plate"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="col-span-2 relative group overflow-hidden rounded-2xl aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=400&fit=crop"
                alt="Table spread"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-lg">Weekend Brunch</p>
                <p className="text-sm opacity-80">Made by The Johnson Family</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              Start Creating Beautiful Meals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              4.9 out of 5 stars
            </div>
            <h2 className="section-title">Loved by 50,000+ families</h2>
            <p className="section-subtitle">
              Real reviews from real users
            </p>
          </div>

          {/* Overall Rating Summary */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-12 border border-amber-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <span className="text-5xl font-bold text-gray-900">4.9</span>
                  <div className="flex flex-col">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Based on 12,847 reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">App Store<br/>Editor&apos;s Choice</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <BadgeCheck className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">Verified<br/>Reviews</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">Top Rated<br/>2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card p-6 relative hover:shadow-xl transition-shadow border-2 border-transparent hover:border-amber-200">
                {/* Verified Badge */}
                {testimonial.verified && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    <BadgeCheck className="w-3 h-3" />
                    Verified Purchase
                  </div>
                )}

                <Quote className="w-8 h-8 text-amber-200 absolute top-4 right-4" />

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4 mt-2">
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{testimonial.date}</span>
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        {testimonial.name}
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                      </p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>

                {/* Helpful */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({testimonial.helpful})
                  </button>
                  <span className="text-gray-400">Report</span>
                </div>
              </div>
            ))}
          </div>

          {/* View More Reviews */}
          <div className="text-center mt-10">
            <Link href="/about#testimonials" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-brand-400 hover:text-brand-600 transition-all">
              View all 12,847 reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
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
            Join 50,000+ families who&apos;ve reclaimed their dinner time.
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

      {/* FAQ Section - Matches FAQ Schema for SEO */}
      <section id="faq" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h2 className="section-title">Got questions? We&apos;ve got answers</h2>
            <p className="section-subtitle">
              Everything you need to know about BestMealMate
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the best meal planning app for families in 2025?",
                a: "BestMealMate is the best meal planning app for families in 2025. Unlike Mealime or Yummly which only handle one diet at a time, BestMealMate supports unlimited family profiles with different dietary needs — from keto to vegan to nut allergies — all in one weekly meal plan. It also includes AI-powered recipe suggestions, smart pantry tracking, and automatic grocery lists."
              },
              {
                q: "How do I meal plan for a family with different diets?",
                a: "With BestMealMate, you create a profile for each family member with their specific dietary needs (keto, vegetarian, allergies, etc.). The AI then suggests recipes that work for everyone or provides easy modifications. The app generates one unified grocery list and meal plan that accommodates all dietary restrictions."
              },
              {
                q: "What is the best free meal planner app?",
                a: "BestMealMate offers a generous free tier that includes family profiles, AI recipe suggestions, weekly meal planning, and smart grocery lists. Unlike many competitors, the free version has no ads and includes core features that others charge for."
              },
              {
                q: "Is there a meal planning app that creates grocery lists automatically?",
                a: "Yes! BestMealMate automatically generates grocery lists from your meal plan. It intelligently merges ingredients (2 onions from Recipe A + 1 from Recipe B = 3 onions), organizes items by store aisle, and excludes items already in your pantry."
              },
              {
                q: "What is better than Mealime for family meal planning?",
                a: "BestMealMate is better than Mealime for families because it supports multiple dietary profiles per household (Mealime only supports one), offers any serving size (not just 2/4/6), includes smart pantry tracking with expiration alerts, and provides AI-powered recipe suggestions that understand your whole family's needs."
              },
              {
                q: "How can I reduce food waste with meal planning?",
                a: "BestMealMate helps reduce food waste with its Smart Pantry feature. It tracks expiration dates and prioritizes ingredients that are about to expire in recipe suggestions. The AI Chef can create recipes using specific items you need to use up, and you can see exactly how much food and money you're saving."
              },
              {
                q: "Is there a meal planning app for keto and regular diets together?",
                a: "BestMealMate is designed exactly for this. You can have one family member on keto while others eat regular, vegetarian, or any other diet. The app suggests recipes that work for multiple diets or provides easy swaps, so the whole family can eat together without making separate meals."
              },
              {
                q: "What meal planning app works with fitness trackers?",
                a: "BestMealMate syncs with Apple Health, Fitbit, and Garmin to incorporate your activity data and calorie goals into meal planning. This feature is exclusive to BestMealMate — competitors like Mealime, Yummly, and Paprika don't offer wearable integration."
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700">
              Contact our team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&crop=center"
                  alt="BestMealMate"
                  width={40}
                  height={40}
                  className="rounded-xl object-cover shadow-md"
                />
                <span className="text-xl font-bold text-white">BestMealMate</span>
              </div>
              <p className="text-gray-400">
                One app. Everyone eats. Nothing wasted.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
                </li>
                <li>
                  <Link href="/dashboard/recipes" className="text-gray-400 hover:text-white transition-colors">Recipes</Link>
                </li>
                <li>
                  <Link href="/onboarding" className="text-gray-400 hover:text-white transition-colors">Get the App</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Careers</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/status" className="text-gray-400 hover:text-white transition-colors">System Status</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="py-8 border-t border-gray-800 mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-white mb-1">Follow us for recipes & tips</h4>
                <p className="text-gray-400 text-sm">Join our community of 50,000+ families · <Link href="/privacy" className="hover:text-white underline">Privacy Policy</Link></p>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://x.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span className="text-gray-400 group-hover:text-white text-sm font-medium">X</span>
                </a>
                <a href="https://instagram.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span className="text-gray-400 group-hover:text-white text-sm font-medium">Instagram</span>
                </a>
                <a href="https://youtube.com/@bestmealmate" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span className="text-gray-400 group-hover:text-white text-sm font-medium">YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="py-8 border-t border-gray-800">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="font-semibold text-white text-lg mb-2">Get Weekly Meal Ideas</h4>
                <p className="text-gray-400">Join 10,000+ families getting recipes, meal planning tips, and exclusive offers.</p>
              </div>
              <NewsletterSignup variant="inline" className="justify-end" />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 BestMealMate. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* X (Twitter) */}
              <a href="https://x.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/bestmealmate" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@bestmealmate" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Subscribe on YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemoVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowDemoVideo(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDemoVideo(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Video embed */}
            <div className="aspect-video bg-black flex flex-col items-center justify-center text-white">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="BestMealMate Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Generate Meal Plan Modal */}
      {showMealPlanModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowMealPlanModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">AI Meal Generator</h3>
                    <p className="text-sm text-white/80">Personalized just for you</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMealPlanModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isGenerating ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-gray-600 font-medium">Generating your perfect meal...</p>
                  <p className="text-sm text-gray-400 mt-2">Analyzing preferences & ingredients</p>
                </div>
              ) : generatedMeal ? (
                <>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 mb-5 border border-purple-100">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        🍽️
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-gray-900">{generatedMeal.name}</h4>
                        <p className="text-sm text-purple-600 font-medium flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          {generatedMeal.time}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{generatedMeal.description}</p>
                  </div>

                  <div className="mb-5">
                    <h5 className="font-semibold text-gray-900 mb-3">Ingredients Needed:</h5>
                    <div className="flex flex-wrap gap-2">
                      {generatedMeal.ingredients.map((ingredient, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href="/onboarding"
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all"
                    >
                      Start Planning Free
                    </Link>
                    <button
                      onClick={generateMealPlan}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Social Proof Notification */}
      <div
        className={`fixed bottom-4 left-4 z-40 transition-all duration-500 ${
          showSocialProof ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-xs">
          <button
            onClick={() => setShowSocialProof(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-2xl">
              {socialProofNotifications[currentProof].emoji}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">
                {socialProofNotifications[currentProof].name}
              </p>
              <p className="text-brand-600 text-sm font-medium">
                {socialProofNotifications[currentProof].action}
              </p>
              <p className="text-gray-400 text-xs">
                {socialProofNotifications[currentProof].time}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <BadgeCheck className="w-3 h-3 text-green-500" />
            Verified by BestMealMate
          </div>
        </div>
      </div>
    </div>
  )
}
