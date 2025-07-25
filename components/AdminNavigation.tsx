'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Car, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  FileText, 
  Home,
  LogOut,
  DollarSign,
  Search,
  Ship,
  Shield,
  User,
  FileCheck
} from 'lucide-react'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Sell Requests', href: '/admin/sell-requests', icon: FileCheck },
  { name: 'Sourcing', href: '/admin/sourcing', icon: Search },
  { name: 'Shipping', href: '/admin/shipping', icon: Ship },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminNavigation() {
  const pathname = usePathname()
  const { signOut, user } = useSupabaseAuth()

  return (
    <>
      {/* Fixed Sidebar */}
      <div className="w-64 bg-gray-900 fixed inset-y-0 left-0 z-40 flex flex-col">
        {/* Admin User Info */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {user?.email || 'Admin User'}
              </div>
              <div className="text-xs text-gray-400">Super Admin</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-6 py-4 border-t border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Admin Access</span>
            </div>
            <button 
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed sidebar */}
      <div className="w-64"></div>
    </>
  )
} 