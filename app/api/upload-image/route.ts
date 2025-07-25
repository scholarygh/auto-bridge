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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `sell-requests/${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Storage upload error:', error)
      
      // Check if it's an RLS policy error
      if (error.message && error.message.includes('row-level security policy')) {
        console.error('🔒 RLS Policy Error - Storage bucket needs policy update')
        return NextResponse.json(
          { 
            error: 'Storage configuration issue. Please contact support.',
            details: 'RLS policy needs to be updated for image uploads'
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(fileName)

    console.log('✅ Image uploaded successfully:', fileName)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('❌ Error uploading image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 