-- Fix Supabase Storage RLS Policies for vehicle-images bucket
-- Run this in your Supabase SQL Editor

-- First, ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images', 
  'vehicle-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Drop all existing policies on storage.objects
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Public can view" ON storage.objects;

-- Create comprehensive policies for vehicle-images bucket
-- Allow public read access to vehicle-images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

-- Allow public upload access to vehicle-images (for sell requests)
CREATE POLICY "Public upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');

-- Allow public update access to vehicle-images
CREATE POLICY "Public update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-images');

-- Allow public delete access to vehicle-images
CREATE POLICY "Public delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-images');

-- Grant necessary permissions to all roles
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO authenticated;

-- Verify the bucket configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'vehicle-images';

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname; 