-- Fix RLS policies for sell_requests table
-- This allows public users to submit sell requests while maintaining security

-- First, let's see what policies currently exist
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
WHERE tablename = 'sell_requests' AND schemaname = 'public';

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Public can submit sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Authenticated users can view sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Authenticated users can update sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Authenticated users can delete sell requests" ON public.sell_requests;

-- Create new policies that work with our admin system
-- Allow public to insert (for form submissions)
CREATE POLICY "Public can submit sell requests" ON public.sell_requests
FOR INSERT WITH CHECK (true);

-- Allow public to view their own submissions (by email)
CREATE POLICY "Public can view own sell requests" ON public.sell_requests
FOR SELECT USING (contact_email = current_setting('request.jwt.claims', true)::json->>'email' OR auth.role() = 'authenticated');

-- Allow authenticated users to view all (admin access)
CREATE POLICY "Authenticated users can view all sell requests" ON public.sell_requests
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update (admin access)
CREATE POLICY "Authenticated users can update sell requests" ON public.sell_requests
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete (admin access)
CREATE POLICY "Authenticated users can delete sell requests" ON public.sell_requests
FOR DELETE USING (auth.role() = 'authenticated');

-- Alternative: If the above still doesn't work, disable RLS temporarily
-- ALTER TABLE public.sell_requests DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to both roles
GRANT ALL ON public.sell_requests TO authenticated;
GRANT ALL ON public.sell_requests TO anon;

-- Verify the new policies
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
WHERE tablename = 'sell_requests' AND schemaname = 'public'
ORDER BY policyname; 