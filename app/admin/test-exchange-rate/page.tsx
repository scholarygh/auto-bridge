'use client'

import React, { useState, useEffect } from 'react'
import { DollarSign, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { convertUSDToGHSSync } from '@/lib/utils'

export default function TestExchangeRatePage() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    loadExchangeRate()
  }, [])

  const loadExchangeRate = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/exchange-rate')
      const result = await response.json()
      
      if (result.success && result.data) {
        setExchangeRate(result.data.USD_TO_GHS)
        setMessage(`Exchange rate loaded successfully: ${result.data.USD_TO_GHS} GHS per USD`)
        setMessageType('success')
      } else {
        setMessage('Failed to load exchange rate')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error loading exchange rate:', error)
      setMessage('Error loading exchange rate')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const testConversions = () => {
    if (!exchangeRate) return []
    
    const testAmounts = [1000, 5000, 10000, 25000, 50000, 100000]
    return testAmounts.map(usd => ({
      usd,
      ghs: convertUSDToGHSSync(usd).toFixed(2)
    }))
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Exchange Rate Test</h1>
          <p className="text-gray-600 mt-1">
            Testing the USD to GHS exchange rate system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exchange Rate Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Exchange Rate</h2>
                <p className="text-sm text-gray-600">USD to GHS conversion rate</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                {exchangeRate ? (
                  <div className="text-3xl font-bold text-blue-600">
                    1 USD = {exchangeRate} GHS
                  </div>
                ) : (
                  <div className="text-lg text-gray-500">
                    Loading...
                  </div>
                )}
              </div>

              <button
                onClick={loadExchangeRate}
                disabled={isLoading}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Loading...' : 'Refresh Rate'}</span>
              </button>

              {message && (
                <div className={`p-3 rounded-lg ${
                  messageType === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {messageType === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversion Examples */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Examples</h2>
            
            {exchangeRate ? (
              <div className="space-y-3">
                {testConversions().map(({ usd, ghs }) => (
                  <div key={usd} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-left">
                      <div className="font-medium text-gray-900">${usd.toLocaleString()} USD</div>
                      <div className="text-sm text-gray-500">Vehicle price example</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">₵{parseFloat(ghs).toLocaleString()} GHS</div>
                      <div className="text-sm text-gray-500">Ghana Cedis</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Load exchange rate to see conversions
              </div>
            )}
          </div>
        </div>

        {/* Expected Values */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Expected Values (Rate: 10.88)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">$10,000 USD</span>
              <span className="font-medium text-blue-900">₵108,800 GHS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">$25,000 USD</span>
              <span className="font-medium text-blue-900">₵272,000 GHS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">$50,000 USD</span>
              <span className="font-medium text-blue-900">₵544,000 GHS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">$100,000 USD</span>
              <span className="font-medium text-blue-900">₵1,088,000 GHS</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex space-x-4">
          <a 
            href="/admin/settings/exchange-rate" 
            className="btn-secondary"
          >
            Exchange Rate Settings
          </a>
          <a 
            href="/admin/vehicles" 
            className="btn-primary"
          >
            Back to Vehicles
          </a>
        </div>
      </div>
    </div>
  )
} 