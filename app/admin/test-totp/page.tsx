'use client'

import React, { useState } from 'react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { ThreeFactorAuth } from '@/lib/threeFactorAuth'

export default function TestTOTP() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const { user } = useSupabaseAuth()

  const handleTestToken = async () => {
    if (!user || !token) return

    setIsLoading(true)
    setResult('')

    try {
      console.log('🔐 Testing TOTP token:', token)
      const verified = await ThreeFactorAuth.verifyTOTP(user.id, token)
      
      if (verified) {
        setResult('✅ Token is valid!')
      } else {
        setResult('❌ Token is invalid. Please try again.')
      }
    } catch (error) {
      console.error('❌ Test error:', error)
      setResult(`❌ Error: ${(error as any).message}`)
    }

    setIsLoading(false)
  }

  const handleSetupTOTP = async () => {
    if (!user) return

    setIsLoading(true)
    setResult('')

    try {
      const { secret: newSecret, qrCode: newQrCode } = await ThreeFactorAuth.setupTOTP(user.id, user.email!)
      setSecret(newSecret)
      setQrCode(newQrCode)
      setResult('✅ TOTP setup complete! Scan the QR code below with your authenticator app.')
    } catch (error) {
      setResult(`❌ Setup error: ${(error as any).message}`)
    }

    setIsLoading(false)
  }

  if (!user) {
    return <div className="p-6">Please log in first.</div>
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">TOTP Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleSetupTOTP}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Setting up...' : 'Setup TOTP'}
        </button>

        {qrCode && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-sm text-gray-600 mb-4">Scan this QR code with your authenticator app</p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border">
                <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48" />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Manual Entry:</h4>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                  {showSecret ? secret : '••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {showSecret ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(secret)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
        </div>

        <button
          onClick={handleTestToken}
          disabled={isLoading || token.length !== 6}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Token'}
        </button>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.startsWith('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="text-sm">{result}</div>
          </div>
        )}
      </div>
    </div>
  )
} 