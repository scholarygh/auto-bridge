'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Car, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ConfirmEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get token and type from URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          setStatus('error')
          setMessage('Invalid confirmation link')
          return
        }

        // Confirm the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) {
          setStatus('error')
          setMessage(error.message || 'Failed to confirm email')
          return
        }

        setStatus('success')
        setMessage('Email confirmed successfully! Redirecting to admin login...')
        
        // Redirect to admin login after 3 seconds
        setTimeout(() => {
          router.push('/admin-login')
        }, 3000)

      } catch (error) {
        setStatus('error')
        setMessage('An unexpected error occurred')
        console.error('Confirmation error:', error)
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Email Confirmation
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                <p className="mt-4 text-sm text-gray-600">
                  Confirming your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Email Confirmed!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/admin-login')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Go to Login
                  </button>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Confirmation Failed
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {message}
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => router.push('/admin-login')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 