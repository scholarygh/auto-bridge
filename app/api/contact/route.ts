import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to database
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        customer_name: name,
        customer_email: email,
        vehicle_request: subject,
        notes: message,
        status: 'new',
        priority: 'medium',
        budget_range: 'Not specified',
        timeline: 'Not specified'
      })

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      )
    }

    console.log('✅ Contact inquiry saved:', data)

    return NextResponse.json(
      { success: true, message: 'Inquiry submitted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 