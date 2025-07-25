import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client inside the function to avoid build-time issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await request.json()
    
    console.log('📝 Received sell request:', body)
    
    // Validate required fields
    const requiredFields = ['vin', 'make', 'model', 'year', 'mileage', 'condition', 'location', 'name', 'email', 'phone']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate VIN format
    if (body.vin.length !== 17) {
      return NextResponse.json(
        { error: 'VIN must be exactly 17 characters' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Insert into sell_requests table
    const { data, error } = await supabase
      .from('sell_requests')
      .insert([
        {
          vin: body.vin.toUpperCase(),
          make: body.make,
          model: body.model,
          year: parseInt(body.year),
          mileage: parseInt(body.mileage),
          condition: body.condition,
          description: body.description || '',
          location: body.location,
          images: body.images || [],
          vin_data: body.vinData || {},
          contact_name: body.name,
          contact_email: body.email,
          contact_phone: body.phone,
          status: 'pending_review',
          submitted_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    console.log('✅ Sell request saved:', data)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Vehicle submission received for review',
        id: data[0].id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ Error processing sell request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Initialize Supabase client inside the function to avoid build-time issues
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('sell_requests')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ submissions: data })
  } catch (error) {
    console.error('❌ Error fetching sell requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 