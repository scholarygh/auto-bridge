'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Edit3, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import { vehicleService, VehicleFormData, VehicleData, VehicleImage } from '@/lib/vehicleService'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

interface ExtractedData {
  make: string
  model: string
  year: number
  trim: string
  mileage: number
  color: string
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  transmission: 'automatic' | 'manual'
  vin: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  features: string[]
  description: string
  estimatedPrice: number
  location: string
  accidentHistory?: string
  serviceHistory?: string
  ownershipHistory?: string
  engine?: string
  drivetrain?: string
  bodyType?: string
  ownerCount?: number
  titleIssues?: string
  odometerIssues?: string
  lastReportedDate?: string
  dealerStockNumber?: string
  fuelEconomy?: string
  batteryInfo?: string
  towingCapacity?: string
  payloadCapacity?: string
  dimensions?: string
  groundClearance?: string
}

export default function CarfaxExtractionPage() {
  const router = useRouter()
  const [carfaxUrl, setCarfaxUrl] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [vehicleImages, setVehicleImages] = useState<File[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [extractionSuccess, setExtractionSuccess] = useState(false)

  const handleExtract = async () => {
    if (!carfaxUrl.trim()) {
      setError('Please enter a Carfax URL')
      return
    }

    setIsExtracting(true)
    setError('')

    try {
      const response = await fetch('/api/extract-carfax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: carfaxUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract data from Carfax URL')
      }

      const data = await response.json()
      
      if (data.success) {
        setExtractedData(data.data)
        setIsEditing(true) // Automatically enter edit mode
        
        // Show extraction info if available
        if (data.extractionInfo) {
          console.log('📊 Extraction info:', data.extractionInfo)
          console.log('📄 HTML length scraped:', data.extractionInfo.htmlLength)
          console.log('🤖 Model used:', data.extractionInfo.model)
          console.log('📄 Page title:', data.extractionInfo.pageTitle)
          console.log('📄 Current URL:', data.extractionInfo.currentUrl)
          
          // Show warning if Cloudflare protection was detected
          if (data.extractionInfo.warning) {
            console.log('⚠️ Warning:', data.extractionInfo.warning)
            setError(`⚠️ ${data.extractionInfo.warning}. Please review and fill in missing information manually.`)
          }
        }
        
        // Log the extracted data for debugging
        console.log('✅ Extracted data:', data.data)
      } else {
        setError(data.error || 'Failed to extract data')
      }
    } catch (error) {
      console.error('Extraction error:', error)
      setError('Failed to extract data from Carfax URL. Please try again.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleDataChange = (field: keyof ExtractedData, value: any) => {
    if (!extractedData) return
    
    setExtractedData({
      ...extractedData,
      [field]: value
    })
  }

  const handleFeaturesChange = (features: string) => {
    const featuresArray = features.split(',').map(f => f.trim()).filter(f => f)
    handleDataChange('features', featuresArray)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setVehicleImages(files)
  }

  const handleSubmit = async () => {
    if (!extractedData) {
      setError('Please extract data from Carfax URL first')
      return
    }

    // Validate required fields
    if (!extractedData.make || extractedData.make === 'Unknown') {
      setError('Please enter a valid make')
      return
    }

    if (!extractedData.model || extractedData.model === 'Unknown') {
      setError('Please enter a valid model')
      return
    }

    if (!extractedData.vin || extractedData.vin.length !== 17) {
      setError('Please enter a valid 17-character VIN')
      return
    }

    if (!extractedData.year || extractedData.year < 1900 || extractedData.year > 2030) {
      setError('Please enter a valid year between 1900 and 2030')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      console.log('�� Submitting vehicle data:', extractedData)
      
      // Convert File[] to VehicleImage[]
      const convertedImages: VehicleImage[] = vehicleImages.map((file, index) => ({
        image_url: URL.createObjectURL(file),
        image_type: 'exterior',
        is_primary: index === 0
      }))

      const vehicleData: VehicleData = {
        vin: extractedData.vin,
        make: extractedData.make,
        model: extractedData.model,
        year: extractedData.year,
        trim: extractedData.trim,
        mileage: extractedData.mileage,
        color: extractedData.color,
        fuel_type: extractedData.fuelType,
        transmission: extractedData.transmission,
        condition: extractedData.condition,
        features: extractedData.features,
        description: extractedData.description,
        estimated_price: extractedData.estimatedPrice,
        location: extractedData.location,
        images: convertedImages,
        // Additional fields from Carfax
        accident_history: extractedData.accidentHistory,
        service_history: extractedData.serviceHistory,
        ownership_history: extractedData.ownershipHistory
      }

      console.log('📝 Final vehicle data:', vehicleData)

      const result = await vehicleService.addVehicle(vehicleData)
      
      console.log('✅ Vehicle added successfully:', result.vehicleId)
      router.push('/admin/inventory')
    } catch (error) {
      console.error('❌ Failed to add vehicle:', error)
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to add vehicle'
      
      if (error instanceof Error) {
        if (error.message.includes('VIN must be exactly 17 characters')) {
          errorMessage = 'Please enter a valid 17-character VIN number'
        } else if (error.message.includes('Missing required fields')) {
          errorMessage = 'Please fill in all required fields (Make, Model, VIN)'
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'A vehicle with this VIN already exists in the database'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/inventory" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI Vehicle Data Extraction
          </h1>
          <p className="text-gray-600">
            Extract vehicle information from Carfax URLs using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* URL Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Carfax URL Input
            </h2>

            {/* URL Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carfax Vehicle Report URL
              </label>
              <input
                type="url"
                value={carfaxUrl}
                onChange={(e) => setCarfaxUrl(e.target.value)}
                placeholder="https://www.carfax.com/vehicle/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Paste the full Carfax URL for the vehicle you want to extract data from
              </p>
            </div>

            {/* Extract Button */}
            <button
              onClick={handleExtract}
              disabled={!carfaxUrl.trim() || isExtracting}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting with AI...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Extract Vehicle Data
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Data Verification & Editing Section */}
          {extractedData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Verify & Edit Vehicle Data
                </h2>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">AI Data Extracted</span>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make *
                    </label>
                    <input
                      type="text"
                      value={extractedData.make}
                      onChange={(e) => handleDataChange('make', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Toyota"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={extractedData.model}
                      onChange={(e) => handleDataChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Camry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={extractedData.year}
                      onChange={(e) => handleDataChange('year', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2023"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trim
                    </label>
                    <input
                      type="text"
                      value={extractedData.trim}
                      onChange={(e) => handleDataChange('trim', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., SE"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VIN *
                    </label>
                    <input
                      type="text"
                      value={extractedData.vin}
                      onChange={(e) => handleDataChange('vin', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="17-character VIN"
                      maxLength={17}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage
                    </label>
                    <input
                      type="number"
                      value={extractedData.mileage}
                      onChange={(e) => handleDataChange('mileage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={extractedData.color}
                      onChange={(e) => handleDataChange('color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <EnhancedDropdown
                      value={extractedData.condition}
                      onChange={(value) => handleDataChange('condition', value)}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <EnhancedDropdown
                      value={extractedData.fuelType}
                      onChange={(value) => handleDataChange('fuelType', value)}
                      options={[
                        { value: 'gasoline', label: 'Gasoline' },
                        { value: 'diesel', label: 'Diesel' },
                        { value: 'electric', label: 'Electric' },
                        { value: 'hybrid', label: 'Hybrid' }
                      ]}
                      placeholder="Select fuel type"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    <EnhancedDropdown
                      value={extractedData.transmission}
                      onChange={(value) => handleDataChange('transmission', value)}
                      options={[
                        { value: 'automatic', label: 'Automatic' },
                        { value: 'manual', label: 'Manual' }
                      ]}
                      placeholder="Select transmission"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Price (GHS)
                    </label>
                    <input
                      type="number"
                      value={extractedData.estimatedPrice}
                      onChange={(e) => handleDataChange('estimatedPrice', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={extractedData.location}
                      onChange={(e) => handleDataChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Accra, Ghana"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={extractedData.features.join(', ')}
                    onChange={(e) => handleFeaturesChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Leather Seats, Navigation, Bluetooth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={extractedData.description}
                    onChange={(e) => handleDataChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vehicle description..."
                  />
                </div>

                {/* Additional History Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accident History
                  </label>
                  <textarea
                    value={extractedData.accidentHistory || ''}
                    onChange={(e) => handleDataChange('accidentHistory', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Accident history details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service History
                  </label>
                  <textarea
                    value={extractedData.serviceHistory || ''}
                    onChange={(e) => handleDataChange('serviceHistory', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Service history details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ownership History
                  </label>
                  <textarea
                    value={extractedData.ownershipHistory || ''}
                    onChange={(e) => handleDataChange('ownershipHistory', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ownership history details..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Upload Section */}
        {extractedData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📸 Vehicle Images
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Vehicle Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select multiple images. First image will be the primary photo.
              </p>
            </div>

            {vehicleImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicleImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Vehicle image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {index === 0 ? 'Primary' : `${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {extractedData && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Add Vehicle to Inventory
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 