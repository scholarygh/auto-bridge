'use client'

import React, { useState } from 'react'
import { 
  Car, 
  X, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  AlertTriangle,
  Info,
  Star,
  Gauge,
  Settings,
  Palette,
  Wrench,
  Fuel,
  Zap,
  Shield,
  Award
} from 'lucide-react'

interface SellRequest {
  id: string
  vin: string
  make: string
  model: string
  year: number
  mileage: number
  condition: string
  description: string
  location: string
  images: string[]
  vin_data: any
  contact_name: string
  contact_email: string
  contact_phone: string
  status: 'pending_review' | 'approved' | 'rejected' | 'contacted'
  submitted_at: string
  reviewed_at?: string
  review_notes?: string
}

interface ReviewVehicleModalProps {
  request: SellRequest | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (requestId: string, status: 'approved' | 'rejected') => Promise<void>
  reviewNotes: string
  setReviewNotes: (notes: string) => void
  processingApprove: boolean
  processingReject: boolean
}

const ReviewVehicleModal: React.FC<ReviewVehicleModalProps> = ({
  request,
  isOpen,
  onClose,
  onStatusUpdate,
  reviewNotes,
  setReviewNotes,
  processingApprove,
  processingReject
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'vin' | 'images'>('overview')

  if (!isOpen || !request) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === request.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? request.images.length - 1 : prev - 1
    )
  }

  const handleContact = (type: 'email' | 'phone') => {
    if (type === 'email') {
      window.open(`mailto:${request.contact_email}`)
    } else {
      window.open(`tel:${request.contact_phone}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Vehicle Submission
                </h2>
                <p className="text-gray-600">
                  {request.year} {request.make} {request.model} • VIN: {request.vin}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 p-4">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'details', label: 'Details', icon: FileText },
              { id: 'vin', label: 'VIN Data', icon: Shield },
              { id: 'images', label: 'Photos', icon: ImageIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Vehicle</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {request.year} {request.make}
                      </p>
                      <p className="text-sm text-gray-500">{request.model}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Mileage</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {request.mileage.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">miles</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Gauge className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Condition</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">
                        {request.condition}
                      </p>
                      <p className="text-sm text-gray-500">overall</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Submitted</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatDate(request.submitted_at).split(',')[0]}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(request.submitted_at).split(',')[1]}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{request.contact_name}</p>
                      <p className="text-sm text-gray-500">Contact Person</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{request.contact_email}</p>
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{request.contact_phone}</p>
                      <p className="text-sm text-gray-500">Phone Number</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{request.location}</p>
                      <p className="text-sm text-gray-500">Location</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleContact('email')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleContact('phone')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Customer
                  </button>
                </div>
              </div>

              {/* Status and Review Notes */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Decision</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Current Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Notes
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add your review notes here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onStatusUpdate(request.id, 'approved')}
                      disabled={processingApprove || request.status !== 'pending_review'}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {processingApprove ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve Submission
                    </button>
                    <button
                      onClick={() => onStatusUpdate(request.id, 'rejected')}
                      disabled={processingReject || request.status !== 'pending_review'}
                      className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {processingReject ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Reject Submission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="p-6 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                      <p className="text-gray-900 font-medium">{request.make}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <p className="text-gray-900 font-medium">{request.model}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <p className="text-gray-900 font-medium">{request.year}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                      <p className="text-gray-900 font-mono text-sm">{request.vin}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                      <p className="text-gray-900 font-medium">{request.mileage.toLocaleString()} miles</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(request.condition)}`}>
                        {request.condition}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <p className="text-gray-900 font-medium">{request.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                      <p className="text-gray-900 font-medium">{formatDate(request.submitted_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {request.description || 'No description provided.'}
                </p>
              </div>
            </div>
          )}

          {/* VIN Data Tab */}
          {activeTab === 'vin' && (
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">VIN Decoded Data</h3>
                {request.vin_data && Object.keys(request.vin_data).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(request.vin_data).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                        <p className="text-gray-900">{String(value) || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No VIN data available.</p>
                )}
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Photos</h3>
                {request.images && request.images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={request.images[currentImageIndex]}
                        alt={`Vehicle photo ${currentImageIndex + 1}`}
                        className="w-full h-96 object-cover"
                      />
                      {request.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {request.images.length}
                          </div>
                        </>
                      )}
                    </div>
                    {request.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {request.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No photos available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewVehicleModal 