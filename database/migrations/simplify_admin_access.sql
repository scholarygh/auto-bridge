-- Simplify Admin Access - Remove Restrictive RLS Policies
-- Run this in your Supabase SQL editor to fix admin access issues

-- First, drop all existing policies on vehicles table
DROP POLICY IF EXISTS "Admin full access" ON vehicles;
DROP POLICY IF EXISTS "Public view available vehicles" ON vehicles;
DROP POLICY IF EXISTS "Authenticated view access" ON vehicles;
DROP POLICY IF EXISTS "Allow inserts for development" ON vehicles;
DROP POLICY IF EXISTS "Allow updates for development" ON vehicles;

-- Disable RLS completely for admin-only access
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;

-- Grant full access to authenticated users (admin)
GRANT ALL ON vehicles TO authenticated;
GRANT ALL ON vehicles TO anon;

-- Create a simple view for public vehicle listings (available vehicles only)
-- This is what customers will see
DROP VIEW IF EXISTS public_vehicles;
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