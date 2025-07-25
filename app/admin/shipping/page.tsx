'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Phone, 
  Mail, 
  Ship,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  User,
  Car,
  Package,
  Truck,
  Anchor,
  Navigation,
  FileText,
  Loader2
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function ShippingPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shippingData, setShippingData] = useState<any[]>([])
  const [filteredShipments, setFilteredShipments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'list'>('table')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    loadShippingData()
  }, [])

  useEffect(() => {
    filterShipping()
  }, [shippingData, searchTerm, sortField, sortDirection])

  const loadShippingData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading shipping data...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load data during server-side rendering')
        return
      }
      
      // Fetch vehicles that are sold (in shipping)
      const { VehicleService } = await import('@/lib/vehicleService')
      const vehiclesResult = await VehicleService.getVehicles(1, 1000)
      
      if (vehiclesResult.success && vehiclesResult.vehicles) {
        const vehicles = vehiclesResult.vehicles
        const soldVehicles = vehicles.filter((v: any) => v.status === 'sold')
        
        const shipping = soldVehicles.map((vehicle: any, index: number) => {
          // Generate mock shipping data for sold vehicles
          const trackingNumber = `AB${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          const departureDate = new Date(vehicle.created_at)
          const estimatedArrival = new Date(departureDate.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days later
          const daysRemaining = Math.max(0, Math.ceil((estimatedArrival.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))
          
          let status = 'in_transit'
          let location = 'On route to Ghana'
          if (daysRemaining <= 0) {
            status = 'arrived'
            location = 'Tema Port'
          }
          
          const shippingCost = 3500
          const insurance = 500
          const totalCost = shippingCost + insurance
          
          return {
            id: vehicle.id,
            customer: `Customer ${index + 1}`,
            car: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
            trackingNumber: trackingNumber,
            status: status,
            daysRemaining: daysRemaining,
            location: location,
            departurePort: 'Miami, FL',
            arrivalPort: 'Tema Port, Ghana',
            departureDate: departureDate.toISOString().split('T')[0],
            estimatedArrival: estimatedArrival.toISOString().split('T')[0],
            shippingCost: shippingCost,
            insurance: insurance,
            totalCost: totalCost,
            assignedTo: 'Admin',
            lastUpdate: vehicle.updated_at || vehicle.created_at,
            notes: `Vehicle ${vehicle.make} ${vehicle.model} ${vehicle.year} in shipping process.`,
            milestones: [
              { date: departureDate.toISOString().split('T')[0], status: 'completed', description: 'Departed Miami Port' },
              { date: new Date(departureDate.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], status: 'completed', description: 'Crossed Atlantic Ocean' },
              { date: estimatedArrival.toISOString().split('T')[0], status: daysRemaining <= 0 ? 'completed' : 'pending', description: 'Arrive at Tema Port' },
              { date: new Date(estimatedArrival.getTime() + (5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], status: 'pending', description: 'Customs Clearance' }
            ]
          }
        })
        
        setShippingData(shipping)
        console.log('✅ Shipping data loaded successfully')
      } else {
        console.error('❌ Failed to load vehicles for shipping:', vehiclesResult.error)
        setError(vehiclesResult.error || 'Failed to load shipping data')
      }
    } catch (err) {
      console.error('❌ Error loading shipping data:', err)
      setError('Failed to load shipping data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filterShipping = () => {
    let filtered = shippingData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(shipment =>
        shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === 'lastUpdate' || sortField === 'departureDate' || sortField === 'estimatedArrival') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredShipments(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'arrived': return 'bg-green-100 text-green-800'
      case 'customs': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-purple-100 text-purple-800'
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

  const handleRefresh = () => {
    loadShippingData()
  }

  const handleBulkAction = (action: string) => {
    if (selectedShipments.length === 0) return
    
    switch (action) {
      case 'update_status':
        console.log('Updating status for:', selectedShipments)
        break
      case 'export':
        console.log('Exporting shipment data:', selectedShipments)
        break
      case 'notify_customers':
        console.log('Notifying customers:', selectedShipments)
        break
    }
    setSelectedShipments([])
  }

  const handleSelectAll = () => {
    if (selectedShipments.length === filteredShipments.length) {
      setSelectedShipments([])
    } else {
      setSelectedShipments(filteredShipments.map(shipment => shipment.id))
    }
  }

  const handleSelectShipment = (id: string) => {
    setSelectedShipments(prev => 
      prev.includes(id) 
        ? prev.filter(shipmentId => shipmentId !== id)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shipping data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadShippingData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  if (shippingData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Shipments Yet</h2>
          <p className="text-gray-600 mb-6">
            Shipping information will appear here once you start selling vehicles and arranging shipments.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/vehicles'} 
              className="btn-primary w-full"
            >
              View Vehicles
            </button>
            <button 
              onClick={loadShippingData} 
              className="btn-secondary w-full"
            >
              Refresh Shipping
            </button>
          </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
              <p className="text-gray-600 mt-1">Track vehicle shipments and manage logistics</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Shipment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{shippingData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Arrived</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Anchor className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatPriceGHS(19600)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search customers, tracking numbers, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  Cards
                </button>
              </div>

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Status', description: 'Show all shipment statuses' },
                    { value: 'preparing', label: 'Preparing', description: 'Shipment being prepared', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                    { value: 'in_transit', label: 'In Transit', description: 'Shipment in transit', icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div> },
                    { value: 'arrived', label: 'Arrived', description: 'Shipment arrived at port', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                    { value: 'customs', label: 'Customs', description: 'Going through customs', icon: <div className="w-3 h-3 rounded-full bg-orange-500"></div> },
                    { value: 'delivered', label: 'Delivered', description: 'Successfully delivered', icon: <CheckCircle className="w-4 h-4 text-green-500" /> }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Select status"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All', description: 'Show all arrival times' },
                    { value: '1-7', label: '1-7 days', description: 'Arriving within a week' },
                    { value: '8-14', label: '8-14 days', description: 'Arriving in 1-2 weeks' },
                    { value: '15+', label: '15+ days', description: 'Arriving in more than 2 weeks' }
                  ]}
                  value="all"
                  onChange={() => {}}
                  placeholder="Select arrival time"
                  size="md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedShipments.length > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedShipments.length} shipment{selectedShipments.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('update_status')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('notify_customers')}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Notify Customers
                </button>
                <button
                  onClick={() => setSelectedShipments([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedShipments.includes(shipment.id)}
                        onChange={() => handleSelectShipment(shipment.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{shipment.customer}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">#{shipment.trackingNumber}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Vehicle:</span> {shipment.car}
                      </div>
                        <div>
                        <span className="font-medium">Location:</span> {shipment.location}
                      </div>
                      <div>
                        <span className="font-medium">Days Left:</span> {shipment.daysRemaining}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900" title="Call Customer">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900" title="Send Email">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900" title="More Actions">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Route Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">From:</span> {shipment.departurePort}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {shipment.arrivalPort}
                  </div>
                  <div>
                    <span className="font-medium">Departure:</span> {formatDate(shipment.departureDate)}
                  </div>
                  <div>
                    <span className="font-medium">Arrival:</span> {formatDate(shipment.estimatedArrival)}
                  </div>
                </div>

                {/* Cost Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Shipping:</span> {formatPriceGHS(shipment.shippingCost)}
                  </div>
                  <div>
                    <span className="font-medium">Insurance:</span> {formatPriceGHS(shipment.insurance)}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span> {formatPriceGHS(shipment.totalCost)}
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{shipment.notes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{shipment.customer}</h3>
                    <p className="text-sm text-gray-600">{shipment.car}</p>
                    <p className="text-sm text-gray-600">#{shipment.trackingNumber}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{shipment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{shipment.daysRemaining} days left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatPriceGHS(shipment.totalCost)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Arrives {formatDate(shipment.estimatedArrival)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900" title="Call Customer">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900" title="Send Email">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-gray-900" title="More Actions">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredShipments.length} of {shippingData.length} shipments</span>
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
  )
} 