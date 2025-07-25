'use client'

import React, { useState, useEffect } from 'react'
import { Car, Eye, EyeOff, Lock, User, Shield, Smartphone, Fingerprint, AlertTriangle, CheckCircle, Mail } from 'lucide-react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { ThreeFactorAuth } from '@/lib/threeFactorAuth'
import Dialog from '@/components/ui/Dialog'
import { useDialog } from '@/hooks/useDialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type LoginStep = 'credentials' | 'totp' | 'device' | 'success'

export default function AdminLogin() {
  const [email, setEmail] = useState('nanaduah09@gmail.com')
  const [password, setPassword] = useState('')
  const [totpToken, setTotpToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<LoginStep>('credentials')
  const [userId, setUserId] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number>(0)
  
  const { signIn, signUp } = useSupabaseAuth()

  // Dialog management
  const { dialog, showError, showSuccess, showInfo, hideDialog } = useDialog()

  useEffect(() => {
    // Check for existing lockout
    const checkLockout = () => {
      const storedLockout = localStorage.getItem('adminLockout')
      if (storedLockout) {
        const lockoutData = JSON.parse(storedLockout)
        if (lockoutData.expires > Date.now()) {
          setIsLocked(true)
          setLockoutTime(lockoutData.expires)
        } else {
          localStorage.removeItem('adminLockout')
        }
      }
    }

    checkLockout()
  }, [])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return

    setIsLoading(true)

    try {
      // Check if user exists first
      const { data: existingUser } = await signUp(email, password)
      
      if (existingUser?.user) {
        setUserId(existingUser.user.id)
        setCurrentStep('totp')
      } else {
        const { data, error: signInError } = await signIn(email, password)
        
        if (signInError) {
          const errorMessage = (signInError as any).message || ''
          
          // If user doesn't exist, offer to create admin user
          if (errorMessage.includes('Invalid login credentials')) {
            showError(
              'User Not Found',
              'Would you like to create the admin user?'
            )
            setIsCreatingUser(true)
          } 
          // If email not confirmed, show helpful message
          else if (errorMessage.includes('Email not confirmed')) {
            showError(
              'Email Not Confirmed',
              'Please check your email and click the confirmation link before signing in.'
            )
          }
          // If user exists but needs confirmation
          else if (errorMessage.includes('confirm')) {
            showError(
              'Account Confirmation Required',
              'Please check your email and confirm your account before signing in.'
            )
          }
          else {
            showError(
              'Login Failed',
              errorMessage || 'Invalid credentials. Please try again.'
            )
          }

          // Increment login attempts
          if (userId) {
            const { attempts, isLocked: locked } = await ThreeFactorAuth.incrementLoginAttempts(userId)
            setLoginAttempts(attempts)
            setIsLocked(locked)
            
            if (locked) {
              setLockoutTime(Date.now() + 15 * 60 * 1000) // 15 minutes
              localStorage.setItem('adminLockout', JSON.stringify({
                expires: Date.now() + 15 * 60 * 1000
              }))
            }
          }
        } else if (data?.user) {
          setUserId(data.user.id)
          setCurrentStep('totp')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      showError(
        'Login Error',
        'An unexpected error occurred. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await signUp(email, password)
      
      if (error) {
        showError(
          'User Creation Failed',
          (error as any).message || 'Failed to create admin user.'
        )
      } else if (data?.user) {
        setUserId(data.user.id)
        showSuccess(
          'Admin User Created',
          'Please check your email and confirm your account before signing in.'
        )
        setIsCreatingUser(false)
      }
    } catch (error) {
      console.error('User creation error:', error)
      showError(
        'User Creation Error',
        'An unexpected error occurred while creating the user.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleTOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setIsLoading(true)

    try {
      const verified = await ThreeFactorAuth.verifyTOTP(userId, totpToken)
      
      if (verified) {
        // Log successful TOTP verification
        await ThreeFactorAuth.logLoginAttempt(userId, true, undefined, true, false)
        
        // Complete login directly (skip device verification for now)
        await completeLogin(userId)
      } else {
        showError(
          'Invalid TOTP Code',
          'Please check your authenticator app and try again.'
        )
        // Log failed TOTP attempt
        await ThreeFactorAuth.logLoginAttempt(userId, false, 'Invalid TOTP', true, false)
      }
    } catch (error) {
      console.error('TOTP verification error:', error)
      showError(
        'TOTP Verification Error',
        'An error occurred while verifying your TOTP code.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const completeLogin = async (userId: string) => {
    try {
      // Log successful login
      await ThreeFactorAuth.logLoginAttempt(userId, true, undefined, false, true)
      
      showSuccess(
        'Login Successful! 🎉',
        'Welcome to the Auto-Bridge admin panel.'
      )
      
      setCurrentStep('success')
      
      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/admin/dashboard'
      }, 2000)
    } catch (error) {
      console.error('Error completing login:', error)
      showError(
        'Login Completion Error',
        'An error occurred while completing your login.'
      )
    }
  }

  const handleDeviceVerification = async () => {
    // if (!userId || !deviceFingerprint) return
    if (!userId) return

    setIsLoading(true)
    try {
      // await ThreeFactorAuth.storeDeviceFingerprint(userId, deviceFingerprint)
      await completeLogin(userId)
    } catch (error) {
      console.error('Device verification error:', error)
      showError(
        'Device Verification Error',
        'An error occurred while verifying your device.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('nanaduah09@gmail.com')
    setPassword('')
    setTotpToken('')
    setCurrentStep('credentials')
    setUserId(null)
    setIsCreatingUser(false)
    setLoginAttempts(0)
    setIsLocked(false)
    setLockoutTime(0)
  }

  const getLockoutTimeRemaining = () => {
    const remaining = Math.max(0, lockoutTime - Date.now())
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Auto-Bridge</h1>
          <p className="text-gray-600 mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {currentStep === 'credentials' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Admin Login
              </h2>
              
              {isLocked && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Account Locked</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Too many failed attempts. Try again in {getLockoutTimeRemaining()}
                  </p>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autobridge.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  disabled={isLocked}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  showPasswordToggle
                  required
                  disabled={isLocked}
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={isLocked}
                  rightIcon={<Shield className="w-4 h-4" />}
                >
                  {isCreatingUser ? 'Create Admin User' : 'Sign In'}
                </Button>
              </form>

              {isCreatingUser && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    No admin user found. Click the button above to create one.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'totp' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Two-Factor Authentication
              </h2>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <form onSubmit={handleTOTPSubmit} className="space-y-6">
                <Input
                  label="TOTP Code"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={resetForm}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    rightIcon={<CheckCircle className="w-4 h-4" />}
                  >
                    Verify
                  </Button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">
                Redirecting to admin dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure admin access with multi-factor authentication
          </p>
        </div>
      </div>

      {/* Beautiful Dialog Component */}
      <Dialog {...dialog} onClose={hideDialog} />
    </div>
  )
} 