-- Update exchange rate to current market rate (July 2025)
-- Current rate: 1 USD = 10.88 GHS

-- First, deactivate all existing rates
UPDATE exchange_rates 
SET is_active = false 
WHERE currency_from = 'USD' AND currency_to = 'GHS';

-- Insert new current rate
INSERT INTO exchange_rates (currency_from, currency_to, rate, is_active, notes) 
VALUES ('USD', 'GHS', 10.88, true, 'Current market rate - USD to Ghana Cedis (July 2025)');

-- Verify the update
SELECT 'Exchange rate updated successfully' as status;
SELECT * FROM exchange_rates WHERE is_active = true ORDER BY created_at DESC; 