'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Smartphone, 
  Fingerprint, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Key,
  Clock,
  Users,
  Activity
} from 'lucide-react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { ThreeFactorAuth } from '@/lib/threeFactorAuth'
import { supabase } from '@/lib/supabase'
import EnhancedDropdown from '@/components/ui/EnhancedDropdown'

interface SecuritySettings {
  security_level: 'basic' | '2fa' | '3fa'
  totp_required: boolean
  device_verification_required: boolean
  max_login_attempts: number
  session_timeout_minutes: number
  lockout_duration_minutes: number
}

interface UserSecurity {
  totp_enabled: boolean
  totp_verified: boolean
  device_fingerprint: string | null
  last_login_device: string | null
  login_attempts: number
  locked_until: string | null
}

export default function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    security_level: 'basic',
    totp_required: false,
    device_verification_required: false,
    max_login_attempts: 5,
    session_timeout_minutes: 480,
    lockout_duration_minutes: 30
  })
  
  const [userSecurity, setUserSecurity] = useState<UserSecurity>({
    totp_enabled: false,
    totp_verified: false,
    device_fingerprint: null,
    last_login_device: null,
    login_attempts: 0,
    locked_until: null
  })
  
  const [totpSetup, setTotpSetup] = useState({
    step: 'none' as 'none' | 'qr' | 'verify',
    qrCode: '',
    secret: '',
    verificationCode: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  
  const router = useRouter()
  const { user } = useSupabaseAuth()

  useEffect(() => {
    if (user) {
      loadSecurityData()
    }
  }, [user])

  const loadSecurityData = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      // Load admin security settings
      const { data: security, error: securityError } = await supabase
        .from('admin_security')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (securityError && securityError.code !== 'PGRST116') {
        console.error('Error loading security settings:', securityError)
      } else if (security) {
        setSecuritySettings({
          security_level: security.security_level || 'basic',
          totp_required: security.totp_required || false,
          device_verification_required: security.device_verification_required || false,
          max_login_attempts: security.max_login_attempts || 5,
          session_timeout_minutes: security.session_timeout_minutes || 480,
          lockout_duration_minutes: security.lockout_duration_minutes || 30
        })
      }

      // Load user security data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('totp_enabled, totp_verified, device_fingerprint, last_login_device, login_attempts, locked_until')
        .eq('id', user.id)
        .single()

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error loading user security:', userError)
      } else if (userData) {
        setUserSecurity({
          totp_enabled: userData.totp_enabled || false,
          totp_verified: userData.totp_verified || false,
          device_fingerprint: userData.device_fingerprint,
          last_login_device: userData.last_login_device,
          login_attempts: userData.login_attempts || 0,
          locked_until: userData.locked_until
        })
      }

    } catch (error) {
      console.error('Error loading security data:', error)
      setError('Failed to load security settings')
    }

    setIsLoading(false)
  }

  const handleSetupTOTP = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const { secret, qrCode } = await ThreeFactorAuth.setupTOTP(user.id, user.email!)
      
      setTotpSetup({
        step: 'qr',
        qrCode,
        secret,
        verificationCode: ''
      })
    } catch (error) {
      setError((error as any).message || 'Failed to setup TOTP')
    }

    setIsLoading(false)
  }

  const handleVerifyTOTP = async () => {
    if (!user || !totpSetup.verificationCode) return

    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Attempting TOTP verification with code:', totpSetup.verificationCode)
      
      // Add a small delay to ensure the token is fresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const verified = await ThreeFactorAuth.verifyAndEnableTOTP(user.id, totpSetup.verificationCode)
      
      if (verified) {
        setSuccess('TOTP setup completed successfully!')
        setTotpSetup({ step: 'none', qrCode: '', secret: '', verificationCode: '' })
        await loadSecurityData() // Reload data
      } else {
        setError('Invalid verification code. Please try again. Make sure you\'re using the current code from your authenticator app.')
      }
    } catch (error) {
      console.error('❌ TOTP verification error:', error)
      setError((error as any).message || 'Verification failed. Please try again.')
    }

    setIsLoading(false)
  }

  const handleSaveSettings = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const { error: upsertError } = await supabase
        .from('admin_security')
        .upsert({
          user_id: user.id,
          ...securitySettings
        }, {
          onConflict: 'user_id'
        })

      if (upsertError) {
        throw upsertError
      }

      setSuccess('Security settings updated successfully!')
    } catch (error) {
      setError((error as any).message || 'Failed to update settings')
    }

    setIsLoading(false)
  }

  const handleResetSecurity = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      // Reset user security
      const { error: userError } = await supabase
        .from('users')
        .update({
          totp_enabled: false,
          totp_verified: false,
          login_attempts: 0,
          locked_until: null
        })
        .eq('id', user.id)

      if (userError) throw userError

      setSuccess('Security reset successfully!')
      await loadSecurityData() // Reload data
    } catch (error) {
      setError((error as any).message || 'Failed to reset security')
    }

    setIsLoading(false)
  }

  const handleSetupDeviceFingerprint = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Setting up device fingerprint...')
      
      // Generate device fingerprint
      const fingerprint = ThreeFactorAuth.generateDeviceFingerprint()
      console.log('✅ Device fingerprint generated:', fingerprint)
      
      // Store device fingerprint
      const stored = await ThreeFactorAuth.storeDeviceFingerprint(user.id, fingerprint)
      
      if (stored) {
        setSuccess('Device fingerprint captured and stored successfully!')
        await loadSecurityData() // Reload data
      } else {
        setError('Failed to store device fingerprint')
      }
    } catch (error) {
      console.error('❌ Device fingerprint error:', error)
      setError((error as any).message || 'Failed to setup device fingerprint')
    }

    setIsLoading(false)
  }

  const renderTOTPSetup = () => {
    if (totpSetup.step === 'none') return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          {totpSetup.step === 'qr' && (
            <div className="space-y-4">
              <div className="text-center">
                <Smartphone className="mx-auto h-12 w-12 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Setup TOTP</h3>
                <p className="text-sm text-gray-600">Scan this QR code with your authenticator app</p>
              </div>

              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border">
                  <img src={totpSetup.qrCode} alt="TOTP QR Code" className="w-48 h-48" />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Manual Entry:</h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                    {showSecret ? totpSetup.secret : '••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(totpSetup.secret)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setTotpSetup({ step: 'none', qrCode: '', secret: '', verificationCode: '' })}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setTotpSetup(prev => ({ ...prev, step: 'verify' }))}
                  className="flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next: Verify
                </button>
              </div>
            </div>
          )}

          {totpSetup.step === 'verify' && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900">Verify Setup</h3>
                <p className="text-sm text-gray-600">Enter the 6-digit code from your authenticator app</p>
              </div>

              <input
                type="text"
                maxLength={6}
                value={totpSetup.verificationCode}
                onChange={(e) => setTotpSetup(prev => ({ ...prev, verificationCode: e.target.value.replace(/\D/g, '') }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
                placeholder="000000"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => setTotpSetup(prev => ({ ...prev, step: 'qr' }))}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyTOTP}
                  disabled={isLoading || totpSetup.verificationCode.length !== 6}
                  className="flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600">Configure 3-factor authentication and security policies</p>
        </div>
        <button
          onClick={loadSecurityData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div className="text-sm text-red-600">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div className="text-sm text-green-600">{success}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Security Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Current Security Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Security Level:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                securitySettings.security_level === '3fa' ? 'bg-green-100 text-green-800' :
                securitySettings.security_level === '2fa' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {securitySettings.security_level.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">TOTP Enabled:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                userSecurity.totp_enabled && userSecurity.totp_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {userSecurity.totp_enabled && userSecurity.totp_verified ? 'Active' : 'Not Setup'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Device Verification:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                userSecurity.device_fingerprint ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {userSecurity.device_fingerprint ? 'Configured' : 'Not Setup'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Login Attempts:</span>
              <span className="text-sm font-medium">{userSecurity.login_attempts}/5</span>
            </div>

            {userSecurity.locked_until && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Locked:</span>
                <span className="text-sm text-red-600">Until {new Date(userSecurity.locked_until).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* TOTP Setup */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Two-Factor Authentication
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {userSecurity.totp_enabled && userSecurity.totp_verified 
                ? 'TOTP is currently active and protecting your account.'
                : 'Set up TOTP to add an extra layer of security to your account.'
              }
            </p>

            {userSecurity.totp_enabled && userSecurity.totp_verified ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">TOTP is active</span>
                  </div>
                </div>
                <button
                  onClick={handleResetSecurity}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  Reset TOTP
                </button>
              </div>
            ) : (
              <button
                onClick={handleSetupTOTP}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Setting up...' : 'Setup TOTP'}
              </button>
            )}
          </div>
        </div>



        {/* Security Policies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Security Policies
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Level
              </label>
              <EnhancedDropdown
                value={securitySettings.security_level}
                onChange={(value) => setSecuritySettings(prev => ({ ...prev, security_level: value as any }))}
                options={[
                  { value: 'basic', label: 'Basic (Password Only)' },
                  { value: '2fa', label: '2FA (Password + TOTP)' },
                  { value: '3fa', label: '3FA (Password + TOTP + Device)' }
                ]}
                placeholder="Select security level"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require TOTP</label>
                <p className="text-xs text-gray-500">Force TOTP for all logins</p>
              </div>
              <input
                type="checkbox"
                checked={securitySettings.totp_required}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, totp_required: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Device Verification</label>
                <p className="text-xs text-gray-500">Verify device fingerprint</p>
              </div>
              <input
                type="checkbox"
                checked={securitySettings.device_verification_required}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, device_verification_required: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={securitySettings.max_login_attempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, max_login_attempts: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="1440"
                value={securitySettings.session_timeout_minutes}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, session_timeout_minutes: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={securitySettings.lockout_duration_minutes}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockout_duration_minutes: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Security Information
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Current Device</h3>
              <p className="text-sm text-blue-800 mb-3">
                {userSecurity.last_login_device || 'No device information available'}
              </p>
              
              {userSecurity.device_fingerprint ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">Device fingerprint is active</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSetupDeviceFingerprint}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
                >
                  {isLoading ? 'Setting up...' : 'Setup Device Fingerprint'}
                </button>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Security Recommendations</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Enable TOTP for enhanced security</li>
                <li>• Use a strong, unique password</li>
                <li>• Keep your authenticator app secure</li>
                <li>• Regularly review login attempts</li>
                <li>• Consider device verification for sensitive operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {renderTOTPSetup()}
    </div>
  )
} 