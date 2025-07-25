'use client'

import React, { useState } from 'react'
import { ArrowLeft, Database, CheckCircle, AlertCircle, Loader2, Upload, Plus } from 'lucide-react'
import Link from 'next/link'

interface VehicleData {
  make: string
  model: string
  year: number
  trim: string
  mileage: number
  color: string
  fuelType: string
  transmission: string
  vin: string
  condition: string
  features: string[]
  description: string
  estimatedPrice: number
  location: string
  engine?: string
  drivetrain?: string
  bodyType?: string
  series?: string
  trim2?: string
  bodyCabType?: string
  vehicleType?: string
  doors?: string
  seats?: string
  seatRows?: string
  engineConfiguration?: string
  engineCylinders?: string
  engineHP?: string
  displacementL?: string
  displacementCC?: string
  fuelTypeSecondary?: string
  electrificationLevel?: string
  transmissionSpeeds?: string
  turbo?: string
  otherEngineInfo?: string
  batteryInfo?: string
  batteryType?: string
  batteryKWh?: string
  batteryV?: string
  chargerLevel?: string
  chargerPowerKW?: string
  evDriveUnit?: string
  bedLengthIN?: string
  gvwr?: string
  curbWeightLB?: string
  wheelBaseLong?: string
  wheelBaseShort?: string
  trackWidth?: string
  wheelSizeFront?: string
  wheelSizeRear?: string
  topSpeedMPH?: string
  abs?: string
  esc?: string
  tractionControl?: string
  airBagLocFront?: string
  airBagLocSide?: string
  airBagLocCurtain?: string
  airBagLocKnee?: string
  seatBeltsAll?: string
  otherRestraintSystemInfo?: string
  adaptiveCruiseControl?: string
  adaptiveHeadlights?: string
  adaptiveDrivingBeam?: string
  forwardCollisionWarning?: string
  laneDepartureWarning?: string
  laneKeepSystem?: string
  laneCenteringAssistance?: string
  blindSpotMon?: string
  blindSpotIntervention?: string
  parkAssist?: string
  rearVisibilitySystem?: string
  rearCrossTrafficAlert?: string
  rearAutomaticEmergencyBraking?: string
  pedestrianAutomaticEmergencyBraking?: string
  autoReverseSystem?: string
  dynamicBrakeSupport?: string
  daytimeRunningLight?: string
  lowerBeamHeadlampLightSource?: string
  semiautomaticHeadlampBeamSwitching?: string
  keylessIgnition?: string
  tpms?: string
  entertainmentSystem?: string
  windows?: string
  wheels?: string
  manufacturer?: string
  plantCity?: string
  plantState?: string
  plantCountry?: string
  destinationMarket?: string
  errorText?: string
  additionalErrorText?: string
  note?: string
}

interface VehicleImage {
  file: File
  preview: string
  type: string
  isPrimary: boolean
}

export default function VINExtractionPage() {
  const [vin, setVin] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<VehicleData | null>(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [images, setImages] = useState<VehicleImage[]>([])
  
  // Form data for manual editing
  const [formData, setFormData] = useState<Partial<VehicleData>>({})

  const handleVINExtraction = async () => {
    if (!vin || vin.length !== 17) {
      setError('Please enter a valid 17-character VIN')
      return
    }

    setIsExtracting(true)
    setError('')
    setExtractedData(null)

    try {
      const response = await fetch('/api/extract-carfax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin: vin.toUpperCase() }),
      })

      const data = await response.json()
      
      if (data.success) {
        setExtractedData(data.data)
        setFormData(data.data)
        console.log('✅ Vehicle data extracted:', data.data)
      } else {
        setError(data.error || 'Failed to extract vehicle data')
      }
    } catch (error) {
      console.error('❌ Extraction error:', error)
      setError('Network error during extraction')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: VehicleImage[] = Array.from(files).map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        type: 'exterior',
        isPrimary: index === 0
      }))
      setImages([...images, ...newImages])
    }
  }

  const handleSaveVehicle = async () => {
    setIsSaving(true)
    setError('')

    try {
      // Upload images first
      const uploadedImages: { image_url: string; image_type: string; is_primary: boolean }[] = []
      
      for (const image of images) {
        // Here you would upload to your storage service
        // For now, we'll use a placeholder
        uploadedImages.push({
          image_url: image.preview,
          image_type: image.type,
          is_primary: image.isPrimary
        })
      }

      // Save vehicle data
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect to inventory or show success message
        window.location.href = '/admin/inventory'
      } else {
        setError(data.error || 'Failed to save vehicle')
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      setError('Network error during save')
    } finally {
      setIsSaving(false)
    }
  }

  const updateFormData = (field: keyof VehicleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/inventory/add" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Add Vehicle
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🗄️ VIN Data Extraction
          </h1>
          <p className="text-gray-600">
            Extract comprehensive vehicle specifications using our proprietary database
          </p>
        </div>

        {/* VIN Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 text-blue-600 mr-2" />
            Vehicle Identification
          </h2>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VIN (Vehicle Identification Number)
              </label>
              <input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                maxLength={17}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the 17-character VIN to extract comprehensive vehicle data
              </p>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleVINExtraction}
                disabled={isExtracting || vin.length !== 17}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Extract Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="text-sm text-red-600 mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Data Form */}
        {extractedData && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Data Extracted Successfully!</h3>
                  <div className="text-sm text-green-600 mt-1">
                    Vehicle specifications have been extracted. Review and edit the information below.
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Vehicle Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    value={formData.make || ''}
                    onChange={(e) => updateFormData('make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => updateFormData('model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => updateFormData('year', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                  <input
                    type="text"
                    value={formData.trim || ''}
                    onChange={(e) => updateFormData('trim', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <input
                    type="text"
                    value={formData.vin || ''}
                    onChange={(e) => updateFormData('vin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <input
                    type="text"
                    value={formData.bodyType || ''}
                    onChange={(e) => updateFormData('bodyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Engine & Powertrain */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Engine & Powertrain
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
                  <input
                    type="text"
                    value={formData.engine || ''}
                    onChange={(e) => updateFormData('engine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine HP</label>
                  <input
                    type="text"
                    value={formData.engineHP || ''}
                    onChange={(e) => updateFormData('engineHP', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drivetrain</label>
                  <input
                    type="text"
                    value={formData.drivetrain || ''}
                    onChange={(e) => updateFormData('drivetrain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType || ''}
                    onChange={(e) => updateFormData('fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select fuel type</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select
                    value={formData.transmission || ''}
                    onChange={(e) => updateFormData('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select transmission</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                  <input
                    type="number"
                    value={formData.mileage || ''}
                    onChange={(e) => updateFormData('mileage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Business Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.color || ''}
                    onChange={(e) => updateFormData('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={formData.condition || ''}
                    onChange={(e) => updateFormData('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Price</label>
                  <input
                    type="number"
                    value={formData.estimatedPrice || ''}
                    onChange={(e) => updateFormData('estimatedPrice', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Vehicle Images
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload vehicle images (exterior, interior, engine, etc.)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Images
                </label>
              </div>
              
              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Vehicle image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveVehicle}
                disabled={isSaving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save Vehicle
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 