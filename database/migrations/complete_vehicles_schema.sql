-- Complete Vehicle Database Schema with NHTSA Integration
-- Run this migration in your Supabase SQL editor to update the vehicles table

-- First, drop the existing vehicles table if it exists
DROP TABLE IF EXISTS vehicles CASCADE;

-- Create the comprehensive vehicles table with all NHTSA fields
CREATE TABLE vehicles (
  -- Basic Identification
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vin VARCHAR(17) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  
  -- Basic Vehicle Info
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  trim VARCHAR(100),
  body_type VARCHAR(50),
  
  -- Pricing & Condition
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(12,2) CHECK (original_price >= 0),
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'excellent',
  
  -- Technical Specifications
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'plug-in hybrid', 'hydrogen')) DEFAULT 'gasoline',
  transmission VARCHAR(20) CHECK (transmission IN ('automatic', 'manual', 'cvt', 'semi-automatic')) DEFAULT 'automatic',
  engine_type VARCHAR(50),
  engine_size VARCHAR(20),
  cylinders INTEGER,
  horsepower INTEGER,
  torque INTEGER,
  
  -- Exterior & Interior
  color VARCHAR(50) NOT NULL,
  interior VARCHAR(50),
  doors INTEGER,
  seats INTEGER,
  
  -- NHTSA Safety & Technical Data
  manufacturer VARCHAR(100),
  plant_city VARCHAR(100),
  plant_state VARCHAR(50),
  plant_country VARCHAR(50),
  vehicle_type VARCHAR(50),
  body_class VARCHAR(50),
  gross_vehicle_weight_rating INTEGER,
  brake_system_type VARCHAR(50),
  brake_system_desc VARCHAR(100),
  steering_type VARCHAR(50),
  steering_control VARCHAR(50),
  tire_pressure_monitoring_type VARCHAR(50),
  anti_brake_system VARCHAR(10),
  traction_control VARCHAR(10),
  stability_control VARCHAR(10),
  auto_reverse_system VARCHAR(10),
  daytime_running_light VARCHAR(10),
  adaptive_cruise_control VARCHAR(10),
  adaptive_headlights VARCHAR(10),
  automatic_emergency_braking VARCHAR(10),
  blind_spot_monitoring VARCHAR(10),
  lane_departure_warning VARCHAR(10),
  lane_keeping_assist VARCHAR(10),
  forward_collision_warning VARCHAR(10),
  rear_cross_traffic_alert VARCHAR(10),
  rear_view_camera VARCHAR(10),
  parking_sensors VARCHAR(10),
  
  -- Fuel & Emissions
  fuel_efficiency_city DECIMAL(5,2),
  fuel_efficiency_highway DECIMAL(5,2),
  fuel_efficiency_combined DECIMAL(5,2),
  fuel_tank_capacity DECIMAL(5,2),
  co2_emissions INTEGER,
  
  -- Dimensions & Capacity
  wheelbase DECIMAL(6,2),
  length DECIMAL(6,2),
  width DECIMAL(6,2),
  height DECIMAL(6,2),
  curb_weight INTEGER,
  cargo_capacity DECIMAL(6,2),
  towing_capacity INTEGER,
  
  -- Location & Status
  location VARCHAR(200) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('available', 'reserved', 'sold', 'maintenance', 'sourcing')) DEFAULT 'available',
  
  -- Media & Content
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  
  -- Analytics & Marketing
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  inquiries INTEGER DEFAULT 0 CHECK (inquiries >= 0),
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for optimal performance
CREATE INDEX idx_vehicles_make ON vehicles(make);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_location ON vehicles(location);
CREATE INDEX idx_vehicles_condition ON vehicles(condition);
CREATE INDEX idx_vehicles_fuel_type ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_transmission ON vehicles(transmission);
CREATE INDEX idx_vehicles_body_type ON vehicles(body_type);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX idx_vehicles_is_featured ON vehicles(is_featured);
CREATE INDEX idx_vehicles_views ON vehicles(views DESC);
CREATE INDEX idx_vehicles_inquiries ON vehicles(inquiries DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vehicles_updated_at 
  BEFORE UPDATE ON vehicles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create functions for incrementing views and inquiries
CREATE OR REPLACE FUNCTION increment_vehicle_views(vehicle_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE vehicles 
  SET views = COALESCE(views, 0) + 1 
  WHERE id = vehicle_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_vehicle_inquiries(vehicle_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE vehicles 
  SET inquiries = COALESCE(inquiries, 0) + 1 
  WHERE id = vehicle_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for different access levels
-- Allow inserts for development (temporary)
CREATE POLICY "Allow inserts for development" ON vehicles
  FOR INSERT WITH CHECK (true);

-- Admin can do everything
CREATE POLICY "Admin full access" ON vehicles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Public can view available vehicles
CREATE POLICY "Public view available vehicles" ON vehicles
  FOR SELECT USING (status = 'available');

-- Authenticated users can view all vehicles but not modify
CREATE POLICY "Authenticated view access" ON vehicles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample data with comprehensive NHTSA fields
INSERT INTO vehicles (
  title, make, model, year, trim, body_type, price, original_price, condition, mileage,
  fuel_type, transmission, engine_type, engine_size, cylinders, horsepower, torque,
  color, interior, doors, seats, vin, location, status,
  manufacturer, plant_city, plant_state, plant_country, vehicle_type, body_class,
  gross_vehicle_weight_rating, brake_system_type, steering_type, anti_brake_system,
  traction_control, stability_control, fuel_efficiency_city, fuel_efficiency_highway,
  fuel_efficiency_combined, wheelbase, length, width, height, curb_weight,
  images, features, description, views, inquiries, is_featured
) VALUES 
(
  '2023 BMW X5 xDrive40i - Luxury SUV',
  'BMW', 'X5', 2023, 'xDrive40i', 'SUV', 85000.00, 89000.00, 'excellent', 15000,
  'gasoline', 'automatic', 'TwinPower Turbo', '3.0L', 6, 335, 330,
  'Alpine White', 'Black', 5, 7, 'WBA5A7C50FD123456', 'Accra, Ghana', 'available',
  'BMW of North America, LLC', 'Spartanburg', 'SC', 'UNITED STATES (USA)', 'MULTIPURPOSE PASSENGER VEHICLE (MPV)', 'Sport Utility Vehicle (SUV)',
  6000, 'Hydraulic', 'Power', 'Standard', 'Standard', 'Standard',
  20.5, 25.8, 22.8, 117.1, 194.3, 78.9, 68.6, 4820,
  ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'],
  ARRAY['Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Sunroof', 'Adaptive Cruise Control', 'Lane Departure Warning', 'Forward Collision Warning'],
  'Excellent condition BMW X5 with full service history. One owner, no accidents. Premium luxury SUV with advanced safety features and cutting-edge technology.',
  45, 8, true
),
(
  '2024 Mercedes C-Class C 300 - Premium Sedan',
  'Mercedes', 'C-Class', 2024, 'C 300', 'Sedan', 72000.00, 75000.00, 'excellent', 8000,
  'gasoline', 'automatic', 'Turbo', '2.0L', 4, 255, 295,
  'Obsidian Black', 'Cream', 4, 5, 'WDDWF4HB0FR789012', 'Kumasi, Ghana', 'reserved',
  'Mercedes-Benz USA, LLC', 'Bremen', 'Bremen', 'GERMANY', 'PASSENGER CAR', 'Sedan',
  4500, 'Hydraulic', 'Power', 'Standard', 'Standard', 'Standard',
  23.5, 32.1, 27.2, 111.8, 187.0, 71.6, 56.8, 3780,
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop'],
  ARRAY['AMG Package', 'Premium Sound', 'Heated Seats', 'LED Headlights', 'Blind Spot Monitoring', 'Lane Keeping Assist', 'Automatic Emergency Braking'],
  'Brand new Mercedes C-Class with AMG styling package. Premium features included with advanced driver assistance systems.',
  32, 5, false
),
(
  '2022 Toyota Camry XSE - Reliable Sedan',
  'Toyota', 'Camry', 2022, 'XSE', 'Sedan', 45000.00, 48000.00, 'good', 25000,
  'gasoline', 'automatic', 'Dynamic Force', '2.5L', 4, 203, 184,
  'Midnight Black', 'Black', 4, 5, '4T1B11HK5KU123456', 'Accra, Ghana', 'available',
  'Toyota Motor Manufacturing, Kentucky, Inc.', 'Georgetown', 'KY', 'UNITED STATES (USA)', 'PASSENGER CAR', 'Sedan',
  4300, 'Hydraulic', 'Power', 'Standard', 'Standard', 'Standard',
  28.0, 39.0, 32.0, 111.2, 192.1, 72.4, 56.9, 3310,
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'],
  ARRAY['Sport Package', 'JBL Audio', 'Safety Sense 2.0', 'Smart Key', 'Rear Cross Traffic Alert', 'Parking Sensors', 'Rear View Camera'],
  'Well-maintained Toyota Camry with low mileage. Great fuel efficiency and reliability. Advanced safety features included.',
  28, 3, false
);

-- Grant permissions
GRANT ALL ON vehicles TO authenticated;
GRANT SELECT ON vehicles TO anon;

-- Create a view for public vehicle listings (available vehicles only)
CREATE VIEW public_vehicles AS
SELECT 
  id, title, make, model, year, trim, body_type, price, condition, mileage,
  fuel_type, transmission, color, interior, location, images, features, description,
  views, inquiries, is_featured, created_at
FROM vehicles 
WHERE status = 'available';

-- Grant access to the public view
GRANT SELECT ON public_vehicles TO anon;
GRANT SELECT ON public_vehicles TO authenticated; 