'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  Palette, 
  Users, 
  Shield, 
  Truck, 
  MessageSquare, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Share2,
  MoreHorizontal,
  Settings,
  Copy,
  Archive,
  Tag
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync, formatMileageForDisplay } from '@/lib/utils'
import FeatureDisplay from '@/components/ui/FeatureDisplay'

export default function AdminVehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadVehicle()
    }
  }, [params.id])

  const loadVehicle = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading vehicle details:', params.id)
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load vehicle during server-side rendering')
        return
      }
      
      // Dynamic import to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      const result = await VehicleService.getVehicleById(params.id as string)
      
      if (result.success && result.vehicle) {
        console.log('✅ Vehicle loaded:', result.vehicle)
        setVehicle(result.vehicle)
      } else {
        console.error('❌ Failed to load vehicle:', result.error)
        setError(result.error || 'Vehicle not found')
      }
    } catch (err) {
      console.error('❌ Error loading vehicle:', err)
      setError('Failed to load vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      console.log('🗑️ Deleting vehicle:', params.id)
      
      const { VehicleService } = await import('@/lib/vehicleService')
      const result = await VehicleService.deleteVehicle(params.id as string) // Ensure it's a string
      
      if (result.success) {
        console.log('✅ Vehicle deleted successfully')
        router.push('/admin/vehicles')
      } else {
        console.error('❌ Failed to delete vehicle:', result.error)
        alert('Failed to delete vehicle. Please try again.')
      }
    } catch (err) {
      console.error('❌ Error deleting vehicle:', err)
      alert('Failed to delete vehicle. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      )
    }
  }

  const getVehicleImage = (index: number = 0) => {
    if (vehicle?.images && vehicle.images.length > index) {
      return vehicle.images[index]
    }
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
  }

  const generateVehicleDescription = (vehicle: any) => {
    const parts = []
    
    // Basic vehicle info
    if (vehicle.year && vehicle.make && vehicle.model) {
      parts.push(`This ${vehicle.year} ${vehicle.make} ${vehicle.model}`)
    }
    
    // Body type and style
    if (vehicle.body_type) {
      parts.push(`is a stylish ${vehicle.body_type.toLowerCase()}`)
    }
    
    // Condition
    if (vehicle.condition) {
      parts.push(`in ${vehicle.condition} condition`)
    }
    
    // Mileage
    if (vehicle.mileage) {
      parts.push(`with ${vehicle.mileage.toLocaleString()} miles on the odometer`)
    }
    
    // Engine and performance
    if (vehicle.engine_size || vehicle.horsepower) {
      const engineInfo = []
      if (vehicle.engine_size) engineInfo.push(vehicle.engine_size)
      if (vehicle.horsepower) engineInfo.push(`${vehicle.horsepower} horsepower`)
      if (engineInfo.length > 0) {
        parts.push(`powered by a ${engineInfo.join(', ')} engine`)
      }
    }
    
    // Transmission
    if (vehicle.transmission) {
      parts.push(`equipped with ${vehicle.transmission} transmission`)
    }
    
    // Fuel type
    if (vehicle.fuel_type) {
      parts.push(`running on ${vehicle.fuel_type}`)
    }
    
    // Color
    if (vehicle.color) {
      parts.push(`finished in ${vehicle.color.toLowerCase()}`)
    }
    
    // Features
    if (vehicle.features && vehicle.features.length > 0) {
      const featureCount = vehicle.features.length
      if (featureCount <= 3) {
        parts.push(`featuring ${vehicle.features.join(', ')}`)
      } else {
        parts.push(`loaded with ${featureCount} premium features including ${vehicle.features.slice(0, 3).join(', ')} and more`)
      }
    }
    
    // Location and shipping
    parts.push(`Currently located in ${vehicle.location || 'the United States'} and ready for import to Ghana.`)
    
    // Final touch
    parts.push(`This vehicle represents excellent value and is perfect for the Ghanaian market.`)
    
    return parts.join('. ') + '.'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'sourcing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This vehicle may have been removed or is no longer available.'}</p>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/admin/vehicles')} 
              className="btn-primary w-full"
            >
              Back to Vehicles
            </button>
            <button 
              onClick={() => router.back()} 
              className="btn-secondary w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicles
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/admin/vehicles/${params.id}/edit`)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Vehicle
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="relative aspect-[16/9] bg-gray-100">
                <img
                  src={getVehicleImage(currentImageIndex)}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {vehicle.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    {vehicle.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">
                    {vehicle.trim && `${vehicle.trim} • `}{vehicle.body_type || 'Vehicle'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    VIN: {vehicle.vin || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-600">Year</div>
                  <div className="font-semibold">{vehicle.year}</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Gauge className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600">Mileage</div>
                  <div className="font-semibold">
                    {vehicle.mileage ? formatMileageForDisplay(vehicle.mileage) : 'N/A'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Fuel className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm text-gray-600">Fuel Type</div>
                  <div className="font-semibold capitalize">{vehicle.fuel_type || 'N/A'}</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Cog className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-600">Transmission</div>
                  <div className="font-semibold capitalize">{vehicle.transmission || 'N/A'}</div>
                </div>
              </div>

              {/* Detailed Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Make</span>
                      <span className="font-medium">{vehicle.make}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model</span>
                      <span className="font-medium">{vehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year</span>
                      <span className="font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Body Type</span>
                      <span className="font-medium capitalize">{vehicle.body_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color</span>
                      <span className="font-medium capitalize">{vehicle.color || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition</span>
                      <span className="font-medium capitalize">{vehicle.condition || 'N/A'}</span>
                    </div>
                    {vehicle.engine_size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engine</span>
                        <span className="font-medium">{vehicle.engine_size}</span>
                      </div>
                    )}
                    {vehicle.horsepower && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Horsepower</span>
                        <span className="font-medium">{vehicle.horsepower} hp</span>
                      </div>
                    )}
                    {vehicle.cylinders && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cylinders</span>
                        <span className="font-medium">{vehicle.cylinders}</span>
                      </div>
                    )}
                    {vehicle.doors && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doors</span>
                        <span className="font-medium">{vehicle.doors}</span>
                      </div>
                    )}
                    {vehicle.seats && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats</span>
                        <span className="font-medium">{vehicle.seats}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Shipping</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{vehicle.location || 'USA'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Shipping Time</span>
                      <span className="font-medium">5-7 weeks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Duties</span>
                      <span className="font-medium">Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Clearance</span>
                      <span className="font-medium">Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <FeatureDisplay features={vehicle.features} />
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {vehicle.description || generateVehicleDescription(vehicle)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 relative">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="text-center mb-6">
                {vehicle.price ? (
                  <>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatPriceGHS(convertUSDToGHSSync(vehicle.price))}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${vehicle.price.toLocaleString()} USD
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">Price on Request</div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/admin/vehicles/${params.id}/edit`)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Vehicle
                </button>
                
                <button
                  onClick={() => window.open(`/vehicles/${params.id}`, '_blank')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View Public Page
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Views</span>
                  <span>{vehicle.views || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Inquiries</span>
                  <span>{vehicle.inquiries || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Created</span>
                  <span>{new Date(vehicle.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Change Status</span>
                </button>
                <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Archive className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Archive Vehicle</span>
                </button>
                <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Copy className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Duplicate Vehicle</span>
                </button>
                <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Export Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Vehicle
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 