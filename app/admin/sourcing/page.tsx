'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Phone, 
  Mail, 
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  User,
  Car,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  MessageSquare,
  Loader2
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function SourcingPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sourcingData, setSourcingData] = useState<any[]>([])
  const [filteredSources, setFilteredSources] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'list'>('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    loadSourcingData()
  }, [])

  useEffect(() => {
    filterSourcing()
  }, [sourcingData, searchTerm, sortField, sortDirection])

  const loadSourcingData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading sourcing data...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load data during server-side rendering')
        return
      }
      
      // Fetch inquiries that are in sourcing status
      const response = await fetch('/api/inquiries?status=sourcing')
      const result = await response.json()
      
      if (result.success && result.inquiries) {
        const sourcing = result.inquiries.map((inquiry: any, index: number) => {
          // Calculate progress based on status
          let progress = 25
          let status = 'searching'
          let daysLeft = 7
          
          if (inquiry.status === 'sourcing') {
            progress = 50
            status = 'negotiating'
            daysLeft = 3
          } else if (inquiry.status === 'quoted') {
            progress = 75
            status = 'finalizing'
            daysLeft = 1
          }
          
          return {
            id: inquiry.id,
            customer: inquiry.customer_name || `Customer ${index + 1}`,
            car: inquiry.vehicle_request || 'Vehicle Request',
            budget: inquiry.budget_range || 'Not specified',
            location: 'Ghana', // Mock location for now
            status: status,
            progress: progress,
            daysLeft: daysLeft,
            priority: inquiry.priority || 'medium',
            assignedTo: 'Admin',
            lastUpdate: inquiry.updated_at || inquiry.created_at,
            notes: inquiry.notes || 'No notes',
            sources: ['Carfax', 'CarMax', 'CarGurus'], // Mock sources
            foundVehicles: [] // Mock found vehicles
          }
        })
        
        setSourcingData(sourcing)
        console.log('✅ Sourcing data loaded successfully')
      } else {
        console.error('❌ Failed to load sourcing data:', result.error)
        setError(result.error || 'Failed to load sourcing data')
      }
    } catch (err) {
      console.error('❌ Error loading sourcing data:', err)
      setError('Failed to load sourcing data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'searching': return 'bg-yellow-100 text-yellow-800'
      case 'evaluating': return 'bg-blue-100 text-blue-800'
      case 'negotiating': return 'bg-orange-100 text-orange-800'
      case 'finalizing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
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

  const filterSourcing = () => {
    let filtered = sourcingData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sourcing =>
        sourcing.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sourcing.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sourcing.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === 'lastUpdate') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredSources(filtered)
  }

  const handleRefresh = () => {
    loadSourcingData()
  }

  const handleBulkAction = (action: string) => {
    if (selectedSources.length === 0) return
    
    switch (action) {
      case 'update_status':
        console.log('Updating status for:', selectedSources)
        break
      case 'export':
        console.log('Exporting sourcing data:', selectedSources)
        break
      case 'assign':
        console.log('Assigning sourcing tasks:', selectedSources)
        break
    }
    setSelectedSources([])
  }

  const handleSelectAll = () => {
    if (selectedSources.length === filteredSources.length) {
      setSelectedSources([])
    } else {
      setSelectedSources(filteredSources.map(item => item.id))
    }
  }

  const handleSelectSourcing = (id: string) => {
    setSelectedSources(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
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
          <p className="text-gray-600">Loading sourcing data...</p>
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
          <button onClick={loadSourcingData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  if (sourcingData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Sourcing Activities</h2>
          <p className="text-gray-600 mb-6">
            Sourcing activities will appear here once you start processing customer inquiries.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/inquiries'} 
              className="btn-primary w-full"
            >
              View Inquiries
            </button>
            <button 
              onClick={loadSourcingData} 
              className="btn-secondary w-full"
            >
              Refresh Sourcing
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
              <h1 className="text-2xl font-bold text-gray-900">Sourcing</h1>
              <p className="text-gray-600 mt-1">Manage active vehicle sourcing operations</p>
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
                New Sourcing
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
                <p className="text-sm font-medium text-gray-600">Active Sourcing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{sourcingData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">60%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vehicles Found</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-purple-600" />
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
                    placeholder="Search customers, vehicles, locations..."
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
              {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
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
                    { value: 'all', label: 'All Status', description: 'Show all sourcing statuses' },
                    { value: 'searching', label: 'Searching', description: 'Actively searching for vehicles', icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div> },
                    { value: 'evaluating', label: 'Evaluating', description: 'Evaluating potential vehicles', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                    { value: 'negotiating', label: 'Negotiating', description: 'Negotiating with sellers', icon: <div className="w-3 h-3 rounded-full bg-orange-500"></div> },
                    { value: 'finalizing', label: 'Finalizing', description: 'Finalizing purchase details', icon: <div className="w-3 h-3 rounded-full bg-purple-500"></div> },
                    { value: 'completed', label: 'Completed', description: 'Sourcing task completed', icon: <CheckCircle className="w-4 h-4 text-green-500" /> }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Select status"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Priorities', description: 'Show all priority levels' },
                    { value: 'high', label: 'High', description: 'High priority sourcing task', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
                    { value: 'medium', label: 'Medium', description: 'Medium priority sourcing task', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                    { value: 'low', label: 'Low', description: 'Low priority sourcing task', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> }
                  ]}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  placeholder="Select priority"
                  size="md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSources.length > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedSources.length} sourcing task{selectedSources.length > 1 ? 's' : ''} selected
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
                  onClick={() => handleBulkAction('assign')}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => setSelectedSources([])}
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
            {filteredSources.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(item.id)}
                        onChange={() => handleSelectSourcing(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{item.customer}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Vehicle:</span> {item.car}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> {formatPriceGHS(item.budget)}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {item.location}
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

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Days Left:</span> {item.daysLeft}
                  </div>
                  <div>
                    <span className="font-medium">Vehicles Found:</span> {item.foundVehicles.length}
                  </div>
                  <div>
                    <span className="font-medium">Last Update:</span> {formatDate(item.lastUpdate)}
                  </div>
                  <div>
                    <span className="font-medium">Assigned To:</span> {item.assignedTo}
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSources.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.customer}</h3>
                    <p className="text-sm text-gray-600">{item.car}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatPriceGHS(item.budget)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.daysLeft} days left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.foundVehicles.length} vehicles found</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
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
          <span>Showing {filteredSources.length} of {sourcingData.length} sourcing tasks</span>
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