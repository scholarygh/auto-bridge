'use client'

import React, { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { supabase } from '@/lib/supabase'

export default function TestAuth() {
  const { user, session, loading, isAdmin } = useSupabaseAuth()
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSessionData(session)
    }
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Authentication Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Hook State</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
            <div><strong>User:</strong> {user ? user.email : 'None'}</div>
            <div><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>
            <div><strong>User Metadata:</strong> <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(user?.user_metadata, null, 2)}</pre></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Direct Session Check</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Session:</strong> {sessionData ? 'Exists' : 'None'}</div>
            <div><strong>Session User:</strong> {sessionData?.user?.email || 'None'}</div>
            <div><strong>Session Role:</strong> {sessionData?.user?.user_metadata?.role || 'None'}</div>
            <div><strong>Session Metadata:</strong> <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(sessionData?.user?.user_metadata, null, 2)}</pre></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/admin-login'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
            >
              Reload Page
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
            <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR'}</div>
            <div><strong>Local Storage:</strong> {typeof window !== 'undefined' ? 'Available' : 'SSR'}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 