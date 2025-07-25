'use client'

import React, { useState, useEffect } from 'react'
import { DollarSign, RefreshCw, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function ExchangeRateSettingsPage() {
  const [exchangeRate, setExchangeRate] = useState(10.45)
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
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Exchange Rate Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage the USD to GHS exchange rate for accurate currency conversion
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">USD to GHS Exchange Rate</h2>
              <p className="text-sm text-gray-600">Current rate used for price conversions</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Exchange Rate Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Rate (1 USD = ? GHS)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="10.45"
                />
                <button
                  onClick={loadExchangeRate}
                  disabled={isLoading}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current market rate: ~10.45 GHS per USD (as of Dec 2024)
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
          </div>
        </div>

        {/* Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• This exchange rate is used for all USD to GHS conversions in the system</li>
            <li>• Update this rate regularly to ensure accurate pricing for customers</li>
            <li>• All vehicle prices are stored in USD and converted to GHS for display</li>
            <li>• Mileage is stored in miles and converted to kilometers for display</li>
            <li>• Current market rate is approximately 10.45 GHS per USD</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 