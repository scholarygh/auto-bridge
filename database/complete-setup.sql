-- Complete Database Setup for Auto-Bridge
-- This script sets up all necessary tables and storage policies

-- ========================================
-- 1. CREATE SELL_REQUESTS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.sell_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Vehicle Information
  vin TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  description TEXT DEFAULT '',
  location TEXT NOT NULL,
  
  -- Images and VIN Data
  images TEXT[] DEFAULT '{}',
  vin_data JSONB DEFAULT '{}',
  
  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  
  -- Status and Timestamps
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'contacted')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  
  -- Additional fields
  estimated_value DECIMAL(10,2),
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sell_requests_status ON public.sell_requests(status);
CREATE INDEX IF NOT EXISTS idx_sell_requests_submitted_at ON public.sell_requests(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_sell_requests_vin ON public.sell_requests(vin);
CREATE INDEX IF NOT EXISTS idx_sell_requests_contact_email ON public.sell_requests(contact_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sell_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sell_requests
CREATE POLICY "Public can submit sell requests" ON public.sell_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view sell requests" ON public.sell_requests
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sell requests" ON public.sell_requests
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sell requests" ON public.sell_requests
FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions for sell_requests
GRANT ALL ON public.sell_requests TO authenticated;
GRANT ALL ON public.sell_requests TO anon;

-- ========================================
-- 2. SETUP STORAGE BUCKET AND POLICIES
-- ========================================

-- Create vehicle-images bucket
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

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Public can view" ON storage.objects;

-- Create comprehensive storage policies for vehicle-images
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Public upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Public update access" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-images');

CREATE POLICY "Public delete access" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-images');

-- Grant storage permissions
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO authenticated;

-- ========================================
-- 3. CREATE UPDATED_AT TRIGGER FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sell_requests
DROP TRIGGER IF EXISTS update_sell_requests_updated_at ON public.sell_requests;
CREATE TRIGGER update_sell_requests_updated_at 
    BEFORE UPDATE ON public.sell_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 4. VERIFICATION QUERIES
-- ========================================

-- Verify sell_requests table
SELECT 
  'sell_requests table created successfully' as status,
  COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'sell_requests';

-- Verify storage bucket
SELECT 
  'vehicle-images bucket configured' as status,
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id = 'vehicle-images';

-- Verify storage policies
SELECT 
  'Storage policies created' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Show all created policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE (tablename = 'objects' AND schemaname = 'storage')
   OR (tablename = 'sell_requests' AND schemaname = 'public')
ORDER BY schemaname, tablename, policyname; 