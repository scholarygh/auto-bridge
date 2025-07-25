import React from 'react'
import AdminNavigation from '@/components/AdminNavigation'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Fixed Sidebar */}
        <AdminNavigation />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedAdminRoute>
  )
} 