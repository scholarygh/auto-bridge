'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  })
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // Get initial session with retry logic
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
        }
        
        console.log('🔍 Initial session check:', session?.user?.email, session?.user?.user_metadata)
        
        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            isAdmin: session?.user?.user_metadata?.role === 'admin'
          })
        }

        // If no session, try to refresh
        if (!session) {
          console.log('🔄 No session found, attempting to refresh...')
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            console.error('❌ Refresh error:', refreshError)
          } else if (refreshData.session) {
            console.log('✅ Session refreshed:', refreshData.session.user.email)
            if (mounted) {
              setAuthState({
                user: refreshData.session.user,
                session: refreshData.session,
                loading: false,
                isAdmin: refreshData.session.user.user_metadata?.role === 'admin'
              })
            }
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error)
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email)
        console.log('👤 User metadata:', session?.user?.user_metadata)
        
        const isAdmin = session?.user?.user_metadata?.role === 'admin'
        console.log('👑 Is admin:', isAdmin)
        
        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            isAdmin
          })
        }

        // Handle auth state changes
        if (event === 'SIGNED_IN') {
          console.log('✅ SIGNED_IN event detected')
          // Redirect based on role
          if (isAdmin) {
            console.log('👑 Admin user, redirecting to dashboard...')
            router.push('/admin/dashboard')
          } else {
            console.log('👤 Regular user, redirecting to home...')
            router.push('/')
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 SIGNED_OUT event detected')
          router.push('/admin-login')
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed')
        } else if (event === 'INITIAL_SESSION') {
          console.log('🎯 Initial session loaded')
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Sign in error:', error)
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before signing in.')
        }
        throw error
      }

      console.log('✅ Sign in successful:', data.user?.email)
      console.log('👤 User metadata:', data.user?.user_metadata)
      console.log('👑 Is admin:', data.user?.user_metadata?.role === 'admin')

      // Manual redirect after successful login
      if (data?.user?.user_metadata?.role === 'admin') {
        console.log('🔐 Admin login successful, redirecting to dashboard...')
        router.push('/admin/dashboard')
      } else {
        console.log('🔐 User login successful, redirecting to home...')
        router.push('/')
      }

      return { data, error: null }
    } catch (error) {
      console.error('❌ Sign in failed:', error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, role: 'admin' | 'customer' = 'customer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('🔓 Sign out successful')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    isAdmin: authState.isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
} 