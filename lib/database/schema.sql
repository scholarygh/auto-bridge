-- Comprehensive Vehicle Database Schema
-- This schema supports all vehicle specifications from our proprietary extraction system

-- Vehicles table with comprehensive fields
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    
    -- Basic Information
    vin VARCHAR(17) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),
    series VARCHAR(100),
    trim2 VARCHAR(100),
    description TEXT,
    
    -- Body and Classification
    body_type VARCHAR(100),
    body_cab_type VARCHAR(200),
    vehicle_type VARCHAR(50),
    doors VARCHAR(10),
    seats VARCHAR(10),
    seat_rows VARCHAR(10),
    
    -- Engine and Powertrain
    engine VARCHAR(200),
    engine_configuration VARCHAR(100),
    engine_cylinders VARCHAR(10),
    engine_hp VARCHAR(10),
    displacement_l VARCHAR(10),
    displacement_cc VARCHAR(10),
    fuel_type VARCHAR(50),
    fuel_type_secondary VARCHAR(50),
    electrification_level VARCHAR(100),
    transmission VARCHAR(50),
    transmission_speeds VARCHAR(10),
    drivetrain VARCHAR(100),
    turbo VARCHAR(10),
    other_engine_info TEXT,
    
    -- Battery and Electric Vehicle
    battery_info TEXT,
    battery_type VARCHAR(100),
    battery_kwh VARCHAR(20),
    battery_v VARCHAR(20),
    charger_level VARCHAR(50),
    charger_power_kw VARCHAR(20),
    ev_drive_unit VARCHAR(100),
    
    -- Dimensions and Capacity
    bed_length_in VARCHAR(10),
    gvwr VARCHAR(200),
    curb_weight_lb VARCHAR(20),
    wheel_base_long VARCHAR(20),
    wheel_base_short VARCHAR(20),
    track_width VARCHAR(20),
    wheel_size_front VARCHAR(50),
    wheel_size_rear VARCHAR(50),
    top_speed_mph VARCHAR(10),
    
    -- Safety Features
    abs VARCHAR(50),
    esc VARCHAR(50),
    traction_control VARCHAR(50),
    air_bag_loc_front VARCHAR(200),
    air_bag_loc_side VARCHAR(200),
    air_bag_loc_curtain VARCHAR(200),
    air_bag_loc_knee VARCHAR(200),
    seat_belts_all VARCHAR(50),
    other_restraint_system_info TEXT,
    
    -- Driver Assistance Features
    adaptive_cruise_control VARCHAR(50),
    adaptive_headlights VARCHAR(50),
    adaptive_driving_beam VARCHAR(50),
    forward_collision_warning VARCHAR(50),
    lane_departure_warning VARCHAR(50),
    lane_keep_system VARCHAR(50),
    lane_centering_assistance VARCHAR(50),
    blind_spot_mon VARCHAR(50),
    blind_spot_intervention VARCHAR(50),
    park_assist VARCHAR(50),
    rear_visibility_system VARCHAR(50),
    rear_cross_traffic_alert VARCHAR(50),
    rear_automatic_emergency_braking VARCHAR(50),
    pedestrian_automatic_emergency_braking VARCHAR(50),
    auto_reverse_system VARCHAR(50),
    dynamic_brake_support VARCHAR(50),
    
    -- Lighting and Visibility
    daytime_running_light VARCHAR(50),
    lower_beam_headlamp_light_source VARCHAR(100),
    semiautomatic_headlamp_beam_switching VARCHAR(50),
    
    -- Additional Features
    keyless_ignition VARCHAR(50),
    tpms VARCHAR(50),
    entertainment_system VARCHAR(200),
    windows VARCHAR(200),
    wheels VARCHAR(200),
    
    -- Manufacturing Information
    manufacturer VARCHAR(200),
    plant_city VARCHAR(100),
    plant_state VARCHAR(100),
    plant_country VARCHAR(100),
    destination_market VARCHAR(100),
    
    -- Error and Notes
    error_text TEXT,
    additional_error_text TEXT,
    note TEXT,
    
    -- Business Logic Fields
    mileage INTEGER DEFAULT 0,
    color VARCHAR(50) DEFAULT 'Unknown',
    condition VARCHAR(20) DEFAULT 'good',
    estimated_price DECIMAL(10,2) DEFAULT 0,
    location VARCHAR(200) DEFAULT 'Unknown',
    dealer_stock_number VARCHAR(100),
    
    -- History and Status
    accident_history TEXT,
    service_history TEXT,
    ownership_history TEXT,
    owner_count INTEGER DEFAULT 1,
    title_issues TEXT,
    odometer_issues TEXT,
    last_reported_date DATE,
    
    -- Features Array (stored as JSON)
    features JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2100),
    CONSTRAINT valid_vin CHECK (LENGTH(vin) = 17)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_body_type ON vehicles(body_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_type ON vehicles(vehicle_type);

-- Vehicle Images table
CREATE TABLE IF NOT EXISTS vehicle_images (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'exterior', -- exterior, interior, engine, etc.
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Features table (for better querying)
CREATE TABLE IF NOT EXISTS vehicle_features (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(200),
    feature_category VARCHAR(50), -- safety, comfort, technology, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle History table
CREATE TABLE IF NOT EXISTS vehicle_history (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    history_type VARCHAR(50) NOT NULL, -- accident, service, ownership, etc.
    description TEXT NOT NULL,
    date DATE,
    mileage INTEGER,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_vehicles_updated_at 
    BEFORE UPDATE ON vehicles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to extract features from JSONB and populate vehicle_features table
CREATE OR REPLACE FUNCTION sync_vehicle_features()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete existing features for this vehicle
    DELETE FROM vehicle_features WHERE vehicle_id = NEW.id;
    
    -- Insert features from JSONB array
    INSERT INTO vehicle_features (vehicle_id, feature_name, feature_value, feature_category)
    SELECT 
        NEW.id,
        jsonb_array_elements_text(NEW.features) as feature_name,
        NULL as feature_value,
        'general' as feature_category;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to sync features
CREATE TRIGGER sync_vehicle_features_trigger
    AFTER INSERT OR UPDATE OF features ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION sync_vehicle_features();

-- Comments for documentation
COMMENT ON TABLE vehicles IS 'Comprehensive vehicle database with all specifications from our proprietary extraction system';
COMMENT ON COLUMN vehicles.vin IS '17-character Vehicle Identification Number';
COMMENT ON COLUMN vehicles.features IS 'JSONB array of vehicle features for flexible querying';
COMMENT ON COLUMN vehicles.condition IS 'Vehicle condition: excellent, good, fair, poor'; 