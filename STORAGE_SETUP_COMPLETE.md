# 🖼️ Complete Storage Setup Guide

## 📋 **Vehicle Image Storage Setup for Auto-Bridge**

This guide will help you set up the complete image storage system for vehicle photos using Supabase Storage.

## 🎯 **What We're Setting Up**

### ✅ **Storage Bucket**
- `vehicle-images` bucket for storing vehicle photos
- Public access for image display
- Proper file organization by vehicle ID

### ✅ **Storage Policies**
- Public read access for images
- Authenticated upload/update/delete permissions
- Secure access control

### ✅ **Upload System**
- Drag & drop image upload
- Image resizing and optimization
- Progress tracking
- Error handling

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Storage Bucket**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `tsmigimqbuccodyhfqpi`

2. **Navigate to Storage**
   - Click **Storage** in the left sidebar
   - Click **New bucket**

3. **Configure Bucket**
   - **Bucket name**: `vehicle-images`
   - **Public bucket**: ✅ Check this (for image access)
   - Click **Create bucket**

### **Step 2: Set Storage Policies**

1. **Go to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run Storage Policies**
   ```sql
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
   ```

### **Step 3: Verify Storage Setup**

Run these verification queries:

```sql
-- Check if bucket exists
SELECT name, public FROM storage.buckets WHERE name = 'vehicle-images';

-- Check if policies exist
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

**Expected Results:**
- Bucket `vehicle-images` exists and is public
- 4 storage policies created

## 📁 **File Structure Created**

### **Storage Service**
- `lib/storageService.ts` - Complete storage management
- `components/ImageUpload.tsx` - Upload component
- `scripts/setup-storage.js` - Setup instructions

### **Features Included**
- ✅ Single and multiple image upload
- ✅ Image validation and resizing
- ✅ Progress tracking
- ✅ Error handling
- ✅ File deletion
- ✅ Public URL generation
- ✅ Thumbnail generation

## 🔧 **How to Use the Storage System**

### **1. In Vehicle Forms**

```tsx
import ImageUpload from '@/components/ImageUpload'

function VehicleForm() {
  const handleImagesUploaded = (urls: string[]) => {
    // URLs are automatically added to vehicle data
    console.log('Uploaded images:', urls)
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
  }

  return (
    <ImageUpload
      vehicleId="vehicle-uuid-here"
      onImagesUploaded={handleImagesUploaded}
      onUploadError={handleUploadError}
      maxImages={10}
    />
  )
}
```

### **2. Programmatic Upload**

```tsx
import { storageService } from '@/lib/storageService'

// Upload single image
const result = await storageService.uploadImage(file, vehicleId, 0)

// Upload multiple images
const results = await storageService.uploadMultipleImages(files, vehicleId)

// Delete images
await storageService.deleteVehicleImages(vehicleId)
```

### **3. Display Images**

```tsx
// Get optimized URL
const optimizedUrl = storageService.getOptimizedUrl(filePath, 800, 600, 80)

// Get thumbnail
const thumbnailUrl = storageService.getThumbnailUrl(imageUrl, 300)
```

## 📊 **Storage Configuration**

### **Bucket Settings**
- **Name**: `vehicle-images`
- **Public Access**: Enabled
- **File Size Limit**: 50MB per file
- **Allowed Types**: jpg, jpeg, png, webp, gif
- **Organization**: Files stored in `{vehicle-id}/{filename}` structure

### **File Naming Convention**
```
{vehicle-id}-{timestamp}-{index}.{extension}
Example: 123e4567-e89b-12d3-a456-426614174000-1703123456789-1.jpg
```

### **URL Structure**
```
https://tsmigimqbuccodyhfqpi.supabase.co/storage/v1/object/public/vehicle-images/{vehicle-id}/{filename}
```

## 🎯 **Integration with Vehicle System**

### **Database Integration**
- Vehicle `images` field stores array of image URLs
- URLs point to Supabase Storage public URLs
- Automatic cleanup when vehicles are deleted

### **Form Integration**
- Drag & drop upload interface
- Real-time preview
- Progress indicators
- Error handling and validation

### **Display Integration**
- Optimized image loading
- Thumbnail generation
- Responsive image grid
- Lazy loading support

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Upload Fails**
   - Check storage policies are created
   - Verify user is authenticated
   - Check file size limits

2. **Images Not Accessible**
   - Verify bucket is public
   - Check CORS settings
   - Validate URL structure

3. **CORS Errors**
   - Add your domain to Supabase allowed origins
   - Check browser console for specific errors

4. **File Size Errors**
   - Check bucket file size limits
   - Implement client-side resizing
   - Validate file types

### **Testing Storage**

```tsx
// Test bucket exists
const bucketExists = await storageService.checkBucketExists()

// Test upload
const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
const result = await storageService.uploadImage(testFile, 'test-vehicle', 0)

// Get storage stats
const stats = await storageService.getStorageStats()
```

## 🎉 **Next Steps**

### **After Storage Setup**
1. ✅ Test image upload functionality
2. ✅ Verify images are accessible via public URLs
3. ✅ Update vehicle forms to use storage upload
4. ✅ Test image deletion when vehicles are removed
5. ✅ Implement image optimization and lazy loading

### **Advanced Features**
1. **Image Optimization** - Automatic resizing and compression
2. **CDN Integration** - Faster image delivery
3. **Image Processing** - Watermarks, filters, cropping
4. **Bulk Operations** - Mass upload/download
5. **Analytics** - Storage usage tracking

---

## 🔗 **Quick Links**

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Storage Section**: https://supabase.com/dashboard/project/tsmigimqbuccodyhfqpi/storage/buckets
- **Project**: tsmigimqbuccodyhfqpi

**Your vehicle image storage system is ready to use! 🚗📸** 