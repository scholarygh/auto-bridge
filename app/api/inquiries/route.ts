import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: inquiries, error, count } = await query

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inquiries' },
        { status: 500 }
      )
    }

    console.log('✅ Inquiries fetched successfully')

    return NextResponse.json({
      success: true,
      inquiries: inquiries || [],
      total: count || 0,
      page,
      limit
    })

  } catch (error) {
    console.error('❌ Inquiries API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, priority, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Inquiry ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (notes) updateData.notes = notes
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update inquiry' },
        { status: 500 }
      )
    }

    console.log('✅ Inquiry updated successfully')

    return NextResponse.json({
      success: true,
      inquiry: data?.[0]
    })

  } catch (error) {
    console.error('❌ Update inquiry API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 