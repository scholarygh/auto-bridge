-- Add source tracking fields to vehicles table
-- This allows us to distinguish between our own inventory and customer submissions

ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'our_inventory',
ADD COLUMN IF NOT EXISTS source_request_id UUID REFERENCES sell_requests(id),
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Add index for better performance when filtering by source
CREATE INDEX IF NOT EXISTS idx_vehicles_source ON vehicles(source);
CREATE INDEX IF NOT EXISTS idx_vehicles_source_request_id ON vehicles(source_request_id);

-- Update existing vehicles to have 'our_inventory' as source
UPDATE vehicles SET source = 'our_inventory' WHERE source IS NULL;

-- Add comment to explain the source field
COMMENT ON COLUMN vehicles.source IS 'Source of the vehicle: our_inventory (our own cars) or customer_submission (approved customer submissions)';
COMMENT ON COLUMN vehicles.source_request_id IS 'Reference to the original sell request if this vehicle came from a customer submission'; 