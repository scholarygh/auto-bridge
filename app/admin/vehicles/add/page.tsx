'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Car, 
  Camera, 
  Search, 
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
  Star
} from 'lucide-react'
import { vehicleService } from '@/lib/dataService'
import { storageService, imageUtils } from '@/lib/storageService'
import ImageUpload from '@/components/ImageUpload'
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

const initialFormData: VehicleFormData = {
  vin: '',
  title: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  trim: '',
  body_type: '',
  price: 0,
  condition: 'excellent',
  mileage: 0,
  fuel_type: 'gasoline',
  transmission: 'automatic',
  engine_type: '',
  engine_size: '',
  cylinders: 0,
  horsepower: 0,
  torque: 0,
  color: '',
  interior: '',
  doors: 4,
  seats: 5,
  manufacturer: '',
  plant_city: '',
  plant_state: '',
  plant_country: '',
  vehicle_type: '',
  body_class: '',
  gross_vehicle_weight_rating: 0,
  description: '',
  features: [],
  images: [],
  location: '',
  status: 'available',
  views: 0,
  inquiries: 0,
  is_featured: false
}

export default function AddVehiclePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState('')
  const [extractionSuccess, setExtractionSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicleId, setVehicleId] = useState<string>('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isCreatingTemp, setIsCreatingTemp] = useState(false)

  const steps = [
    { id: 1, title: 'VIN Lookup', icon: Search, description: 'Extract vehicle data from VIN' },
    { id: 2, title: 'Basic Info', icon: Car, description: 'Vehicle specifications' },
    { id: 3, title: 'Pricing & Condition', icon: DollarSign, description: 'Pricing and vehicle condition' },
    { id: 4, title: 'Images', icon: Camera, description: 'Upload vehicle photos' },
    { id: 5, title: 'Review & Save', icon: Save, description: 'Review and save vehicle' }
  ]

  // Extract vehicle data from VIN
  const extractVehicleData = async () => {
    if (!formData.vin.trim()) {
      setExtractionError('Please enter a VIN')
      return
    }

    setIsExtracting(true)
    setExtractionError('')
    setExtractionSuccess(false)

    try {
      // Use the same NHTSA API approach as the sell page for consistency
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${formData.vin.trim()}?format=json`)
      const data = await response.json()
      
      console.log('🔍 Raw NHTSA Response:', data)
      
      if (data.Results && data.Results.length > 0) {
        // Process the Results array to extract vehicle information (same as sell page)
        const vehicleInfo: any = {}
        
        data.Results.forEach((item: any) => {
          // Only add values that are not empty, null, or "0"
          if (item.Value && 
              item.Value !== '0' && 
              item.Value !== 'null' && 
              item.Value !== '' && 
              item.Value !== 'Not Applicable') {
            vehicleInfo[item.Variable] = item.Value
          }
        })

        console.log('🔍 VIN Data extracted:', vehicleInfo)
        
        // Map the extracted data to our form structure
        const extractedData = {
          make: vehicleInfo.Make || 'Unknown',
          model: vehicleInfo.Model || 'Unknown',
          year: vehicleInfo['Model Year'] ? parseInt(vehicleInfo['Model Year']) : new Date().getFullYear(),
          trim: vehicleInfo.Trim || '',
          bodyType: vehicleInfo['Body Class'] || 'Unknown',
          fuelType: vehicleInfo['Fuel Type - Primary'] ? vehicleInfo['Fuel Type - Primary'].toLowerCase() : 'gasoline',
          transmission: vehicleInfo.TransmissionStyle || 'automatic',
          engine: vehicleInfo.EngineModel || 'Unknown',
          engineHP: vehicleInfo['Engine Brake (hp) From'] || '',
          displacementL: vehicleInfo['Displacement (L)'] || '',
          engineCylinders: vehicleInfo.EngineCylinders || '',
          drivetrain: vehicleInfo['Drive Type'] || 'Unknown',
          manufacturer: vehicleInfo['Manufacturer Name'] || '',
          plantCity: vehicleInfo['Plant City'] || '',
          plantState: vehicleInfo['Plant State'] || '',
          plantCountry: vehicleInfo['Plant Country'] || '',
          vehicleType: vehicleInfo['Vehicle Type'] || 'Unknown',
          doors: vehicleInfo.Doors || '',
          seats: vehicleInfo.Seats || '',
          description: `${vehicleInfo['Model Year'] || ''} ${vehicleInfo.Make || ''} ${vehicleInfo.Model || ''} ${vehicleInfo.Series || ''}`.trim()
        }
        
        // Update form with extracted data
        setFormData(prev => ({
          ...prev,
          make: extractedData.make || prev.make,
          model: extractedData.model || prev.model,
          year: extractedData.year || prev.year,
          trim: extractedData.trim || prev.trim,
          body_type: extractedData.bodyType || prev.body_type,
          fuel_type: extractedData.fuelType || prev.fuel_type,
          transmission: extractedData.transmission || prev.transmission,
          engine_type: extractedData.engine || prev.engine_type,
          manufacturer: extractedData.manufacturer || prev.manufacturer,
          plant_city: extractedData.plantCity || prev.plant_city,
          plant_state: extractedData.plantState || prev.plant_state,
          plant_country: extractedData.plantCountry || prev.plant_country,
          vehicle_type: extractedData.vehicleType || prev.vehicle_type,
          body_class: extractedData.bodyType || prev.body_class,
          doors: extractedData.doors ? parseInt(extractedData.doors) : prev.doors,
          seats: extractedData.seats ? parseInt(extractedData.seats) : prev.seats,
          engine_size: extractedData.displacementL || prev.engine_size,
          cylinders: extractedData.engineCylinders ? parseInt(extractedData.engineCylinders) : prev.cylinders,
          horsepower: extractedData.engineHP ? parseInt(extractedData.engineHP) : prev.horsepower,
          description: extractedData.description || prev.description,
          title: `${extractedData.year || prev.year} ${extractedData.make || prev.make} ${extractedData.model || prev.model}${extractedData.trim ? ` ${extractedData.trim}` : ''}`
        }))

        setExtractionSuccess(true)
        setCurrentStep(2) // Move to next step
      } else {
        throw new Error('No vehicle data found for this VIN')
      }
    } catch (error) {
      console.error('Extraction error:', error)
      setExtractionError(error instanceof Error ? error.message : 'Failed to extract vehicle data')
    } finally {
      setIsExtracting(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle image uploads - FIXED: Prevent duplication
  const handleImagesUploaded = (urls: string[]) => {
    console.log('Images uploaded:', urls)
    console.log('Current uploaded images:', uploadedImages)
    
    // Only add new URLs that aren't already in the list
    const newUrls = urls.filter(url => !uploadedImages.includes(url))
    console.log('New unique URLs:', newUrls)
    
    setUploadedImages(prev => {
      const updated = [...prev, ...newUrls]
      console.log('Updated uploaded images:', updated)
      return updated
    })
    
    setFormData(prev => {
      const updated = { ...prev, images: [...prev.images, ...newUrls] }
      console.log('Updated form data images:', updated.images)
      return updated
    })
  }

  // Create temporary vehicle for image uploads
  const createTemporaryVehicle = async () => {
    if (vehicleId) return vehicleId // Already exists

    setIsCreatingTemp(true)
    setExtractionError('')

    try {
      // Create a minimal vehicle record for image uploads with all required fields
      const tempVehicleData = {
        title: formData.title || 'Temporary Vehicle',
        make: formData.make || 'Unknown',
        model: formData.model || 'Unknown',
        year: formData.year || new Date().getFullYear(),
        vin: formData.vin || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        price: formData.price || 0,
        mileage: formData.mileage || 0,
        color: formData.color || 'Unknown',
        location: formData.location || 'Unknown Location',
        description: formData.description || 'Temporary vehicle for image uploads',
        status: 'sourcing' as const,
        images: [],
        // Add other required fields with defaults
        condition: 'good' as const,
        fuel_type: 'gasoline' as const,
        transmission: 'automatic' as const,
        views: 0,
        inquiries: 0,
        is_featured: false,
        features: []
      }

      console.log('Creating temporary vehicle with data:', tempVehicleData)

      const { data, error } = await vehicleService.create(tempVehicleData)
      
      if (error) {
        console.error('Failed to create temporary vehicle:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Failed to create temporary vehicle: ${error.message}`)
      }

      if (data) {
        setVehicleId(data.id)
        return data.id
      }
    } catch (error) {
      console.error('Create temporary vehicle error:', error)
      setExtractionError(error instanceof Error ? error.message : 'Failed to create temporary vehicle')
      throw error
    } finally {
      setIsCreatingTemp(false)
    }
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
    // You could add a toast notification here
  }

  // Save vehicle to database - FIXED: Proper save functionality
  const saveVehicle = async () => {
    setIsLoading(true)

    try {
      // Create vehicle data with all required fields
      const vehicleData = {
        ...formData,
        // Use uploaded images if available, otherwise use form images
        images: uploadedImages.length > 0 ? uploadedImages : (formData.images.length > 0 ? formData.images : []),
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
        status: formData.status || 'available',
        views: 0,
        inquiries: 0,
        is_featured: false
      }

      console.log('Saving vehicle data:', vehicleData)
      console.log('Uploaded images count:', uploadedImages.length)
      console.log('Form images count:', formData.images.length)
      console.log('Features count:', formData.features.length)

      let result
      
      if (vehicleId) {
        // Update existing vehicle (temporary vehicle created for image uploads)
        console.log('Updating existing vehicle:', vehicleId)
        result = await vehicleService.update(vehicleId, vehicleData)
      } else {
        // Create new vehicle
        console.log('Creating new vehicle')
        result = await vehicleService.create(vehicleData)
      }

      const { data, error } = result

      if (error) {
        console.error('Save error:', error)
        throw new Error(error.message || 'Failed to save vehicle')
      }

      if (data) {
        console.log('Vehicle saved successfully:', data)
        setVehicleId(data.id)
        setCurrentStep(5) // Show success step
      } else {
        throw new Error('No data returned from save operation')
      }
    } catch (error) {
      console.error('Save error:', error)
      setExtractionError(error instanceof Error ? error.message : 'Failed to save vehicle')
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Go to specific step
  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
            <p className="text-gray-600 mt-1">Create a new vehicle listing with comprehensive details</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/vehicles')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => goToStep(step.id)}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </button>
              <div className="ml-3">
                <div className={`font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-sm text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Step 1: VIN Lookup */}
        {currentStep === 1 && (
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Search className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vehicle Identification Number (VIN)
                </h2>
                <p className="text-gray-600">
                  Enter the VIN to automatically extract vehicle specifications from our comprehensive database
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VIN Number *
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                      placeholder="Enter 17-digit VIN (e.g., 1HGBH41JXMN109186)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={17}
                    />
                    <button
                      onClick={extractVehicleData}
                      disabled={isExtracting || !formData.vin.trim()}
                      className="btn-primary flex items-center space-x-2 px-6"
                    >
                      {isExtracting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                      <span>{isExtracting ? 'Extracting...' : 'Extract Data'}</span>
                    </button>
                  </div>
                </div>

                {/* Extraction Status */}
                {extractionError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      <span className="text-red-800">{extractionError}</span>
                    </div>
                  </div>
                )}

                {extractionSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-800">Vehicle data extracted successfully!</span>
                    </div>
                  </div>
                )}

                {/* VIN Help */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Where to find the VIN:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Driver's side dashboard (visible through windshield)</li>
                        <li>Driver's side door jamb</li>
                        <li>Vehicle registration documents</li>
                        <li>Insurance card</li>
                        <li>Title or registration certificate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 2 && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Car className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vehicle Specifications
                </h2>
                <p className="text-gray-600">
                  Review and update the vehicle specifications extracted from the VIN
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                    <input
                      type="text"
                      value={formData.body_type}
                      onChange={(e) => handleInputChange('body_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Technical Specifications</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cylinders</label>
                      <input
                        type="number"
                        value={formData.cylinders}
                        onChange={(e) => handleInputChange('cylinders', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Horsepower</label>
                      <input
                        type="number"
                        value={formData.horsepower}
                        onChange={(e) => handleInputChange('horsepower', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Torque (lb-ft)</label>
                      <input
                        type="number"
                        value={formData.torque}
                        onChange={(e) => handleInputChange('torque', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doors</label>
                      <input
                        type="number"
                        value={formData.doors}
                        onChange={(e) => handleInputChange('doors', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="2"
                        max="6"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                      <input
                        type="number"
                        value={formData.seats}
                        onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="2"
                        max="15"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Condition */}
        {currentStep === 3 && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <DollarSign className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pricing & Condition
                </h2>
                <p className="text-gray-600">
                  Set the vehicle price and condition details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      placeholder="Enter price in USD"
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
                      placeholder="Enter original price in USD"
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
                      placeholder="Enter mileage in miles"
                    />
                    {formData.mileage > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.mileage.toLocaleString()} miles = {formatMileageForDisplay(formData.mileage)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Condition & Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Condition & Details</h3>
                  
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interior</label>
                    <input
                      type="text"
                      value={formData.interior}
                      onChange={(e) => handleInputChange('interior', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location (US)</label>
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
                        { value: 'available', label: 'Available' },
                        { value: 'reserved', label: 'Reserved' },
                        { value: 'sold', label: 'Sold' },
                        { value: 'maintenance', label: 'Maintenance' },
                        { value: 'sourcing', label: 'Sourcing' }
                      ]}
                      placeholder="Select status"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the vehicle's features, condition, history, and any special details..."
                />
              </div>

              {/* Features */}
              <div className="mt-8">
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
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Images */}
        {currentStep === 4 && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vehicle Images
                </h2>
                <p className="text-gray-600">
                  Upload high-quality photos of the vehicle to attract potential buyers
                </p>
              </div>

              <div className="mb-4">
                <button
                  onClick={createTemporaryVehicle}
                  disabled={!!vehicleId || isCreatingTemp}
                  className={`mb-4 ${vehicleId ? 'btn-success' : 'btn-secondary'}`}
                >
                  {isCreatingTemp ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : vehicleId ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <FileText className="w-5 h-5 mr-2" />
                  )}
                  {vehicleId ? 'Vehicle Ready for Images' : isCreatingTemp ? 'Preparing...' : 'Prepare Vehicle for Image Upload'}
                </button>
                
                {vehicleId && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-800">Vehicle prepared successfully! You can now upload images.</span>
                    </div>
                  </div>
                )}
                
                {extractionError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      <span className="text-red-800">{extractionError}</span>
                    </div>
                  </div>
                )}
              </div>

              <ImageUpload
                vehicleId={vehicleId}
                onImagesUploaded={handleImagesUploaded}
                onUploadError={handleUploadError}
                maxImages={20}
                className="max-w-2xl mx-auto"
              />

              {/* Image Upload Tips */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">Tips for great vehicle photos:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Take photos in good lighting (natural light is best)</li>
                      <li>Include exterior shots from multiple angles</li>
                      <li>Show the interior, dashboard, and seats</li>
                      <li>Highlight any damage or wear honestly</li>
                      <li>Include photos of the engine bay if possible</li>
                      <li>Show the vehicle's best features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Save */}
        {currentStep === 5 && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Save className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review & Save Vehicle
                </h2>
                <p className="text-gray-600">
                  Review all the information before saving the vehicle to the database
                </p>
              </div>

              {/* Vehicle Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VIN:</span>
                      <span className="font-medium">{formData.vin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Make/Model:</span>
                      <span className="font-medium">{formData.make} {formData.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-medium">{formData.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">
                        {formatPriceUSD(formData.price)} = {formatPriceGHS(convertUSDToGHSSync(formData.price))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-medium">
                        {formData.mileage.toLocaleString()} mi = {formatMileageForDisplay(formData.mileage)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="font-medium capitalize">{formData.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-medium capitalize">{formData.fuel_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transmission:</span>
                      <span className="font-medium capitalize">{formData.transmission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium">{formData.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images:</span>
                      <span className="font-medium">{uploadedImages.length} uploaded</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="text-center">
                <button
                  onClick={saveVehicle}
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center space-x-2 px-8 py-4 text-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Save className="w-6 h-6" />
                  )}
                  <span>{isLoading ? 'Saving Vehicle...' : 'Save Vehicle'}</span>
                </button>
              </div>

              {/* Success Message */}
              {vehicleId && (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                      Vehicle Saved Successfully!
                    </h3>
                    <p className="text-green-700 mb-4">
                      The vehicle has been added to your inventory with ID: {vehicleId}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => router.push(`/admin/vehicles/${vehicleId}`)}
                        className="btn-primary"
                      >
                        View Vehicle
                      </button>
                      <button
                        onClick={() => router.push('/admin/vehicles')}
                        className="btn-secondary"
                      >
                        Back to Inventory
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {extractionError && (
                <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-800">{extractionError}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            className="btn-primary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
} 