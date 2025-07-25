-- Manual Fix for Approved Sell Requests
-- Run this in your Supabase SQL Editor to manually add approved sell requests to vehicles

-- Step 1: Check what approved sell requests exist
SELECT 
  'APPROVED SELL REQUESTS' as info,
  id,
  make,
  model,
  year,
  status,
  submitted_at,
  reviewed_at,
  contact_name,
  contact_email,
  contact_phone
FROM sell_requests 
WHERE status = 'approved';

-- Step 2: Check if they already exist in vehicles table
SELECT 
  'EXISTING VEHICLES FOR APPROVED REQUESTS' as info,
  sr.id as sell_request_id,
  sr.make,
  sr.model,
  sr.year,
  v.id as vehicle_id,
  v.source,
  v.status as vehicle_status
FROM sell_requests sr
LEFT JOIN vehicles v ON sr.id = v.source_request_id
WHERE sr.status = 'approved';

-- Step 3: Insert missing vehicles (uncomment and run if step 2 shows missing vehicles)
-- This will add any approved sell requests that aren't in the vehicles table

/*
INSERT INTO vehicles (
  title,
  make,
  model,
  year,
  condition,
  mileage,
  description,
  location,
  images,
  features,
  status,
  source,
  source_request_id,
  vin,
  vin_data,
  contact_name,
  contact_email,
  contact_phone,
  submitted_at,
  approved_at,
  views,
  inquiries,
  is_featured,
  price,
  color,
  interior,
  trim,
  body_type,
  fuel_type,
  transmission
)
SELECT 
  CONCAT(year, ' ', make, ' ', model) as title,
  make,
  model,
  year,
  condition,
  mileage,
  COALESCE(description, '') as description,
  COALESCE(location, 'Unknown') as location,
  COALESCE(images, ARRAY[]::text[]) as images,
  ARRAY[]::text[] as features,
  'sourcing' as status,
  'customer_submission' as source,
  id as source_request_id,
  vin,
  vin_data,
  contact_name,
  contact_email,
  contact_phone,
  submitted_at,
  COALESCE(reviewed_at, NOW()) as approved_at,
  0 as views,
  0 as inquiries,
  false as is_featured,
  0 as price,
  NULL as color,
  NULL as interior,
  NULL as trim,
  NULL as body_type,
  NULL as fuel_type,
  NULL as transmission
FROM sell_requests 
WHERE status = 'approved' 
  AND id NOT IN (
    SELECT COALESCE(source_request_id, '00000000-0000-0000-0000-000000000000'::uuid)
    FROM vehicles 
    WHERE source_request_id IS NOT NULL
  );
*/

-- Step 4: Verify the fix worked
SELECT 
  'FINAL CHECK - ALL VEHICLES' as info,
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  source_request_id,
  contact_name,
  created_at
FROM vehicles 
ORDER BY created_at DESC; 