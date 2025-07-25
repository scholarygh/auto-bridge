'use client'

import React, { useState } from 'react'
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TestCarfaxExtraction() {
  const [carfaxUrl, setCarfaxUrl] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const testUrl = 'https://www.carfax.com/vehiclehistory/ccl/YYkIB0cfS8A3bi8vRFqK-kJJyggfDiuh_hH3zJdkrpQtoVfLSe8TVqCidEVzHFDUqCidEVzHFDUqjz6C2B2lq6jmrjf4UVlafc2fiUfhto4-90Dxg28?partner=APP_2&model=Tundra&isapp=true&source_caller=sdk&pid=af_app_invites&icr_url=https://www.carfax.com/vehiclehistory/ccl/YYkIB0cfS8A3bi8vRFqK-kJJyggfDiuh_hH3zJdkrpQtoVfLSe8TVqCidEVzHFDUqjz6C2B2lq6jmrjf4UVlafc2fiUfhto4-90Dxg28?partner=APP_2&make=Toyota&shortlink=lnsmsaat&af_referrer_customer_id=cuid0c643f5c9b4f4d69a0dbc57055987e3a&deep_link_value=icr%2F5TFPC5DB6PX021600&af_siteid=479267592&vin=5TFPC5DB6PX021600&af_referrer_uid=1743292802455-8318590'

  const handleTest = async () => {
    const urlToTest = carfaxUrl || testUrl
    setIsTesting(true)
    setError('')
    setResult(null)

    try {
      console.log('🧪 Testing Carfax extraction with URL:', urlToTest)
      
      const response = await fetch('/api/extract-carfax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToTest }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        console.log('✅ Test successful:', data)
      } else {
        setError(data.error || 'Test failed')
        console.error('❌ Test failed:', data.error)
      }
    } catch (error) {
      console.error('❌ Test error:', error)
      setError('Network error during test')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/inventory" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Carfax Extraction Test
          </h1>
          <p className="text-gray-600">
            Test the Carfax extraction system and debug issues
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Test Configuration
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carfax URL (optional - will use test URL if empty)
            </label>
            <input
              type="url"
              value={carfaxUrl}
              onChange={(e) => setCarfaxUrl(e.target.value)}
              placeholder="https://www.carfax.com/vehiclehistory/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Run Test
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="text-sm text-red-600 mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Extraction Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Extraction Results
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <div className="text-sm text-gray-900">{result.extractionInfo?.method}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <div className="text-sm text-gray-900">{result.extractionInfo?.model}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HTML Length</label>
                  <div className="text-sm text-gray-900">{result.extractionInfo?.htmlLength}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <div className="text-sm text-gray-900">{result.extractionInfo?.pageTitle}</div>
                </div>
              </div>
              
              {result.extractionInfo?.warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">{result.extractionInfo.warning}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Extracted Vehicle Data
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Common Issues */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-4">
            🔍 Enhanced Extraction Methods
          </h3>
          
          <div className="space-y-4 text-sm text-yellow-700">
            <div>
              <strong>🔄 Cloudflare Bypass Strategies:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <strong>Standard Load:</strong> Basic page loading</li>
                <li>• <strong>Stealth Mode:</strong> Advanced headers and user agent</li>
                <li>• <strong>Mobile Emulation:</strong> Mobile browser simulation</li>
                <li>• <strong>Delayed Load:</strong> Extended wait times</li>
              </ul>
            </div>
            
            <div>
              <strong>🔍 NHTSA API Fallback:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <strong>VIN Decoding:</strong> Official government vehicle database</li>
                <li>• <strong>Make/Model/Year:</strong> Basic vehicle information</li>
                <li>• <strong>Engine/Transmission:</strong> Technical specifications</li>
                <li>• <strong>Body Type:</strong> Vehicle classification</li>
              </ul>
            </div>
            
            <div>
              <strong>📊 Expected Results:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• <strong>Success:</strong> Full Carfax data extraction</li>
                <li>• <strong>NHTSA Fallback:</strong> Basic vehicle data from government API</li>
                <li>• <strong>URL Fallback:</strong> Minimal data from URL parameters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 