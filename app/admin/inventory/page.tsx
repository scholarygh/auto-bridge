'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  RefreshCw,
  Settings,
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  FileText,
  ImageIcon,
  FileUp,
  Gauge,
  Fuel,
  Cog,
  Palette,
  Users,
  Shield,
  Wrench
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync, formatMileageForDisplay, formatLocation } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'
import { vehicleService } from '@/lib/vehicleService'

// Helper function to format USD prices as GHS
const formatPriceAsGHS = (usdPrice: number): string => {
  const ghsPrice = convertUSDToGHSSync(usdPrice)
  return formatPriceGHS(ghsPrice)
}

export default function InventoryPage() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [makeFilter, setMakeFilter] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    totalValue: 0,
    avgPrice: 0,
    lowStock: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await vehicleService.getVehicles()
      if (result.success && result.vehicles) {
        setVehicles(result.vehicles)
        // Calculate basic stats from vehicles
        const totalVehicles = result.vehicles.length
        const availableVehicles = result.vehicles.filter((v: any) => v.status === 'available').length
        const soldVehicles = result.vehicles.filter((v: any) => v.status === 'sold').length
        const totalValue = result.vehicles.reduce((sum: number, v: any) => sum + (v.estimated_price || 0), 0)
        const avgPrice = totalVehicles > 0 ? totalValue / totalVehicles : 0
        
        setStats({
          totalVehicles,
          availableVehicles,
          soldVehicles,
          totalValue,
          avgPrice,
          lowStock: availableVehicles < 5 ? availableVehicles : 0
        })
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-blue-100 text-blue-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const formatDate = (dateString: string) => {
    if (!mounted) return dateString
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesMake = makeFilter === 'all' || vehicle.make.toLowerCase() === makeFilter.toLowerCase()
    
    let matchesPrice = true
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (max) {
        matchesPrice = vehicle.price >= min && vehicle.price <= max
      } else {
        matchesPrice = vehicle.price >= min
      }
    }
    
    return matchesSearch && matchesStatus && matchesMake && matchesPrice
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadData()
    setIsRefreshing(false)
  }

  const handleBulkAction = (action: string) => {
    if (selectedVehicles.length === 0) return
    
    switch (action) {
      case 'delete':
        console.log('Deleting vehicles:', selectedVehicles)
        break
      case 'export':
        console.log('Exporting vehicles:', selectedVehicles)
        break
      case 'mark_sold':
        console.log('Marking vehicles as sold:', selectedVehicles)
        break
    }
    setSelectedVehicles([])
  }

  const handleSelectAll = () => {
    if (selectedVehicles.length === filteredVehicles.length) {
      setSelectedVehicles([])
    } else {
      setSelectedVehicles(filteredVehicles.map(vehicle => vehicle.id))
    }
  }

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicles(prev => 
      prev.includes(id) 
        ? prev.filter(vehicleId => vehicleId !== id)
        : [...prev, id]
    )
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-1">Manage your vehicle inventory</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="flex gap-3">
                <Link
                  href="/admin/inventory/add"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Manual Entry
                </Link>
                <Link
                  href="/admin/inventory/add/pdf"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload PDF Report
                </Link>
                <Link
                  href="/admin/inventory/add/carfax"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  AI Extraction (URL)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalVehicles}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Car className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 font-medium">In Stock</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.availableVehicles}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Ready to Sell</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPriceGHS(stats.totalValue)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Inventory Value</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.lowStock}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600 font-medium">Needs Attention</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vehicle Inventory</h3>
                <p className="text-sm text-gray-600">{filteredVehicles.length} vehicles found</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <div className="w-4 h-4 space-y-0.5">
                      <div className="w-full h-0.5 bg-current rounded-sm"></div>
                      <div className="w-full h-0.5 bg-current rounded-sm"></div>
                      <div className="w-full h-0.5 bg-current rounded-sm"></div>
                    </div>
                  </button>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search vehicles, VIN, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {(searchTerm || statusFilter !== 'all' || makeFilter !== 'all' || priceRange !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setMakeFilter('all')
                      setPriceRange('all')
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <EnhancedDropdown
                    options={[
                      { value: 'all', label: 'All Status', description: 'Show all vehicle statuses' },
                      { value: 'available', label: 'Available', description: 'Ready for customers to see and purchase', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                      { value: 'reserved', label: 'Reserved', description: 'Temporarily held for a specific customer', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                      { value: 'sold', label: 'Sold', description: 'Vehicle has been sold', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
                      { value: 'maintenance', label: 'Maintenance', description: 'Vehicle is being serviced', icon: <Wrench className="w-4 h-4 text-gray-500" /> }
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Select status"
                    size="md"
                  />
                  <EnhancedDropdown
                    options={[
                      { value: 'all', label: 'All Makes', description: 'Show all vehicle makes' },
                      { value: 'BMW', label: 'BMW', description: 'BMW vehicles', icon: <Car className="w-4 h-4 text-gray-500" /> },
                      { value: 'Mercedes', label: 'Mercedes', description: 'Mercedes vehicles', icon: <Car className="w-4 h-4 text-gray-500" /> },
                      { value: 'Toyota', label: 'Toyota', description: 'Toyota vehicles', icon: <Car className="w-4 h-4 text-gray-500" /> },
                      { value: 'Audi', label: 'Audi', description: 'Audi vehicles', icon: <Car className="w-4 h-4 text-gray-500" /> },
                      { value: 'Honda', label: 'Honda', description: 'Honda vehicles', icon: <Car className="w-4 h-4 text-gray-500" /> }
                    ]}
                    value={makeFilter}
                    onChange={setMakeFilter}
                    placeholder="Select make"
                    size="md"
                  />
                  <EnhancedDropdown
                    options={[
                      { value: 'all', label: 'All Prices', description: 'Show all price ranges' },
                      { value: '0-30000', label: 'Under $30,000', description: 'Budget-friendly vehicles', icon: <DollarSign className="w-4 h-4 text-green-500" /> },
                      { value: '30000-50000', label: '$30,000 - $50,000', description: 'Mid-range vehicles', icon: <DollarSign className="w-4 h-4 text-blue-500" /> },
                      { value: '50000-80000', label: '$50,000 - $80,000', description: 'Premium vehicles', icon: <DollarSign className="w-4 h-4 text-purple-500" /> },
                      { value: '80000-999999', label: 'Over $80,000', description: 'Luxury vehicles', icon: <DollarSign className="w-4 h-4 text-red-500" /> }
                    ]}
                    value={priceRange}
                    onChange={setPriceRange}
                    placeholder="Select price range"
                    size="md"
                  />
                  <EnhancedDropdown
                    options={[
                      { value: 'date', label: 'Date Added', description: 'Sort by date added' },
                      { value: 'price_low', label: 'Price: Low to High', description: 'Sort by price ascending' },
                      { value: 'price_high', label: 'Price: High to Low', description: 'Sort by price descending' },
                      { value: 'mileage', label: 'Mileage', description: 'Sort by mileage' },
                      { value: 'year', label: 'Year', description: 'Sort by year' }
                    ]}
                    value="date"
                    onChange={() => {}}
                    placeholder="Select sort order"
                    size="md"
                  />
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedVehicles.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    {selectedVehicles.length} vehicle{selectedVehicles.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('mark_sold')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Sold
                    </button>
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedVehicles([])}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={vehicle.images[0]} 
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(vehicle.id)}
                          onChange={() => handleSelectVehicle(vehicle.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                        {vehicle.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(vehicle.condition)}`}>
                          {vehicle.condition}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{vehicle.trim}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-semibold text-gray-900">{formatPriceGHS(vehicle.price)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Mileage:</span>
                          <span className="text-gray-900">{vehicle.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span className="text-gray-900">{vehicle.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{vehicle.views} views</span>
                        <span>{vehicle.inquiries} inquiries</span>
                        <span>Added {formatDate(vehicle.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                          <Eye className="w-4 h-4 inline mr-1" />
                          View
                        </button>
                        <button className="py-2 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="py-2 px-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedVehicles.length === filteredVehicles.length && filteredVehicles.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedVehicles.includes(vehicle.id)}
                            onChange={() => handleSelectVehicle(vehicle.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={vehicle.images[0]} 
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">{vehicle.trim}</div>
                              <div className="text-xs text-gray-400">{vehicle.mileage.toLocaleString()} km</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatPriceGHS(vehicle.price)}</div>
                          <div className="text-sm text-gray-500">{vehicle.condition}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900" title="More Actions">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Results Summary */}
            <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
              <span>Showing {filteredVehicles.length} of {vehicles.length} vehicles</span>
              <div className="flex items-center gap-4">
                <span>Page 1 of 1</span>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50">Previous</button>
                  <button className="px-2 py-1 border border-gray-300 rounded disabled:opacity-50">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 