'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Car, 
  MapPin, 
  Filter, 
  Star, 
  Users, 
  Award, 
  Shield, 
  Truck, 
  Globe,
  MessageSquare,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Play,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync, formatMileageForDisplay } from '@/lib/utils'
import FeatureDisplay from '@/components/ui/FeatureDisplay'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

// Services data with enhanced descriptions
const services = [
  {
    icon: Search,
    title: 'Premium Car Sourcing',
    description: 'Access to exclusive inventory from top-tier US dealerships and auctions',
    features: ['Curated selection', 'Quality verification', 'Market analysis'],
    color: 'bg-blue-600'
  },
  {
    icon: Truck,
    title: 'Global Shipping Network',
    description: 'Seamless door-to-door delivery with real-time tracking and insurance',
    features: ['5-7 weeks delivery', 'Container shipping', 'Live tracking'],
    color: 'bg-blue-600'
  },
  {
    icon: Shield,
    title: 'Customs & Compliance',
    description: 'Expert handling of all import procedures and regulatory requirements',
    features: ['Duty optimization', 'Documentation', 'Port clearance'],
    color: 'bg-blue-600'
  },
  {
    icon: CheckCircle,
    title: 'Quality Assurance',
    description: 'Comprehensive inspection and warranty coverage for peace of mind',
    features: ['Pre-shipment inspection', 'Warranty coverage', 'Support network'],
    color: 'bg-blue-600'
  }
]

const testimonials = [
  {
    name: 'Kwame Asante',
    location: 'Accra, Ghana',
    rating: 5,
    comment: 'Auto-Bridge transformed my car buying experience. Professional, transparent, and delivered exactly what they promised.',
    car: 'BMW M4 Competition',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Ama Osei',
    location: 'Kumasi, Ghana',
    rating: 5,
    comment: 'Exceptional service from start to finish. They found my dream car and handled everything flawlessly.',
    car: 'Mercedes-AMG C63',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Kofi Mensah',
    location: 'Tema, Ghana',
    rating: 5,
    comment: 'The most reliable car import service I\'ve used. Transparent pricing and excellent communication.',
    car: 'Audi RS6 Avant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMake, setSelectedMake] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [makes, setMakes] = useState<string[]>([])

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading vehicles from database...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load vehicles during server-side rendering')
        return
      }
      
      // Dynamic import to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      const result = await VehicleService.getVehicles(1, 8) // Get first 8 vehicles for homepage
      
      console.log('📊 Homepage vehicle loading result:', result)
      
      if (result.success && result.vehicles) {
        console.log(`✅ Loaded ${result.vehicles.length} vehicles for homepage`)
        setVehicles(result.vehicles)
        
        // Extract unique makes for filter dropdown
        const uniqueMakes = Array.from(new Set(result.vehicles.map(v => v.make).filter(Boolean)))
        setMakes(uniqueMakes.sort())
        console.log('🚗 Available makes for homepage:', uniqueMakes)
      } else {
        console.error('❌ Failed to load vehicles for homepage:', result.error)
        setError(result.error || 'Failed to load vehicles')
      }
    } catch (err) {
      console.error('❌ Error loading vehicles for homepage:', err)
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

  // Get vehicle subtitle
  const getVehicleSubtitle = (vehicle: any) => {
    const details = []
    if (vehicle.body_type) details.push(vehicle.body_type)
    if (vehicle.transmission) details.push(vehicle.transmission)
    if (vehicle.fuel_type) details.push(vehicle.fuel_type)
    return details.join(' • ')
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.title?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesMake = selectedMake === 'all' || vehicle.make === selectedMake
    const matchesLocation = selectedLocation === 'all' || vehicle.location === selectedLocation

    return matchesSearch && matchesMake && matchesLocation
  })

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading premium vehicles...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Vehicles</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={loadVehicles} 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Premium Auto Import Service</span>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Import Your Dream Car
              <span className="block text-blue-100">
                From USA to Ghana
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Access premium vehicles from top US dealerships with our comprehensive import service. 
              From sourcing to delivery, we handle everything.
            </p>

            {/* Search Section */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search for make, model, or year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                
                <div>
                  <EnhancedDropdown
                    value={selectedMake}
                    onChange={(value) => setSelectedMake(value)}
                    options={[
                      { value: 'all', label: 'All Makes' },
                      ...makes.map(make => ({ value: make, label: make }))
                    ]}
                    placeholder="All Makes"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <EnhancedDropdown
                    value={selectedLocation}
                    onChange={(value) => setSelectedLocation(value)}
                    options={[
                      { value: 'all', label: 'All Locations' },
                      { value: 'USA', label: 'USA' },
                      { value: 'Ghana', label: 'Ghana' }
                    ]}
                    placeholder="All Locations"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/cars')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Browse All Vehicles
                </button>
                <button 
                  onClick={() => router.push('/sell')}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" />
                  Sell Your Car
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Featured Vehicles
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Premium Selection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated collection of high-quality vehicles from top US dealerships
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredVehicles.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Vehicles Found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Try adjusting your search criteria or explore our full inventory.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedMake('all')
                      setSelectedLocation('all')
                    }} 
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <img
                        src={getVehicleImage(vehicle)}
                        alt={getVehicleTitle(vehicle)}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {getVehicleTitle(vehicle)}
                        </h3>
                        <p className="text-gray-600 text-sm">{getVehicleSubtitle(vehicle)}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{vehicle.location || 'USA'} • {vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <span>Shipping: 5-7 weeks</span>
                        </div>
                      </div>
                      
                      {/* Features */}
                      {/* Removed features section to reduce card height */}
                      
                      <div className="mb-4">
                        {vehicle.price ? (
                          <>
                            <div className="text-xl font-bold text-blue-600 mb-1">
                              {formatPriceGHS(convertUSDToGHSSync(vehicle.price))}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${vehicle.price.toLocaleString()} USD
                            </div>
                          </>
                        ) : (
                          <div className="text-lg text-gray-500">Price on request</div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        View Details
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {filteredVehicles.length > 0 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => router.push('/cars')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto"
              >
                View All Vehicles
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Our Services
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Import Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From sourcing to delivery, we handle every aspect of your vehicle import journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Customer Reviews
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Trusted by Customers
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              See what our satisfied customers have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-white mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-100">{testimonial.location}</div>
                    <div className="text-sm text-blue-200">{testimonial.car}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Import Your Dream Car?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who have successfully imported their vehicles with Auto-Bridge
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/cars')}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Browse Vehicles
            </button>
            <button 
              onClick={() => router.push('/contact')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 