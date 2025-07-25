'use client'

import React, { useState, useEffect } from 'react'
import { 
  Car, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  User,
  RefreshCw,
  Plus,
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Users
} from 'lucide-react'
import ReviewVehicleModal from '@/components/admin/ReviewVehicleModal'
import { formatPriceGHS } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

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

export default function SellRequestsPage() {
  const [requests, setRequests] = useState<SellRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<SellRequest | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [reviewNotes, setReviewNotes] = useState('')
  const [processingApprove, setProcessingApprove] = useState(false)
  const [processingReject, setProcessingReject] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])

  useEffect(() => {
    loadSellRequests()
  }, [])

  const loadSellRequests = async () => {
    try {
      const response = await fetch('/api/sell-request')
      if (response.ok) {
        const data = await response.json()
        setRequests(data.submissions || [])
      }
    } catch (error) {
      console.error('Error loading sell requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      setProcessingApprove(true)
    } else {
      setProcessingReject(true)
    }
    
    try {
      const response = await fetch(`/api/sell-request/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          review_notes: reviewNotes,
          reviewed_at: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status, review_notes: reviewNotes, reviewed_at: new Date().toISOString() }
            : req
        ))
        setShowDetailModal(false)
        setSelectedRequest(null)
        setReviewNotes('')
      } else {
        const errorData = await response.json()
        console.error('Error updating request status:', errorData)
      }
    } catch (error) {
      console.error('Error updating request status:', error)
    } finally {
      if (status === 'approved') {
        setProcessingApprove(false)
      } else {
        setProcessingReject(false)
      }
    }
  }

  const handleReviewClick = (request: SellRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedRequest(null)
    setReviewNotes('')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadSellRequests()
    setIsRefreshing(false)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action}`, selectedRequests)
    // Implement bulk actions here
  }

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([])
    } else {
      setSelectedRequests(filteredRequests.map(req => req.id))
    }
  }

  const handleSelectRequest = (id: string) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    )
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending_review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading sell requests...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Sell Requests</h1>
              <p className="text-gray-600 mt-1">Review and manage vehicle submissions from customers</p>
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
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pending}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600 font-medium">Needs Attention</span>
                  <span className="text-sm text-gray-500">• {stats.pending} urgent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.approved}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.rejected}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">-5%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <EnhancedDropdown
                options={[
                  { value: 'all', label: 'All Status', description: 'Show all requests' },
                  { value: 'pending_review', label: 'Pending Review', description: 'Awaiting admin review', icon: <Clock className="w-4 h-4 text-yellow-500" /> },
                  { value: 'approved', label: 'Approved', description: 'Request approved and added to inventory', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
                  { value: 'rejected', label: 'Rejected', description: 'Request rejected', icon: <XCircle className="w-4 h-4 text-red-500" /> },
                  { value: 'contacted', label: 'Contacted', description: 'Customer has been contacted', icon: <User className="w-4 h-4 text-blue-500" /> }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
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

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedRequests.length} request(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => setSelectedRequests([])}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Car className="w-7 h-7 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {request.year} {request.make} {request.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            VIN: {request.vin}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.mileage.toLocaleString()} miles • {request.condition}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.contact_name}</div>
                        <div className="text-xs text-gray-500">{request.contact_email}</div>
                        <div className="text-xs text-gray-500">{request.contact_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleReviewClick(request)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="Review Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900" 
                          title="Call Customer"
                          onClick={() => window.open(`tel:${request.contact_phone}`)}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900" 
                          title="Send Email"
                          onClick={() => window.open(`mailto:${request.contact_email}`)}
                        >
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

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No sell requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewVehicleModal
        request={selectedRequest}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        onStatusUpdate={handleStatusUpdate}
        reviewNotes={reviewNotes}
        setReviewNotes={setReviewNotes}
        processingApprove={processingApprove}
        processingReject={processingReject}
      />
    </div>
  )
} 