#!/usr/bin/env node

/**
 * Storage Setup Script for Auto-Bridge
 * This script helps set up the vehicle-images storage bucket and policies
 */

console.log('🖼️  Auto-Bridge Storage Setup');
console.log('==============================\n');

console.log('📋 Storage Setup Instructions:');
console.log('Follow these steps to set up image storage for vehicles\n');

console.log('1️⃣ Create Storage Bucket:');
console.log('• Go to Supabase Dashboard → Storage');
console.log('• Click "New bucket"');
console.log('• Bucket name: vehicle-images');
console.log('• Make it Public (for image access)');
console.log('• Click "Create bucket"\n');

console.log('2️⃣ Set Storage Policies:');
console.log('Run these SQL commands in Supabase SQL Editor:\n');

const storagePolicies = `
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

console.log(storagePolicies);

console.log('3️⃣ Test Storage Setup:');
console.log('After creating the bucket and policies, test with this query:\n');

console.log(`
-- Test if bucket exists
SELECT name, public FROM storage.buckets WHERE name = 'vehicle-images';

-- Test if policies exist
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
`);

console.log('4️⃣ Storage Bucket Configuration:');
console.log('• Bucket Name: vehicle-images');
console.log('• Public Access: Enabled');
console.log('• File Size Limit: 50MB (default)');
console.log('• Allowed File Types: jpg, jpeg, png, webp, gif');
console.log('• Storage Location: Default (your project region)\n');

console.log('5️⃣ Image Upload URL Structure:');
console.log('After upload, images will be accessible at:');
console.log('https://tsmigimqbuccodyhfqpi.supabase.co/storage/v1/object/public/vehicle-images/{filename}\n');

console.log('6️⃣ File Naming Convention:');
console.log('• Use unique filenames: {vehicle-id}-{timestamp}-{index}.jpg');
console.log('• Example: 123e4567-e89b-12d3-a456-426614174000-1703123456789-1.jpg');
console.log('• This prevents conflicts and enables easy management\n');

console.log('✅ Expected Results:');
console.log('• vehicle-images bucket created');
console.log('• 4 storage policies created (read, insert, update, delete)');
console.log('• Public read access enabled');
console.log('• Authenticated users can upload/update/delete\n');

console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('📁 Project: tsmigimqbuccodyhfqpi');
console.log('🗂️  Storage Section: https://supabase.com/dashboard/project/tsmigimqbuccodyhfqpi/storage/buckets\n');

console.log('🎯 Next Steps After Storage Setup:');
console.log('1. Test image upload functionality');
console.log('2. Verify images are accessible via public URLs');
console.log('3. Update vehicle forms to use storage upload');
console.log('4. Test image deletion when vehicles are removed\n');

console.log('🚨 Troubleshooting:');
console.log('• If upload fails: Check storage policies');
console.log('• If images not accessible: Verify bucket is public');
console.log('• If CORS errors: Check allowed origins in Supabase settings');
console.log('• If file size errors: Check bucket file size limits'); 