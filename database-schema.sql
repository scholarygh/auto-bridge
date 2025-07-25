-- Auto-Bridge Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('available', 'sold', 'sourcing')) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  vehicle_request TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'contacted', 'negotiating', 'completed', 'cancelled')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sourcing table
CREATE TABLE sourcing (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE,
  vehicle_details TEXT NOT NULL,
  target_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2),
  progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  status TEXT CHECK (status IN ('searching', 'found', 'negotiating', 'purchased', 'cancelled')) DEFAULT 'searching',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  kyc_status TEXT CHECK (kyc_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping table
CREATE TABLE shipping (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  shipping_company TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  departure_date DATE NOT NULL,
  estimated_arrival DATE NOT NULL,
  actual_arrival DATE,
  status TEXT CHECK (status IN ('preparing', 'in_transit', 'arrived', 'delivered')) DEFAULT 'preparing',
  shipping_cost DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX idx_sourcing_status ON sourcing(status);
CREATE INDEX idx_shipping_status ON shipping(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_customers_email ON customers(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sourcing_updated_at BEFORE UPDATE ON sourcing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipping_updated_at BEFORE UPDATE ON shipping FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sourcing ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping ENABLE ROW LEVEL SECURITY;

-- Admin can access all data
CREATE POLICY "Admin access all" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access all" ON vehicles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access all" ON inquiries FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access all" ON sourcing FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access all" ON customers FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access all" ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access all" ON shipping FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Public can view available vehicles
CREATE POLICY "Public view available vehicles" ON vehicles FOR SELECT USING (status = 'available');

-- Insert sample data for testing
INSERT INTO vehicles (title, description, price, year, make, model, mileage, fuel_type, transmission, images) VALUES
('2020 Toyota Camry XSE', 'Excellent condition, one owner, full service history', 25000.00, 2020, 'Toyota', 'Camry', 45000, 'Gasoline', 'Automatic', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800']),
('2019 Honda Accord Sport', 'Well maintained, clean title, ready for import', 22000.00, 2019, 'Honda', 'Accord', 52000, 'Gasoline', 'Automatic', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800']),
('2021 Nissan Altima SR', 'Premium package, low mileage, excellent fuel economy', 28000.00, 2021, 'Nissan', 'Altima', 32000, 'Gasoline', 'CVT', ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']),
('2018 Ford Fusion Titanium', 'Loaded with features, great value for money', 18000.00, 2018, 'Ford', 'Fusion', 68000, 'Gasoline', 'Automatic', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800']);

INSERT INTO inquiries (customer_name, customer_email, customer_phone, vehicle_request, budget_range, timeline, status, priority) VALUES
('Kwame Asante', 'kwame@email.com', '+233 24 123 4567', 'Looking for a 2020+ Toyota Camry or Honda Accord', 'GHS 200,000 - 250,000', 'Within 2 months', 'new', 'high'),
('Ama Osei', 'ama.osei@email.com', '+233 20 987 6543', 'Need a reliable SUV for family use', 'GHS 300,000 - 400,000', 'Flexible timeline', 'contacted', 'medium'),
('Kofi Mensah', 'kofi.mensah@email.com', '+233 26 555 1234', 'Searching for luxury sedan (BMW, Mercedes)', 'GHS 500,000+', 'Within 3 months', 'negotiating', 'high');

INSERT INTO customers (name, email, phone, address, kyc_status, total_orders, total_spent) VALUES
('Kwame Asante', 'kwame@email.com', '+233 24 123 4567', 'Accra, Ghana', 'verified', 2, 450000.00),
('Ama Osei', 'ama.osei@email.com', '+233 20 987 6543', 'Kumasi, Ghana', 'pending', 1, 280000.00),
('Kofi Mensah', 'kofi.mensah@email.com', '+233 26 555 1234', 'Tema, Ghana', 'verified', 3, 1200000.00);

INSERT INTO sourcing (inquiry_id, vehicle_details, target_price, current_price, progress, status, notes) VALUES
((SELECT id FROM inquiries WHERE customer_email = 'kwame@email.com'), '2020 Toyota Camry XSE', 250000.00, 245000.00, 85, 'negotiating', 'Found excellent condition vehicle, negotiating final price'),
((SELECT id FROM inquiries WHERE customer_email = 'ama.osei@email.com'), 'SUV - Honda CR-V or Toyota RAV4', 350000.00, NULL, 45, 'searching', 'Searching for best value SUV in target range'),
((SELECT id FROM inquiries WHERE customer_email = 'kofi.mensah@email.com'), 'Luxury sedan - BMW 5 Series', 600000.00, 580000.00, 90, 'negotiating', 'Found BMW 530i, excellent condition, negotiating final terms');

INSERT INTO shipping (vehicle_id, customer_id, shipping_company, tracking_number, departure_date, estimated_arrival, status, shipping_cost, notes) VALUES
((SELECT id FROM vehicles WHERE make = 'Toyota' LIMIT 1), (SELECT id FROM customers WHERE email = 'kwame@email.com'), 'Global Shipping Co', 'GS123456789', '2024-01-15', '2024-02-20', 'in_transit', 45000.00, 'Vessel departed Miami, tracking via GPS'),
((SELECT id FROM vehicles WHERE make = 'Honda' LIMIT 1), (SELECT id FROM customers WHERE email = 'ama.osei@email.com'), 'Atlantic Cargo', 'AC987654321', '2024-01-20', '2024-02-25', 'preparing', 48000.00, 'Vehicle being prepared for shipment');

INSERT INTO orders (customer_id, vehicle_id, total_amount, commission_amount, status, payment_method) VALUES
((SELECT id FROM customers WHERE email = 'kwame@email.com'), (SELECT id FROM vehicles WHERE make = 'Toyota' LIMIT 1), 295000.00, 15000.00, 'paid', 'Bank Transfer'),
((SELECT id FROM customers WHERE email = 'ama.osei@email.com'), (SELECT id FROM vehicles WHERE make = 'Honda' LIMIT 1), 268000.00, 12000.00, 'processing', 'Mobile Money'); 