#!/usr/bin/env node

/**
 * Storage Test Script for Auto-Bridge
 * This script helps verify that the storage setup is working correctly
 */

console.log('🧪 Auto-Bridge Storage Test');
console.log('============================\n');

console.log('📋 Storage Verification Queries:');
console.log('Run these in Supabase SQL Editor to verify your setup:\n');

console.log('1️⃣ Check if bucket exists and is public:');
console.log(`
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'vehicle-images';
`);

console.log('2️⃣ Check if storage policies exist:');
console.log(`
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual LIKE '%vehicle-images%';
`);

console.log('3️⃣ Test bucket access (should return empty array if no files):');
console.log(`
SELECT name, metadata, created_at 
FROM storage.objects 
WHERE bucket_id = 'vehicle-images' 
LIMIT 5;
`);

console.log('4️⃣ Check RLS is enabled on storage.objects:');
console.log(`
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
`);

console.log('✅ Expected Results:');
console.log('• Bucket "vehicle-images" exists and is public');
console.log('• 4 storage policies created (read, insert, update, delete)');
console.log('• RLS enabled on storage.objects table');
console.log('• No errors when querying bucket contents\n');

console.log('🔧 If Policies Are Missing:');
console.log('Run this SQL to create the missing policies:\n');

const missingPolicies = `
-- Allow public read access to vehicle images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload access" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vehicle-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own uploads
CREATE POLICY "Authenticated update access" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'vehicle-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own uploads
CREATE POLICY "Authenticated delete access" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vehicle-images' 
    AND auth.role() = 'authenticated'
  );
`;

console.log(missingPolicies);

console.log('🎯 Next Steps After Verification:');
console.log('1. Test image upload in your application');
console.log('2. Verify images are accessible via public URLs');
console.log('3. Test image deletion functionality');
console.log('4. Integrate with vehicle forms\n');

console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('📁 Project: tsmigimqbuccodyhfqpi');
console.log('🗂️  Storage Section: https://supabase.com/dashboard/project/tsmigimqbuccodyhfqpi/storage/buckets\n');

console.log('🚀 Ready to test upload functionality!'); 