-- Fix RLS policies and set up users table properly
-- Run this in your Supabase SQL Editor

-- First, let's check what RLS policies exist on the users table
-- and create proper ones that allow admin operations

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Admin can insert users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;
DROP POLICY IF EXISTS "Admin can delete users" ON users;

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