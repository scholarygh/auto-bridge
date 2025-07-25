import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tsmigimqbuccodyhfqpi.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlnaW1xYnVjY29keWhmcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTQ3OTQsImV4cCI6MjA2ODc5MDc5NH0.GYSnPso7QFabY6dlfB4nsBaAsPBwPZQf9UE7eNpesDE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          // Basic Identification
          id: string
          vin: string
          title: string
          
          // Basic Vehicle Info
          make: string
          model: string
          year: number
          trim?: string
          body_type?: string
          
          // Pricing & Condition
          price: number
          original_price?: number
          condition: 'excellent' | 'good' | 'fair' | 'poor'
          
          // Technical Specifications
          mileage: number
          fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen'
          transmission: 'automatic' | 'manual' | 'cvt' | 'semi-automatic'
          engine_type?: string
          engine_size?: string
          cylinders?: number
          horsepower?: number
          torque?: number
          
          // Exterior & Interior
          color: string
          interior?: string
          doors?: number
          seats?: number
          
          // NHTSA Safety & Technical Data
          manufacturer?: string
          plant_city?: string
          plant_state?: string
          plant_country?: string
          vehicle_type?: string
          body_class?: string
          gross_vehicle_weight_rating?: number
          brake_system_type?: string
          brake_system_desc?: string
          steering_type?: string
          steering_control?: string
          tire_pressure_monitoring_type?: string
          anti_brake_system?: string
          traction_control?: string
          stability_control?: string
          auto_reverse_system?: string
          daytime_running_light?: string
          adaptive_cruise_control?: string
          adaptive_headlights?: string
          automatic_emergency_braking?: string
          blind_spot_monitoring?: string
          lane_departure_warning?: string
          lane_keeping_assist?: string
          forward_collision_warning?: string
          rear_cross_traffic_alert?: string
          rear_view_camera?: string
          parking_sensors?: string
          
          // Fuel & Emissions
          fuel_efficiency_city?: number
          fuel_efficiency_highway?: number
          fuel_efficiency_combined?: number
          fuel_tank_capacity?: number
          co2_emissions?: number
          
          // Dimensions & Capacity
          wheelbase?: number
          length?: number
          width?: number
          height?: number
          curb_weight?: number
          cargo_capacity?: number
          towing_capacity?: number
          
          // Location & Status
          location: string
          status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'sourcing'
          
          // Media & Content
          images: string[]
          features: string[]
          description: string
          
          // Analytics & Marketing
          views: number
          inquiries: number
          is_featured: boolean
          
          // Timestamps
          created_at: string
          updated_at: string
        }
        Insert: {
          // Basic Identification
          id?: string
          vin: string
          title: string
          
          // Basic Vehicle Info
          make: string
          model: string
          year: number
          trim?: string
          body_type?: string
          
          // Pricing & Condition
          price: number
          original_price?: number
          condition?: 'excellent' | 'good' | 'fair' | 'poor'
          
          // Technical Specifications
          mileage: number
          fuel_type?: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen'
          transmission?: 'automatic' | 'manual' | 'cvt' | 'semi-automatic'
          engine_type?: string
          engine_size?: string
          cylinders?: number
          horsepower?: number
          torque?: number
          
          // Exterior & Interior
          color: string
          interior?: string
          doors?: number
          seats?: number
          
          // NHTSA Safety & Technical Data
          manufacturer?: string
          plant_city?: string
          plant_state?: string
          plant_country?: string
          vehicle_type?: string
          body_class?: string
          gross_vehicle_weight_rating?: number
          brake_system_type?: string
          brake_system_desc?: string
          steering_type?: string
          steering_control?: string
          tire_pressure_monitoring_type?: string
          anti_brake_system?: string
          traction_control?: string
          stability_control?: string
          auto_reverse_system?: string
          daytime_running_light?: string
          adaptive_cruise_control?: string
          adaptive_headlights?: string
          automatic_emergency_braking?: string
          blind_spot_monitoring?: string
          lane_departure_warning?: string
          lane_keeping_assist?: string
          forward_collision_warning?: string
          rear_cross_traffic_alert?: string
          rear_view_camera?: string
          parking_sensors?: string
          
          // Fuel & Emissions
          fuel_efficiency_city?: number
          fuel_efficiency_highway?: number
          fuel_efficiency_combined?: number
          fuel_tank_capacity?: number
          co2_emissions?: number
          
          // Dimensions & Capacity
          wheelbase?: number
          length?: number
          width?: number
          height?: number
          curb_weight?: number
          cargo_capacity?: number
          towing_capacity?: number
          
          // Location & Status
          location: string
          status?: 'available' | 'reserved' | 'sold' | 'maintenance' | 'sourcing'
          
          // Media & Content
          images?: string[]
          features?: string[]
          description: string
          
          // Analytics & Marketing
          views?: number
          inquiries?: number
          is_featured?: boolean
          
          // Timestamps
          created_at?: string
          updated_at?: string
        }
        Update: {
          // Basic Identification
          id?: string
          vin?: string
          title?: string
          
          // Basic Vehicle Info
          make?: string
          model?: string
          year?: number
          trim?: string
          body_type?: string
          
          // Pricing & Condition
          price?: number
          original_price?: number
          condition?: 'excellent' | 'good' | 'fair' | 'poor'
          
          // Technical Specifications
          mileage?: number
          fuel_type?: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen'
          transmission?: 'automatic' | 'manual' | 'cvt' | 'semi-automatic'
          engine_type?: string
          engine_size?: string
          cylinders?: number
          horsepower?: number
          torque?: number
          
          // Exterior & Interior
          color?: string
          interior?: string
          doors?: number
          seats?: number
          
          // NHTSA Safety & Technical Data
          manufacturer?: string
          plant_city?: string
          plant_state?: string
          plant_country?: string
          vehicle_type?: string
          body_class?: string
          gross_vehicle_weight_rating?: number
          brake_system_type?: string
          brake_system_desc?: string
          steering_type?: string
          steering_control?: string
          tire_pressure_monitoring_type?: string
          anti_brake_system?: string
          traction_control?: string
          stability_control?: string
          auto_reverse_system?: string
          daytime_running_light?: string
          adaptive_cruise_control?: string
          adaptive_headlights?: string
          automatic_emergency_braking?: string
          blind_spot_monitoring?: string
          lane_departure_warning?: string
          lane_keeping_assist?: string
          forward_collision_warning?: string
          rear_cross_traffic_alert?: string
          rear_view_camera?: string
          parking_sensors?: string
          
          // Fuel & Emissions
          fuel_efficiency_city?: number
          fuel_efficiency_highway?: number
          fuel_efficiency_combined?: number
          fuel_tank_capacity?: number
          co2_emissions?: number
          
          // Dimensions & Capacity
          wheelbase?: number
          length?: number
          width?: number
          height?: number
          curb_weight?: number
          cargo_capacity?: number
          towing_capacity?: number
          
          // Location & Status
          location?: string
          status?: 'available' | 'reserved' | 'sold' | 'maintenance' | 'sourcing'
          
          // Media & Content
          images?: string[]
          features?: string[]
          description?: string
          
          // Analytics & Marketing
          views?: number
          inquiries?: number
          is_featured?: boolean
          
          // Timestamps
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          vehicle_request: string
          budget_range: string
          timeline: string
          status: 'new' | 'contacted' | 'negotiating' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high'
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone: string
          vehicle_request: string
          budget_range: string
          timeline: string
          status?: 'new' | 'contacted' | 'negotiating' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          vehicle_request?: string
          budget_range?: string
          timeline?: string
          status?: 'new' | 'contacted' | 'negotiating' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high'
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      sourcing: {
        Row: {
          id: string
          inquiry_id: string
          vehicle_details: string
          target_price: number
          current_price: number
          progress: number
          status: 'searching' | 'found' | 'negotiating' | 'purchased' | 'cancelled'
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inquiry_id: string
          vehicle_details: string
          target_price: number
          current_price?: number
          progress?: number
          status?: 'searching' | 'found' | 'negotiating' | 'purchased' | 'cancelled'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inquiry_id?: string
          vehicle_details?: string
          target_price?: number
          current_price?: number
          progress?: number
          status?: 'searching' | 'found' | 'negotiating' | 'purchased' | 'cancelled'
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      shipping: {
        Row: {
          id: string
          vehicle_id: string
          customer_id: string
          shipping_company: string
          tracking_number: string
          departure_date: string
          estimated_arrival: string
          actual_arrival?: string
          status: 'preparing' | 'in_transit' | 'arrived' | 'delivered'
          shipping_cost: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          customer_id: string
          shipping_company: string
          tracking_number: string
          departure_date: string
          estimated_arrival: string
          actual_arrival?: string
          status?: 'preparing' | 'in_transit' | 'arrived' | 'delivered'
          shipping_cost: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          customer_id?: string
          shipping_company?: string
          tracking_number?: string
          departure_date?: string
          estimated_arrival?: string
          actual_arrival?: string
          status?: 'preparing' | 'in_transit' | 'arrived' | 'delivered'
          shipping_cost?: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          kyc_status: 'pending' | 'verified' | 'rejected'
          total_orders: number
          total_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          kyc_status?: 'pending' | 'verified' | 'rejected'
          total_orders?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          kyc_status?: 'pending' | 'verified' | 'rejected'
          total_orders?: number
          total_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          vehicle_id: string
          total_amount: number
          commission_amount: number
          status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          vehicle_id: string
          total_amount: number
          commission_amount: number
          status?: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
          payment_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          vehicle_id?: string
          total_amount?: number
          commission_amount?: number
          status?: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
          payment_method?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 