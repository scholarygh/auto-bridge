'use client'

import React, { useState } from 'react'
import { ArrowLeft, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TestNHTSAAPI() {
  const [vin, setVin] = useState('5TFPC5DB6PX021600')
  const [isTesting, setIsTesting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTest = async () => {
    setIsTesting(true)
    setError('')
    setResult(null)

    try {
      console.log('🧪 Testing NHTSA API with VIN:', vin)
      
      // Use the same NHTSA API approach as the sell page for consistency
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`)
      const data = await response.json()
      
      console.log('🔍 Raw NHTSA Response:', data)
      
      if (data.Results && data.Results.length > 0) {
        // Process the Results array to extract vehicle information (same as sell page)
        const vehicleInfo: any = {}
        
        data.Results.forEach((item: any) => {
          // Only add values that are not empty, null, or "0"
          if (item.Value && 
              item.Value !== '0' && 
              item.Value !== 'null' && 
              item.Value !== '' && 
              item.Value !== 'Not Applicable') {
            vehicleInfo[item.Variable] = item.Value
          }
        })

        console.log('🔍 VIN Data extracted:', vehicleInfo)
        
        // Create result object with the extracted data
        const result = {
          success: true,
          data: vehicleInfo
        }
        
        setResult(result)
        console.log('✅ NHTSA test successful:', result)
      } else {
        setError('No vehicle data found for this VIN')
        console.error('❌ NHTSA test failed: No data found')
      }
    } catch (error) {
      console.error('❌ NHTSA test error:', error)
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
            🗄️ NHTSA API Test
          </h1>
          <p className="text-gray-600">
            Test the NHTSA API data extraction with the provided VIN
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 text-blue-600 mr-2" />
            NHTSA API Configuration
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VIN Number
            </label>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="5TFPC5DB6PX021600"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will trigger the NHTSA API fallback since we're not providing a real Carfax URL
            </p>
          </div>
          
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing NHTSA API...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Test NHTSA API
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
                NHTSA API Results
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                  <div className="text-sm text-gray-900">{result.extractionInfo?.pageTitle}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warning</label>
                  <div className="text-sm text-gray-900">{result.extractionInfo?.warning || 'None'}</div>
                </div>
              </div>
            </div>

            {/* Basic Vehicle Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Vehicle Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <div className="text-sm text-gray-900 font-semibold">{result.data.make}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <div className="text-sm text-gray-900 font-semibold">{result.data.model}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <div className="text-sm text-gray-900 font-semibold">{result.data.year}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trim</label>
                  <div className="text-sm text-gray-900">{result.data.trim}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                  <div className="text-sm text-gray-900">{result.data.series}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <div className="text-sm text-gray-900 font-mono">{result.data.vin}</div>
                </div>
              </div>
            </div>

            {/* Engine & Powertrain */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Engine & Powertrain
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine</label>
                  <div className="text-sm text-gray-900">{result.data.engine}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine HP</label>
                  <div className="text-sm text-gray-900">{result.data['Engine Brake (hp) From']}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engine Configuration</label>
                  <div className="text-sm text-gray-900">{result.data.engineConfiguration}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Displacement</label>
                  <div className="text-sm text-gray-900">{result.data['Displacement (L)']}L ({result.data['Displacement (CC)']}cc)</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <div className="text-sm text-gray-900">{result.data['Fuel Type - Primary']}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drivetrain</label>
                  <div className="text-sm text-gray-900">{result.data['Drive Type']}</div>
                </div>
              </div>
            </div>

            {/* Safety Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Safety & Driver Assistance Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ABS</label>
                  <div className="text-sm text-gray-900">{result.data.abs}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ESC</label>
                  <div className="text-sm text-gray-900">{result.data.esc}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Traction Control</label>
                  <div className="text-sm text-gray-900">{result.data.tractionControl}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forward Collision Warning</label>
                  <div className="text-sm text-gray-900">{result.data.forwardCollisionWarning}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lane Departure Warning</label>
                  <div className="text-sm text-gray-900">{result.data.laneDepartureWarning}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blind Spot Monitor</label>
                  <div className="text-sm text-gray-900">{result.data.blindSpotMon}</div>
                </div>
              </div>
            </div>

            {/* All Extracted Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Complete NHTSA Data
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-auto max-h-96">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* NHTSA API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-4">
            📊 NHTSA API Information
          </h3>
          
          <div className="space-y-3 text-sm text-blue-700">
            <div>
              <strong>API Endpoint:</strong> https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/{vin}?format=json
            </div>
            <div>
              <strong>Data Source:</strong> Official US Department of Transportation vehicle database (Extended)
            </div>
            <div>
              <strong>Coverage:</strong> All vehicles sold in the United States with extended data
            </div>
            <div>
              <strong>Update Frequency:</strong> Real-time from manufacturer submissions
            </div>
            <div>
              <strong>Cost:</strong> Free, no API key required
            </div>
            <div>
              <strong>Enhanced Data:</strong> Includes additional fields beyond basic VIN decoding
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 