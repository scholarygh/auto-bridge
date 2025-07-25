'use client'

import React, { useEffect } from 'react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { useRouter } from 'next/navigation'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, loading, isAdmin } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and definitely not authenticated
    if (!loading && !user) {
      console.log('🚫 No user found, redirecting to login...')
      router.push('/admin-login')
    } else if (!loading && user && !isAdmin) {
      console.log('🚫 User is not admin, redirecting to login...')
      router.push('/admin-login')
    }
  }, [user, loading, isAdmin, router])

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('🔄 Loading authentication state...')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated or not admin, show loading (redirect will happen in useEffect)
  if (!user || !isAdmin) {
    console.log('🚫 Access denied: User not authenticated or not admin')
    console.log('User:', user?.email, 'IsAdmin:', isAdmin)
    console.log('User metadata:', user?.user_metadata)
    console.log('Session exists:', !!user)
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    )
  }

  console.log('✅ Access granted: User authenticated and is admin')
  console.log('User:', user.email, 'Role:', user.user_metadata?.role)
  return <>{children}</>
} 