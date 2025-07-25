import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { supabase } from './supabase'

export interface DeviceFingerprint {
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string | null
  canvasFingerprint: string
  webglFingerprint: string
  hash: string
}

export interface SecurityQuestion {
  question: string
  answer: string
}

export class ThreeFactorAuth {
  // Generate TOTP secret and QR code
  static async generateTOTPSecret(userId: string, email: string) {
    try {
      const secret = authenticator.generateSecret()

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(authenticator.keyuri(email, 'Auto-Bridge', secret))

      return {
        secret: secret,
        qrCode: qrCodeUrl,
        otpauthUrl: authenticator.keyuri(email, 'Auto-Bridge', secret)
      }
    } catch (error) {
      console.error('Error generating TOTP secret:', error)
      throw new Error('Failed to generate TOTP secret')
    }
  }

  // Verify TOTP token
  static async verifyTOTP(userId: string, token: string) {
    try {
      console.log('🔐 Verifying TOTP for user:', userId, 'Token:', token)
      
      // Get user's TOTP secret from database
      const { data: user, error } = await supabase
        .from('users')
        .select('totp_secret')
        .eq('id', userId)
        .single()

      if (error || !user?.totp_secret) {
        console.error('❌ TOTP not configured for user:', error?.message || 'No secret found')
        throw new Error('TOTP not configured for this user')
      }

      console.log('✅ TOTP secret found in database:', user.totp_secret)
      console.log('🔍 Token to verify:', token)
      console.log('🔍 Secret length:', user.totp_secret.length)

      // Verify the token with multiple windows for better tolerance
      const verified = authenticator.verify({
        token: token,
        secret: user.totp_secret
      })

      console.log('🔍 TOTP verification result:', verified)
      
      // Also test with different windows for debugging
      const window0 = authenticator.verify({
        token: token,
        secret: user.totp_secret
      })
      const window1 = authenticator.verify({
        token: token,
        secret: user.totp_secret
      })
      const window2 = authenticator.verify({
        token: token,
        secret: user.totp_secret
      })
      
      console.log('🔍 Window 0 result:', window0)
      console.log('🔍 Window 1 result:', window1)
      console.log('🔍 Window 2 result:', window2)
      console.log('🔍 Window 3 result:', verified)
      
      return verified
    } catch (error) {
      console.error('❌ Error verifying TOTP:', error)
      return false
    }
  }

  // Generate device fingerprint
  static generateDeviceFingerprint(): DeviceFingerprint {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx!.textBaseline = 'top'
    ctx!.font = '14px Arial'
    ctx!.fillText('Auto-Bridge Device Fingerprint', 2, 2)
    
    const canvasFingerprint = canvas.toDataURL()

    // Generate WebGL fingerprint
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    let webglFingerprint = 'unknown'
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        webglFingerprint = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }

    const fingerprint: DeviceFingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      canvasFingerprint,
      webglFingerprint,
      hash: ''
    }

    // Generate hash from fingerprint data
    const fingerprintString = JSON.stringify(fingerprint)
    fingerprint.hash = this.hashString(fingerprintString)

    return fingerprint
  }

  // Hash string for fingerprint
  private static hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  // Verify device fingerprint
  static async verifyDeviceFingerprint(userId: string, fingerprint: DeviceFingerprint) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('device_fingerprint, allowed_devices')
        .eq('id', userId)
        .single()

      if (error) {
        throw new Error('Failed to get user device data')
      }

      // If no device fingerprint stored, this is first login - trust it
      if (!user.device_fingerprint) {
        return { verified: true, isNewDevice: true }
      }

      // Check if device fingerprint matches
      const storedFingerprint = user.device_fingerprint
      const currentFingerprint = fingerprint.hash

      return {
        verified: storedFingerprint === currentFingerprint,
        isNewDevice: false
      }
    } catch (error) {
      console.error('Error verifying device fingerprint:', error)
      return { verified: false, isNewDevice: false }
    }
  }

  // Store device fingerprint
  static async storeDeviceFingerprint(userId: string, fingerprint: DeviceFingerprint) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          device_fingerprint: fingerprint.hash,
          last_login_device: fingerprint.userAgent
        })
        .eq('id', userId)

      if (error) {
        throw new Error('Failed to store device fingerprint')
      }

      return true
    } catch (error) {
      console.error('Error storing device fingerprint:', error)
      return false
    }
  }

  // Check login attempts and lockout
  static async checkLoginAttempts(userId: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('login_attempts, locked_until')
        .eq('id', userId)
        .single()

      if (error) {
        throw new Error('Failed to get user login data')
      }

      // Check if account is locked
      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        const remainingTime = Math.ceil((new Date(user.locked_until).getTime() - new Date().getTime()) / 1000 / 60)
        throw new Error(`Account locked. Try again in ${remainingTime} minutes.`)
      }

      return {
        attempts: user.login_attempts || 0,
        isLocked: false
      }
    } catch (error) {
      console.error('Error checking login attempts:', error)
      throw error
    }
  }

  // Increment login attempts
  static async incrementLoginAttempts(userId: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('login_attempts')
        .eq('id', userId)
        .single()

      if (error) {
        throw new Error('Failed to get user login data')
      }

      const currentAttempts = (user.login_attempts || 0) + 1
      const maxAttempts = 5
      const lockoutDuration = 30 // minutes

      let lockedUntil = null
      if (currentAttempts >= maxAttempts) {
        lockedUntil = new Date(Date.now() + lockoutDuration * 60 * 1000)
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          login_attempts: currentAttempts,
          locked_until: lockedUntil
        })
        .eq('id', userId)

      if (updateError) {
        throw new Error('Failed to update login attempts')
      }

      return { attempts: currentAttempts, isLocked: !!lockedUntil }
    } catch (error) {
      console.error('Error incrementing login attempts:', error)
      throw error
    }
  }

  // Reset login attempts on successful login
  static async resetLoginAttempts(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          login_attempts: 0,
          locked_until: null
        })
        .eq('id', userId)

      if (error) {
        throw new Error('Failed to reset login attempts')
      }

      return true
    } catch (error) {
      console.error('Error resetting login attempts:', error)
      return false
    }
  }

  // Log login attempt
  static async logLoginAttempt(userId: string, success: boolean, failureReason?: string, totpUsed = false, deviceVerified = false) {
    try {
      const fingerprint = this.generateDeviceFingerprint()
      
      const { error } = await supabase
        .from('login_audit')
        .insert({
          user_id: userId,
          ip_address: await this.getClientIP(),
          user_agent: fingerprint.userAgent,
          device_fingerprint: fingerprint.hash,
          success,
          failure_reason: failureReason,
          totp_used: totpUsed,
          device_verified: deviceVerified
        })

      if (error) {
        console.error('Error logging login attempt:', error)
      }
    } catch (error) {
      console.error('Error logging login attempt:', error)
    }
  }

  // Get client IP (simplified - in production, use proper IP detection)
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      return 'unknown'
    }
  }

  // Setup TOTP for user
  static async setupTOTP(userId: string, email: string) {
    try {
      const { secret, qrCode, otpauthUrl } = await this.generateTOTPSecret(userId, email)

      // Store secret in database
      const { error } = await supabase
        .from('users')
        .update({
          totp_secret: secret,
          totp_enabled: true
        })
        .eq('id', userId)

      if (error) {
        throw new Error('Failed to store TOTP secret')
      }

      return { secret, qrCode, otpauthUrl }
    } catch (error) {
      console.error('Error setting up TOTP:', error)
      throw error
    }
  }

  // Verify and enable TOTP
  static async verifyAndEnableTOTP(userId: string, token: string) {
    try {
      console.log('🔐 verifyAndEnableTOTP called with token:', token)
      
      const verified = await this.verifyTOTP(userId, token)
      console.log('🔐 verifyTOTP result:', verified)
      
      if (verified) {
        console.log('✅ TOTP verified, enabling in database...')
        const { error } = await supabase
          .from('users')
          .update({
            totp_verified: true
          })
          .eq('id', userId)

        if (error) {
          console.error('❌ Failed to enable TOTP in database:', error)
          throw new Error('Failed to enable TOTP')
        }

        console.log('✅ TOTP enabled successfully')
        return true
      }

      console.log('❌ TOTP verification failed')
      return false
    } catch (error) {
      console.error('❌ Error in verifyAndEnableTOTP:', error)
      return false
    }
  }
} 