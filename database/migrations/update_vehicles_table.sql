-- Update vehicles table with comprehensive fields
-- Run this migration in your Supabase SQL editor

-- First, drop the existing vehicles table if it exists
DROP TABLE IF EXISTS vehicles CASCADE;

-- Create the new vehicles table with comprehensive fields
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  trim VARCHAR(100),
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(12,2) CHECK (original_price >= 0),
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'excellent',
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')) DEFAULT 'gasoline',
  transmission VARCHAR(20) CHECK (transmission IN ('automatic', 'manual')) DEFAULT 'automatic',
  color VARCHAR(50) NOT NULL,
  interior VARCHAR(50),
  vin VARCHAR(17) NOT NULL UNIQUE,
  location VARCHAR(200) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('available', 'reserved', 'sold', 'maintenance')) DEFAULT 'available',
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  inquiries INTEGER DEFAULT 0 CHECK (inquiries >= 0),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_make ON vehicles(make);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX idx_vehicles_is_featured ON vehicles(is_featured);

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
CREATE OR REPLACE FUNCTION increment_views()
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(views, 0) + 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_inquiries()
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(inquiries, 0) + 1;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for different access levels
-- Admin can do everything
CREATE POLICY "Admin full access" ON vehicles
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Public can view available vehicles
CREATE POLICY "Public view available vehicles" ON vehicles
  FOR SELECT USING (status = 'available');

-- Insert some sample data
INSERT INTO vehicles (
  make, model, year, trim, price, original_price, condition, mileage,
  fuel_type, transmission, color, interior, vin, location, status,
  images, features, description, views, inquiries, is_featured
) VALUES 
(
  'BMW', 'X5', 2023, 'xDrive40i', 85000.00, 89000.00, 'excellent', 15000,
  'gasoline', 'automatic', 'Alpine White', 'Black', 'WBA5A7C50FD123456', 'Accra, Ghana', 'available',
  ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop'],
  ARRAY['Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Sunroof'],
  'Excellent condition BMW X5 with full service history. One owner, no accidents.',
  45, 8, true
),
(
  'Mercedes', 'C-Class', 2024, 'C 300', 72000.00, 75000.00, 'excellent', 8000,
  'gasoline', 'automatic', 'Obsidian Black', 'Cream', 'WDDWF4HB0FR789012', 'Kumasi, Ghana', 'reserved',
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop'],
  ARRAY['AMG Package', 'Premium Sound', 'Heated Seats', 'LED Headlights'],
  'Brand new Mercedes C-Class with AMG styling package. Premium features included.',
  32, 5, false
),
(
  'Toyota', 'Camry', 2022, 'XSE', 45000.00, 48000.00, 'good', 25000,
  'gasoline', 'automatic', 'Midnight Black', 'Black', '4T1B11HK5KU123456', 'Accra, Ghana', 'available',
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'],
  ARRAY['Sport Package', 'JBL Audio', 'Safety Sense 2.0', 'Smart Key'],
  'Well-maintained Toyota Camry with low mileage. Great fuel efficiency and reliability.',
  28, 3, false
);

-- Grant permissions
GRANT ALL ON vehicles TO authenticated;
GRANT SELECT ON vehicles TO anon; 