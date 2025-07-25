-- Fix Missing Approved Sell Request
-- Run this in your Supabase SQL Editor

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
  contact_phone,
  vin
FROM sell_requests 
WHERE status = 'approved';

-- Step 2: Check if any vehicles have the wrong source (should be customer_submission but are our_inventory)
SELECT 
  'VEHICLES WITH WRONG SOURCE' as info,
  v.id,
  v.title,
  v.make,
  v.model,
  v.year,
  v.source,
  v.status,
  v.source_request_id,
  sr.status as sell_request_status
FROM vehicles v
LEFT JOIN sell_requests sr ON v.source_request_id = sr.id
WHERE v.source = 'our_inventory' 
  AND v.source_request_id IS NOT NULL;

-- Step 3: Insert the missing approved sell request into vehicles table
-- (This will add any approved sell requests that aren't in the vehicles table)

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
  contact_name,
  contact_email,
  contact_phone,
  submitted_at,
  COALESCE(reviewed_at, NOW()) as approved_at,
  0 as views,
  0 as inquiries,
  false as is_featured,
  0 as price,
  'Unknown' as color,
  'Unknown' as interior,
  'Unknown' as trim,
  'Unknown' as body_type,
  'gasoline' as fuel_type,
  'automatic' as transmission
FROM sell_requests 
WHERE status = 'approved' 
  AND id NOT IN (
    SELECT COALESCE(source_request_id, '00000000-0000-0000-0000-000000000000'::uuid)
    FROM vehicles 
    WHERE source_request_id IS NOT NULL
  );

-- Step 4: Fix any vehicles that have the wrong source
UPDATE vehicles 
SET source = 'customer_submission' 
WHERE source_request_id IS NOT NULL 
  AND source != 'customer_submission';

-- Step 5: Verify the fix worked
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

-- Step 6: Check final counts
SELECT 
  'FINAL VEHICLE COUNTS BY SOURCE' as info,
  source,
  COUNT(*) as total_count,
  COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
  COUNT(CASE WHEN status = 'sourcing' THEN 1 END) as sourcing,
  COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold,
  COUNT(CASE WHEN status = 'reserved' THEN 1 END) as reserved
FROM vehicles 
GROUP BY source; 