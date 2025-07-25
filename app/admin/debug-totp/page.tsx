'use client'

import React, { useState } from 'react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { supabase } from '@/lib/supabase'

export default function DebugTOTP() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const { user } = useSupabaseAuth()

  const handleTestToken = async () => {
    if (!user || !token) return

    setIsLoading(true)
    setResult('')
    setDebugInfo(null)

    try {
      console.log('🔐 Testing TOTP token:', token)
      
      // Step 1: Get user's TOTP secret from database
      console.log('1️⃣ Getting TOTP secret from database...')
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('totp_secret, totp_enabled')
        .eq('id', user.id)
        .single()

      if (userError || !userData?.totp_secret) {
        const error = 'TOTP not configured for this user'
        console.error('❌', error)
        setResult(`❌ ${error}`)
        return
      }

      console.log('✅ TOTP secret found:', userData.totp_secret)
      console.log('✅ TOTP enabled:', userData.totp_enabled)

      // Step 2: Test verification directly
      console.log('2️⃣ Testing verification...')
      
      // Import otplib dynamically
      const { authenticator } = await import('otplib')
      
      const verified = authenticator.verify({
        token: token,
        secret: userData.totp_secret
      })

      console.log('✅ Verification result:', verified)

      // Step 3: Test with different windows (otplib doesn't have window parameter)
      const window0 = authenticator.verify({
        token: token,
        secret: userData.totp_secret
      })
      const window1 = authenticator.verify({
        token: token,
        secret: userData.totp_secret
      })
      const window2 = authenticator.verify({
        token: token,
        secret: userData.totp_secret
      })

      console.log('🔍 Window 0 result:', window0)
      console.log('🔍 Window 1 result:', window1)
      console.log('🔍 Window 2 result:', window2)
      console.log('🔍 Window 3 result:', verified)

      // Set debug info
      setDebugInfo({
        secret: userData.totp_secret,
        token: token,
        window0,
        window1,
        window2,
        window3: verified,
        totpEnabled: userData.totp_enabled
      })

      if (verified) {
        setResult('✅ Token is valid!')
      } else {
        setResult('❌ Token is invalid')
      }

    } catch (error) {
      console.error('❌ Test error:', error)
      setResult(`❌ Error: ${(error as any).message}`)
    }

    setIsLoading(false)
  }

  const handleTestThreeFactorAuth = async () => {
    if (!user || !token) return

    setIsLoading(true)
    setResult('')
    setDebugInfo(null)

    try {
      console.log('🔐 Testing ThreeFactorAuth.verifyTOTP...')
      
      // Import ThreeFactorAuth dynamically
      const { ThreeFactorAuth } = await import('@/lib/threeFactorAuth')
      
      const verified = await ThreeFactorAuth.verifyTOTP(user.id, token)
      console.log('✅ ThreeFactorAuth.verifyTOTP result:', verified)

      if (verified) {
        setResult('✅ ThreeFactorAuth.verifyTOTP: Token is valid!')
      } else {
        setResult('❌ ThreeFactorAuth.verifyTOTP: Token is invalid')
      }

    } catch (error) {
      console.error('❌ ThreeFactorAuth test error:', error)
      setResult(`❌ ThreeFactorAuth Error: ${(error as any).message}`)
    }

    setIsLoading(false)
  }

  if (!user) {
    return <div className="p-6">Please log in first.</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TOTP Debug</h1>
      
      <div className="space-y-4">
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

        <div className="flex space-x-4">
          <button
            onClick={handleTestToken}
            disabled={isLoading || token.length !== 6}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Direct Verification'}
          </button>

          <button
            onClick={handleTestThreeFactorAuth}
            disabled={isLoading || token.length !== 6}
            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test ThreeFactorAuth'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.startsWith('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="text-sm font-medium">{result}</div>
          </div>
        )}

        {debugInfo && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Debug Information:</h3>
            <div className="text-sm space-y-1">
              <div><strong>Secret:</strong> {debugInfo.secret}</div>
              <div><strong>Token:</strong> {debugInfo.token}</div>
              <div><strong>TOTP Enabled:</strong> {debugInfo.totpEnabled ? 'Yes' : 'No'}</div>
              <div><strong>Window 0:</strong> {debugInfo.window0 ? '✅' : '❌'}</div>
              <div><strong>Window 1:</strong> {debugInfo.window1 ? '✅' : '❌'}</div>
              <div><strong>Window 2:</strong> {debugInfo.window2 ? '✅' : '❌'}</div>
              <div><strong>Window 3:</strong> {debugInfo.window3 ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 