-- Create sell_requests table for vehicle submission requests
CREATE TABLE IF NOT EXISTS sell_requests (
  id BIGSERIAL PRIMARY KEY,
  vin VARCHAR(17) NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  condition VARCHAR(50) NOT NULL,
  description TEXT,
  location VARCHAR(200) NOT NULL,
  images TEXT[], -- Array of image URLs
  vin_data JSONB, -- VIN validation data from NHTSA API
  contact_name VARCHAR(200) NOT NULL,
  contact_email VARCHAR(200) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  review_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sell_requests_status ON sell_requests(status);
CREATE INDEX IF NOT EXISTS idx_sell_requests_submitted_at ON sell_requests(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_sell_requests_vin ON sell_requests(vin);
CREATE INDEX IF NOT EXISTS idx_sell_requests_contact_email ON sell_requests(contact_email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sell_requests_updated_at 
    BEFORE UPDATE ON sell_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin can view all sell requests" ON sell_requests
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert sell requests" ON sell_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update sell requests" ON sell_requests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create storage bucket for vehicle images (if not exists)
-- Note: This needs to be run in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true);

-- Grant necessary permissions
GRANT ALL ON sell_requests TO authenticated;
GRANT USAGE ON SEQUENCE sell_requests_id_seq TO authenticated; 