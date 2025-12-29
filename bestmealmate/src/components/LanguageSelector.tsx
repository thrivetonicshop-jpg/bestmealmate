'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useTranslation, languages, type Language } from '@/lib/i18n'

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'grid' | 'minimal'
  className?: string
}

export default function LanguageSelector({ variant = 'dropdown', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${className}`}>
        {(Object.entries(languages) as [Language, typeof languages.en][]).map(([code, info]) => (
          <button
            key={code}
            onClick={() => handleSelect(code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              language === code
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            aria-pressed={language === code}
          >
            <span className="text-lg" role="img" aria-hidden="true">{info.flag}</span>
            <span className="text-sm font-medium">{info.name}</span>
            {language === code && <Check className="w-4 h-4 ml-auto text-brand-600" />}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={t('settings.language')}
        >
          <span>{languages[language].flag}</span>
          <span className="text-sm">{language.toUpperCase()}</span>
        </button>

        {isOpen && (
          <div
            className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            role="listbox"
            aria-label={t('settings.language')}
          >
            {(Object.entries(languages) as [Language, typeof languages.en][]).map(([code, info]) => (
              <button
                key={code}
                onClick={() => handleSelect(code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  language === code ? 'bg-brand-50 dark:bg-brand-900/30' : ''
                }`}
                role="option"
                aria-selected={language === code}
              >
                <span>{info.flag}</span>
                <span className="text-sm">{info.name}</span>
                {language === code && <Check className="w-4 h-4 ml-auto text-brand-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('settings.language')}
      >
        <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="text-lg">{languages[language].flag}</span>
        <span className="flex-1 text-left font-medium text-gray-900 dark:text-white">
          {languages[language].name}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 max-h-64 overflow-y-auto"
          role="listbox"
          aria-label={t('settings.language')}
        >
          {(Object.entries(languages) as [Language, typeof languages.en][]).map(([code, info]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                language === code ? 'bg-brand-50 dark:bg-brand-900/30' : ''
              }`}
              role="option"
              aria-selected={language === code}
            >
              <span className="text-lg">{info.flag}</span>
              <span className="flex-1 font-medium text-gray-900 dark:text-white">{info.name}</span>
              {language === code && <Check className="w-5 h-5 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
