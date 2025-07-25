-- Fix RLS Policy to Allow Inserts for Development
-- Run this in your Supabase SQL editor

-- Add policy to allow inserts without authentication
CREATE POLICY "Allow inserts for development" ON vehicles
  FOR INSERT WITH CHECK (true);

-- Also add policy to allow updates for development
CREATE POLICY "Allow updates for development" ON vehicles
  FOR UPDATE USING (true); 