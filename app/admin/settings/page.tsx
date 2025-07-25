'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  User, 
  Building, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Edit,
  Eye,
  EyeOff,
  Globe,
  Clock,
  DollarSign,
  Percent,
  Phone,
  Mail,
  MapPin,
  Camera,
  X,
  Check,
  AlertCircle,
  RefreshCw,
  CheckCircle
} from 'lucide-react'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

// Exchange Rate Settings Component
function ExchangeRateSettings({ isEditing }: { isEditing: boolean }) {
  const [exchangeRate, setExchangeRate] = useState(10.88)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  // Load current exchange rate
  useEffect(() => {
    loadExchangeRate()
  }, [])

  const loadExchangeRate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/exchange-rate')
      const result = await response.json()
      
      if (result.success && result.data) {
        setExchangeRate(result.data.USD_TO_GHS)
      }
    } catch (error) {
      console.error('Error loading exchange rate:', error)
      setMessage('Failed to load exchange rate')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateExchangeRate = async () => {
    // Validate rate
    if (!exchangeRate || exchangeRate <= 0 || exchangeRate > 100) {
      setMessage('Please enter a valid exchange rate between 0 and 100')
      setMessageType('error')
      return
    }

    setIsSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: exchangeRate })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage('Exchange rate updated successfully')
        setMessageType('success')
      } else {
        setMessage(result.error || 'Failed to update exchange rate')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error updating exchange rate:', error)
      setMessage('Failed to update exchange rate')
      setMessageType('error')
    } finally {
      setIsSaving(false)
    }
  }

  const testConversion = (usdAmount: number) => {
    return (usdAmount * exchangeRate).toFixed(2)
  }

  return (
    <div className="space-y-6">
      {/* Exchange Rate Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exchange Rate (1 USD = {exchangeRate} GHS)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
            disabled={!isEditing}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            min="0"
            max="100"
            step="0.01"
            placeholder="10.88"
          />
          <button
            onClick={loadExchangeRate}
            disabled={isLoading || !isEditing}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Current market rate: ~10.88 GHS per USD (as of July 2025)
        </p>
      </div>

      {/* Conversion Examples */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Conversion Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">$10,000 USD</span>
            <span className="font-medium">₵{testConversion(10000)} GHS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">$25,000 USD</span>
            <span className="font-medium">₵{testConversion(25000)} GHS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">$50,000 USD</span>
            <span className="font-medium">₵{testConversion(50000)} GHS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">$100,000 USD</span>
            <span className="font-medium">₵{testConversion(100000)} GHS</span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            )}
            <span className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message}
            </span>
          </div>
        </div>
      )}

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={updateExchangeRate}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Exchange Rate'}</span>
          </button>
        </div>
      )}

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Important Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• This exchange rate is used for all USD to GHS conversions in the system</li>
          <li>• Update this rate regularly to ensure accurate pricing for customers</li>
          <li>• All vehicle prices are stored in USD and converted to GHS for display</li>
          <li>• Mileage is stored in miles and converted to kilometers for display</li>
          <li>• Current market rate is approximately 10.88 GHS per USD (July 2025)</li>
        </ul>
      </div>
    </div>
  )
}

// Mock settings data
const settingsData = {
  business: {
    name: 'Auto-Bridge',
    email: 'contact@autobridge.com',
    phone: '+233 24 123 4567',
    address: '123 Main Street, Accra, Ghana',
    website: 'www.autobridge.com',
    description: 'Premium car sourcing and import service from USA to Ghana',
    logo: '/logo.png',
    currency: 'GHS',
    timezone: 'Africa/Accra',
    commissionRate: 15,
    defaultCurrency: 'GHS',
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '15:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    }
  },
  admin: {
    name: 'Admin User',
    email: 'admin@autobridge.com',
    phone: '+233 24 123 4567',
    role: 'Super Admin',
    avatar: '/avatar.png',
    lastLogin: '2024-01-22 15:30:00'
  },
  notifications: {
    email: {
      newInquiries: true,
      shipmentUpdates: true,
      paymentReceived: true,
      customerMessages: true,
      systemAlerts: true
    },
    sms: {
      newInquiries: false,
      shipmentUpdates: true,
      paymentReceived: true,
      customerMessages: false
    },
    push: {
      newInquiries: true,
      shipmentUpdates: true,
      paymentReceived: true,
      customerMessages: true
    }
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: [],
    auditLog: true
  },
  payment: {
    stripeEnabled: true,
    paypalEnabled: false,
    bankTransfer: true,
    mobileMoney: true,
    defaultPaymentMethod: 'stripe',
    autoInvoice: true,
    paymentTerms: 7
  }
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('business')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState(settingsData)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setSettings(settingsData)
    setIsEditing(false)
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
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
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your business configuration</p>
            </div>
            {isEditing && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {[
                  { id: 'business', name: 'Business Profile', icon: Building },
                  { id: 'admin', name: 'Admin Profile', icon: User },
                  { id: 'notifications', name: 'Notifications', icon: Bell },
                  { id: 'business-settings', name: 'Business Settings', icon: Settings },
                  { id: 'exchange-rate', name: 'Exchange Rate', icon: DollarSign },
                  { id: 'security', name: 'Security', icon: Shield },
                  { id: 'payment', name: 'Payment', icon: CreditCard }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Business Profile */}
            {activeTab === 'business' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Business Profile</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                      <input
                        type="text"
                        value={settings.business.name}
                        onChange={(e) => updateSetting('business', 'name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.business.email}
                        onChange={(e) => updateSetting('business', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={settings.business.phone}
                        onChange={(e) => updateSetting('business', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={settings.business.website}
                        onChange={(e) => updateSetting('business', 'website', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={settings.business.address}
                        onChange={(e) => updateSetting('business', 'address', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={settings.business.description}
                        onChange={(e) => updateSetting('business', 'description', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Profile */}
            {activeTab === 'admin' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Profile</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={settings.admin.name}
                        onChange={(e) => updateSetting('admin', 'name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.admin.email}
                        onChange={(e) => updateSetting('admin', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={settings.admin.phone}
                        onChange={(e) => updateSetting('admin', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        value={settings.admin.role}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          disabled={!isEditing}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(settings.notifications.email).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <p className="text-xs text-gray-500">Receive email notifications for {key.toLowerCase()}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => updateSetting('notifications', 'email', { ...settings.notifications.email, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">SMS Notifications</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(settings.notifications.sms).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <p className="text-xs text-gray-500">Receive SMS notifications for {key.toLowerCase()}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => updateSetting('notifications', 'sms', { ...settings.notifications.sms, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Settings */}
            {activeTab === 'business-settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Business Settings</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.business.commissionRate}
                          onChange={(e) => updateSetting('business', 'commissionRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Percent className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                      <EnhancedDropdown
                        value={settings.business.defaultCurrency}
                        onChange={(value) => updateSetting('business', 'defaultCurrency', value)}
                        options={[
                          { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
                          { value: 'USD', label: 'USD - US Dollar' },
                          { value: 'EUR', label: 'EUR - Euro' }
                        ]}
                        placeholder="Select currency"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <EnhancedDropdown
                        value={settings.business.timezone}
                        onChange={(value) => updateSetting('business', 'timezone', value)}
                        options={[
                          { value: 'Africa/Accra', label: 'Africa/Accra (GMT+0)' },
                          { value: 'America/New_York', label: 'America/New_York (GMT-5)' },
                          { value: 'Europe/London', label: 'Europe/London (GMT+0)' }
                        ]}
                        placeholder="Select timezone"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exchange Rate Settings */}
            {activeTab === 'exchange-rate' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Exchange Rate Settings</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <ExchangeRateSettings isEditing={isEditing} />
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Two-Factor Authentication</span>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Session Timeout (minutes)</span>
                        <p className="text-xs text-gray-500">Automatically log out after inactivity</p>
                      </div>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Password Expiry (days)</span>
                        <p className="text-xs text-gray-500">Force password change after specified days</p>
                      </div>
                      <input
                        type="number"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Audit Log</span>
                        <p className="text-xs text-gray-500">Track all system activities and changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.auditLog}
                          onChange={(e) => updateSetting('security', 'auditLog', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Stripe Payments</span>
                        <p className="text-xs text-gray-500">Accept credit card payments via Stripe</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payment.stripeEnabled}
                          onChange={(e) => updateSetting('payment', 'stripeEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Bank Transfer</span>
                        <p className="text-xs text-gray-500">Accept direct bank transfers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payment.bankTransfer}
                          onChange={(e) => updateSetting('payment', 'bankTransfer', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Mobile Money</span>
                        <p className="text-xs text-gray-500">Accept mobile money payments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payment.mobileMoney}
                          onChange={(e) => updateSetting('payment', 'mobileMoney', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms (days)</label>
                      <input
                        type="number"
                        value={settings.payment.paymentTerms}
                        onChange={(e) => updateSetting('payment', 'paymentTerms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Auto-Generate Invoices</span>
                        <p className="text-xs text-gray-500">Automatically create invoices for completed orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.payment.autoInvoice}
                          onChange={(e) => updateSetting('payment', 'autoInvoice', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 