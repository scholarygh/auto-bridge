-- Simplify sell_requests table access
-- Disable RLS to allow public submissions (since we're using local admin auth)

-- Disable Row Level Security for sell_requests table
ALTER TABLE public.sell_requests DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can submit sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Public can view own sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Authenticated users can view all sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Authenticated users can update sell requests" ON public.sell_requests;
DROP POLICY IF EXISTS "Authenticated users can delete sell requests" ON public.sell_requests;

-- Grant all permissions to both roles
GRANT ALL ON public.sell_requests TO authenticated;
GRANT ALL ON public.sell_requests TO anon;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'sell_requests' AND schemaname = 'public';

-- Test insert (this should work now)
-- INSERT INTO public.sell_requests (vin, make, model, year, mileage, condition, location, contact_name, contact_email, contact_phone)
-- VALUES ('TEST12345678901234', 'Test', 'Model', 2020, 50000, 'good', 'Test Location', 'Test User', 'test@example.com', '1234567890'); 