-- Test Status Updates
-- Run this in your Supabase SQL Editor to verify status changes work

-- 1. Check current vehicle statuses
SELECT 
  'CURRENT VEHICLE STATUSES' as info,
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  created_at
FROM vehicles 
ORDER BY created_at DESC;

-- 2. Test updating a vehicle status (replace with actual vehicle ID)
-- Uncomment and run this to test status updates
/*
UPDATE vehicles 
SET status = 'available' 
WHERE id = 'your-vehicle-id-here' 
  AND status != 'available';

-- Check if the update worked
SELECT 
  'AFTER STATUS UPDATE' as info,
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  updated_at
FROM vehicles 
WHERE id = 'your-vehicle-id-here';
*/

-- 3. Check all possible status values in the database
SELECT 
  'ALL STATUS VALUES IN DATABASE' as info,
  status,
  COUNT(*) as count
FROM vehicles 
GROUP BY status
ORDER BY count DESC;

-- 4. Check status changes by source
SELECT 
  'STATUS BY SOURCE' as info,
  source,
  status,
  COUNT(*) as count
FROM vehicles 
GROUP BY source, status
ORDER BY source, status;

-- 5. Test constraint validation
-- This should work without errors
UPDATE vehicles 
SET status = 'available' 
WHERE status = 'sourcing' 
LIMIT 1;

-- 6. Check if the test update worked
SELECT 
  'TEST UPDATE RESULT' as info,
  id,
  title,
  make,
  model,
  year,
  source,
  status,
  updated_at
FROM vehicles 
WHERE updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY updated_at DESC; 