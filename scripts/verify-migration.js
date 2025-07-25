#!/usr/bin/env node

/**
 * Migration Verification Script for Auto-Bridge
 * This script helps verify that the database migration was successful
 */

console.log('🔍 Auto-Bridge Migration Verification');
console.log('=====================================\n');

console.log('📋 To verify your migration was successful, run these queries in Supabase SQL Editor:\n');

console.log('1️⃣ Check all columns are present:');
console.log(`
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
ORDER BY ordinal_position;
`);

console.log('2️⃣ Verify the body_type column exists:');
console.log(`
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
AND column_name = 'body_type';
`);

console.log('3️⃣ Check sample data with NHTSA fields:');
console.log(`
SELECT 
  make, model, year, body_type, price, 
  manufacturer, plant_city, anti_brake_system,
  fuel_efficiency_combined, wheelbase, length
FROM vehicles 
LIMIT 3;
`);

console.log('4️⃣ Verify indexes were created:');
console.log(`
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'vehicles';
`);

console.log('5️⃣ Check RLS policies:');
console.log(`
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'vehicles';
`);

console.log('6️⃣ Test the public_vehicles view:');
console.log(`
SELECT * FROM public_vehicles LIMIT 2;
`);

console.log('✅ Expected Results:');
console.log('• Column count should be 50+ (including all NHTSA fields)');
console.log('• body_type column should exist');
console.log('• 3 sample vehicles with comprehensive data');
console.log('• 15+ indexes for performance');
console.log('• 3 RLS policies (admin, public, authenticated)');
console.log('• public_vehicles view should show available vehicles only\n');

console.log('🚨 If any of these fail:');
console.log('• Check the migration output for errors');
console.log('• Verify you ran the complete migration SQL');
console.log('• Make sure you have admin permissions in Supabase\n');

console.log('🎯 Next Steps After Verification:');
console.log('1. Update your application to use the new Vehicle interface');
console.log('2. Test vehicle addition with the new fields');
console.log('3. Update search/filter components to use new fields');
console.log('4. Test NHTSA integration with VIN lookup\n');

console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('📁 Project: tsmigimqbuccodyhfqpi'); 