'use client'

import React, { useState, useRef, useCallback } from 'react'
import { storageService, imageUtils } from '@/lib/storageService'
import { UploadResponse } from '@/lib/storageService'

interface ImageUploadProps {
  vehicleId?: string
  onImagesUploaded: (urls: string[]) => void
  onUploadError: (error: string) => void
  maxImages?: number
  className?: string
}

export default function ImageUpload({ 
  vehicleId, 
  onImagesUploaded, 
  onUploadError, 
  maxImages = 10,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // Validate number of files
    if (uploadedUrls.length + previewUrls.length + fileArray.length > maxImages) {
      onUploadError(`Maximum ${maxImages} images allowed`)
      return
    }

    // Create preview URLs
    const newPreviewUrls = await Promise.all(
      fileArray.map(file => imageUtils.fileToBase64(file))
    )
    
    // Only add new preview URLs (avoid duplication)
    setPreviewUrls(prev => {
      const existingUrls = new Set(prev)
      const uniqueNewUrls = newPreviewUrls.filter(url => !existingUrls.has(url))
      return [...prev, ...uniqueNewUrls]
    })

    // Upload files if vehicleId is provided
    if (vehicleId) {
      await uploadFiles(fileArray)
    }
  }, [vehicleId, uploadedUrls.length, previewUrls.length, maxImages, onUploadError])

  // Upload files to storage
  const uploadFiles = async (files: File[]) => {
    if (!vehicleId) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Resize image before upload
        const resizedFile = await imageUtils.resizeImage(file)
        
        const result = await storageService.uploadImage(resizedFile, vehicleId, index)
        
        // Update progress
        setUploadProgress(prev => prev + (100 / files.length))
        
        return result
      })

      const results = await Promise.all(uploadPromises)
      
      // Check for errors
      const errors = results.filter(result => !result.success)
      if (errors.length > 0) {
        onUploadError(`Failed to upload ${errors.length} images: ${errors[0].error}`)
        return
      }

      // Get successful uploads
      const successfulUploads = results.filter(result => result.success)
      const newUrls = successfulUploads.map(result => result.url!).filter(Boolean)
      
      // Only add new URLs (avoid duplication)
      setUploadedUrls(prev => {
        const existingUrls = new Set(prev)
        const uniqueNewUrls = newUrls.filter(url => !existingUrls.has(url))
        return [...prev, ...uniqueNewUrls]
      })
      
      // Only call onImagesUploaded with new unique URLs
      const existingUrls = new Set(uploadedUrls)
      const uniqueNewUrls = newUrls.filter(url => !existingUrls.has(url))
      if (uniqueNewUrls.length > 0) {
        onImagesUploaded(uniqueNewUrls)
      }
      
      // Clear previews for uploaded files
      setPreviewUrls(prev => prev.slice(files.length))
      
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError('Failed to upload images')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
    handleFileSelect(e.dataTransfer.files)
  }

  // Remove image
  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setUploadedUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center
          transition-colors duration-200 cursor-pointer
          hover:border-blue-400 hover:bg-blue-50
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, WEBP up to 50MB each
          </p>
          
          <p className="text-xs text-gray-500">
            {uploadedUrls.length}/{maxImages} images uploaded
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {(previewUrls.length > 0 || uploadedUrls.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Uploaded Images */}
          {uploadedUrls.map((url, index) => (
            <div key={`uploaded-${index}`} className="relative group">
                                      <img
                          src={imageUtils.getThumbnailUrl(url, 200)}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          
          {/* Preview Images */}
          {previewUrls.map((url, index) => (
            <div key={`preview-${index}`} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(uploadedUrls.length + index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {!vehicleId && (
                <div className="absolute inset-0 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                    Pending Upload
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Pending Images Button */}
      {!vehicleId && previewUrls.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {previewUrls.length} images ready to upload when vehicle is created
          </p>
        </div>
      )}
    </div>
  )
} 