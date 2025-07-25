'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin token exists in localStorage
    const adminToken = localStorage.getItem('admin-token')
    if (adminToken === 'admin-secret-key') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  // Handle navigation when not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only redirect if we're on an admin page
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        router.push('/admin-login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  const login = (email: string, password: string) => {
    if (email === 'admin@autobridge.com' && password === 'admin123') {
      localStorage.setItem('admin-token', 'admin-secret-key')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin-token')
    setIsAuthenticated(false)
    router.push('/admin-login')
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
} 