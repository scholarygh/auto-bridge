-- Check the integration between sell_requests and vehicles
-- Run this in your Supabase SQL Editor to verify the data

-- 1. Check all sell requests and their status
SELECT 
  id,
  make,
  model,
  year,
  status,
  submitted_at,
  reviewed_at
FROM sell_requests 
ORDER BY submitted_at DESC;

-- 2. Check all vehicles and their source
SELECT 
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  created_at,
  source_request_id
FROM vehicles 
ORDER BY created_at DESC;

-- 3. Check specifically for customer submissions
SELECT 
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  contact_name,
  contact_email,
  source_request_id,
  created_at
FROM vehicles 
WHERE source = 'customer_submission'
ORDER BY created_at DESC;

-- 4. Check if there are any approved sell requests that don't have corresponding vehicles
SELECT 
  sr.id,
  sr.make,
  sr.model,
  sr.year,
  sr.status,
  sr.submitted_at,
  sr.reviewed_at
FROM sell_requests sr
LEFT JOIN vehicles v ON sr.id = v.source_request_id
WHERE sr.status = 'approved' 
  AND v.id IS NULL;

-- 5. Check the count of vehicles by source
SELECT 
  source,
  COUNT(*) as count,
  COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
  COUNT(CASE WHEN status = 'sourcing' THEN 1 END) as sourcing,
  COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold
FROM vehicles 
GROUP BY source; 