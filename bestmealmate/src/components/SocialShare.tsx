'use client'

import { useState } from 'react'
import { Share2, X as XIcon, Youtube, Instagram, Music2, Copy, Check, ExternalLink } from 'lucide-react'

interface SocialShareProps {
  title: string
  description?: string
  url?: string
  hashtags?: string[]
  image?: string
  className?: string
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export default function SocialShare({ title, description, url, hashtags = [], image, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `${title}${description ? ` - ${description}` : ''}`
  const hashtagString = hashtags.length > 0 ? hashtags.map(t => `#${t}`).join(' ') : '#BestMealMate #MealPlanning'

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: XIcon,
      color: 'bg-black hover:bg-gray-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags.join(','))}`,
    },
    {
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600 hover:bg-red-700',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`,
      action: 'Search on YouTube',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
      url: `https://www.instagram.com/`,
      note: 'Copy and share on Instagram',
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      color: 'bg-black hover:bg-gray-800',
      url: `https://www.tiktok.com/search?q=${encodeURIComponent(title)}`,
      action: 'Search on TikTok',
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}\n\n${hashtagString}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Share Recipe</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl ${social.color} text-white transition-transform hover:scale-105`}
                  title={social.action || `Share on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-600 outline-none truncate"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500 text-center">
              {hashtagString}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// Social media account links for marketing page
export function SocialLinks({ className = '' }: { className?: string }) {
  const links = [
    { name: 'X', icon: XIcon, url: 'https://twitter.com/bestmealmate', color: 'hover:text-black' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@bestmealmate', color: 'hover:text-red-600' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/bestmealmate', color: 'hover:text-pink-600' },
    { name: 'TikTok', icon: TikTokIcon, url: 'https://tiktok.com/@bestmealmate', color: 'hover:text-black' },
  ]

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 text-gray-400 ${link.color} transition-colors`}
          title={link.name}
        >
          <link.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  )
}
