import { supabase } from './supabase'
import { Database } from './supabase'

// Type definitions
type Vehicle = Database['public']['Tables']['vehicles']['Row']
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert']
type VehicleUpdate = Database['public']['Tables']['vehicles']['Update']

type Inquiry = Database['public']['Tables']['inquiries']['Row']
type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

type Sourcing = Database['public']['Tables']['sourcing']['Row']
type SourcingInsert = Database['public']['Tables']['sourcing']['Insert']
type SourcingUpdate = Database['public']['Tables']['sourcing']['Update']

type Shipping = Database['public']['Tables']['shipping']['Row']
type ShippingInsert = Database['public']['Tables']['shipping']['Insert']
type ShippingUpdate = Database['public']['Tables']['shipping']['Update']

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

// Vehicle operations
export const vehicleService = {
  // Get all vehicles
  async getAll() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get available vehicles (public)
  async getAvailable() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get vehicle by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create vehicle
  async create(vehicle: VehicleInsert) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single()
    
    return { data, error }
  },

  // Update vehicle
  async update(id: string, updates: VehicleUpdate) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete vehicle
  async delete(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
    
    return { error }
  }
}

// Inquiry operations
export const inquiryService = {
  // Get all inquiries
  async getAll() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get inquiries by status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get inquiry by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Create inquiry
  async create(inquiry: InquiryInsert) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert(inquiry)
      .select()
      .single()
    
    return { data, error }
  },

  // Update inquiry
  async update(id: string, updates: InquiryUpdate) {
    const { data, error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete inquiry
  async delete(id: string) {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)
    
    return { error }
  }
}

// Customer operations
export const customerService = {
  // Get all customers
  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get customer by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Get customer by email
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()
    
    return { data, error }
  },

  // Create customer
  async create(customer: CustomerInsert) {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    return { data, error }
  },

  // Update customer
  async update(id: string, updates: CustomerUpdate) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete customer
  async delete(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    return { error }
  }
}

// Sourcing operations
export const sourcingService = {
  // Get all sourcing
  async getAll() {
    const { data, error } = await supabase
      .from('sourcing')
      .select(`
        *,
        inquiries (
          customer_name,
          customer_email,
          vehicle_request
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get sourcing by status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('sourcing')
      .select(`
        *,
        inquiries (
          customer_name,
          customer_email,
          vehicle_request
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create sourcing
  async create(sourcing: SourcingInsert) {
    const { data, error } = await supabase
      .from('sourcing')
      .insert(sourcing)
      .select()
      .single()
    
    return { data, error }
  },

  // Update sourcing
  async update(id: string, updates: SourcingUpdate) {
    const { data, error } = await supabase
      .from('sourcing')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
}

// Shipping operations
export const shippingService = {
  // Get all shipping
  async getAll() {
    const { data, error } = await supabase
      .from('shipping')
      .select(`
        *,
        vehicles (title, make, model),
        customers (name, email)
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get shipping by status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('shipping')
      .select(`
        *,
        vehicles (title, make, model),
        customers (name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create shipping
  async create(shipping: ShippingInsert) {
    const { data, error } = await supabase
      .from('shipping')
      .insert(shipping)
      .select()
      .single()
    
    return { data, error }
  },

  // Update shipping
  async update(id: string, updates: ShippingUpdate) {
    const { data, error } = await supabase
      .from('shipping')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
}

// Order operations
export const orderService = {
  // Get all orders
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        vehicles (title, make, model),
        customers (name, email)
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get orders by status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        vehicles (title, make, model),
        customers (name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create order
  async create(order: OrderInsert) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    return { data, error }
  },

  // Update order
  async update(id: string, updates: OrderUpdate) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
}

// Analytics operations
export const analyticsService = {
  // Get dashboard stats
  async getDashboardStats() {
    // Get total vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('status', { count: 'exact' })

    // Get total inquiries
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('inquiries')
      .select('status', { count: 'exact' })

    // Get total customers
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })

    // Get total revenue
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, commission_amount')

    if (vehiclesError || inquiriesError || customersError || ordersError) {
      return { error: 'Failed to fetch dashboard stats' }
    }

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalCommission = orders?.reduce((sum, order) => sum + (order.commission_amount || 0), 0) || 0

    return {
      data: {
        totalVehicles: vehicles?.length || 0,
        totalInquiries: inquiries?.length || 0,
        totalCustomers: customers?.length || 0,
        totalRevenue,
        totalCommission
      },
      error: null
    }
  }
} 