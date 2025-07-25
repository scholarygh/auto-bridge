'use client'

import React, { useState, useRef } from 'react'
import { 
  Car, 
  Camera, 
  FileText, 
  CheckCircle, 
  Upload, 
  X, 
  AlertCircle,
  Loader2,
  Search,
  MapPin,
  Phone,
  Mail,
  User,
  Info
} from 'lucide-react'
import Dialog from '@/components/ui/Dialog'
import { useDialog } from '@/hooks/useDialog'
import Input from '@/components/ui/Input'
import Dropdown from '@/components/ui/Dropdown'
import Button from '@/components/ui/Button'

const steps = [
  { id: 1, title: 'VIN & Basic Info', icon: Car, required: ['vin', 'make', 'model', 'year'] },
  { id: 2, title: 'Photos', icon: Camera, required: ['images'] },
  { id: 3, title: 'Contact Info', icon: User, required: ['name', 'email', 'phone'] },
  { id: 4, title: 'Review & Submit', icon: FileText, required: [] }
]

const conditionOptions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
]

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [vinData, setVinData] = useState<any>(null)
  const [vinLoading, setVinLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Dialog management
  const { dialog, showSuccess, showError, showLoading, hideDialog } = useDialog()
  
  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    description: '',
    location: '',
    name: '',
    email: '',
    phone: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // VIN validation and data fetching
  const validateVIN = async () => {
    if (!formData.vin || formData.vin.length !== 17) {
      showError('Invalid VIN', 'Please enter a valid 17-character VIN')
      return false
    }

    setVinLoading(true)
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${formData.vin}?format=json`)
      const data = await response.json()
      
      console.log('🔍 Raw NHTSA Response:', data)
      
      if (data.Results && data.Results.length > 0) {
        // Process the Results array to extract vehicle information
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
        console.log('🔍 Looking for Model Year:', vehicleInfo['Model Year'])
        console.log('🔍 Looking for Body Class:', vehicleInfo['Body Class'])
        
        setVinData(vehicleInfo)
        
        // Auto-fill form with VIN data
        setFormData(prev => ({
          ...prev,
          make: vehicleInfo.Make || prev.make,
          model: vehicleInfo.Model || prev.model,
          year: vehicleInfo['Model Year'] || prev.year,
        }))

        return true
      } else {
        showError('VIN Not Found', 'No vehicle data found for this VIN. Please check the VIN and try again.')
        return false
      }
    } catch (error) {
      console.error('Error validating VIN:', error)
      showError('VIN Validation Error', 'Error validating VIN. Please try again.')
    } finally {
      setVinLoading(false)
    }
    return false
  }

  // Image upload handling
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length + images.length > 20) {
      showError('Too Many Images', 'Maximum 20 images allowed')
      return
    }

    setImages(prev => [...prev, ...validFiles])
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = async () => {
    const currentStepData = steps[currentStep - 1]
    
    // Validate required fields for current step
    for (const field of currentStepData.required) {
      if (field === 'images' && images.length === 0) {
        showError('Images Required', 'Please upload at least one image of your vehicle.')
        return
      } else if (field === 'vin' && !formData.vin) {
        showError('VIN Required', 'Please enter a VIN to continue.')
        return
      } else if (formData[field as keyof typeof formData] === '') {
        showError('Field Required', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`)
        return
      }
    }

    // Special validation for VIN
    if (currentStep === 1 && formData.vin) {
      const isValid = await validateVIN()
      if (!isValid) return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Show loading dialog
      showLoading('Submitting Vehicle', 'Please wait while we process your submission...')
      
      // Upload images to Supabase storage
      const uploadedImageUrls = []
      
      for (const image of images) {
        const formData = new FormData()
        formData.append('file', image)
        
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          uploadedImageUrls.push(data.url)
        }
      }

      // Submit vehicle request for admin review
      const submissionData = {
        ...formData,
        images: uploadedImageUrls,
        vinData,
        status: 'pending_review',
        submittedAt: new Date().toISOString()
      }

      const response = await fetch('/api/sell-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })
      
      if (response.ok) {
        console.log('✅ Vehicle submission sent for admin review')
        
        // Show success dialog
        showSuccess(
          'Submission Successful! 🎉',
          'Your vehicle has been submitted for review. Our team will contact you within 24-48 hours to discuss next steps.'
        )
        
        // Reset form
        setFormData({
          vin: '',
          make: '',
          model: '',
          year: '',
          mileage: '',
          condition: '',
          description: '',
          location: '',
          name: '',
          email: '',
          phone: ''
        })
        setImages([])
        setImageUrls([])
        setVinData(null)
        setCurrentStep(1)
      } else {
        console.error('❌ Failed to submit vehicle request')
        showError(
          'Submission Failed',
          'We encountered an issue while processing your submission. Please try again or contact support if the problem persists.'
        )
      }
    } catch (error) {
      console.error('❌ Error submitting vehicle request:', error)
      showError(
        'Submission Error',
        'An unexpected error occurred. Please check your internet connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sell Your Car
          </h1>
          <p className="text-xl text-gray-600">
            Submit your vehicle for admin review and listing
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: VIN & Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Car className="w-6 h-6 text-blue-600" />
                    Vehicle Information
                  </h2>
                  
                  {/* VIN Input */}
                  <div className="mb-6">
                    <Input
                      label="VIN Number *"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                      placeholder="Enter 17-character VIN"
                      maxLength={17}
                      className="font-mono"
                      rightIcon={
                        <Button
                          type="button"
                          onClick={validateVIN}
                          disabled={vinLoading || !formData.vin}
                          variant="primary"
                          size="sm"
                          className="ml-2"
                        >
                          {vinLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Validating...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4" />
                              Validate
                            </>
                          )}
                        </Button>
                      }
                    />
                  </div>

                  {/* VIN Data Display */}
                  {vinData && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">VIN Validated Successfully</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Make:</span>
                          <span className="ml-2 font-medium">{vinData.Make || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Model:</span>
                          <span className="ml-2 font-medium">{vinData.Model || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Year:</span>
                          <span className="ml-2 font-medium">{vinData['Model Year'] || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Body Type:</span>
                          <span className="ml-2 font-medium">{vinData['Body Class'] || 'N/A'}</span>
                        </div>
                        {vinData.Series && (
                          <div>
                            <span className="text-gray-600">Series:</span>
                            <span className="ml-2 font-medium">{vinData.Series}</span>
                          </div>
                        )}
                        {vinData['Engine Brake (hp) From'] && (
                          <div>
                            <span className="text-gray-600">Engine HP:</span>
                            <span className="ml-2 font-medium">{vinData['Engine Brake (hp) From']}</span>
                          </div>
                        )}
                        {vinData['Displacement (L)'] && (
                          <div>
                            <span className="text-gray-600">Engine Size:</span>
                            <span className="ml-2 font-medium">{vinData['Displacement (L)']}L</span>
                          </div>
                        )}
                        {vinData['Fuel Type - Primary'] && (
                          <div>
                            <span className="text-gray-600">Fuel Type:</span>
                            <span className="ml-2 font-medium">{vinData['Fuel Type - Primary']}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Basic Vehicle Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Make *"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      placeholder="e.g., Toyota"
                      required
                    />
                    
                    <Input
                      label="Model *"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="e.g., Camry"
                      required
                    />
                    
                    <Input
                      label="Year *"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                    
                    <Input
                      label="Mileage *"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      placeholder="e.g., 50000"
                      min="0"
                      required
                    />
                    
                    <Dropdown
                      label="Condition *"
                      options={conditionOptions}
                      value={formData.condition}
                      onChange={(value) => handleInputChange('condition', value)}
                      placeholder="Select condition"
                      required
                    />
                    
                    <Input
                      label="Location *"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Accra, Ghana"
                      leftIcon={<MapPin className="w-4 h-4" />}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your vehicle, any modifications, service history, etc."
                    multiline
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600" />
                    Vehicle Photos
                  </h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Photo Guidelines</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Upload clear, high-quality photos of your vehicle</li>
                      <li>• Include exterior shots from multiple angles</li>
                      <li>• Show interior condition and features</li>
                      <li>• Highlight any damage or issues</li>
                      <li>• Maximum 20 photos, 5MB each</li>
                    </ul>
                  </div>

                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {images.length === 0 ? (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Upload Vehicle Photos
                        </p>
                        <p className="text-gray-600 mb-4">
                          Drag and drop images here, or click to browse
                        </p>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="primary"
                        >
                          Choose Files
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Vehicle photo ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="primary"
                        >
                          Add More Photos
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-600" />
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      leftIcon={<User className="w-4 h-4" />}
                      required
                    />
                    
                    <Input
                      label="Email Address *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      required
                    />
                    
                    <Input
                      label="Phone Number *"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      leftIcon={<Phone className="w-4 h-4" />}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Review & Submit
                  </h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">VIN:</span>
                        <span className="ml-2 font-medium font-mono">{formData.vin}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="ml-2 font-medium">{formData.year} {formData.make} {formData.model}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mileage:</span>
                        <span className="ml-2 font-medium">{formData.mileage} miles</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Condition:</span>
                        <span className="ml-2 font-medium capitalize">{formData.condition}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 font-medium">{formData.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Photos:</span>
                        <span className="ml-2 font-medium">{images.length} uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{formData.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{formData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Ready to Submit</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your vehicle information has been reviewed and is ready for admin review. 
                      Click "Submit for Review" to send your submission.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  variant="primary"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  variant="success"
                  loading={loading}
                  rightIcon={<FileText className="w-4 h-4" />}
                >
                  Submit for Review
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Beautiful Dialog Component */}
      <Dialog {...dialog} onClose={hideDialog} />
    </div>
  )
} 