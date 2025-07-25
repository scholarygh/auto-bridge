-- 3-Factor Authentication Schema Updates (Fixed)
-- Run this in your Supabase SQL Editor

-- Add 3FA fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip INET;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_device TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_questions JSONB;

-- Drop existing admin_security table if it exists (to fix constraints)
DROP TABLE IF EXISTS admin_security CASCADE;

-- Create admin security settings table with proper constraints
CREATE TABLE admin_security (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE, -- Added UNIQUE constraint
  security_level TEXT CHECK (security_level IN ('basic', '2fa', '3fa')) DEFAULT 'basic',
  totp_required BOOLEAN DEFAULT FALSE,
  device_verification_required BOOLEAN DEFAULT FALSE,
  ip_whitelist TEXT[],
  allowed_devices JSONB,
  session_timeout_minutes INTEGER DEFAULT 480, -- 8 hours
  max_login_attempts INTEGER DEFAULT 5,
  lockout_duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing login_audit table if it exists
DROP TABLE IF EXISTS login_audit CASCADE;

-- Create login audit log
CREATE TABLE login_audit (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  success BOOLEAN,
  failure_reason TEXT,
  totp_used BOOLEAN DEFAULT FALSE,
  device_verified BOOLEAN DEFAULT FALSE,
  location_data JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_totp_enabled ON users(totp_enabled);
CREATE INDEX IF NOT EXISTS idx_login_audit_user_time ON login_audit(user_id, login_time);
CREATE INDEX IF NOT EXISTS idx_admin_security_user ON admin_security(user_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_security_updated_at 
  BEFORE UPDATE ON admin_security 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE admin_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_audit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Admin access all security" ON admin_security;
CREATE POLICY "Admin access all security" ON admin_security FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin access all audit" ON login_audit;
CREATE POLICY "Admin access all audit" ON login_audit FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert default admin security settings (this will work now with the UNIQUE constraint)
INSERT INTO admin_security (user_id, security_level, totp_required, device_verification_required, max_login_attempts)
SELECT 
  id,
  '3fa',
  TRUE,
  TRUE,
  5
FROM users 
WHERE email = 'nanaduah09@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  security_level = EXCLUDED.security_level,
  totp_required = EXCLUDED.totp_required,
  device_verification_required = EXCLUDED.device_verification_required,
  max_login_attempts = EXCLUDED.max_login_attempts,
  updated_at = NOW(); 