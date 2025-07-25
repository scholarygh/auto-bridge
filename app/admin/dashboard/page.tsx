'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Search, 
  Ship, 
  Clock,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  MoreHorizontal,
  Plus,
  FileText,
  BarChart3,
  Filter as FilterIcon,
  X,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Shield,
  TrendingDown,
  Loader2
} from 'lucide-react'
import { formatPriceGHS, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function AdminDashboard() {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {
      totalInquiries: 0,
      activeSourcing: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
      pendingQuotes: 0,
      inTransit: 0,
      completedThisMonth: 0,
      totalCustomers: 0,
      avgResponseTime: '0h',
      customerSatisfaction: 0
    },
    trends: {
      inquiries: { current: 0, previous: 0, change: '0%' },
      revenue: { current: 0, previous: 0, change: '0%' },
      conversion: { current: 0, previous: 0, change: '0%' },
      customers: { current: 0, previous: 0, change: '0%' }
    },
    recentInquiries: [],
    recentVehicles: [],
    topPerformingSources: [],
    customerLocations: [],
    notifications: [],
    quickActions: [],
    activeSourcing: [],
    shippingUpdates: []
  })

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading dashboard data...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load data during server-side rendering')
        return
      }
      
      // Dynamic imports to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      
      // Fetch vehicles data
      const vehiclesResult = await VehicleService.getVehicles(1, 100)
      
      if (vehiclesResult.success && vehiclesResult.vehicles) {
        const vehicles = vehiclesResult.vehicles
        
        // Calculate statistics from real data
        const totalVehicles = vehicles.length
        const availableVehicles = vehicles.filter((v: any) => v.status === 'available').length
        const soldVehicles = vehicles.filter((v: any) => v.status === 'sold').length
        const totalRevenue = vehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
        const avgPrice = totalVehicles > 0 ? totalRevenue / totalVehicles : 0
        
        // Calculate trends (simplified - you might want to fetch historical data)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const thisMonthVehicles = vehicles.filter((v: any) => {
          const vehicleDate = new Date(v.created_at)
          return vehicleDate.getMonth() === currentMonth && vehicleDate.getFullYear() === currentYear
        })
        
        const thisMonthRevenue = thisMonthVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
        
        // Get unique makes for analytics
        const makes = Array.from(new Set(vehicles.map((v: any) => v.make).filter(Boolean)))
        const makeStats = makes.map(make => {
          const makeVehicles = vehicles.filter((v: any) => v.make === make)
          const makeRevenue = makeVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          return {
            make,
            count: makeVehicles.length,
            revenue: makeRevenue,
            percentage: totalRevenue > 0 ? (makeRevenue / totalRevenue) * 100 : 0
          }
        }).sort((a, b) => b.revenue - a.revenue)
        
        // Get locations
        const locations = Array.from(new Set(vehicles.map((v: any) => v.location).filter(Boolean)))
        const locationStats = locations.map(location => {
          const locationVehicles = vehicles.filter((v: any) => v.location === location)
          const locationRevenue = locationVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          return {
            location,
            count: locationVehicles.length,
            revenue: locationRevenue
          }
        }).sort((a, b) => b.revenue - a.revenue)
        
        // Calculate conversion rate (simplified)
        const conversionRate = totalVehicles > 0 ? (soldVehicles / totalVehicles) * 100 : 0
        
        // Update dashboard data
        setDashboardData({
          stats: {
            totalInquiries: totalVehicles, // Using vehicles as proxy for inquiries
            activeSourcing: availableVehicles,
            monthlyRevenue: thisMonthRevenue,
            conversionRate: Math.round(conversionRate),
            pendingQuotes: availableVehicles,
            inTransit: vehicles.filter((v: any) => v.status === 'sourcing').length,
            completedThisMonth: thisMonthVehicles.length,
            totalCustomers: totalVehicles, // Using vehicles as proxy for customers
            avgResponseTime: '2.3h', // This would need to be calculated from actual inquiry data
            customerSatisfaction: 94 // This would need to be calculated from actual feedback
          },
          trends: {
            inquiries: { current: totalVehicles, previous: Math.floor(totalVehicles * 0.9), change: '+10%' },
            revenue: { current: thisMonthRevenue, previous: Math.floor(thisMonthRevenue * 0.9), change: '+10%' },
            conversion: { current: Math.round(conversionRate), previous: Math.round(conversionRate * 0.95), change: '+5%' },
            customers: { current: totalVehicles, previous: Math.floor(totalVehicles * 0.9), change: '+10%' }
          },
          recentInquiries: vehicles.slice(0, 5).map((v: any, index: number) => ({
            id: v.id,
            customer: `Customer ${index + 1}`,
            car: `${v.make} ${v.model} ${v.year}`,
            budget: v.price,
            location: v.location || 'Unknown',
            status: v.status || 'new',
            priority: index === 0 ? 'high' : 'medium',
            date: v.created_at,
            phone: '+233 XX XXX XXXX',
            email: `customer${index + 1}@email.com`,
            source: 'website',
            notes: v.description || 'No notes',
            responseTime: '1.2h'
          })),
          recentVehicles: vehicles.slice(0, 5).map((v: any) => ({
            id: v.id,
            title: `${v.make} ${v.model} ${v.year}`,
            price: v.price,
            status: v.status,
            location: v.location,
            views: v.views || 0,
            inquiries: v.inquiries || 0,
            created_at: v.created_at
          })),
          topPerformingSources: [
            { source: 'Website', inquiries: totalVehicles, conversion: Math.round(conversionRate) },
            { source: 'Referrals', inquiries: Math.floor(totalVehicles * 0.3), conversion: 85 },
            { source: 'Social Media', inquiries: Math.floor(totalVehicles * 0.2), conversion: 62 },
            { source: 'Direct Contact', inquiries: Math.floor(totalVehicles * 0.1), conversion: 100 }
          ],
          customerLocations: locationStats.slice(0, 5),
          makeStats: makeStats.slice(0, 5),
          quickActions: [
            { id: 1, title: 'Create New Inquiry', action: 'create_inquiry', icon: Plus, color: 'blue' },
            { id: 2, title: 'View Inventory', action: 'inventory', icon: Car, color: 'green' },
            { id: 3, title: 'Export Reports', action: 'export', icon: Download, color: 'purple' },
            { id: 4, title: 'View Analytics', action: 'analytics', icon: BarChart3, color: 'orange' }
          ],
          activeSourcing: [
            { id: 1, customer: 'Customer A', car: 'Toyota Camry 2020', budget: 12000, status: 'sourcing', progress: 45, daysLeft: 10, lastUpdate: '2 hours ago' },
            { id: 2, customer: 'Customer B', car: 'Honda Accord 2019', budget: 15000, status: 'sourcing', progress: 60, daysLeft: 5, lastUpdate: '1 hour ago' },
            { id: 3, customer: 'Customer C', car: 'Ford F-150 2021', budget: 20000, status: 'sourcing', progress: 75, daysLeft: 2, lastUpdate: '30 minutes ago' }
          ],
          shippingUpdates: [
            { id: 1, customer: 'Customer X', car: 'BMW M3 2022', status: 'in_transit', trackingNumber: '1234567890123456789012345678901234567890', location: 'Accra, GH', eta: '2023-12-15T10:00:00Z', daysRemaining: 3 },
            { id: 2, customer: 'Customer Y', car: 'Mercedes-Benz C-Class 2021', status: 'arrived', trackingNumber: '9876543210987654321098765432109876543210', location: 'Tema, GH', eta: '2023-12-10T14:00:00Z', daysRemaining: 0 }
          ]
        })
        
        console.log('✅ Dashboard data loaded successfully')
      } else {
        console.error('❌ Failed to load vehicles for dashboard:', vehiclesResult.error)
        setError(vehiclesResult.error || 'Failed to load dashboard data')
      }
    } catch (err) {
      console.error('❌ Error loading dashboard data:', err)
      setError('Failed to load dashboard data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'sourcing': return 'bg-yellow-100 text-yellow-800'
      case 'quoted': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
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
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
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
          <button onClick={loadDashboardData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  const hasData = dashboardData.stats.totalInquiries > 0 || 
                  dashboardData.recentInquiries.length > 0 || 
                  dashboardData.recentVehicles.length > 0

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Auto-Bridge!</h2>
          <p className="text-gray-600 mb-6">
            Your dashboard is ready but there's no data yet. Start by adding vehicles or receiving inquiries.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/vehicles/add'} 
              className="btn-primary w-full"
            >
              Add Your First Vehicle
            </button>
            <button 
              onClick={loadDashboardData} 
              className="btn-secondary w-full"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const filteredInquiries = (dashboardData.recentInquiries || []).filter((inquiry: any) => {
    const matchesSearch = inquiry.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || inquiry.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

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
      setSelectedInquiries(filteredInquiries.map((inquiry: any) => inquiry.id))
    }
  }

  const handleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev => 
      prev.includes(id) 
        ? prev.filter(inquiryId => inquiryId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Advanced Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Car sourcing operations overview</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  {dashboardData.notifications?.filter((n: any) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {dashboardData.notifications?.filter((n: any) => !n.read).length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {dashboardData.notifications?.map((notification: any) => (
                        <div key={notification.id} className={`p-3 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}>
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                      {(!dashboardData.notifications || dashboardData.notifications.length === 0) && (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Export Button */}
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>

              {/* New Inquiry Button */}
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Inquiry
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
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.stats.totalInquiries}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {dashboardData.trends.inquiries.change.startsWith('+') ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    dashboardData.trends.inquiries.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dashboardData.trends.inquiries.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Active Sourcing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.stats.activeSourcing}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600 font-medium">In Progress</span>
                  <span className="text-sm text-gray-500">• {dashboardData.stats.pendingQuotes} pending</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPriceGHS(dashboardData.stats.monthlyRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {dashboardData.trends.revenue.change.startsWith('+') ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    dashboardData.trends.revenue.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dashboardData.trends.revenue.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardData.stats.conversionRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {dashboardData.trends.conversion.change.startsWith('+') ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    dashboardData.trends.conversion.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dashboardData.trends.conversion.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Table with Better UX */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
                <p className="text-sm text-gray-600">Latest customer requests • {filteredInquiries.length} results</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Avg Response: {dashboardData.stats.avgResponseTime}</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search customers, cars, locations..."
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
                  <FilterIcon className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

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
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inquiry.customer}</div>
                          <div className="text-sm text-gray-500">{inquiry.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inquiry.car}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPriceGHS(inquiry.budget)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
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

            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Showing {filteredInquiries.length} of {dashboardData.recentInquiries.length} inquiries</span>
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