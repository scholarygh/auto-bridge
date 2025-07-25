'use client'

import React, { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { supabase } from '@/lib/supabase'

export default function AuthTest() {
  const { user, session, loading, isAdmin } = useSupabaseAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [manualSession, setManualSession] = useState<any>(null)

  useEffect(() => {
    // Get session manually
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setManualSession({ session, error })
    }
    getSession()
  }, [])

  useEffect(() => {
    // Get session info
    if (session) {
      setSessionInfo({
        user: session.user,
        expires_at: session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown',
        access_token: session.access_token ? 'Present' : 'Missing',
        refresh_token: session.refresh_token ? 'Present' : 'Missing'
      })
    }
  }, [session])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook State */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Hook State</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
            <div><strong>User:</strong> {user?.email || 'None'}</div>
            <div><strong>User ID:</strong> {user?.id || 'None'}</div>
            <div><strong>Role:</strong> {user?.user_metadata?.role || 'None'}</div>
            <div><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>
            <div><strong>Session:</strong> {session ? 'Present' : 'None'}</div>
          </div>
        </div>

        {/* Manual Session Check */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Manual Session Check</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Error:</strong> {manualSession?.error?.message || 'None'}</div>
            <div><strong>Session:</strong> {manualSession?.session ? 'Present' : 'None'}</div>
            <div><strong>User:</strong> {manualSession?.session?.user?.email || 'None'}</div>
            <div><strong>Role:</strong> {manualSession?.session?.user?.user_metadata?.role || 'None'}</div>
          </div>
        </div>

        {/* Session Details */}
        {sessionInfo && (
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Session Details</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Expires:</strong> {sessionInfo.expires_at}</div>
              <div><strong>Access Token:</strong> {sessionInfo.access_token}</div>
              <div><strong>Refresh Token:</strong> {sessionInfo.refresh_token}</div>
              <div><strong>User ID:</strong> {sessionInfo.user?.id}</div>
              <div><strong>Created:</strong> {new Date(sessionInfo.user?.created_at).toLocaleString()}</div>
              <div><strong>Last Sign In:</strong> {new Date(sessionInfo.user?.last_sign_in_at).toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
            <button
              onClick={async () => {
                const { data, error } = await supabase.auth.getSession()
                console.log('Manual session check:', { data, error })
                setManualSession({ session: data.session, error })
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 