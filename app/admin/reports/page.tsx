'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw, 
  BarChart3,
  DollarSign,
  Users,
  Car,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Eye,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { formatPriceGHS, formatPriceUSD, convertUSDToGHSSync } from '@/lib/utils'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('30days')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedReport, setSelectedReport] = useState('financial')
  const [reportsData, setReportsData] = useState<any>({
    financial: {
      revenueReport: {
        title: 'Revenue Report',
        period: 'Current Month',
        totalRevenue: 0,
        growth: 0,
        breakdown: [],
        topVehicles: []
      },
      profitReport: {
        title: 'Profit & Loss Report',
        period: 'Current Month',
        revenue: 0,
        expenses: 0,
        profit: 0,
        margin: 0,
        expenseBreakdown: []
      }
    },
    operational: {
      sourcingReport: {
        title: 'Sourcing Performance Report',
        period: 'Current Month',
        totalInquiries: 0,
        successfulSourcing: 0,
        successRate: 0,
        averageTime: 0,
        byStatus: [],
        topSources: []
      },
      shippingReport: {
        title: 'Shipping & Logistics Report',
        period: 'Current Month',
        totalShipments: 0,
        delivered: 0,
        inTransit: 0,
        delayed: 0,
        onTimeRate: 0,
        averageTransitTime: 0,
        byRoute: []
      }
    },
    customer: {
      customerReport: {
        title: 'Customer Analytics Report',
        period: 'Current Month',
        totalCustomers: 0,
        newCustomers: 0,
        returningCustomers: 0,
        retentionRate: 0,
        averageOrderValue: 0,
        topLocations: [],
        customerSatisfaction: 0
      }
    }
  })

  useEffect(() => {
    setMounted(true)
    loadReportsData()
  }, [])

  const loadReportsData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading reports data...')
      
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
        
        // Calculate financial data
        const totalRevenue = vehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
        const soldVehicles = vehicles.filter((v: any) => v.status === 'sold')
        const soldRevenue = soldVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
        
        // Calculate revenue by vehicle make
        const makes = Array.from(new Set(vehicles.map((v: any) => v.make).filter(Boolean)))
        const revenueByVehicle = makes.map(make => {
          const makeVehicles = vehicles.filter((v: any) => v.make === make)
          const makeRevenue = makeVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          return {
            vehicle: make,
            revenue: makeRevenue,
            units: makeVehicles.length
          }
        }).sort((a, b) => b.revenue - a.revenue)
        
        // Calculate operational data
        const totalInquiries = vehicles.length
        const successfulSourcing = soldVehicles.length
        const successRate = totalInquiries > 0 ? (successfulSourcing / totalInquiries) * 100 : 0
        
        // Calculate customer data
        const uniqueLocations = new Set(vehicles.map((v: any) => v.location).filter(Boolean))
        const locationStats = Array.from(uniqueLocations).map(location => {
          const locationVehicles = vehicles.filter((v: any) => v.location === location)
          const locationRevenue = locationVehicles.reduce((sum: number, v: any) => sum + (v.price || 0), 0)
          return {
            location,
            customers: locationVehicles.length,
            revenue: locationRevenue
          }
        }).sort((a, b) => b.revenue - a.revenue)
        
        // Update reports data
        setReportsData({
          financial: {
            revenueReport: {
              title: 'Revenue Report',
              period: 'Current Month',
              totalRevenue: soldRevenue,
              growth: 12.5, // Mock for now
              breakdown: [
                { category: 'Vehicle Sales', amount: soldRevenue, percentage: 100 },
                { category: 'Shipping Fees', amount: soldRevenue * 0.1, percentage: 10 },
                { category: 'Insurance', amount: soldRevenue * 0.05, percentage: 5 },
                { category: 'Other Services', amount: soldRevenue * 0.02, percentage: 2 }
              ],
              topVehicles: revenueByVehicle.slice(0, 5)
            },
            profitReport: {
              title: 'Profit & Loss Report',
              period: 'Current Month',
              revenue: soldRevenue,
              expenses: soldRevenue * 0.65, // Mock 65% cost
              profit: soldRevenue * 0.35, // Mock 35% profit
              margin: 35,
              expenseBreakdown: [
                { category: 'Vehicle Costs', amount: soldRevenue * 0.5, percentage: 50 },
                { category: 'Shipping Costs', amount: soldRevenue * 0.1, percentage: 10 },
                { category: 'Operational Costs', amount: soldRevenue * 0.03, percentage: 3 },
                { category: 'Marketing', amount: soldRevenue * 0.01, percentage: 1 },
                { category: 'Other', amount: soldRevenue * 0.01, percentage: 1 }
              ]
            }
          },
          operational: {
            sourcingReport: {
              title: 'Sourcing Performance Report',
              period: 'Current Month',
              totalInquiries: totalInquiries,
              successfulSourcing: successfulSourcing,
              successRate: Math.round(successRate),
              averageTime: 14, // Mock for now
              byStatus: [
                { status: 'Completed', count: successfulSourcing, percentage: Math.round(successRate) },
                { status: 'In Progress', count: vehicles.filter(v => v.status === 'sourcing').length, percentage: Math.round((vehicles.filter(v => v.status === 'sourcing').length / totalInquiries) * 100) },
                { status: 'Cancelled', count: vehicles.filter(v => v.status === 'cancelled').length, percentage: Math.round((vehicles.filter(v => v.status === 'cancelled').length / totalInquiries) * 100) }
              ],
              topSources: [
                { source: 'Website', success: successfulSourcing, total: totalInquiries },
                { source: 'Referrals', success: Math.floor(successfulSourcing * 0.3), total: Math.floor(totalInquiries * 0.3) },
                { source: 'Social Media', success: Math.floor(successfulSourcing * 0.2), total: Math.floor(totalInquiries * 0.2) },
                { source: 'Direct Contact', success: Math.floor(successfulSourcing * 0.1), total: Math.floor(totalInquiries * 0.1) }
              ]
            },
            shippingReport: {
              title: 'Shipping & Logistics Report',
              period: 'Current Month',
              totalShipments: successfulSourcing,
              delivered: Math.floor(successfulSourcing * 0.8),
              inTransit: Math.floor(successfulSourcing * 0.15),
              delayed: Math.floor(successfulSourcing * 0.05),
              onTimeRate: 80, // Mock for now
              averageTransitTime: 35, // Mock for now
              byRoute: [
                { route: 'Miami → Tema', shipments: Math.floor(successfulSourcing * 0.4), avgTime: 32, onTime: 93 },
                { route: 'Los Angeles → Tema', shipments: Math.floor(successfulSourcing * 0.3), avgTime: 38, onTime: 75 },
                { route: 'Houston → Tema', shipments: Math.floor(successfulSourcing * 0.3), avgTime: 35, onTime: 88 }
              ]
            }
          },
          customer: {
            customerReport: {
              title: 'Customer Analytics Report',
              period: 'Current Month',
              totalCustomers: totalInquiries,
              newCustomers: Math.floor(totalInquiries * 0.3),
              returningCustomers: Math.floor(totalInquiries * 0.7),
              retentionRate: 78, // Mock for now
              averageOrderValue: totalInquiries > 0 ? Math.round(soldRevenue / totalInquiries) : 0,
              topLocations: locationStats.slice(0, 5),
              customerSatisfaction: 4.8 // Mock for now
            }
          }
        })
        
        console.log('✅ Reports data loaded successfully')
      } else {
        console.error('❌ Failed to load vehicles for reports:', vehiclesResult.error)
        setError(vehiclesResult.error || 'Failed to load reports data')
      }
    } catch (err) {
      console.error('❌ Error loading reports data:', err)
      setError('Failed to load reports data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadReportsData()
  }

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports data...</p>
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
          <button onClick={loadReportsData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Check if there's no data
  const hasData = reportsData.financial.revenueReport.totalRevenue > 0 || 
                  reportsData.operational.sourcingReport.totalInquiries > 0

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reports Available</h2>
          <p className="text-gray-600 mb-6">
            Reports will be generated once you have vehicles and sales data in your system.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/vehicles/add'} 
              className="btn-primary w-full"
            >
              Add Your First Vehicle
            </button>
            <button 
              onClick={loadReportsData} 
              className="btn-secondary w-full"
            >
              Refresh Reports
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
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">Business reports and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <EnhancedDropdown
                value={timeRange}
                onChange={(value) => setTimeRange(value)}
                options={[
                  { value: '1week', label: 'Last week' },
                  { value: '1month', label: 'Last month' },
                  { value: '3months', label: 'Last 3 months' },
                  { value: '6months', label: 'Last 6 months' },
                  { value: '1year', label: 'Last year' }
                ]}
                placeholder="Select time range"
                className="w-48"
              />
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setSelectedReport('financial')}
            className={`p-6 rounded-xl border transition-all ${
              selectedReport === 'financial'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedReport === 'financial' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  selectedReport === 'financial' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Financial Reports</h3>
                <p className="text-sm text-gray-500">Revenue, profit & loss</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedReport('operational')}
            className={`p-6 rounded-xl border transition-all ${
              selectedReport === 'operational'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedReport === 'operational' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <BarChart3 className={`w-6 h-6 ${
                  selectedReport === 'operational' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Operational Reports</h3>
                <p className="text-sm text-gray-500">Sourcing & shipping</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedReport('customer')}
            className={`p-6 rounded-xl border transition-all ${
              selectedReport === 'customer'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedReport === 'customer' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Users className={`w-6 h-6 ${
                  selectedReport === 'customer' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Customer Reports</h3>
                <p className="text-sm text-gray-500">Analysis & satisfaction</p>
              </div>
            </div>
          </button>
        </div>

        {/* Financial Reports */}
        {selectedReport === 'financial' && (
          <div className="space-y-6">
            {/* Revenue Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportsData.financial.revenueReport.title}</h3>
                    <p className="text-sm text-gray-600">{reportsData.financial.revenueReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('revenue')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Overview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Revenue Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Total Revenue</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPriceGHS(reportsData.financial.revenueReport.totalRevenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Growth</span>
                        <span className="text-lg font-bold text-green-600">
                          +{reportsData.financial.revenueReport.growth}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Revenue Breakdown</h4>
                    <div className="space-y-3">
                      {reportsData.financial.revenueReport.breakdown.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.category}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{formatPriceGHS(item.amount)}</div>
                            <div className="text-xs text-gray-500">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Vehicles */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Top Revenue Vehicles</h4>
                  <div className="space-y-3">
                    {reportsData.financial.revenueReport.topVehicles.map((vehicle: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{vehicle.vehicle}</span>
                            <p className="text-xs text-gray-500">{vehicle.units} units sold</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{formatPriceGHS(vehicle.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profit & Loss Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportsData.financial.profitReport.title}</h3>
                    <p className="text-sm text-gray-600">{reportsData.financial.profitReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('profit')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* P&L Summary */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Profit & Loss Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Revenue</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatPriceGHS(reportsData.financial.profitReport.revenue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Expenses</span>
                        <span className="text-lg font-bold text-red-600">
                          {formatPriceGHS(reportsData.financial.profitReport.expenses)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Net Profit</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatPriceGHS(reportsData.financial.profitReport.profit)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Profit Margin</span>
                        <span className="text-lg font-bold text-gray-900">
                          {reportsData.financial.profitReport.margin}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Expense Breakdown</h4>
                    <div className="space-y-3">
                      {reportsData.financial.profitReport.expenseBreakdown.map((expense: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{expense.category}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{formatPriceGHS(expense.amount)}</div>
                            <div className="text-xs text-gray-500">{expense.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operational Reports */}
        {selectedReport === 'operational' && (
          <div className="space-y-6">
            {/* Sourcing Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportsData.operational.sourcingReport.title}</h3>
                    <p className="text-sm text-gray-600">{reportsData.operational.sourcingReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('sourcing')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sourcing Overview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Sourcing Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Total Inquiries</span>
                        <span className="text-lg font-bold text-gray-900">{reportsData.operational.sourcingReport.totalInquiries}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Successful Sourcing</span>
                        <span className="text-lg font-bold text-green-600">{reportsData.operational.sourcingReport.successfulSourcing}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Success Rate</span>
                        <span className="text-lg font-bold text-blue-600">{reportsData.operational.sourcingReport.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Average Time</span>
                        <span className="text-lg font-bold text-gray-900">{reportsData.operational.sourcingReport.averageTime} days</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Status Breakdown</h4>
                    <div className="space-y-3">
                      {reportsData.operational.sourcingReport.byStatus.map((status: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{status.status}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{status.count}</div>
                            <div className="text-xs text-gray-500">{status.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Sources */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Top Performing Sources</h4>
                  <div className="space-y-3">
                    {reportsData.operational.sourcingReport.topSources.map((source: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{source.source}</span>
                            <p className="text-xs text-gray-500">{source.success}/{source.total} successful</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{Math.round((source.success / source.total) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportsData.operational.shippingReport.title}</h3>
                    <p className="text-sm text-gray-600">{reportsData.operational.shippingReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('shipping')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Shipping Overview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Shipping Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Total Shipments</span>
                        <span className="text-lg font-bold text-gray-900">{reportsData.operational.shippingReport.totalShipments}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Delivered</span>
                        <span className="text-lg font-bold text-green-600">{reportsData.operational.shippingReport.delivered}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">In Transit</span>
                        <span className="text-lg font-bold text-blue-600">{reportsData.operational.shippingReport.inTransit}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">On-Time Rate</span>
                        <span className="text-lg font-bold text-yellow-600">{reportsData.operational.shippingReport.onTimeRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Performance */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Route Performance</h4>
                    <div className="space-y-3">
                      {reportsData.operational.shippingReport.byRoute.map((route: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{route.route}</span>
                            <span className="text-sm text-gray-600">{route.shipments} shipments</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Avg: {route.avgTime} days</span>
                            <span>On-time: {route.onTime}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reports */}
        {selectedReport === 'customer' && (
          <div className="space-y-6">
            {/* Customer Analysis Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportsData.customer.customerReport.title}</h3>
                    <p className="text-sm text-gray-600">{reportsData.customer.customerReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('customer')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Overview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Customer Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Total Customers</span>
                        <span className="text-lg font-bold text-gray-900">{reportsData.customer.customerReport.totalCustomers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">New Customers</span>
                        <span className="text-lg font-bold text-blue-600">{reportsData.customer.customerReport.newCustomers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Returning Customers</span>
                        <span className="text-lg font-bold text-green-600">{reportsData.customer.customerReport.returningCustomers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Retention Rate</span>
                        <span className="text-lg font-bold text-purple-600">{reportsData.customer.customerReport.retentionRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer by Location */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Customers by Location</h4>
                    <div className="space-y-3">
                      {reportsData.customer.customerReport.topLocations.map((location: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{location.location}</span>
                            <span className="text-sm text-gray-600">{location.customers} customers</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Revenue: {formatPriceGHS(location.revenue)}</span>
                            <span>Avg: {formatPriceGHS(location.revenue / location.customers)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Satisfaction Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{reportsData.customer.satisfactionReport.title}</h3>
                    <p className="text-sm text-gray-600">{reportsData.customer.satisfactionReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport('satisfaction')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Satisfaction */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Overall Satisfaction</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Overall Rating</span>
                        <span className="text-lg font-bold text-yellow-600">{reportsData.customer.satisfactionReport.customerSatisfaction}/5</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Total Reviews</span>
                        <span className="text-lg font-bold text-gray-900">{reportsData.customer.customerReport.totalCustomers}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Rating Breakdown</h4>
                    <div className="space-y-3">
                      {/* This section would typically fetch satisfaction ratings from a database */}
                      {/* For now, we'll use a placeholder or mock data */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">4 stars</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">100</div>
                          <div className="text-xs text-gray-500">70%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">3 stars</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">50</div>
                          <div className="text-xs text-gray-500">35%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">2 stars</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">20</div>
                          <div className="text-xs text-gray-500">15%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">1 star</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 1 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">0</div>
                          <div className="text-xs text-gray-500">0%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Categories */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Feedback by Category</h4>
                    <div className="space-y-3">
                      {/* This section would typically fetch feedback categories from a database */}
                      {/* For now, we'll use a placeholder or mock data */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">1</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Vehicle Quality</span>
                            <p className="text-xs text-gray-500">100 reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4.5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">2</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Service Quality</span>
                            <p className="text-xs text-gray-500">100 reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4.2 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.2</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">3</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Communication</span>
                            <p className="text-xs text-gray-500">100 reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4.1 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.1</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">4</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Delivery Time</span>
                            <p className="text-xs text-gray-500">100 reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4.0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.0</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">5</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Value for Money</span>
                            <p className="text-xs text-gray-500">100 reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < 4.8 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 