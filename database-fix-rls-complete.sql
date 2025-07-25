-- Complete RLS fix for 3FA setup
-- Run this in your Supabase SQL Editor

-- ========================================
-- FIX USERS TABLE RLS POLICIES
-- ========================================

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Admin can insert users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;
DROP POLICY IF EXISTS "Admin can delete users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new policies that allow proper access
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow admin users to view all users
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to insert users
CREATE POLICY "Admin can insert users" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to update users
CREATE POLICY "Admin can update users" ON users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to delete users
CREATE POLICY "Admin can delete users" ON users
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Also allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- FIX ADMIN_SECURITY TABLE RLS POLICIES
-- ========================================

-- Drop existing policies on admin_security table
DROP POLICY IF EXISTS "Admin access all security" ON admin_security;
DROP POLICY IF EXISTS "Users can view own security" ON admin_security;
DROP POLICY IF EXISTS "Users can update own security" ON admin_security;
DROP POLICY IF EXISTS "Users can insert own security" ON admin_security;
DROP POLICY IF EXISTS "Users can delete own security" ON admin_security;

-- Create new policies for admin_security table
-- Allow users to view their own security settings
CREATE POLICY "Users can view own security" ON admin_security
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own security settings
CREATE POLICY "Users can update own security" ON admin_security
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own security settings
CREATE POLICY "Users can insert own security" ON admin_security
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own security settings
CREATE POLICY "Users can delete own security" ON admin_security
  FOR DELETE USING (auth.uid() = user_id);

-- Allow admin users to view all security settings
CREATE POLICY "Admin can view all security" ON admin_security
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to update all security settings
CREATE POLICY "Admin can update all security" ON admin_security
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to insert security settings
CREATE POLICY "Admin can insert security" ON admin_security
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to delete security settings
CREATE POLICY "Admin can delete security" ON admin_security
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- ========================================
-- FIX LOGIN_AUDIT TABLE RLS POLICIES
-- ========================================

-- Drop existing policies on login_audit table
DROP POLICY IF EXISTS "Admin access all audit" ON login_audit;
DROP POLICY IF EXISTS "Users can view own audit" ON login_audit;
DROP POLICY IF EXISTS "Users can insert own audit" ON login_audit;

-- Create new policies for login_audit table
-- Allow users to view their own audit logs
CREATE POLICY "Users can view own audit" ON login_audit
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own audit logs
CREATE POLICY "Users can insert own audit" ON login_audit
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow admin users to view all audit logs
CREATE POLICY "Admin can view all audit" ON login_audit
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admin users to insert audit logs
CREATE POLICY "Admin can insert audit" ON login_audit
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ========================================
-- CREATE USER SYNC FUNCTION AND TRIGGER
-- ========================================

-- Create a function to handle user creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- INSERT EXISTING ADMIN USER
-- ========================================

-- Insert the existing admin user manually
INSERT INTO public.users (id, email, role, created_at, updated_at)
VALUES (
  '330c1133-4607-4535-a804-16968224f748',
  'nanaduah09@gmail.com',
  'admin',
  '2025-07-22T20:59:45.891571Z',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if everything is set up correctly
SELECT 'Users table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

SELECT 'Admin_security table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_security';

SELECT 'Login_audit table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'login_audit'; 