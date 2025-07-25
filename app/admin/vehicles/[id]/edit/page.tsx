'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Car, 
  Camera, 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Info,
  Zap,
  FileText,
  DollarSign,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Palette,
  Users,
  Shield,
  Star,
  Edit,
  Trash2
} from 'lucide-react'
import { vehicleService } from '@/lib/dataService'
import { storageService, imageUtils } from '@/lib/storageService'
import ImageUpload from '@/components/ImageUpload'
import FeatureDisplay from '@/components/ui/FeatureDisplay'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'
import { 
  convertUSDToGHSSync, 
  formatPriceUSD, 
  formatPriceGHS, 
  milesToKilometers,
  formatMileageForDisplay,
  formatLocation
} from '@/lib/utils'

interface VehicleFormData {
  // Basic Information
  vin: string
  title: string
  make: string
  model: string
  year: number
  trim: string
  body_type: string
  
  // Pricing & Condition
  price: number
  original_price?: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  
  // Technical Specifications
  mileage: number
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen'
  transmission: 'automatic' | 'manual' | 'cvt' | 'semi-automatic'
  engine_type: string
  engine_size: string
  cylinders: number
  horsepower: number
  torque: number
  
  // Exterior & Interior
  color: string
  interior: string
  doors: number
  seats: number
  
  // NHTSA Data
  manufacturer: string
  plant_city: string
  plant_state: string
  plant_country: string
  vehicle_type: string
  body_class: string
  gross_vehicle_weight_rating: number
  
  // Additional Details
  description: string
  features: string[]
  images: string[]
  
  // Location & Status
  location: string
  status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'sourcing'
  
  // Analytics
  views: number
  inquiries: number
  is_featured: boolean
}

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string
  
  const [formData, setFormData] = useState<VehicleFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])

  // Load vehicle data
  useEffect(() => {
    const loadVehicle = async () => {
      if (!vehicleId) return

      try {
        const { data, error } = await vehicleService.getById(vehicleId)
        
        if (error) {
          throw new Error(error.message || 'Failed to load vehicle')
        }

        if (data) {
          setFormData(data as VehicleFormData)
          setUploadedImages(data.images || [])
        } else {
          throw new Error('Vehicle not found')
        }
      } catch (error) {
        console.error('Load vehicle error:', error)
        setError(error instanceof Error ? error.message : 'Failed to load vehicle')
      } finally {
        setIsLoading(false)
      }
    }

    loadVehicle()
  }, [vehicleId])

  // Handle form input changes
  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    if (!formData) return
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
  }

  // Handle image uploads
  const handleImagesUploaded = (urls: string[]) => {
    console.log('New images uploaded:', urls)
    
    // Only add new URLs that aren't already in the list
    const newUrls = urls.filter(url => !uploadedImages.includes(url))
    console.log('New unique URLs:', newUrls)
    
    setUploadedImages(prev => {
      const updated = [...prev, ...newUrls]
      console.log('Updated uploaded images:', updated)
      return updated
    })
  }

  // Handle image removal
  const handleImageRemove = (imageUrl: string) => {
    setUploadedImages(prev => prev.filter(url => url !== imageUrl))
    setRemovedImages(prev => [...prev, imageUrl])
  }

  // Handle upload error
  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
    setError(`Image upload error: ${error}`)
  }

  // Save vehicle
  const saveVehicle = async () => {
    if (!formData) return

    setIsSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Create vehicle data with all required fields
      const vehicleData = {
        ...formData,
        // Use current uploaded images (excluding removed ones)
        images: uploadedImages,
        // Ensure features is always an array
        features: formData.features && formData.features.length > 0 ? formData.features : [],
        // Ensure required fields have default values
        price: formData.price || 0,
        mileage: formData.mileage || 0,
        year: formData.year || new Date().getFullYear(),
        make: formData.make || 'Unknown',
        model: formData.model || 'Unknown',
        title: formData.title || `${formData.year} ${formData.make} ${formData.model}`,
        vin: formData.vin || '',
        color: formData.color || 'Unknown',
        condition: formData.condition || 'good',
        fuel_type: formData.fuel_type || 'gasoline',
        transmission: formData.transmission || 'automatic',
        status: formData.status || 'available'
      }

      console.log('Saving vehicle data:', vehicleData)
      console.log('Final images count:', uploadedImages.length)
      console.log('Features count:', formData.features.length)

      const { data, error } = await vehicleService.update(vehicleId, vehicleData)

      if (error) {
        console.error('Save error:', error)
        throw new Error(error.message || 'Failed to save vehicle')
      }

      if (data) {
        console.log('Vehicle updated successfully:', data)
        setSuccess(true)
        
        // Delete removed images from storage
        if (removedImages.length > 0) {
          console.log('Deleting removed images:', removedImages)
          for (const imageUrl of removedImages) {
            try {
              // Extract file path from URL
              const urlParts = imageUrl.split('/')
              const fileName = urlParts[urlParts.length - 1]
              const filePath = `${vehicleId}/${fileName}`
              
              await storageService.deleteImage(filePath)
              console.log('Deleted image:', filePath)
            } catch (deleteError) {
              console.error('Failed to delete image:', imageUrl, deleteError)
            }
          }
        }
        
        // Show success message for 2 seconds then redirect
        setTimeout(() => {
          router.push(`/admin/vehicles/${vehicleId}`)
        }, 2000)
      } else {
        throw new Error('No data returned from update operation')
      }
    } catch (error) {
      console.error('Save error:', error)
      setError(error instanceof Error ? error.message : 'Failed to save vehicle')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete vehicle
  const deleteVehicle = async () => {
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return
    }

    setIsSaving(true)
    setError('')

    try {
      // Delete all vehicle images from storage
      if (uploadedImages.length > 0) {
        console.log('Deleting all vehicle images')
        await storageService.deleteVehicleImages(vehicleId)
      }

      // Delete vehicle from database
      const { error } = await vehicleService.delete(vehicleId)

      if (error) {
        throw new Error(error.message || 'Failed to delete vehicle')
      }

      // Redirect to vehicles list
      router.push('/admin/vehicles')
    } catch (error) {
      console.error('Delete error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete vehicle')
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading vehicle data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !formData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={() => router.push('/admin/vehicles')}
            className="btn-secondary mt-4"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-800">Vehicle not found</span>
          </div>
          <button
            onClick={() => router.push('/admin/vehicles')}
            className="btn-secondary mt-4"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="text-gray-600 mt-1">Update vehicle information and images</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/admin/vehicles/${vehicleId}`)}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicle
            </button>
            
            <button
              onClick={deleteVehicle}
              disabled={isSaving}
              className="btn-danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-800">Vehicle updated successfully! Redirecting...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Edit className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vehicle Information
              </h2>
              <p className="text-gray-600">
                Update the vehicle details and images
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2023 BMW X5 xDrive40i"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trim</label>
                    <input
                      type="text"
                      value={formData.trim}
                      onChange={(e) => handleInputChange('trim', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VIN *</label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={17}
                  />
                </div>
              </div>

              {/* Pricing & Condition */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing & Condition</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                  {formData.price > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPriceUSD(formData.price)} = {formatPriceGHS(convertUSDToGHSSync(formData.price))}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (USD)</label>
                  <input
                    type="number"
                    value={formData.original_price || ''}
                    onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value) || undefined)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                  {formData.original_price && formData.original_price > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPriceUSD(formData.original_price)} = {formatPriceGHS(convertUSDToGHSSync(formData.original_price))}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (Miles) *</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  {formData.mileage > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.mileage.toLocaleString()} miles = {formatMileageForDisplay(formData.mileage)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <EnhancedDropdown
                    value={formData.condition}
                    onChange={(value) => handleInputChange('condition', value)}
                    options={[
                      { value: 'excellent', label: 'Excellent' },
                      { value: 'good', label: 'Good' },
                      { value: 'fair', label: 'Fair' },
                      { value: 'poor', label: 'Poor' }
                    ]}
                    placeholder="Select condition"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Technical Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                  <EnhancedDropdown
                    value={formData.fuel_type}
                    onChange={(value) => handleInputChange('fuel_type', value)}
                    options={[
                      { value: 'gasoline', label: 'Gasoline' },
                      { value: 'diesel', label: 'Diesel' },
                      { value: 'electric', label: 'Electric' },
                      { value: 'hybrid', label: 'Hybrid' },
                      { value: 'plug-in hybrid', label: 'Plug-in Hybrid' },
                      { value: 'hydrogen', label: 'Hydrogen' }
                    ]}
                    placeholder="Select fuel type"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                  <EnhancedDropdown
                    value={formData.transmission}
                    onChange={(value) => handleInputChange('transmission', value)}
                    options={[
                      { value: 'automatic', label: 'Automatic' },
                      { value: 'manual', label: 'Manual' },
                      { value: 'cvt', label: 'CVT' },
                      { value: 'semi-automatic', label: 'Semi-Automatic' }
                    ]}
                    placeholder="Select transmission"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type</label>
                  <input
                    type="text"
                    value={formData.engine_type}
                    onChange={(e) => handleInputChange('engine_type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                  <input
                    type="text"
                    value={formData.engine_size}
                    onChange={(e) => handleInputChange('engine_size', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2.0L"
                  />
                </div>
              </div>
            </div>

            {/* Location & Status */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Location & Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (US) *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Los Angeles, CA, USA"
                  />
                  {formData.location && (
                    <p className="text-sm text-gray-600 mt-1">
                      Display: {formatLocation(formData.location)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <EnhancedDropdown
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                    options={[
                      { value: 'available', label: '🟢 Available - Ready for customers to see and purchase' },
                      { value: 'reserved', label: '🟡 Reserved - Temporarily held for a specific customer' },
                      { value: 'sold', label: '🔴 Sold - Vehicle has been sold' },
                      { value: 'maintenance', label: '🔧 Maintenance - Vehicle is being serviced' },
                      { value: 'sourcing', label: '⏳ Sourcing - Being processed/prepared for sale' }
                    ]}
                    placeholder="Select status"
                    className="w-full"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {formData.status === 'available' && (
                      <p>✅ Vehicle is visible to customers and ready for purchase</p>
                    )}
                    {formData.status === 'reserved' && (
                      <p>⏸️ Vehicle is held for a customer who has shown serious interest</p>
                    )}
                    {formData.status === 'sold' && (
                      <p>🎉 Vehicle has been successfully sold</p>
                    )}
                    {formData.status === 'maintenance' && (
                      <p>🔧 Vehicle is being serviced or repaired</p>
                    )}
                    {formData.status === 'sourcing' && (
                      <p>📋 Vehicle needs pricing, photos, or other preparation before going live</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Description & Features</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the vehicle's features, condition, history, and any special details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <textarea
                    value={formData.features.join(', ')}
                    onChange={(e) => {
                      const features = e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0)
                      handleInputChange('features', features)
                    }}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter features separated by commas (e.g., Leather Seats, Navigation, Bluetooth, Backup Camera, Sunroof)"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Separate multiple features with commas
                  </p>
                  
                  {/* Features Preview */}
                  {formData.features.length > 0 && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
                      <FeatureDisplay features={formData.features} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Images */}
            {uploadedImages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Current Images</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUtils.getThumbnailUrl(imageUrl, 200)}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleImageRemove(imageUrl)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                  {uploadedImages.length} image(s) - Click the × to remove images
                </p>
              </div>
            )}

            {/* Add New Images */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Add New Images</h3>
              
              <ImageUpload
                vehicleId={vehicleId}
                onImagesUploaded={handleImagesUploaded}
                onUploadError={handleUploadError}
                maxImages={20}
                className="max-w-2xl"
              />
            </div>

            {/* Save Button */}
            <div className="mt-8 text-center">
              <button
                onClick={saveVehicle}
                disabled={isSaving}
                className="btn-primary flex items-center justify-center space-x-2 px-8 py-4 text-lg"
              >
                {isSaving ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Save className="w-6 h-6" />
                )}
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 