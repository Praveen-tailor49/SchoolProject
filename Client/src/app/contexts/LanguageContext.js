import React, { createContext, useContext, useState, useEffect } from 'react'

// Import translations
import enTranslations from '../locales/en.json'
import hiTranslations from '../locales/hi.json'

const LanguageContext = createContext()

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('language')
    return savedLanguage || 'en'
  })

  const translations = {
    en: enTranslations,
    hi: hiTranslations
  }

  const currentTranslation = translations[language] || translations.en

  const t = (key) => {
    const keys = key.split('.')
    let value = currentTranslation
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found in current language
        value = enTranslations
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found anywhere
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en'
    changeLanguage(newLang)
  }

  useEffect(() => {
    // Save language preference to localStorage whenever it changes
    localStorage.setItem('language', language)
  }, [language])

  const value = {
    language,
    changeLanguage,
    toggleLanguage,
    t,
    isRTL: language === 'hi' // Hindi can be RTL in some contexts
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
