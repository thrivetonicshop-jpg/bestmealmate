'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Search, HelpCircle, CreditCard, Users, Smartphone, Shield, Utensils } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'What is BestMealMate?',
    answer: 'BestMealMate is an AI-powered meal planning app designed for families with multiple dietary needs. It creates personalized meal plans that accommodate everyone\'s preferences, allergies, and dietary restrictions in one unified plan.'
  },
  {
    category: 'Getting Started',
    question: 'How do I get started?',
    answer: 'Simply sign up for a free account, add your family members with their dietary preferences, and our AI will generate personalized meal plans for your household. You can start with our free tier which includes basic meal planning for up to 2 family members.'
  },
  {
    category: 'Getting Started',
    question: 'Is there a free trial?',
    answer: 'Yes! All paid plans come with a 14-day free trial. You can explore all premium features without entering a credit card. Cancel anytime during the trial period with no charges.'
  },
  {
    category: 'Getting Started',
    question: 'What devices can I use BestMealMate on?',
    answer: 'BestMealMate works on any device with a web browser - phones, tablets, and computers. It\'s also a Progressive Web App (PWA), so you can install it on your home screen for quick access and offline use.'
  },

  // Features
  {
    category: 'Features',
    question: 'How does the AI meal planning work?',
    answer: 'Our AI analyzes your family\'s dietary restrictions, preferences, what\'s in your pantry, and nutritional goals to suggest meals that work for everyone. It learns from your feedback to improve recommendations over time.'
  },
  {
    category: 'Features',
    question: 'Can I scan items into my pantry?',
    answer: 'Yes! Use our food scanner to photograph items and automatically add them to your pantry. We also support barcode scanning for packaged products to quickly add items with nutritional information.'
  },
  {
    category: 'Features',
    question: 'How does the grocery list work?',
    answer: 'Based on your meal plan, we automatically generate a grocery list organized by store aisle. You can export it to various formats (text, CSV, print) or share it with family members. Check off items as you shop!'
  },
  {
    category: 'Features',
    question: 'Can I customize recipes?',
    answer: 'Absolutely! You can modify any suggested recipe, add your own family recipes, and the AI will learn your preferences. Swap ingredients, adjust portions, and save custom variations.'
  },
  {
    category: 'Features',
    question: 'Does it track food expiration?',
    answer: 'Yes, we track expiration dates for all pantry items and send you notifications when items are about to expire. The AI prioritizes using soon-to-expire ingredients in meal suggestions to reduce food waste.'
  },

  // Family & Dietary
  {
    category: 'Family & Dietary',
    question: 'How many family members can I add?',
    answer: 'The free tier supports up to 2 family members. Premium ($9.99/mo) supports up to 4 members, and the Family plan ($14.99/mo) supports unlimited family members.'
  },
  {
    category: 'Family & Dietary',
    question: 'What dietary restrictions do you support?',
    answer: 'We support all major dietary needs including: vegetarian, vegan, keto, paleo, gluten-free, dairy-free, nut allergies, low-sodium, diabetic-friendly, halal, kosher, and many more. You can also add custom restrictions.'
  },
  {
    category: 'Family & Dietary',
    question: 'Can different family members have different diets?',
    answer: 'Yes! This is our specialty. Dad can be keto, kids can have nut allergies, grandma can be low-sodium - we create meal plans that accommodate everyone at the same dinner table.'
  },
  {
    category: 'Family & Dietary',
    question: 'How do you handle food allergies?',
    answer: 'Food allergies are taken very seriously. When you mark an allergy, we completely exclude those ingredients from all suggestions and warn you if a recipe might contain allergens. Always double-check ingredients for severe allergies.'
  },

  // Billing & Subscription
  {
    category: 'Billing',
    question: 'What are the pricing plans?',
    answer: 'We offer three tiers: Free (2 family members, basic features), Premium at $9.99/month (4 members, AI chef, unlimited recipes), and Family at $14.99/month (unlimited members, all features, priority support).'
  },
  {
    category: 'Billing',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from your account settings. Your subscription remains active until the end of your billing period. We don\'t offer prorated refunds, but you keep access until the period ends.'
  },
  {
    category: 'Billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe. We also support Apple Pay and Google Pay where available.'
  },
  {
    category: 'Billing',
    question: 'Can I change my plan?',
    answer: 'Yes, you can upgrade or downgrade your plan anytime from account settings. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.'
  },

  // Privacy & Security
  {
    category: 'Privacy & Security',
    question: 'How is my data protected?',
    answer: 'We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 encryption for data at rest. Your data is stored securely on Supabase infrastructure with regular backups.'
  },
  {
    category: 'Privacy & Security',
    question: 'Do you sell my data?',
    answer: 'Never. We do not sell, rent, or share your personal data with third parties for marketing purposes. Your meal preferences and family data are private. See our Privacy Policy for details.'
  },
  {
    category: 'Privacy & Security',
    question: 'Can I delete my account?',
    answer: 'Yes, you can request account deletion from your settings page. We\'ll delete all your personal data within 30 days as required by GDPR/CCPA. Some anonymized data may be retained for analytics.'
  },
  {
    category: 'Privacy & Security',
    question: 'Is my payment information secure?',
    answer: 'Yes, all payment processing is handled by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your full credit card number on our servers.'
  },

  // Technical
  {
    category: 'Technical',
    question: 'Does the app work offline?',
    answer: 'Yes! BestMealMate is a Progressive Web App with offline support. Your recent meal plans, recipes, and grocery lists are cached for offline access. Changes sync when you\'re back online.'
  },
  {
    category: 'Technical',
    question: 'Why is the AI not giving good suggestions?',
    answer: 'The AI improves with feedback. Rate meals, mark favorites, and add your own recipes to help it learn your family\'s preferences. Also ensure all dietary restrictions are accurately set in family profiles.'
  },
  {
    category: 'Technical',
    question: 'How do I report a bug?',
    answer: 'Email us at hello@bestmealmate.com with a description of the issue, steps to reproduce it, and screenshots if possible. We typically respond within 24 hours.'
  }
]

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'Getting Started', label: 'Getting Started', icon: Smartphone },
  { id: 'Features', label: 'Features', icon: Utensils },
  { id: 'Family & Dietary', label: 'Family & Dietary', icon: Users },
  { id: 'Billing', label: 'Billing', icon: CreditCard },
  { id: 'Privacy & Security', label: 'Privacy & Security', icon: Shield },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-brand-600 hover:text-brand-700 text-sm font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-2">Find answers to common questions about BestMealMate</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No questions found matching your search.</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                className="text-brand-600 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-1">{faq.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-600 mb-4">Can&apos;t find what you&apos;re looking for? We&apos;re here to help.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 BestMealMate. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-brand-600">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-600">Terms</Link>
            <Link href="/contact" className="hover:text-brand-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
