import { supabase } from './supabase'

export interface VehicleData {
  // Basic Information
  id?: string
  vin: string
  make: string
  model: string
  year: number
  trim?: string
  series?: string
  trim2?: string
  description?: string
  
  // Body and Classification
  body_type?: string
  body_cab_type?: string
  vehicle_type?: string
  doors?: string
  seats?: string
  seat_rows?: string
  
  // Engine and Powertrain
  engine?: string
  engine_configuration?: string
  engine_cylinders?: string
  engine_hp?: string
  displacement_l?: string
  displacement_cc?: string
  fuel_type?: string
  fuel_type_secondary?: string
  electrification_level?: string
  transmission?: string
  transmission_speeds?: string
  drivetrain?: string
  turbo?: string
  other_engine_info?: string
  
  // Battery and Electric Vehicle
  battery_info?: string
  battery_type?: string
  battery_kwh?: string
  battery_v?: string
  charger_level?: string
  charger_power_kw?: string
  ev_drive_unit?: string
  
  // Dimensions and Capacity
  bed_length_in?: string
  gvwr?: string
  curb_weight_lb?: string
  wheel_base_long?: string
  wheel_base_short?: string
  track_width?: string
  wheel_size_front?: string
  wheel_size_rear?: string
  top_speed_mph?: string
  
  // Safety Features
  abs?: string
  esc?: string
  traction_control?: string
  air_bag_loc_front?: string
  air_bag_loc_side?: string
  air_bag_loc_curtain?: string
  air_bag_loc_knee?: string
  seat_belts_all?: string
  other_restraint_system_info?: string
  
  // Driver Assistance Features
  adaptive_cruise_control?: string
  adaptive_headlights?: string
  adaptive_driving_beam?: string
  forward_collision_warning?: string
  lane_departure_warning?: string
  lane_keep_system?: string
  lane_centering_assistance?: string
  blind_spot_mon?: string
  blind_spot_intervention?: string
  park_assist?: string
  rear_visibility_system?: string
  rear_cross_traffic_alert?: string
  rear_automatic_emergency_braking?: string
  pedestrian_automatic_emergency_braking?: string
  auto_reverse_system?: string
  dynamic_brake_support?: string
  
  // Lighting and Visibility
  daytime_running_light?: string
  lower_beam_headlamp_light_source?: string
  semiautomatic_headlamp_beam_switching?: string
  
  // Additional Features
  keyless_ignition?: string
  tpms?: string
  entertainment_system?: string
  windows?: string
  wheels?: string
  
  // Manufacturing Information
  manufacturer?: string
  plant_city?: string
  plant_state?: string
  plant_country?: string
  destination_market?: string
  
  // Error and Notes
  error_text?: string
  additional_error_text?: string
  note?: string
  
  // Business Logic Fields
  mileage?: number
  color?: string
  condition?: string
  price?: number
  estimated_price?: number
  location?: string
  dealer_stock_number?: string
  
  // History and Status
  accident_history?: string
  service_history?: string
  ownership_history?: string
  owner_count?: number
  title_issues?: string
  odometer_issues?: string
  last_reported_date?: string
  
  // Features Array
  features?: string[]
  
  // Images
  images?: VehicleImage[]
  
  // Source tracking fields
  source?: 'our_inventory' | 'customer_submission'
  source_request_id?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  submitted_at?: string
  approved_at?: string
  
  // Standard fields
  status?: string
  views?: number
  inquiries?: number
  is_featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface VehicleImage {
  image_url: string
  image_type?: string
  is_primary?: boolean
}

// Legacy interface for backward compatibility
export interface VehicleFormData {
  make: string
  model: string
  year: number
  trim: string
  mileage: number
  color: string
  fuelType: string
  transmission: string
  vin: string
  condition: string
  features: string[]
  description: string
  estimatedPrice: number
  location: string
  engine?: string
  drivetrain?: string
  bodyType?: string
  images?: VehicleImage[]
}

export class VehicleService {
  // Add a new vehicle to the database
  static async addVehicle(vehicleData: VehicleData): Promise<{ success: boolean; vehicleId?: number; error?: string }> {
    try {
      console.log('🚀 Adding vehicle to database:', vehicleData.vin)
      
      // Check if vehicle already exists
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('vin', vehicleData.vin)
        .single()
      
      if (existingVehicle) {
        return { success: false, error: 'Vehicle with this VIN already exists' }
      }
      
      // Prepare vehicle data for insertion
      const vehicleInsertData = {
        vin: vehicleData.vin,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        trim: vehicleData.trim,
        series: vehicleData.series,
        trim2: vehicleData.trim2,
        description: vehicleData.description,
        body_type: vehicleData.body_type,
        body_cab_type: vehicleData.body_cab_type,
        vehicle_type: vehicleData.vehicle_type,
        doors: vehicleData.doors,
        seats: vehicleData.seats,
        seat_rows: vehicleData.seat_rows,
        engine: vehicleData.engine,
        engine_configuration: vehicleData.engine_configuration,
        engine_cylinders: vehicleData.engine_cylinders,
        engine_hp: vehicleData.engine_hp,
        displacement_l: vehicleData.displacement_l,
        displacement_cc: vehicleData.displacement_cc,
        fuel_type: vehicleData.fuel_type,
        fuel_type_secondary: vehicleData.fuel_type_secondary,
        electrification_level: vehicleData.electrification_level,
        transmission: vehicleData.transmission,
        transmission_speeds: vehicleData.transmission_speeds,
        drivetrain: vehicleData.drivetrain,
        turbo: vehicleData.turbo,
        other_engine_info: vehicleData.other_engine_info,
        battery_info: vehicleData.battery_info,
        battery_type: vehicleData.battery_type,
        battery_kwh: vehicleData.battery_kwh,
        battery_v: vehicleData.battery_v,
        charger_level: vehicleData.charger_level,
        charger_power_kw: vehicleData.charger_power_kw,
        ev_drive_unit: vehicleData.ev_drive_unit,
        bed_length_in: vehicleData.bed_length_in,
        gvwr: vehicleData.gvwr,
        curb_weight_lb: vehicleData.curb_weight_lb,
        wheel_base_long: vehicleData.wheel_base_long,
        wheel_base_short: vehicleData.wheel_base_short,
        track_width: vehicleData.track_width,
        wheel_size_front: vehicleData.wheel_size_front,
        wheel_size_rear: vehicleData.wheel_size_rear,
        top_speed_mph: vehicleData.top_speed_mph,
        abs: vehicleData.abs,
        esc: vehicleData.esc,
        traction_control: vehicleData.traction_control,
        air_bag_loc_front: vehicleData.air_bag_loc_front,
        air_bag_loc_side: vehicleData.air_bag_loc_side,
        air_bag_loc_curtain: vehicleData.air_bag_loc_curtain,
        air_bag_loc_knee: vehicleData.air_bag_loc_knee,
        seat_belts_all: vehicleData.seat_belts_all,
        other_restraint_system_info: vehicleData.other_restraint_system_info,
        adaptive_cruise_control: vehicleData.adaptive_cruise_control,
        adaptive_headlights: vehicleData.adaptive_headlights,
        adaptive_driving_beam: vehicleData.adaptive_driving_beam,
        forward_collision_warning: vehicleData.forward_collision_warning,
        lane_departure_warning: vehicleData.lane_departure_warning,
        lane_keep_system: vehicleData.lane_keep_system,
        lane_centering_assistance: vehicleData.lane_centering_assistance,
        blind_spot_mon: vehicleData.blind_spot_mon,
        blind_spot_intervention: vehicleData.blind_spot_intervention,
        park_assist: vehicleData.park_assist,
        rear_visibility_system: vehicleData.rear_visibility_system,
        rear_cross_traffic_alert: vehicleData.rear_cross_traffic_alert,
        rear_automatic_emergency_braking: vehicleData.rear_automatic_emergency_braking,
        pedestrian_automatic_emergency_braking: vehicleData.pedestrian_automatic_emergency_braking,
        auto_reverse_system: vehicleData.auto_reverse_system,
        dynamic_brake_support: vehicleData.dynamic_brake_support,
        daytime_running_light: vehicleData.daytime_running_light,
        lower_beam_headlamp_light_source: vehicleData.lower_beam_headlamp_light_source,
        semiautomatic_headlamp_beam_switching: vehicleData.semiautomatic_headlamp_beam_switching,
        keyless_ignition: vehicleData.keyless_ignition,
        tpms: vehicleData.tpms,
        entertainment_system: vehicleData.entertainment_system,
        windows: vehicleData.windows,
        wheels: vehicleData.wheels,
        manufacturer: vehicleData.manufacturer,
        plant_city: vehicleData.plant_city,
        plant_state: vehicleData.plant_state,
        plant_country: vehicleData.plant_country,
        destination_market: vehicleData.destination_market,
        error_text: vehicleData.error_text,
        additional_error_text: vehicleData.additional_error_text,
        note: vehicleData.note,
        mileage: vehicleData.mileage || 0,
        color: vehicleData.color || 'Unknown',
        condition: vehicleData.condition || 'good',
        estimated_price: vehicleData.estimated_price || 0,
        location: vehicleData.location || 'Unknown',
        dealer_stock_number: vehicleData.dealer_stock_number,
        accident_history: vehicleData.accident_history,
        service_history: vehicleData.service_history,
        ownership_history: vehicleData.ownership_history,
        owner_count: vehicleData.owner_count || 1,
        title_issues: vehicleData.title_issues,
        odometer_issues: vehicleData.odometer_issues,
        last_reported_date: vehicleData.last_reported_date,
        features: vehicleData.features || [],
        source: vehicleData.source || 'our_inventory',
        source_request_id: vehicleData.source_request_id,
        contact_name: vehicleData.contact_name,
        contact_email: vehicleData.contact_email,
        contact_phone: vehicleData.contact_phone,
        submitted_at: vehicleData.submitted_at,
        approved_at: vehicleData.approved_at,
        status: vehicleData.status || 'available',
        views: vehicleData.views || 0,
        inquiries: vehicleData.inquiries || 0,
        is_featured: vehicleData.is_featured || false,
        created_at: vehicleData.created_at,
        updated_at: vehicleData.updated_at
      }
      
      // Insert vehicle data
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert(vehicleInsertData)
        .select('id')
        .single()
      
      if (vehicleError) {
        console.error('❌ Error adding vehicle:', vehicleError)
        return { success: false, error: 'Failed to add vehicle to database' }
      }
      
      console.log('✅ Vehicle added successfully with ID:', vehicle.id)
      
      // Add images if provided
      if (vehicleData.images && vehicleData.images.length > 0) {
        const imageData = vehicleData.images.map((image, index) => ({
          vehicle_id: vehicle.id,
          image_url: image.image_url,
          image_type: image.image_type || 'exterior',
          is_primary: image.is_primary || index === 0
        }))
        
        const { error: imageError } = await supabase
          .from('vehicle_images')
          .insert(imageData)
        
        if (imageError) {
          console.error('❌ Error adding images:', imageError)
          // Don't fail the whole operation if images fail
        } else {
          console.log('✅ Images added successfully')
        }
      }
      
      return { success: true, vehicleId: vehicle.id }
      
    } catch (error) {
      console.error('❌ Vehicle service error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }
  
  static async getVehicleByVIN(vin: string): Promise<{ success: boolean; vehicle?: any; error?: string }> {
    try {
      console.log('🔍 Searching for vehicle with VIN:', vin)
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('vin', vin)
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        return { success: false, error: error.message }
      }

      if (!data) {
        console.log('❌ No vehicle found with VIN:', vin)
        return { success: false, error: 'Vehicle not found' }
      }

      console.log('✅ Vehicle found:', data)
      return { success: true, vehicle: data }
    } catch (error) {
      console.error('❌ Error getting vehicle by VIN:', error)
      return { success: false, error: 'Failed to get vehicle' }
    }
  }

  static async getVehicleById(id: string | number): Promise<{ success: boolean; vehicle?: any; error?: string }> {
    try {
      console.log('🔍 Getting vehicle by ID:', id)
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Database error:', error)
        return { success: false, error: error.message }
      }

      if (!data) {
        console.log('❌ No vehicle found with ID:', id)
        return { success: false, error: 'Vehicle not found' }
      }

      console.log('✅ Vehicle found:', data)
      return { success: true, vehicle: data }
    } catch (error) {
      console.error('❌ Error getting vehicle by ID:', error)
      return { success: false, error: 'Failed to get vehicle' }
    }
  }
  
  // Get all vehicles with pagination
  static async getVehicles(page: number = 1, limit: number = 20, source?: 'our_inventory' | 'customer_submission' | 'all'): Promise<{ success: boolean; vehicles?: any[]; total?: number; error?: string }> {
    try {
      let query = supabase
        .from('vehicles')
        .select('*', { count: 'exact' })

      // Filter by source if specified
      if (source && source !== 'all') {
        query = query.eq('source', source)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) {
        console.error('Error fetching vehicles:', error)
        return { success: false, error: 'Failed to fetch vehicles' }
      }

      return {
        success: true,
        vehicles: data || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Error in getVehicles:', error)
      return { success: false, error: 'Failed to fetch vehicles' }
    }
  }

  // New method to get vehicles by source
  static async getVehiclesBySource(source: 'our_inventory' | 'customer_submission', page: number = 1, limit: number = 20): Promise<{ success: boolean; vehicles?: any[]; total?: number; error?: string }> {
    return this.getVehicles(page, limit, source)
  }

  // New method to get all vehicles (both sources)
  static async getAllVehicles(page: number = 1, limit: number = 20): Promise<{ success: boolean; vehicles?: any[]; total?: number; error?: string }> {
    return this.getVehicles(page, limit, 'all')
  }

  // New method to get vehicle statistics by source
  static async getVehicleStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      // Get total counts by source - include ALL vehicles regardless of status
      const { data: sourceStats, error: sourceError } = await supabase
        .from('vehicles')
        .select('source, status')

      if (sourceError) {
        console.error('Error fetching vehicle stats:', sourceError)
        return { success: false, error: 'Failed to fetch vehicle stats' }
      }

      console.log('📊 Raw vehicle stats data:', sourceStats)

      // Calculate stats
      const stats = {
        total: sourceStats?.length || 0,
        our_inventory: {
          total: sourceStats?.filter(v => v.source === 'our_inventory').length || 0,
          available: sourceStats?.filter(v => v.source === 'our_inventory' && v.status === 'available').length || 0,
          sourcing: sourceStats?.filter(v => v.source === 'our_inventory' && v.status === 'sourcing').length || 0,
          sold: sourceStats?.filter(v => v.source === 'our_inventory' && v.status === 'sold').length || 0,
          reserved: sourceStats?.filter(v => v.source === 'our_inventory' && v.status === 'reserved').length || 0
        },
        customer_submissions: {
          total: sourceStats?.filter(v => v.source === 'customer_submission').length || 0,
          available: sourceStats?.filter(v => v.source === 'customer_submission' && v.status === 'available').length || 0,
          sourcing: sourceStats?.filter(v => v.source === 'customer_submission' && v.status === 'sourcing').length || 0,
          sold: sourceStats?.filter(v => v.source === 'customer_submission' && v.status === 'sold').length || 0,
          reserved: sourceStats?.filter(v => v.source === 'customer_submission' && v.status === 'reserved').length || 0
        }
      }

      console.log('📊 Calculated stats:', stats)

      return { success: true, stats }
    } catch (error) {
      console.error('Error in getVehicleStats:', error)
      return { success: false, error: 'Failed to fetch vehicle stats' }
    }
  }
  
  // Update vehicle
  static async updateVehicle(id: string, vehicleData: Partial<VehicleData>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)

      if (error) {
        console.error('Error updating vehicle:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      return { success: false, error: 'Failed to update vehicle' }
    }
  }

  static async deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting vehicle:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      return { success: false, error: 'Failed to delete vehicle' }
    }
  }
  
  // Search vehicles
  static async searchVehicles(query: string): Promise<{ success: boolean; vehicles?: any[]; error?: string }> {
    try {
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .or(`make.ilike.%${query}%,model.ilike.%${query}%,vin.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) {
        return { success: false, error: 'Failed to search vehicles' }
      }
      
      return { success: true, vehicles }
      
    } catch (error) {
      console.error('❌ Error searching vehicles:', error)
      return { success: false, error: 'Internal server error' }
    }
  }
}

// Export a default instance for backward compatibility
export const vehicleService = VehicleService 