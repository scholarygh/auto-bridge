import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get the current active exchange rate from database
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

    return NextResponse.json({
      success: true,
      data: {
        USD_TO_GHS: rate,
        lastUpdated: exchangeRate?.updated_at || new Date().toISOString(),
        source: exchangeRate ? 'database' : 'default'
      }
    })
  } catch (error) {
    console.error('Exchange rate error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch exchange rate',
        data: {
          USD_TO_GHS: 10.45, // Fallback to current rate
          lastUpdated: new Date().toISOString(),
          source: 'fallback'
        }
      },
      { status: 500 }
    )
  }
}

// Update exchange rate (admin only)
export async function POST(request: NextRequest) {
  try {
    const { rate } = await request.json()
    
    if (!rate || typeof rate !== 'number' || rate <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid exchange rate' },
        { status: 400 }
      )
    }

    // Get current user to check if admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Deactivate all existing rates for this currency pair
    await supabase
      .from('exchange_rates')
      .update({ is_active: false })
      .eq('currency_from', 'USD')
      .eq('currency_to', 'GHS')

    // Insert new rate
    const { data: newRate, error: insertError } = await supabase
      .from('exchange_rates')
      .insert({
        currency_from: 'USD',
        currency_to: 'GHS',
        rate: rate,
        is_active: true,
        created_by: user.id,
        notes: 'Updated via admin interface'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Exchange rate updated successfully',
      data: { 
        USD_TO_GHS: newRate.rate,
        lastUpdated: newRate.updated_at,
        source: 'database'
      }
    })
  } catch (error) {
    console.error('Update exchange rate error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update exchange rate' },
      { status: 500 }
    )
  }
} 