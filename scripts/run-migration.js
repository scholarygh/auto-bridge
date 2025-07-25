#!/usr/bin/env node

/**
 * Database Migration Runner for Auto-Bridge
 * This script helps you run the complete vehicle schema migration
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Auto-Bridge Database Migration Runner');
console.log('==========================================\n');

// Read the migration file
const migrationPath = path.join(__dirname, '../database/migrations/complete_vehicles_schema.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Migration Summary:');
console.log('• Drops and recreates the vehicles table');
console.log('• Adds 50+ comprehensive NHTSA fields');
console.log('• Includes body_type column (fixes your error)');
console.log('• Creates 15+ optimized indexes');
console.log('• Sets up Row Level Security (RLS)');
console.log('• Adds sample data with full NHTSA specifications');
console.log('• Creates public_vehicles view for public access\n');

console.log('⚠️  IMPORTANT WARNINGS:');
console.log('• This will DROP your existing vehicles table');
console.log('• All existing vehicle data will be lost');
console.log('• Make sure to backup any important data first\n');

console.log('📝 To run this migration:');
console.log('1. Go to your Supabase Dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Create a new query');
console.log('4. Copy and paste the migration SQL below');
console.log('5. Click "Run" to execute\n');

console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('📁 Project: tsmigimqbuccodyhfqpi\n');

console.log('📄 Migration SQL:');
console.log('==========================================');
console.log(migrationSQL);
console.log('==========================================\n');

console.log('✅ After running the migration:');
console.log('1. Verify all columns are present');
console.log('2. Test the sample data');
console.log('3. Update your application code');
console.log('4. Test vehicle addition functionality\n');

console.log('🔍 Verification Query:');
console.log('Run this in Supabase SQL Editor to verify the migration:');
console.log(`
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
ORDER BY ordinal_position;
`);

console.log('📊 Test Query:');
console.log('Run this to see the sample data:');
console.log(`
SELECT 
  make, model, year, body_type, price, 
  manufacturer, plant_city, anti_brake_system,
  fuel_efficiency_combined, wheelbase, length
FROM vehicles 
LIMIT 3;
`);

console.log('🎉 Migration ready to run!');
console.log('Follow the steps above to complete the migration.'); 