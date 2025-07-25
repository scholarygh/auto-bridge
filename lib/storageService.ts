import { supabase } from './supabase'

// Storage configuration
const BUCKET_NAME = 'vehicle-images'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// File upload response type
export interface UploadResponse {
  success: boolean
  url?: string
  path?: string
  error?: string
  size?: number
}

// Storage service for vehicle images
export const storageService = {
  /**
   * Upload a single image to vehicle-images bucket
   */
  async uploadImage(file: File, vehicleId: string, index: number = 0): Promise<UploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const filename = `${vehicleId}-${timestamp}-${index}.${fileExtension}`
      const filePath = `${vehicleId}/${filename}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        size: file.size
      }
    } catch (error) {
      console.error('Storage upload error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown upload error' 
      }
    }
  },

  /**
   * Upload multiple images for a vehicle
   */
  async uploadMultipleImages(files: File[], vehicleId: string): Promise<UploadResponse[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, vehicleId, index)
    )
    
    return Promise.all(uploadPromises)
  },

  /**
   * Delete a single image
   */
  async deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Storage delete error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown delete error' 
      }
    }
  },

  /**
   * Delete multiple images
   */
  async deleteMultipleImages(filePaths: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths)

      if (error) {
        console.error('Delete multiple error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Storage delete multiple error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown delete error' 
      }
    }
  },

  /**
   * Delete all images for a vehicle
   */
  async deleteVehicleImages(vehicleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // List all files in the vehicle folder
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(vehicleId)

      if (listError) {
        console.error('List files error:', listError)
        return { success: false, error: listError.message }
      }

      if (!files || files.length === 0) {
        return { success: true } // No files to delete
      }

      // Delete all files in the vehicle folder
      const filePaths = files.map(file => `${vehicleId}/${file.name}`)
      return this.deleteMultipleImages(filePaths)
    } catch (error) {
      console.error('Delete vehicle images error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown delete error' 
      }
    }
  },

  /**
   * Get public URL for an image
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)
    
    return data.publicUrl
  },

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
      }
    }

    return { valid: true }
  },

  /**
   * Generate optimized image URL with parameters
   */
  getOptimizedUrl(filePath: string, width: number = 800, height: number = 600, quality: number = 80): string {
    const baseUrl = this.getPublicUrl(filePath)
    return `${baseUrl}?width=${width}&height=${height}&quality=${quality}&fit=crop`
  },

  /**
   * Check if storage bucket exists
   */
  async checkBucketExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.getBucket(BUCKET_NAME)
      return !error && data !== null
    } catch (error) {
      console.error('Check bucket error:', error)
      return false
    }
  },

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{ totalSize: number; fileCount: number; error?: string }> {
    try {
      const { data: files, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', { limit: 1000 })

      if (error) {
        return { totalSize: 0, fileCount: 0, error: error.message }
      }

      const totalSize = files?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0
      const fileCount = files?.length || 0

      return { totalSize, fileCount }
    } catch (error) {
      console.error('Get storage stats error:', error)
      return { 
        totalSize: 0, 
        fileCount: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  },

  /**
   * Generate thumbnail URL (convenience method)
   */
  getThumbnailUrl(imageUrl: string, size: number = 300): string {
    // If it's already a Supabase URL, add thumbnail parameters
    if (imageUrl.includes('supabase.co')) {
      return `${imageUrl}?width=${size}&height=${size}&fit=crop`
    }
    return imageUrl
  }
}

// Utility functions for image handling
export const imageUtils = {
  /**
   * Convert file to base64 for preview
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  },

  /**
   * Resize image before upload (client-side)
   */
  async resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Resize canvas and draw image
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            resolve(file) // Fallback to original file
          }
        }, file.type, 0.8)
      }

      img.src = URL.createObjectURL(file)
    })
  },

  /**
   * Generate thumbnail URL
   */
  getThumbnailUrl(imageUrl: string, size: number = 300): string {
    // If it's already a Supabase URL, add thumbnail parameters
    if (imageUrl.includes('supabase.co')) {
      return `${imageUrl}?width=${size}&height=${size}&fit=crop`
    }
    return imageUrl
  }
} 