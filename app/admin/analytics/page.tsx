'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Car, 
  MessageSquare,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { formatPriceGHS, formatPriceUSD, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('30days')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [analyticsData, setAnalyticsData] = useState<any>({
    overview: {
      totalRevenue: 0,
      totalInquiries: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      monthlyGrowth: 0,
      customerSatisfaction: 0
    },
    revenue: {
      monthly: [],
      byVehicle: []
    },
    customers: {
      newCustomers: 0,
      returningCustomers: 0,
      customerRetention: 0,
      averageLifetimeValue: 0,
      topLocations: []
    },
    operations: {
      averageSourcingTime: 0,
      averageShippingTime: 0,
      successRate: 0,
      customerSatisfaction: 0,
      topPerformingSources: []
    },
    trends: {
      popularVehicles: [],
      seasonalTrends: []
    }
  })

  useEffect(() => {
    setMounted(true)
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading analytics data...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        setError('Cannot load data during server-side rendering')
        return
      }
      
      // Dynamic imports to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      
      // Fetch vehicles data
      const vehiclesResult = await VehicleService.getVehicles(1, 1000)
      
      if (vehiclesResult.success && vehiclesResult.vehicles) {
        const vehicles = vehiclesResult.vehicles
        
        // Calculate overview statistics
        const totalVehicles = vehicles.length
        const totalRevenue = vehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
        const avgPrice = totalVehicles > 0 ? totalRevenue / totalVehicles : 0
        const soldVehicles = vehicles.filter((v: any) => v.status === 'sold').length
        const conversionRate = totalVehicles > 0 ? (soldVehicles / totalVehicles) * 100 : 0
        
        // Calculate monthly revenue (simplified - using current month)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const thisMonthVehicles = vehicles.filter((v: any) => {
          const vehicleDate = new Date(v.created_at)
          return vehicleDate.getMonth() === currentMonth && vehicleDate.getFullYear() === currentYear
        })
        const thisMonthRevenue = thisMonthVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
        
        // Calculate revenue by vehicle make
        const makes = Array.from(new Set(vehicles.map((v: any) => v.make).filter(Boolean)))
        const revenueByVehicle = makes.map(make => {
          const makeVehicles = vehicles.filter((v: any) => v.make === make)
          const makeRevenue = makeVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          return {
            vehicle: make,
            revenue: makeRevenue,
            percentage: totalRevenue > 0 ? (makeRevenue / totalRevenue) * 100 : 0
          }
        }).sort((a, b) => b.revenue - a.revenue)
        
        // Calculate customer locations
        const locations = Array.from(new Set(vehicles.map((v: any) => v.location).filter(Boolean)))
        const topLocations = locations.map(location => {
          const locationVehicles = vehicles.filter((v: any) => v.location === location)
          const locationRevenue = locationVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          return {
            location,
            customers: locationVehicles.length,
            revenue: locationRevenue
          }
        }).sort((a, b) => b.revenue - a.revenue)
        
        // Calculate popular vehicles
        const popularVehicles = makes.map(make => {
          const makeVehicles = vehicles.filter((v: any) => v.make === make)
          const totalViews = makeVehicles.reduce((sum: number, v: any) => sum + (v.views || 0), 0)
          return {
            vehicle: make,
            demand: makeVehicles.length,
            growth: Math.floor(Math.random() * 20) + 5 // Mock growth for now
          }
        }).sort((a, b) => b.demand - a.demand)
        
        // Generate monthly trends (last 6 months)
        const monthlyTrends = []
        for (let i = 5; i >= 0; i--) {
          const month = new Date(currentYear, currentMonth - i, 1)
          const monthVehicles = vehicles.filter((v: any) => {
            const vehicleDate = new Date(v.created_at)
            return vehicleDate.getMonth() === month.getMonth() && vehicleDate.getFullYear() === month.getFullYear()
          })
          const monthRevenue = monthVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          
          monthlyTrends.push({
            month: month.toLocaleDateString('en-US', { month: 'short' }),
            inquiries: monthVehicles.length,
            revenue: monthRevenue
          })
        }
        
        // Update analytics data
        setAnalyticsData({
          overview: {
            totalRevenue: thisMonthRevenue,
            totalInquiries: totalVehicles,
            conversionRate: Math.round(conversionRate),
            averageOrderValue: Math.round(avgPrice),
            monthlyGrowth: 12.5, // Mock for now
            customerSatisfaction: 4.8 // Mock for now
          },
          revenue: {
            monthly: monthlyTrends,
            byVehicle: revenueByVehicle.slice(0, 5)
          },
          customers: {
            newCustomers: Math.floor(totalVehicles * 0.3),
            returningCustomers: Math.floor(totalVehicles * 0.7),
            customerRetention: 78, // Mock for now
            averageLifetimeValue: Math.round(avgPrice * 1.5),
            topLocations: topLocations.slice(0, 5)
          },
          operations: {
            averageSourcingTime: 14, // Mock for now
            averageShippingTime: 35, // Mock for now
            successRate: 92, // Mock for now
            customerSatisfaction: 4.8, // Mock for now
            topPerformingSources: [
              { source: 'Website', inquiries: totalVehicles, conversion: Math.round(conversionRate) },
              { source: 'Referrals', inquiries: Math.floor(totalVehicles * 0.3), conversion: 85 },
              { source: 'Social Media', inquiries: Math.floor(totalVehicles * 0.2), conversion: 62 },
              { source: 'Direct Contact', inquiries: Math.floor(totalVehicles * 0.1), conversion: 100 }
            ]
          },
          trends: {
            popularVehicles: popularVehicles.slice(0, 5),
            seasonalTrends: monthlyTrends
          }
        })
        
        console.log('✅ Analytics data loaded successfully')
      } else {
        console.error('❌ Failed to load vehicles for analytics:', vehiclesResult.error)
        setError(vehiclesResult.error || 'Failed to load analytics data')
      }
    } catch (err) {
      console.error('❌ Error loading analytics data:', err)
      setError('Failed to load analytics data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadAnalyticsData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
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
          <button onClick={loadAnalyticsData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  const hasData = analyticsData.overview.totalRevenue > 0 || 
                  analyticsData.revenue.monthly.length > 0 || 
                  analyticsData.revenue.byVehicle.length > 0

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Data Yet</h2>
          <p className="text-gray-600 mb-6">
            Analytics will appear here once you start adding vehicles and making sales.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/vehicles/add'} 
              className="btn-primary w-full"
            >
              Add Your First Vehicle
            </button>
            <button 
              onClick={loadAnalyticsData} 
              className="btn-secondary w-full"
            >
              Refresh Analytics
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <EnhancedDropdown
                value={timeRange}
                onChange={(value) => setTimeRange(value)}
                options={[
                  { value: '7days', label: 'Last 7 days' },
                  { value: '30days', label: 'Last 30 days' },
                  { value: '3months', label: 'Last 3 months' },
                  { value: '6months', label: 'Last 6 months' },
                  { value: '1year', label: 'Last year' }
                ]}
                placeholder="Select time range"
                className="w-48"
              />
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPriceGHS(analyticsData.overview.totalRevenue)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">+{analyticsData.overview.monthlyGrowth}%</span>
                  <span className="text-sm text-gray-500">from last month</span>
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
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.overview.totalInquiries}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 font-medium">+8.2%</span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.overview.conversionRate}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600 font-medium">+3.2%</span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.overview.customerSatisfaction}/5
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600 font-medium">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'revenue', name: 'Revenue', icon: DollarSign },
                { id: 'customers', name: 'Customers', icon: Users },
                { id: 'operations', name: 'Operations', icon: Activity },
                { id: 'trends', name: 'Trends', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="space-y-4">
                {analyticsData.revenue.monthly.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900">{formatPriceGHS(item.revenue)}</span>
                      <div className={`flex items-center gap-1 text-xs ${
                        item.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(item.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Vehicle Revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Vehicle</h3>
              <div className="space-y-4">
                {analyticsData.revenue.byVehicle.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.vehicle}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900">{formatPriceGHS(item.revenue)}</span>
                      <span className="text-xs text-gray-500">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Total Revenue</span>
                  <span className="text-lg font-bold text-gray-900">{formatPriceGHS(analyticsData.overview.totalRevenue)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Average Order Value</span>
                  <span className="text-lg font-bold text-gray-900">{formatPriceGHS(analyticsData.overview.averageOrderValue)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Monthly Growth</span>
                  <span className="text-lg font-bold text-green-600">+{analyticsData.overview.monthlyGrowth}%</span>
                </div>
              </div>
            </div>

            {/* Revenue by Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Location</h3>
              <div className="space-y-4">
                {analyticsData.customers.topLocations.map((location: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{location.location}</span>
                      <p className="text-xs text-gray-500">{location.customers} customers</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatPriceGHS(location.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">New Customers</span>
                  <span className="text-lg font-bold text-blue-600">{analyticsData.customers.newCustomers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Returning Customers</span>
                  <span className="text-lg font-bold text-green-600">{analyticsData.customers.returningCustomers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Customer Retention</span>
                  <span className="text-lg font-bold text-purple-600">{analyticsData.customers.customerRetention}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Avg Lifetime Value</span>
                  <span className="text-lg font-bold text-gray-900">{formatPriceGHS(analyticsData.customers.averageLifetimeValue)}</span>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customer Locations</h3>
              <div className="space-y-4">
                {analyticsData.customers.topLocations.map((location: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{location.location}</span>
                        <p className="text-xs text-gray-500">{location.customers} customers</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatPriceGHS(location.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Operational Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Avg Sourcing Time</span>
                  <span className="text-lg font-bold text-blue-600">{analyticsData.operations.averageSourcingTime} days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Avg Shipping Time</span>
                  <span className="text-lg font-bold text-green-600">{analyticsData.operations.averageShippingTime} days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Success Rate</span>
                  <span className="text-lg font-bold text-purple-600">{analyticsData.operations.successRate}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Customer Satisfaction</span>
                  <span className="text-lg font-bold text-yellow-600">{analyticsData.operations.customerSatisfaction}/5</span>
                </div>
              </div>
            </div>

            {/* Top Performing Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sources</h3>
              <div className="space-y-4">
                {analyticsData.operations.topPerformingSources.map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      <p className="text-xs text-gray-500">{source.inquiries} inquiries</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{source.conversion}%</span>
                      <p className="text-xs text-gray-500">conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Vehicles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Vehicles</h3>
              <div className="space-y-4">
                {analyticsData.trends.popularVehicles.map((vehicle: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{vehicle.vehicle}</span>
                      <p className="text-xs text-gray-500">Demand: {vehicle.demand}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-600">+{vehicle.growth}%</span>
                      <p className="text-xs text-gray-500">growth</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Trends</h3>
              <div className="space-y-4">
                {analyticsData.trends.seasonalTrends.map((trend: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{trend.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-900">{trend.inquiries} inquiries</span>
                      <span className="text-sm font-medium text-gray-900">{formatPriceGHS(trend.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 