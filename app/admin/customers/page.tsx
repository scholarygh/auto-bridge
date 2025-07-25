'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Phone, 
  Mail, 
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Car,
  FileText,
  MessageSquare,
  Shield,
  Loader2,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function CustomersPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customersData, setCustomersData] = useState<any[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [sortField, setSortField] = useState('joinDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kycFilter, setKycFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    loadCustomersData()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customersData, searchTerm, sortField, sortDirection])

  const loadCustomersData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading customers data...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load data during server-side rendering')
        return
      }
      
      // Dynamic imports to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      
      // Fetch vehicles data to extract customer information
      const vehiclesResult = await VehicleService.getVehicles(1, 1000)
      
      if (vehiclesResult.success && vehiclesResult.vehicles) {
        const vehicles = vehiclesResult.vehicles
        
        // Group vehicles by customer (using email as unique identifier)
        const customerMap = new Map()
        
        vehicles.forEach((vehicle: any, index: number) => {
          // Create a customer identifier (in real app, you'd have actual customer data)
          const customerId = `customer_${index + 1}`
          const customerEmail = `customer${index + 1}@email.com`
          const customerName = `Customer ${index + 1}`
          
          if (!customerMap.has(customerId)) {
            customerMap.set(customerId, {
              id: customerId,
              name: customerName,
              email: customerEmail,
              phone: '+233 XX XXX XXXX',
              location: vehicle.location || 'Unknown',
              status: 'active',
              joinDate: vehicle.created_at,
              totalPurchases: 0,
              totalSpent: 0,
              lastPurchase: vehicle.created_at,
              kycStatus: 'verified',
              source: 'website',
              notes: vehicle.description || 'No notes',
              vehicles: [],
              tags: []
            })
          }
          
          const customer = customerMap.get(customerId)
          customer.vehicles.push({
            id: vehicle.id,
            model: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
            status: vehicle.status,
            date: vehicle.created_at
          })
          
          if (vehicle.status === 'sold') {
            customer.totalPurchases += 1
            customer.totalSpent += vehicle.price || 0
          }
        })
        
        // Convert map to array and add tags
        const customers = Array.from(customerMap.values()).map(customer => {
          const tags = []
          if (customer.totalSpent > 100000) tags.push('high-value')
          if (customer.vehicles.length > 1) tags.push('returning')
          if (customer.totalSpent > 0) tags.push('verified')
          
          return {
            ...customer,
            tags
          }
        })
        
        setCustomersData(customers)
        console.log('✅ Customers data loaded successfully')
      } else {
        console.error('❌ Failed to load vehicles for customers:', vehiclesResult.error)
        setError(vehiclesResult.error || 'Failed to load customers data')
      }
    } catch (err) {
      console.error('❌ Error loading customers data:', err)
      setError('Failed to load customers data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getKycColor = (kycStatus: string) => {
    switch (kycStatus) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
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

  const filterCustomers = () => {
    let filtered = customersData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === 'joinDate' || sortField === 'lastPurchase') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCustomers(filtered)
  }

  const handleRefresh = () => {
    loadCustomersData()
  }

  const handleBulkAction = (action: string) => {
    if (selectedCustomers.length === 0) return
    
    switch (action) {
      case 'export':
        console.log('Exporting customer data:', selectedCustomers)
        break
      case 'send_email':
        console.log('Sending email to customers:', selectedCustomers)
        break
      case 'update_status':
        console.log('Updating customer status:', selectedCustomers)
        break
    }
    setSelectedCustomers([])
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id))
    }
  }

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) 
        ? prev.filter(customerId => customerId !== id)
        : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading customers data...</p>
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
          <button onClick={loadCustomersData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  if (customersData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Customers Yet</h2>
          <p className="text-gray-600 mb-6">
            Customer profiles will appear here once you start receiving inquiries and making sales.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/vehicles/add'} 
              className="btn-primary w-full"
            >
              Add Your First Vehicle
            </button>
            <button 
              onClick={loadCustomersData} 
              className="btn-secondary w-full"
            >
              Refresh Customers
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
              <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage customer relationships and profiles</p>
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
                Add Customer
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
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customersData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customersData.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KYC Verified</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customersData.filter(c => c.kycStatus === 'verified').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatPriceGHS(customersData.reduce((sum, c) => sum + c.totalSpent, 0))}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
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
                    placeholder="Search customers, emails, locations..."
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
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  Cards
                </button>
              </div>

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== 'all' || kycFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setKycFilter('all')
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
                    { value: 'all', label: 'All Status', description: 'Show all customer statuses' },
                    { value: 'active', label: 'Active', description: 'Active customers', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                    { value: 'inactive', label: 'Inactive', description: 'Inactive customers', icon: <div className="w-3 h-3 rounded-full bg-gray-500"></div> },
                    { value: 'suspended', label: 'Suspended', description: 'Suspended customers', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Select status"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All KYC Status', description: 'Show all KYC statuses' },
                    { value: 'verified', label: 'Verified', description: 'KYC verification completed', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
                    { value: 'pending', label: 'Pending', description: 'KYC verification pending', icon: <Clock className="w-4 h-4 text-yellow-500" /> },
                    { value: 'rejected', label: 'Rejected', description: 'KYC verification rejected', icon: <XCircle className="w-4 h-4 text-red-500" /> }
                  ]}
                  value={kycFilter}
                  onChange={setKycFilter}
                  placeholder="Select KYC status"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Time', description: 'Show all customers' },
                    { value: '30', label: 'Last 30 days', description: 'Customers from past month' },
                    { value: '90', label: 'Last 90 days', description: 'Customers from past quarter' },
                    { value: '180', label: 'Last 6 months', description: 'Customers from past 6 months' },
                    { value: '365', label: 'Last year', description: 'Customers from past year' }
                  ]}
                  value="all"
                  onChange={() => {}}
                  placeholder="Select join date"
                  size="md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('send_email')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Send Email
                </button>
                <button
                  onClick={() => handleBulkAction('update_status')}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setSelectedCustomers([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{customer.totalPurchases} vehicles</div>
                          <div className="text-sm text-gray-500">{formatPriceGHS(customer.totalSpent)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycColor(customer.kycStatus)}`}>
                          {customer.kycStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(customer.joinDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View Profile">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-600">{customer.location}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycColor(customer.kycStatus)}`}>
                      {customer.kycStatus}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{customer.totalPurchases} vehicles purchased</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatPriceGHS(customer.totalSpent)} total spent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Joined {formatDate(customer.joinDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{customer.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Profile">
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
          <span>Showing {filteredCustomers.length} of {customersData.length} customers</span>
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