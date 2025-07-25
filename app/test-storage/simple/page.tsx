'use client'

import { useState } from 'react'

export default function SimpleTestPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [clickCount, setClickCount] = useState(0)

  const handleSimpleClick = () => {
    setClickCount(prev => prev + 1)
    setTestResult('Simple button clicked!')
    console.log('Simple button clicked')
  }

  const handleAlertClick = () => {
    alert('Alert button clicked!')
    setTestResult('Alert button clicked!')
    console.log('Alert button clicked')
  }

  const handleAsyncClick = async () => {
    setTestResult('Loading...')
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTestResult('Async operation completed!')
      console.log('Async operation completed')
    } catch (error) {
      setTestResult('Async operation failed!')
      console.error('Async operation failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Simple Test Page
          </h1>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Test Status
              </h2>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Click Count:</strong> {clickCount}</p>
                <p><strong>Last Result:</strong> {testResult || 'No action yet'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSimpleClick}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔵 Simple Click Test
              </button>
              
              <button
                onClick={handleAlertClick}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🟢 Alert Click Test
              </button>
              
              <button
                onClick={handleAsyncClick}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                🟣 Async Click Test
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-yellow-900 font-semibold mb-2">🔍 Debug Info</h3>
              <div className="text-yellow-800 text-sm space-y-1">
                <p>• Check browser console for logs</p>
                <p>• Buttons should update the status above</p>
                <p>• Alert button should show a popup</p>
                <p>• Async button should show "Loading..." then complete</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-gray-900 font-semibold mb-2">🚨 If Buttons Don't Work</h3>
              <div className="text-gray-700 text-sm space-y-1">
                <p>• Check browser console for JavaScript errors</p>
                <p>• Verify the page is loading correctly</p>
                <p>• Check if React is working (try typing in the status area)</p>
                <p>• Ensure the dev server is running</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 