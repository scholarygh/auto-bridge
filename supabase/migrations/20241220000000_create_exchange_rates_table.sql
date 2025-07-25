-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  currency_from VARCHAR(3) NOT NULL DEFAULT 'USD',
  currency_to VARCHAR(3) NOT NULL DEFAULT 'GHS',
  rate DECIMAL(10,4) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Insert default exchange rate
INSERT INTO exchange_rates (currency_from, currency_to, rate, is_active, notes) 
VALUES ('USD', 'GHS', 10.45, true, 'Default exchange rate - USD to Ghana Cedis');

-- Create index for active rates
CREATE INDEX idx_exchange_rates_active ON exchange_rates(is_active);

-- Create unique constraint for active rates per currency pair
CREATE UNIQUE INDEX idx_exchange_rates_unique_active 
ON exchange_rates(currency_from, currency_to) 
WHERE is_active = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_exchange_rates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_exchange_rates_updated_at
  BEFORE UPDATE ON exchange_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_exchange_rates_updated_at();

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to exchange rates" ON exchange_rates
  FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage exchange rates" ON exchange_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Create function to get current exchange rate
CREATE OR REPLACE FUNCTION get_current_exchange_rate(
  p_currency_from VARCHAR(3) DEFAULT 'USD',
  p_currency_to VARCHAR(3) DEFAULT 'GHS'
)
RETURNS DECIMAL(10,4) AS $$
DECLARE
  current_rate DECIMAL(10,4);
BEGIN
  SELECT rate INTO current_rate
  FROM exchange_rates
  WHERE currency_from = p_currency_from
    AND currency_to = p_currency_to
    AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(current_rate, 10.45); -- Fallback to 10.45 if no rate found
END;
$$ LANGUAGE plpgsql; 