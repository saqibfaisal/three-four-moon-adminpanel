"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Country = "UAE" | "Germany" | "UK" | "USA" | "Pakistan"
export type Currency = "AED" | "EUR" | "GBP" | "USD" | "PKR"
export type Language = "ar" | "de" | "en"

interface CountryConfig {
  country: Country
  currency: Currency
  language: Language
  flag: string
  rtl: boolean
}

export const countryConfigs: Record<Country, CountryConfig> = {
  UAE: { country: "UAE", currency: "AED", language: "en", flag: "🇦🇪", rtl: false },
  Germany: { country: "Germany", currency: "EUR", language: "en", flag: "🇩🇪", rtl: false },
  UK: { country: "UK", currency: "GBP", language: "en", flag: "🇬🇧", rtl: false },
  USA: { country: "USA", currency: "USD", language: "en", flag: "🇺🇸", rtl: false },
  Pakistan: { country: "Pakistan", currency: "PKR", language: "en", flag: "🇵🇰", rtl: false },
}

interface InternationalizationContextType {
  currentCountry: Country
  currentConfig: CountryConfig
  setCountry: (country: Country) => void
  formatPrice: (price: number, currency?: Currency) => string
  translate: (key: string) => string
}

const InternationalizationContext = createContext<InternationalizationContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.cart": "Cart",
    "nav.profile": "Profile",
    "hero.shopNow": "Shop Now",
    "product.addToCart": "Add to Cart",
    "product.addToWishlist": "Add to Wishlist",
    "flash.deals": "Flash Deals",
    "trending.now": "Trending Now",
    "featured.collections": "Featured Collections",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.shop": "تسوق",
    "nav.cart": "السلة",
    "nav.profile": "الملف الشخصي",
    "hero.shopNow": "تسوق الآن",
    "product.addToCart": "أضف إلى السلة",
    "product.addToWishlist": "أضف إلى المفضلة",
    "flash.deals": "عروض سريعة",
    "trending.now": "الأكثر رواجاً",
    "featured.collections": "مجموعات مميزة",
  },
  de: {
    "nav.home": "Startseite",
    "nav.shop": "Shop",
    "nav.cart": "Warenkorb",
    "nav.profile": "Profil",
    "hero.shopNow": "Jetzt einkaufen",
    "product.addToCart": "In den Warenkorb",
    "product.addToWishlist": "Zur Wunschliste",
    "flash.deals": "Blitzangebote",
    "trending.now": "Trending jetzt",
    "featured.collections": "Ausgewählte Kollektionen",
  },
}

export function InternationalizationProvider({ children }: { children: React.ReactNode }) {
  const [currentCountry, setCurrentCountry] = useState<Country>("USA")

  useEffect(() => {
    // Auto-detect location or load from localStorage
    const savedCountry = localStorage.getItem("selectedCountry") as Country
    if (savedCountry && countryConfigs[savedCountry]) {
      setCurrentCountry(savedCountry)
    }
  }, [])

  useEffect(() => {
    const config = countryConfigs[currentCountry]
    document.documentElement.dir = config.rtl ? "rtl" : "ltr"
    document.documentElement.lang = config.language
  }, [currentCountry])

  const setCountry = (country: Country) => {
    setCurrentCountry(country)
    localStorage.setItem("selectedCountry", country)
  }

  const formatPrice = (price: number, currency?: Currency) => {
    const config = countryConfigs[currentCountry]
    const exchangeRates: Record<Currency, number> = { AED: 3.67, EUR: 0.85, GBP: 0.73, USD: 1, PKR: 278 }
    
    // Map currency to appropriate locale for proper symbol display
    const currencyToLocale: Record<Currency, string> = {
      AED: "ar-AE",
      EUR: "de-DE", 
      GBP: "en-GB",
      USD: "en-US",
      PKR: "en-PK"
    }
    
    // If a specific currency is provided, convert price from USD to that currency and display in that currency
    if (currency) {
      // Price is in USD, convert to the specified currency
      const convertedPrice = price * exchangeRates[currency]
      const locale = currencyToLocale[currency]
      
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(convertedPrice)
    }
    
    // No currency specified, convert to current selected country currency
    const displayPrice = price * exchangeRates[config.currency]
    const locale = currencyToLocale[config.currency]

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: config.currency,
    }).format(displayPrice)
  }

  const translate = (key: string) => {
    const config = countryConfigs[currentCountry]
    return translations[config.language]?.[key] || key
  }

  return (
    <InternationalizationContext.Provider
      value={{
        currentCountry,
        currentConfig: countryConfigs[currentCountry],
        setCountry,
        formatPrice,
        translate,
      }}
    >
      {children}
    </InternationalizationContext.Provider>
  )
}

export function useInternationalization() {
  const context = useContext(InternationalizationContext)
  if (context === undefined) {
    throw new Error("useInternationalization must be used within an InternationalizationProvider")
  }
  return context
}
