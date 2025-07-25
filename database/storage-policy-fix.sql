-- Fix Supabase Storage RLS Policies for vehicle-images bucket
-- This allows public uploads and downloads for the sell request process

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;

-- Create new policies for vehicle-images bucket
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

-- Also ensure the bucket exists and is public
-- Note: This should be run in Supabase Dashboard if bucket doesn't exist
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('vehicle-images', 'vehicle-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;

-- Grant necessary permissions
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;

-- Verify the policies
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
WHERE tablename = 'objects' AND schemaname = 'storage'; 