import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default exchange rate (fallback if API fails)
const DEFAULT_USD_TO_GHS_RATE = 10.88 // 1 USD = 10.88 GHS (current rate as of July 2025)

// Cache for exchange rate to avoid multiple API calls
let exchangeRateCache: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Get current exchange rate from API with caching
export async function getCurrentExchangeRate(): Promise<number> {
  // Check cache first
  if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
    return exchangeRateCache.rate
  }

  try {
    const response = await fetch('/api/exchange-rate')
    const result = await response.json()
    
    if (result.success && result.data?.USD_TO_GHS) {
      const rate = result.data.USD_TO_GHS
      // Update cache
      exchangeRateCache = { rate, timestamp: Date.now() }
      return rate
    }
  } catch (error) {
    console.warn('Failed to fetch exchange rate from API, using default:', error)
  }

  // Return default rate if API fails
  return DEFAULT_USD_TO_GHS_RATE
}

// Synchronous version for immediate use (uses cached value or default)
export function getCurrentExchangeRateSync(): number {
  return exchangeRateCache?.rate || DEFAULT_USD_TO_GHS_RATE
}

export async function formatPrice(price: number, currency: 'USD' | 'GHS' = 'GHS'): Promise<string> {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  // Convert USD to GHS using current rate
  const rate = await getCurrentExchangeRate()
  const ghsPrice = price * rate
  
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ghsPrice)
}

export function formatPriceUSD(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatPriceGHS(price: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Convert USD to GHS (async version)
export async function convertUSDToGHS(usdPrice: number): Promise<number> {
  const rate = await getCurrentExchangeRate()
  return usdPrice * rate
}

// Convert USD to GHS (sync version using cached/default rate)
export function convertUSDToGHSSync(usdPrice: number): number {
  const rate = getCurrentExchangeRateSync()
  return usdPrice * rate
}

// Convert GHS to USD (async version)
export async function convertGHSToUSD(ghsPrice: number): Promise<number> {
  const rate = await getCurrentExchangeRate()
  return ghsPrice / rate
}

// Convert GHS to USD (sync version using cached/default rate)
export function convertGHSToUSDSync(ghsPrice: number): number {
  const rate = getCurrentExchangeRateSync()
  return ghsPrice / rate
}

// Convert miles to kilometers
export function milesToKilometers(miles: number): number {
  return miles * 1.60934
}

// Convert kilometers to miles
export function kilometersToMiles(kilometers: number): number {
  return kilometers / 1.60934
}

export function formatMileage(mileage: number, unit: 'miles' | 'km' = 'miles'): string {
  if (unit === 'miles') {
    return new Intl.NumberFormat('en-US').format(mileage) + ' mi'
  } else {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km'
  }
}

// Format mileage for display (convert miles to km for Ghana market)
export function formatMileageForDisplay(miles: number): string {
  const kilometers = milesToKilometers(miles)
  return new Intl.NumberFormat('en-US').format(Math.round(kilometers)) + ' km'
}

export function formatYear(year: number): string {
  return year.toString()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Format location for display (US location to Ghana context)
export function formatLocation(location: string): string {
  // If it's a US location, add context for Ghana customers
  if (location.includes(', USA') || location.includes(', US') || location.includes(', United States')) {
    return `${location} (Import from USA)`
  }
  return location
} 