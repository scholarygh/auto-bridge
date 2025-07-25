import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's TOTP status
    const { data: user, error } = await supabase
      .from('users')
      .select('totp_enabled, totp_verified')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to get user data' }, { status: 500 })
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error('Error checking TOTP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 