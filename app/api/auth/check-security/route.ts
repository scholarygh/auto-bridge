import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's security settings
    const { data: security, error } = await supabase
      .from('admin_security')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no security settings found, return default settings
      return NextResponse.json({ 
        data: {
          security_level: 'basic',
          totp_required: false,
          device_verification_required: false,
          max_login_attempts: 5
        }
      })
    }

    return NextResponse.json({ data: security })
  } catch (error) {
    console.error('Error checking security:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 