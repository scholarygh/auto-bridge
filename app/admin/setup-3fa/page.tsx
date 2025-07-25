'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Smartphone, Shield, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import { ThreeFactorAuth } from '@/lib/threeFactorAuth'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

export default function Setup3FA() {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'complete'>('intro')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { user } = useSupabaseAuth()

  useEffect(() => {
    if (!user) {
      router.push('/admin-login')
      return
    }
  }, [user, router])

  const handleSetupTOTP = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const { secret: totpSecret, qrCode: qrCodeUrl } = await ThreeFactorAuth.setupTOTP(user.id, user.email!)
      
      setSecret(totpSecret)
      setQrCode(qrCodeUrl)
      setStep('qr')
    } catch (error) {
      setError((error as any).message || 'Failed to setup TOTP')
    }

    setIsLoading(false)
  }

  const handleVerifyTOTP = async () => {
    if (!user || !verificationCode) return

    setIsLoading(true)
    setError('')

    try {
      const verified = await ThreeFactorAuth.verifyAndEnableTOTP(user.id, verificationCode)
      
      if (verified) {
        setSuccess('TOTP setup completed successfully!')
        setStep('complete')
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 3000)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (error) {
      setError((error as any).message || 'Verification failed')
    }

    setIsLoading(false)
  }

  const renderIntroStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
        <Shield className="w-8 h-8 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enhanced Security Setup</h2>
        <p className="mt-2 text-gray-600">
          Set up 3-factor authentication for maximum security
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
        <h3 className="font-medium text-blue-900 mb-3">What you'll need:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-center">
            <Smartphone className="w-4 h-4 mr-2" />
            An authenticator app (Google Authenticator, Authy, etc.)
          </li>
          <li className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Your current device for device fingerprinting
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            About 2 minutes to complete setup
          </li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Skip for now
        </button>
        <button
          onClick={handleSetupTOTP}
          disabled={isLoading}
          className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Setting up...' : 'Start Setup'}
        </button>
      </div>
    </div>
  )

  const renderQRStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Smartphone className="mx-auto h-12 w-12 text-blue-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Scan QR Code</h3>
        <p className="mt-2 text-sm text-gray-600">
          Open your authenticator app and scan this QR code
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg border">
          {qrCode && (
            <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48" />
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Manual Entry (if QR code doesn't work):</h4>
        <div className="flex items-center space-x-2">
          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
            {secret}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(secret)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep('intro')}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={() => setStep('verify')}
          className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Next: Verify
        </button>
      </div>
    </div>
  )

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Verify Setup</h3>
        <p className="mt-2 text-sm text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <div className="mt-1">
          <input
            id="verification"
            type="text"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors text-center text-lg tracking-widest"
            placeholder="000000"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep('qr')}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={handleVerifyTOTP}
          disabled={isLoading || verificationCode.length !== 6}
          className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Verifying...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
      
      <div>
        <h3 className="text-lg font-medium text-gray-900">Setup Complete!</h3>
        <p className="mt-2 text-sm text-gray-600">
          {success}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-green-600 mr-2" />
          <div className="text-sm text-green-800">
            <strong>Enhanced Security Enabled:</strong> Your account is now protected with 3-factor authentication.
          </div>
        </div>
      </div>

      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
    </div>
  )

  const renderCurrentStep = () => {
    switch (step) {
      case 'intro':
        return renderIntroStep()
      case 'qr':
        return renderQRStep()
      case 'verify':
        return renderVerifyStep()
      case 'complete':
        return renderCompleteStep()
      default:
        return renderIntroStep()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          3FA Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Configure enhanced security for your admin account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          {renderCurrentStep()}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
} 