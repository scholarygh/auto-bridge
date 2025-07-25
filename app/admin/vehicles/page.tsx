'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Car,
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
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone
} from 'lucide-react'
import { VehicleService } from '@/lib/vehicleService'
import { formatPriceUSD, formatPriceGHS, convertUSDToGHSSync, formatMileageForDisplay, formatLocation } from '@/lib/utils'
import FeatureDisplay from '@/components/ui/FeatureDisplay'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

interface Vehicle {
  id: string
  vin: string
  title: string
  make: string
  model: string
  year: number
  trim?: string
  body_type?: string
  price: number
  original_price?: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  mileage: number
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in hybrid' | 'hydrogen'
  transmission: 'automatic' | 'manual' | 'cvt' | 'semi-automatic'
  engine_type?: string
  engine_size?: string
  cylinders?: number
  horsepower?: number
  torque?: number
  color: string
  interior?: string
  doors?: number
  seats?: number
  manufacturer?: string
  plant_city?: string
  plant_state?: string
  plant_country?: string
  vehicle_type?: string
  body_class?: string
  gross_vehicle_weight_rating?: number
  description: string
  features: string[]
  images: string[]
  location: string
  status: 'available' | 'sold' | 'sourcing'
  views: number
  inquiries: number
  is_featured: boolean
  created_at: string
  updated_at: string
  // Source tracking fields
  source?: 'our_inventory' | 'customer_submission'
  source_request_id?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  submitted_at?: string
  approved_at?: string
}

type VehicleSource = 'all' | 'our_inventory' | 'customer_submission'

export default function VehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [selectedMake, setSelectedMake] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSource, setSelectedSource] = useState<VehicleSource>('all')
  const [vehicleStats, setVehicleStats] = useState<any>(null)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])

  // Load vehicles based on selected source
  const loadVehicles = async () => {
    setIsLoading(true)
    try {
      console.log('🔄 Loading vehicles for source:', selectedSource)
      
      let result
      
      if (selectedSource === 'all') {
        result = await VehicleService.getAllVehicles()
        console.log('📊 All vehicles result:', result)
      } else {
        result = await VehicleService.getVehiclesBySource(selectedSource)
        console.log('📊 Filtered vehicles result:', result)
      }
      
      if (!result.success) {
        console.error('❌ Error loading vehicles:', result.error)
        return
      }
      
      console.log('✅ Vehicles loaded:', result.vehicles?.length || 0)
      console.log('📋 Sample vehicle:', result.vehicles?.[0])
      
      setVehicles(result.vehicles || [])
      setFilteredVehicles(result.vehicles || [])
    } catch (error) {
      console.error('❌ Error loading vehicles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load vehicle statistics
  const loadVehicleStats = async () => {
    try {
      console.log('📊 Loading vehicle stats...')
      const result = await VehicleService.getVehicleStats()
      console.log('📊 Vehicle stats result:', result)
      
      if (result.success) {
        console.log('📊 Setting vehicle stats:', result.stats)
        setVehicleStats(result.stats)
      } else {
        console.error('❌ Failed to load vehicle stats:', result.error)
      }
    } catch (error) {
      console.error('❌ Error loading vehicle stats:', error)
    }
  }

  useEffect(() => {
    loadVehicles()
    loadVehicleStats()
  }, [selectedSource])

  useEffect(() => {
    filterVehicles()
  }, [vehicles, searchTerm, selectedStatus, selectedCondition, selectedMake, sortBy, sortOrder])

  const filterVehicles = () => {
    let filtered = [...vehicles]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === selectedStatus)
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.condition === selectedCondition)
    }

    // Make filter
    if (selectedMake !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.make === selectedMake)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Vehicle]
      let bValue = b[sortBy as keyof Vehicle]

      // Handle undefined values
      if (aValue === undefined) aValue = ''
      if (bValue === undefined) bValue = ''

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredVehicles(filtered)
  }

  const convertUSDToGHS = (usdPrice: number): number => {
    return convertUSDToGHSSync(usdPrice)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const result = await VehicleService.deleteVehicle(id)
        if (result.success) {
          setVehicles(vehicles.filter(v => v.id !== id))
        } else {
          console.error('Error deleting vehicle:', result.error)
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      }
    }
  }

  const deleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const result = await VehicleService.deleteVehicle(id)
        if (result.success) {
          setVehicles(vehicles.filter(v => v.id !== id))
        } else {
          console.error('Error deleting vehicle:', result.error)
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      }
    }
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-red-100 text-red-800'
      case 'sourcing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'our_inventory': return 'bg-blue-100 text-blue-800'
      case 'customer_submission': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUniqueMakes = () => {
    const makes = vehicles.map(v => v.make).filter(Boolean)
    return Array.from(new Set(makes)).sort()
  }

  const handleSelectAll = () => {
    if (selectedVehicles.length === filteredVehicles.length) {
      setSelectedVehicles([])
    } else {
      setSelectedVehicles(filteredVehicles.map(v => v.id))
    }
  }

  const handleSelectVehicle = (id: string) => {
    if (selectedVehicles.includes(id)) {
      setSelectedVehicles(selectedVehicles.filter(v => v !== id))
    } else {
      setSelectedVehicles([...selectedVehicles, id])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
              <p className="text-gray-600 mt-1">Manage your vehicle inventory and customer submissions</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={loadVehicles}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => router.push('/admin/vehicles/add')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        {vehicleStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {vehicleStats.total}
                  </p>
                  <p className="text-sm text-gray-500">All sources</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Our Inventory</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {vehicleStats.our_inventory.total}
                  </p>
                  <p className="text-sm text-gray-500">{vehicleStats.our_inventory.available} available</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Customer Submissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {vehicleStats.customer_submissions.total}
                  </p>
                  <p className="text-sm text-gray-500">{vehicleStats.customer_submissions.available} available</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">In Sourcing</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {vehicleStats.our_inventory.sourcing + vehicleStats.customer_submissions.sourcing}
                  </p>
                  <p className="text-sm text-gray-500">being processed</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Source Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex space-x-1">
            {[
              { id: 'all', label: 'All Cars', icon: Car, count: vehicleStats?.total || 0 },
              { id: 'our_inventory', label: 'Our Cars', icon: Shield, count: vehicleStats?.our_inventory?.total || 0 },
              { id: 'customer_submission', label: 'Customer Submissions', icon: Users, count: vehicleStats?.customer_submissions?.total || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSource(tab.id as VehicleSource)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSource === tab.id
                    ? 'bg-blue-100 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <EnhancedDropdown
                options={[
                  { value: 'all', label: 'All Status', description: 'Show all vehicles' },
                  { value: 'available', label: 'Available', description: 'Ready for customers to see and purchase', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                  { value: 'sourcing', label: 'Sourcing', description: 'Being processed/prepared for sale', icon: <Clock className="w-4 h-4 text-gray-500" /> },
                  { value: 'sold', label: 'Sold', description: 'Vehicle has been sold', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
                  { value: 'reserved', label: 'Reserved', description: 'Temporarily held for a specific customer', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Select status"
                size="md"
                className="min-w-[200px]"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Conditions', description: 'Show all conditions' },
                    { value: 'excellent', label: 'Excellent', description: 'Like new condition', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                    { value: 'good', label: 'Good', description: 'Minor wear and tear', icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div> },
                    { value: 'fair', label: 'Fair', description: 'Some damage or wear', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                    { value: 'poor', label: 'Poor', description: 'Significant damage', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> }
                  ]}
                  value={selectedCondition}
                  onChange={setSelectedCondition}
                  placeholder="Select condition"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Makes', description: 'Show all vehicle makes' },
                    ...getUniqueMakes().map(make => ({
                      value: make,
                      label: make,
                      description: `${make} vehicles`,
                      icon: <Car className="w-4 h-4 text-gray-500" />
                    }))
                  ]}
                  value={selectedMake}
                  onChange={setSelectedMake}
                  placeholder="Select make"
                  size="md"
                />
              </div>
            </div>
          )}
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Car className="w-7 h-7 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            VIN: {vehicle.vin}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatMileageForDisplay(vehicle.mileage)} miles
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceColor(vehicle.source || 'our_inventory')}`}>
                        {vehicle.source === 'customer_submission' ? 'Customer' : 'Our Inventory'}
                      </span>
                      {vehicle.source === 'customer_submission' && vehicle.contact_name && (
                        <div className="text-xs text-gray-500 mt-1">
                          {vehicle.contact_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPriceUSD(vehicle.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPriceGHS(convertUSDToGHS(vehicle.price))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatLocation(vehicle.location)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => router.push(`/admin/vehicles/${vehicle.id}`)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/admin/vehicles/${vehicle.id}/edit`)}
                          className="text-gray-600 hover:text-gray-900" 
                          title="Edit Vehicle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {vehicle.source === 'customer_submission' && vehicle.contact_email && (
                          <button 
                            onClick={() => window.open(`mailto:${vehicle.contact_email}`)}
                            className="text-gray-600 hover:text-gray-900" 
                            title="Contact Customer"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        {vehicle.source === 'customer_submission' && vehicle.contact_phone && (
                          <button 
                            onClick={() => window.open(`tel:${vehicle.contact_phone}`)}
                            className="text-gray-600 hover:text-gray-900" 
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="text-red-600 hover:text-red-900" 
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No vehicles found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 