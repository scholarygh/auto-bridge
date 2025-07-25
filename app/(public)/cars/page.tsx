'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Zap, 
  Star, 
  Loader2, 
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  MessageSquare,
  SlidersHorizontal,
  X,
  Sparkles,
  AlertCircle,
  Car
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync, formatMileageForDisplay } from '@/lib/utils'
import FeatureDisplay from '@/components/ui/FeatureDisplay'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function CarsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [makes, setMakes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Fetch vehicles on component mount
  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading vehicles for cars page...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load vehicles during server-side rendering')
        return
      }
      
      // Dynamic import to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      const result = await VehicleService.getVehicles(1, 100) // Get first 100 vehicles
      
      console.log('📊 Cars page vehicle loading result:', result)
      
      if (result.success && result.vehicles) {
        console.log(`✅ Loaded ${result.vehicles.length} vehicles for cars page`)
        setVehicles(result.vehicles)
        
        // Extract unique makes for filter dropdown
        const uniqueMakes = Array.from(new Set(result.vehicles.map(v => v.make).filter(Boolean)))
        setMakes(uniqueMakes.sort())
        console.log('🚗 Available makes for cars page:', uniqueMakes)
      } else {
        console.error('❌ Failed to load vehicles for cars page:', result.error)
        setError(result.error || 'Failed to load vehicles')
      }
    } catch (err) {
      console.error('❌ Error loading vehicles for cars page:', err)
      setError('Failed to load vehicles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Get primary image for vehicle
  const getVehicleImage = (vehicle: any) => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0]
    }
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
  }

  // Get vehicle title
  const getVehicleTitle = (vehicle: any) => {
    const parts = [vehicle.make, vehicle.model]
    if (vehicle.trim) parts.push(vehicle.trim)
    if (vehicle.year) parts.unshift(vehicle.year.toString())
    return parts.filter(Boolean).join(' ')
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.title?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPrice = !priceRange || 
      (priceRange === '0-25000' && vehicle.price <= 25000) ||
      (priceRange === '25000-50000' && vehicle.price > 25000 && vehicle.price <= 50000) ||
      (priceRange === '50000-100000' && vehicle.price > 50000 && vehicle.price <= 100000) ||
      (priceRange === '100000+' && vehicle.price > 100000)
    
    const matchesMake = !selectedMake || vehicle.make === selectedMake
    const matchesCondition = !selectedCondition || vehicle.condition === selectedCondition

    return matchesSearch && matchesPrice && matchesMake && matchesCondition
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
        return (b.price || 0) - (a.price || 0)
      case 'year-new':
        return (b.year || 0) - (a.year || 0)
      case 'year-old':
        return (a.year || 0) - (b.year || 0)
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const clearFilters = () => {
    setSearchTerm('')
    setPriceRange('')
    setSelectedMake('')
    setSelectedCondition('')
    setSortBy('newest')
  }

  const hasActiveFilters = searchTerm || priceRange || selectedMake || selectedCondition || sortBy !== 'newest'

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Vehicles</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button onClick={loadVehicles} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show empty state
  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Vehicles Available</h2>
          <p className="text-slate-600 mb-8">
            We're currently updating our inventory. Check back soon for amazing vehicles!
          </p>
          <button 
            onClick={loadVehicles} 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Premium Vehicles
              </h1>
              <p className="text-xl text-slate-600">
                Discover our curated collection of high-quality vehicles
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                {filteredVehicles.length} vehicles found
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search for make, model, or year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <EnhancedDropdown
                  value={selectedMake}
                  onChange={(value) => setSelectedMake(value)}
                  options={[
                    { value: '', label: 'All Makes' },
                    ...makes.map(make => ({ value: make, label: make }))
                  ]}
                  placeholder="All Makes"
                  className="w-full"
                />
              </div>
              
              <div>
                <EnhancedDropdown
                  value={priceRange}
                  onChange={(value) => setPriceRange(value)}
                  options={[
                    { value: '', label: 'All Prices' },
                    { value: '0-25000', label: 'Under $25,000' },
                    { value: '25000-50000', label: '$25,000 - $50,000' },
                    { value: '50000-100000', label: '$50,000 - $100,000' },
                    { value: '100000+', label: 'Over $100,000' }
                  ]}
                  placeholder="All Prices"
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-red-100 border border-red-200 rounded-xl text-red-700 hover:bg-red-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                    <EnhancedDropdown
                      value={selectedCondition}
                      onChange={(value) => setSelectedCondition(value)}
                      options={[
                        { value: '', label: 'All Conditions' },
                        { value: 'excellent', label: 'Excellent' },
                        { value: 'good', label: 'Good' },
                        { value: 'fair', label: 'Fair' },
                        { value: 'poor', label: 'Poor' }
                      ]}
                      placeholder="All Conditions"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                    <EnhancedDropdown
                      value={sortBy}
                      onChange={(value) => setSortBy(value)}
                      options={[
                        { value: 'newest', label: 'Newest First' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'year-new', label: 'Year: Newest First' },
                        { value: 'year-old', label: 'Year: Oldest First' }
                      ]}
                      placeholder="Sort By"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-200 transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">No Vehicles Found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or explore our full inventory.
            </p>
            <button 
              onClick={clearFilters} 
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={getVehicleImage(vehicle)}
                    alt={getVehicleTitle(vehicle)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {vehicle.location || 'USA'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Available
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {getVehicleTitle(vehicle)}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {vehicle.body_type && `${vehicle.body_type} • `}{vehicle.transmission && `${vehicle.transmission} • `}{vehicle.fuel_type}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="leading-relaxed">
                        {vehicle.location || 'USA'} • {vehicle.year} • {vehicle.mileage ? formatMileageForDisplay(vehicle.mileage) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Zap className="w-4 h-4 text-slate-400" />
                      <span className="leading-relaxed">Shipping: 5-7 weeks</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  {/* Removed features section to reduce card height */}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {vehicle.price ? (
                        <>
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {formatPriceGHS(convertUSDToGHSSync(vehicle.price))}
                          </div>
                          <div className="text-sm text-slate-500">
                            ${vehicle.price.toLocaleString()} USD
                          </div>
                        </>
                      ) : (
                        <div className="text-lg text-slate-500">Price on request</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                      className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 