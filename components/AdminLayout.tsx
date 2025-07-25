'use client'

import React from 'react'
import { Download, Plus, Search } from 'lucide-react'

interface AdminLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
  showExport?: boolean
  showNewButton?: boolean
  newButtonText?: string
  onNewClick?: () => void
  onExportClick?: () => void
}

export default function AdminLayout({
  title,
  subtitle,
  children,
  showExport = true,
  showNewButton = true,
  newButtonText = "New",
  onNewClick,
  onExportClick
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              {showExport && (
                <button 
                  onClick={onExportClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Export
                </button>
              )}
              {showNewButton && (
                <button 
                  onClick={onNewClick}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {newButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

// Reusable Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
}

export function StatsCard({ title, value, icon, iconBgColor, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable Stats Grid Component
interface StatsGridProps {
  children: React.ReactNode
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {children}
    </div>
  )
}

// Reusable Filters Component
interface FiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children?: React.ReactNode
}

export function Filters({ searchTerm, onSearchChange, searchPlaceholder = "Search...", children }: FiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {children}
      </div>
    </div>
  )
}

// Reusable Table Container Component
interface TableContainerProps {
  title: string
  subtitle: string
  totalItems: number
  filteredItems: number
  children: React.ReactNode
}

export function TableContainer({ title, subtitle, totalItems, filteredItems, children }: TableContainerProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredItems} of {totalItems} items
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

// Reusable Even Layout Cards Component
interface EvenLayoutCardsProps {
  children: React.ReactNode
}

export function EvenLayoutCards({ children }: EvenLayoutCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {children}
    </div>
  )
}

// Reusable Card Component
interface CardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
} 