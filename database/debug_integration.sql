-- Debug Integration Issues
-- Run this in your Supabase SQL Editor to see what's happening

-- 1. Check all sell requests
SELECT 
  'SELL REQUESTS' as table_name,
  id,
  make,
  model,
  year,
  status,
  submitted_at,
  reviewed_at,
  contact_name
FROM sell_requests 
ORDER BY submitted_at DESC;

-- 2. Check all vehicles
SELECT 
  'VEHICLES' as table_name,
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

-- 3. Check specifically for approved sell requests
SELECT 
  'APPROVED SELL REQUESTS' as table_name,
  sr.id as sell_request_id,
  sr.make,
  sr.model,
  sr.year,
  sr.status,
  sr.submitted_at,
  sr.reviewed_at,
  v.id as vehicle_id,
  v.source as vehicle_source,
  v.status as vehicle_status
FROM sell_requests sr
LEFT JOIN vehicles v ON sr.id = v.source_request_id
WHERE sr.status = 'approved'
ORDER BY sr.submitted_at DESC;

-- 4. Check for any vehicles with customer_submission source
SELECT 
  'CUSTOMER SUBMISSIONS IN VEHICLES' as table_name,
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
WHERE source = 'customer_submission'
ORDER BY created_at DESC;

-- 5. Check for any vehicles with NULL source (should be fixed)
SELECT 
  'VEHICLES WITH NULL SOURCE' as table_name,
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  created_at
FROM vehicles 
WHERE source IS NULL
ORDER BY created_at DESC;

-- 6. Count vehicles by source
SELECT 
  'VEHICLE COUNTS BY SOURCE' as table_name,
  source,
  COUNT(*) as total_count,
  COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
  COUNT(CASE WHEN status = 'sourcing' THEN 1 END) as sourcing,
  COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold,
  COUNT(CASE WHEN status = 'reserved' THEN 1 END) as reserved
FROM vehicles 
GROUP BY source; 