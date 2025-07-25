'use client'

import { useState, useEffect } from 'react'

// Import with error handling
let ImageUpload: any = null
let storageService: any = null

try {
  ImageUpload = require('@/components/ImageUpload').default
} catch (error) {
  console.error('Failed to import ImageUpload:', error)
}

try {
  storageService = require('@/lib/storageService').storageService
} catch (error) {
  console.error('Failed to import storageService:', error)
}

export default function TestStoragePage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string>('')
  const [testVehicleId, setTestVehicleId] = useState<string>('')
  const [testResult, setTestResult] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  // Fix hydration error by setting vehicleId only on client
  useEffect(() => {
    setIsClient(true)
    setTestVehicleId('test-vehicle-' + Date.now())
  }, [])

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedImages(prev => [...prev, ...urls])
    setUploadError('')
    setTestResult('Images uploaded successfully!')
    console.log('✅ Images uploaded successfully:', urls)
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
    setTestResult('Upload failed: ' + error)
    console.error('❌ Upload error:', error)
  }

  const testStorageConnection = async () => {
    setTestResult('Testing storage connection...')
    console.log('Testing storage connection...')
    
    if (!storageService) {
      const error = 'Storage service not available'
      setTestResult('Error: ' + error)
      alert('Storage service not available - check console for details')
      return
    }

    try {
      const bucketExists = await storageService.checkBucketExists()
      console.log('Bucket exists:', bucketExists)
      
      const stats = await storageService.getStorageStats()
      console.log('Storage stats:', stats)
      
      const result = `Bucket exists: ${bucketExists}\nStorage stats: ${JSON.stringify(stats, null, 2)}`
      setTestResult('Storage test completed!')
      alert(result)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('Storage test error:', error)
      setTestResult('Storage test failed: ' + errorMsg)
      alert('Storage test failed: ' + errorMsg)
    }
  }

  const clearImages = () => {
    setUploadedImages([])
    setUploadError('')
    setTestResult('Images cleared!')
    console.log('Images cleared')
  }

  const testSimpleClick = () => {
    setTestResult('Simple button clicked!')
    console.log('Simple button clicked')
  }

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🧪 Storage Test Page
            </h1>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Storage Test Page
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Controls */}
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Test Information
                </h2>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Test Vehicle ID:</strong> {testVehicleId}</p>
                  <p><strong>Bucket:</strong> vehicle-images</p>
                  <p><strong>Uploaded Images:</strong> {uploadedImages.length}</p>
                  <p><strong>Last Action:</strong> {testResult || 'No action yet'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={testSimpleClick}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔵 Simple Click Test
                </button>

                <button
                  onClick={testStorageConnection}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔍 Test Storage Connection
                </button>
                
                <button
                  onClick={clearImages}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🗑️ Clear Images
                </button>
              </div>

              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-900 font-semibold mb-2">❌ Upload Error</h3>
                  <p className="text-red-800 text-sm">{uploadError}</p>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-900 font-semibold mb-2">✅ Uploaded Images</h3>
                  <div className="space-y-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="text-sm">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          Image {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Status */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-yellow-900 font-semibold mb-2">📦 Import Status</h3>
                <div className="text-yellow-800 text-sm space-y-1">
                  <p>• ImageUpload: {ImageUpload ? '✅ Loaded' : '❌ Failed'}</p>
                  <p>• StorageService: {storageService ? '✅ Loaded' : '❌ Failed'}</p>
                </div>
              </div>
            </div>

            {/* Upload Component */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📸 Test Image Upload
              </h2>
              
              {ImageUpload && testVehicleId ? (
                <ImageUpload
                  vehicleId={testVehicleId}
                  onImagesUploaded={handleImagesUploaded}
                  onUploadError={handleUploadError}
                  maxImages={5}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4"
                />
              ) : (
                <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center">
                  <p className="text-red-600">
                    {!ImageUpload ? 'ImageUpload component failed to load' : 'Loading vehicle ID...'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Check console for import errors</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-900 font-semibold mb-2">📋 Test Instructions</h3>
            <ol className="text-yellow-800 text-sm space-y-1 list-decimal list-inside">
              <li>Click "Simple Click Test" to verify buttons work</li>
              <li>Click "Test Storage Connection" to verify bucket access</li>
              <li>Drag & drop images or click to select files</li>
              <li>Watch for upload progress and success/error messages</li>
              <li>Click on uploaded image links to verify they're accessible</li>
              <li>Check browser console for detailed logs</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-gray-900 font-semibold mb-2">🔧 Troubleshooting</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Buttons not working:</strong> Check browser console for JavaScript errors</p>
              <p><strong>Import failures:</strong> Check file paths and TypeScript compilation</p>
              <p><strong>Upload fails:</strong> Check storage policies in Supabase</p>
              <p><strong>Images not accessible:</strong> Verify bucket is public</p>
              <p><strong>CORS errors:</strong> Check allowed origins in Supabase settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 