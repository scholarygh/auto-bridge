-- Create sell_requests table for vehicle submissions
-- This table stores submissions from the "Sell Your Car" form

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

-- Create RLS policies
-- Allow public to insert (for form submissions)
CREATE POLICY "Public can submit sell requests" ON public.sell_requests
FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view all (admin access)
CREATE POLICY "Authenticated users can view sell requests" ON public.sell_requests
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update (admin access)
CREATE POLICY "Authenticated users can update sell requests" ON public.sell_requests
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete (admin access)
CREATE POLICY "Authenticated users can delete sell requests" ON public.sell_requests
FOR DELETE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON public.sell_requests TO authenticated;
GRANT ALL ON public.sell_requests TO anon;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sell_requests_updated_at 
    BEFORE UPDATE ON public.sell_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'sell_requests' 
ORDER BY ordinal_position; 