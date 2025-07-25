// Comprehensive Vehicle Type Definition
// Matches the complete database schema with NHTSA integration

export interface Vehicle {
  // Basic Identification
  id: string;
  vin: string;
  title: string;
  
  // Basic Vehicle Info
  make: string;
  model: string;
  year: number;
  trim?: string;
  body_type?: string;
  
  // Pricing & Condition
  price: number;
  original_price?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Technical Specifications
  mileage: number;
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen';
  transmission: 'automatic' | 'manual' | 'cvt' | 'semi-automatic';
  engine_type?: string;
  engine_size?: string;
  cylinders?: number;
  horsepower?: number;
  torque?: number;
  
  // Exterior & Interior
  color: string;
  interior?: string;
  doors?: number;
  seats?: number;
  
  // NHTSA Safety & Technical Data
  manufacturer?: string;
  plant_city?: string;
  plant_state?: string;
  plant_country?: string;
  vehicle_type?: string;
  body_class?: string;
  gross_vehicle_weight_rating?: number;
  brake_system_type?: string;
  brake_system_desc?: string;
  steering_type?: string;
  steering_control?: string;
  tire_pressure_monitoring_type?: string;
  anti_brake_system?: string;
  traction_control?: string;
  stability_control?: string;
  auto_reverse_system?: string;
  daytime_running_light?: string;
  adaptive_cruise_control?: string;
  adaptive_headlights?: string;
  automatic_emergency_braking?: string;
  blind_spot_monitoring?: string;
  lane_departure_warning?: string;
  lane_keeping_assist?: string;
  forward_collision_warning?: string;
  rear_cross_traffic_alert?: string;
  rear_view_camera?: string;
  parking_sensors?: string;
  
  // Fuel & Emissions
  fuel_efficiency_city?: number;
  fuel_efficiency_highway?: number;
  fuel_efficiency_combined?: number;
  fuel_tank_capacity?: number;
  co2_emissions?: number;
  
  // Dimensions & Capacity
  wheelbase?: number;
  length?: number;
  width?: number;
  height?: number;
  curb_weight?: number;
  cargo_capacity?: number;
  towing_capacity?: number;
  
  // Location & Status
  location: string;
  status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'sourcing';
  
  // Media & Content
  images: string[];
  features: string[];
  description: string;
  
  // Analytics & Marketing
  views: number;
  inquiries: number;
  is_featured: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Vehicle creation/update form type (for admin forms)
export interface VehicleFormData {
  // Basic Identification
  vin: string;
  title: string;
  
  // Basic Vehicle Info
  make: string;
  model: string;
  year: number;
  trim?: string;
  body_type?: string;
  
  // Pricing & Condition
  price: number;
  original_price?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Technical Specifications
  mileage: number;
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen';
  transmission: 'automatic' | 'manual' | 'cvt' | 'semi-automatic';
  engine_type?: string;
  engine_size?: string;
  cylinders?: number;
  horsepower?: number;
  torque?: number;
  
  // Exterior & Interior
  color: string;
  interior?: string;
  doors?: number;
  seats?: number;
  
  // NHTSA Safety & Technical Data
  manufacturer?: string;
  plant_city?: string;
  plant_state?: string;
  plant_country?: string;
  vehicle_type?: string;
  body_class?: string;
  gross_vehicle_weight_rating?: number;
  brake_system_type?: string;
  brake_system_desc?: string;
  steering_type?: string;
  steering_control?: string;
  tire_pressure_monitoring_type?: string;
  anti_brake_system?: string;
  traction_control?: string;
  stability_control?: string;
  auto_reverse_system?: string;
  daytime_running_light?: string;
  adaptive_cruise_control?: string;
  adaptive_headlights?: string;
  automatic_emergency_braking?: string;
  blind_spot_monitoring?: string;
  lane_departure_warning?: string;
  lane_keeping_assist?: string;
  forward_collision_warning?: string;
  rear_cross_traffic_alert?: string;
  rear_view_camera?: string;
  parking_sensors?: string;
  
  // Fuel & Emissions
  fuel_efficiency_city?: number;
  fuel_efficiency_highway?: number;
  fuel_efficiency_combined?: number;
  fuel_tank_capacity?: number;
  co2_emissions?: number;
  
  // Dimensions & Capacity
  wheelbase?: number;
  length?: number;
  width?: number;
  height?: number;
  curb_weight?: number;
  cargo_capacity?: number;
  towing_capacity?: number;
  
  // Location & Status
  location: string;
  status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'sourcing';
  
  // Media & Content
  images: File[];
  features: string[];
  description: string;
  
  // Marketing
  is_featured: boolean;
}

// Vehicle search/filter type
export interface VehicleFilters {
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  fuel_type?: string[];
  transmission?: string[];
  body_type?: string[];
  condition?: string[];
  location?: string;
  status?: string[];
  is_featured?: boolean;
}

// NHTSA API response type
export interface NHTSAResponse {
  Count: number;
  Message: string;
  Results: NHTSAResult[];
}

export interface NHTSAResult {
  Variable: string;
  Value: string;
  ValueId: string;
  VariableId: number;
}

// Vehicle statistics type
export interface VehicleStats {
  total_vehicles: number;
  available_vehicles: number;
  sold_vehicles: number;
  total_views: number;
  total_inquiries: number;
  average_price: number;
  featured_vehicles: number;
}

// Vehicle image upload response
export interface ImageUploadResponse {
  url: string;
  path: string;
  size: number;
}

// Vehicle API response wrapper
export interface VehicleApiResponse {
  success: boolean;
  data?: Vehicle | Vehicle[];
  error?: string;
  message?: string;
} 