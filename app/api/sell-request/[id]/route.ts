import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status, review_notes, reviewed_at } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      )
    }

    // First, get the sell request details
    const { data: sellRequest, error: fetchError } = await supabase
      .from('sell_requests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('❌ Error fetching sell request:', fetchError)
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    // Update the sell request
    const { data, error } = await supabase
      .from('sell_requests')
      .update({
        status,
        review_notes: review_notes || null,
        reviewed_at: reviewed_at || new Date().toISOString()
      })
      .eq('id', params.id)
      .select()

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      )
    }

    // If approved, add to vehicles inventory
    if (status === 'approved') {
      console.log('🚀 Processing approval - adding to inventory...')
      console.log('📋 Sell request data:', sellRequest)
      
      try {
        // Extract VIN data for vehicle details
        const vinData = sellRequest.vin_data || {}
        console.log('🔍 VIN data:', vinData)
        
        // Create vehicle data for inventory
        const vehicleData = {
          title: `${sellRequest.year} ${sellRequest.make} ${sellRequest.model}`,
          make: sellRequest.make,
          model: sellRequest.model,
          year: sellRequest.year,
          trim: vinData.Trim || null,
          body_type: vinData['Body Class'] || vinData.BodyType || null,
          price: 0, // Will be set by admin later
          condition: sellRequest.condition,
          mileage: sellRequest.mileage,
          fuel_type: vinData['Fuel Type'] || vinData.FuelType || null,
          transmission: vinData.Transmission || null,
          color: null, // Will be set by admin later
          interior: null, // Will be set by admin later
          images: sellRequest.images || [],
          features: [], // Will be set by admin later
          description: sellRequest.description || '',
          location: sellRequest.location,
          views: 0,
          inquiries: 0,
          is_featured: false,
          status: 'sourcing', // Start as sourcing, admin can change to available
          source: 'customer_submission', // Distinguish from our own inventory
          source_request_id: sellRequest.id, // Reference to original sell request
          vin: sellRequest.vin,
          vin_data: sellRequest.vin_data,
          contact_name: sellRequest.contact_name,
          contact_email: sellRequest.contact_email,
          contact_phone: sellRequest.contact_phone,
          submitted_at: sellRequest.submitted_at,
          approved_at: new Date().toISOString()
        }

        console.log('📝 Vehicle data to insert:', vehicleData)

        // Check if vehicle already exists
        const { data: existingVehicle, error: checkError } = await supabase
          .from('vehicles')
          .select('id')
          .eq('source_request_id', sellRequest.id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('❌ Error checking existing vehicle:', checkError)
        }

        if (existingVehicle) {
          console.log('⚠️ Vehicle already exists in inventory:', existingVehicle.id)
        } else {
          console.log('✅ No existing vehicle found, proceeding with insertion...')
          
          // Insert into vehicles table
          const { data: newVehicle, error: vehicleError } = await supabase
            .from('vehicles')
            .insert(vehicleData)
            .select()

          if (vehicleError) {
            console.error('❌ Error adding to inventory:', vehicleError)
            console.error('❌ Vehicle data that failed:', vehicleData)
            console.error('❌ Error details:', {
              code: vehicleError.code,
              message: vehicleError.message,
              details: vehicleError.details,
              hint: vehicleError.hint
            })
            // Don't fail the approval, just log the error
            console.log('⚠️ Vehicle not added to inventory, but request was approved')
          } else {
            console.log('✅ Vehicle successfully added to inventory:', newVehicle[0])
            console.log('✅ Vehicle ID:', newVehicle[0]?.id)
            console.log('✅ Vehicle source:', newVehicle[0]?.source)
            console.log('✅ Vehicle status:', newVehicle[0]?.status)
          }
        }
      } catch (inventoryError) {
        console.error('❌ Error processing inventory addition:', inventoryError)
        console.error('❌ Full error details:', inventoryError)
        // Don't fail the approval, just log the error
      }
    }

    console.log('✅ Sell request updated:', data)

    // TODO: Send email notification to user about the decision
    // await sendStatusUpdateEmail(data[0])

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`,
      data: data[0]
    })

  } catch (error) {
    console.error('❌ Error updating sell request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error fetching sell request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 