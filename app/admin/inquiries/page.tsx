'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Phone, 
  Mail, 
  MessageSquare,
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
  Loader2
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function InquiriesPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inquiriesData, setInquiriesData] = useState<any[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([])
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    loadInquiriesData()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [inquiriesData, searchTerm, sortField, sortDirection])

  const loadInquiriesData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading inquiries data...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load data during server-side rendering')
        return
      }
      
      // Fetch inquiries from database
      const response = await fetch('/api/inquiries')
      const result = await response.json()
      
      if (result.success && result.inquiries) {
        const inquiries = result.inquiries.map((inquiry: any, index: number) => ({
          id: inquiry.id,
          customer: inquiry.customer_name || `Customer ${index + 1}`,
          email: inquiry.customer_email,
          phone: '+233 XX XXX XXXX', // Mock phone for now
          car: inquiry.vehicle_request || 'Vehicle Request',
          budget: inquiry.budget_range || 'Not specified',
          location: 'Ghana', // Mock location for now
          status: inquiry.status || 'new',
          priority: inquiry.priority || 'medium',
          date: inquiry.created_at,
          source: 'website', // Mock source for now
          notes: inquiry.notes || 'No notes',
          lastContact: inquiry.updated_at || inquiry.created_at,
          assignedTo: 'Admin',
          tags: inquiry.status === 'new' ? ['new'] : inquiry.status === 'sourcing' ? ['sourcing'] : ['active']
        }))
        
        setInquiriesData(inquiries)
        console.log('✅ Inquiries data loaded successfully')
      } else {
        console.error('❌ Failed to load inquiries:', result.error)
        setError(result.error || 'Failed to load inquiries data')
      }
    } catch (err) {
      console.error('❌ Error loading inquiries data:', err)
      setError('Failed to load inquiries data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'sourcing': return 'bg-yellow-100 text-yellow-800'
      case 'quoted': return 'bg-blue-100 text-blue-800'
      case 'purchased': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-orange-100 text-orange-800'
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

  const filterInquiries = () => {
    let filtered = inquiriesData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === 'date' || sortField === 'lastContact') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredInquiries(filtered)
  }

  const handleRefresh = () => {
    loadInquiriesData()
  }

  const handleBulkAction = (action: string) => {
    if (selectedInquiries.length === 0) return
    
    switch (action) {
      case 'mark_contacted':
        console.log('Marking inquiries as contacted:', selectedInquiries)
        break
      case 'export':
        console.log('Exporting inquiries:', selectedInquiries)
        break
      case 'delete':
        console.log('Deleting inquiries:', selectedInquiries)
        break
    }
    setSelectedInquiries([])
  }

  const handleSelectAll = () => {
    if (selectedInquiries.length === filteredInquiries.length) {
      setSelectedInquiries([])
    } else {
      setSelectedInquiries(filteredInquiries.map(inquiry => inquiry.id))
    }
  }

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev => 
      prev.includes(id) 
        ? prev.filter(inquiryId => inquiryId !== id)
        : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading inquiries data...</p>
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
          <button onClick={loadInquiriesData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  if (inquiriesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Inquiries Yet</h2>
          <p className="text-gray-600 mb-6">
            Customer inquiries will appear here once people start contacting you about vehicles.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/vehicles/add'} 
              className="btn-primary w-full"
            >
              Add Your First Vehicle
            </button>
            <button 
              onClick={loadInquiriesData} 
              className="btn-secondary w-full"
            >
              Refresh Inquiries
            </button>
          </div>
        </div>
      </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
              <p className="text-gray-600 mt-1">Manage customer inquiries and requests</p>
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
                New Inquiry
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
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{inquiriesData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">68%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
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
                    placeholder="Search customers, cars, emails..."
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
              {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setPriorityFilter('all')
                    setSourceFilter('all')
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
                    { value: 'all', label: 'All Status', description: 'Show all inquiries' },
                    { value: 'new', label: 'New', description: 'Recently submitted inquiries', icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div> },
                    { value: 'sourcing', label: 'Sourcing', description: 'Currently being processed', icon: <Clock className="w-4 h-4 text-gray-500" /> },
                    { value: 'quoted', label: 'Quoted', description: 'Price quote provided', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                    { value: 'purchased', label: 'Purchased', description: 'Successfully completed', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Select status"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Priorities', description: 'Show all priority levels' },
                    { value: 'high', label: 'High', description: 'Urgent attention required', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
                    { value: 'medium', label: 'Medium', description: 'Standard priority', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                    { value: 'low', label: 'Low', description: 'Low priority inquiry', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> }
                  ]}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  placeholder="Select priority"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: 'all', label: 'All Sources', description: 'Show all inquiry sources' },
                    { value: 'website', label: 'Website', description: 'Inquiries from website', icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div> },
                    { value: 'referral', label: 'Referral', description: 'Customer referrals', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                    { value: 'social_media', label: 'Social Media', description: 'Social media inquiries', icon: <div className="w-3 h-3 rounded-full bg-purple-500"></div> }
                  ]}
                  value={sourceFilter}
                  onChange={setSourceFilter}
                  placeholder="Select source"
                  size="md"
                />
                <EnhancedDropdown
                  options={[
                    { value: '7', label: 'Last 7 days', description: 'Inquiries from the past week' },
                    { value: '30', label: 'Last 30 days', description: 'Inquiries from the past month' },
                    { value: '90', label: 'Last 90 days', description: 'Inquiries from the past quarter' },
                    { value: 'custom', label: 'Custom range', description: 'Select custom date range' }
                  ]}
                  value="7"
                  onChange={() => {}}
                  placeholder="Select date range"
                  size="md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedInquiries.length > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedInquiries.length} inquiry{selectedInquiries.length > 1 ? 'ies' : 'y'} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('mark_contacted')}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
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
                  onClick={() => setSelectedInquiries([])}
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
                        checked={selectedInquiries.length === filteredInquiries.length && filteredInquiries.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => handleSelectInquiry(inquiry.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inquiry.customer}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                          <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inquiry.car}</div>
                        <div className="text-sm text-gray-500">{inquiry.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPriceGHS(inquiry.budget)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(inquiry.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
            {filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{inquiry.customer}</h3>
                    <p className="text-sm text-gray-600">{inquiry.email}</p>
                    <p className="text-sm text-gray-600">{inquiry.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}>
                      {inquiry.priority}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{inquiry.car}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{inquiry.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatPriceGHS(inquiry.budget)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDate(inquiry.date)}</span>
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
          <span>Showing {filteredInquiries.length} of {inquiriesData.length} inquiries</span>
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