import { supabase } from '@/lib/supabase'

export interface ExchangeRate {
  id: number
  currency_from: string
  currency_to: string
  rate: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by?: string
  notes?: string
}

export interface ExchangeRateResponse {
  USD_TO_GHS: number
  lastUpdated: string
  source: 'database' | 'default' | 'fallback'
}

// Cache for exchange rate to avoid multiple API calls
let exchangeRateCache: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export class ExchangeRateService {
  private static instance: ExchangeRateService

  public static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService()
    }
    return ExchangeRateService.instance
  }

  /**
   * Get current exchange rate with caching
   */
  async getCurrentRate(): Promise<ExchangeRateResponse> {
    // Check cache first
    if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
      return {
        USD_TO_GHS: exchangeRateCache.rate,
        lastUpdated: new Date(exchangeRateCache.timestamp).toISOString(),
        source: 'database'
      }
    }

    try {
      const { data: exchangeRate, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('currency_from', 'USD')
        .eq('currency_to', 'GHS')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Database error:', error)
        throw error
      }

      // If no rate found in database, use default
      const rate = exchangeRate?.rate || 10.45

      // Update cache
      exchangeRateCache = { rate, timestamp: Date.now() }

      return {
        USD_TO_GHS: rate,
        lastUpdated: exchangeRate?.updated_at || new Date().toISOString(),
        source: exchangeRate ? 'database' : 'default'
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
      
      // Return fallback rate
      return {
        USD_TO_GHS: 10.45,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      }
    }
  }

  /**
   * Update exchange rate (admin only)
   */
  async updateRate(rate: number, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate rate
      if (!rate || rate <= 0 || rate > 100) {
        return { success: false, error: 'Invalid exchange rate' }
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Admin access required' }
      }

      // Deactivate all existing rates for this currency pair
      await supabase
        .from('exchange_rates')
        .update({ is_active: false })
        .eq('currency_from', 'USD')
        .eq('currency_to', 'GHS')

      // Insert new rate
      const { error: insertError } = await supabase
        .from('exchange_rates')
        .insert({
          currency_from: 'USD',
          currency_to: 'GHS',
          rate: rate,
          is_active: true,
          created_by: userId,
          notes: 'Updated via admin interface'
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        return { success: false, error: 'Failed to update exchange rate' }
      }

      // Clear cache to force refresh
      exchangeRateCache = null

      return { success: true }
    } catch (error) {
      console.error('Update exchange rate error:', error)
      return { success: false, error: 'Failed to update exchange rate' }
    }
  }

  /**
   * Get exchange rate history
   */
  async getRateHistory(limit: number = 10): Promise<ExchangeRate[]> {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('currency_from', 'USD')
        .eq('currency_to', 'GHS')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching rate history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch rate history:', error)
      return []
    }
  }

  /**
   * Convert USD to GHS
   */
  async convertUSDToGHS(usdAmount: number): Promise<number> {
    const rateData = await this.getCurrentRate()
    return usdAmount * rateData.USD_TO_GHS
  }

  /**
   * Convert GHS to USD
   */
  async convertGHSToUSD(ghsAmount: number): Promise<number> {
    const rateData = await this.getCurrentRate()
    return ghsAmount / rateData.USD_TO_GHS
  }

  /**
   * Clear cache (useful for testing or manual cache invalidation)
   */
  clearCache(): void {
    exchangeRateCache = null
  }
}

// Export singleton instance
export const exchangeRateService = ExchangeRateService.getInstance() 