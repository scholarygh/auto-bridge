-- Fix approved sell requests that weren't added to vehicles table
-- Run this in your Supabase SQL Editor

-- 1. First, let's see what approved sell requests exist
SELECT 
  id,
  make,
  model,
  year,
  status,
  submitted_at,
  reviewed_at,
  contact_name,
  contact_email
FROM sell_requests 
WHERE status = 'approved'
ORDER BY submitted_at DESC;

-- 2. Check if any approved sell requests are missing from vehicles table
SELECT 
  sr.id as sell_request_id,
  sr.make,
  sr.model,
  sr.year,
  sr.status as sell_request_status,
  sr.submitted_at,
  sr.reviewed_at,
  v.id as vehicle_id,
  v.source as vehicle_source
FROM sell_requests sr
LEFT JOIN vehicles v ON sr.id = v.source_request_id
WHERE sr.status = 'approved' 
  AND v.id IS NULL;

-- 3. If there are missing vehicles, manually insert them
-- (Uncomment and run this section if step 2 shows missing vehicles)

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
  price
)
SELECT 
  CONCAT(year, ' ', make, ' ', model) as title,
  make,
  model,
  year,
  condition,
  mileage,
  description,
  location,
  images,
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
  reviewed_at as approved_at,
  0 as views,
  0 as inquiries,
  false as is_featured,
  0 as price
FROM sell_requests 
WHERE status = 'approved' 
  AND id NOT IN (
    SELECT source_request_id 
    FROM vehicles 
    WHERE source_request_id IS NOT NULL
  );
*/

-- 4. Update any vehicles that might have wrong source
UPDATE vehicles 
SET source = 'customer_submission' 
WHERE source_request_id IS NOT NULL 
  AND source != 'customer_submission';

-- 5. Update any vehicles that might have wrong source (our inventory)
UPDATE vehicles 
SET source = 'our_inventory' 
WHERE source_request_id IS NULL 
  AND source != 'our_inventory';

-- 6. Final check - show all vehicles with their sources
SELECT 
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  source_request_id,
  created_at
FROM vehicles 
ORDER BY created_at DESC; 