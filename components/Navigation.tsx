'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, User, Heart, Bell, Car, MapPin, ChevronDown, HelpCircle, Shield, FileText } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Cars', href: '/cars' },
  { 
    name: 'Services', 
    href: '/services',
    dropdown: [
      { name: 'Vehicle Import', href: '/services' },
      { name: 'Sell Your Car', href: '/sell' },
      { name: 'Customs & Compliance', href: '/services' },
      { name: 'Shipping & Logistics', href: '/services' }
    ]
  },
  { name: 'About', href: '/about' },
  { 
    name: 'Support', 
    href: '/support',
    dropdown: [
      { name: 'Help Center', href: '/help-center' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Support', href: '/support' },
      { name: 'Safety Tips', href: '/safety-tips' }
    ]
  },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-auto-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-auto-gray-900">
                Auto-Bridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-auto-blue-600'
                          : 'text-auto-gray-600 hover:text-auto-gray-900'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-auto-blue-600 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-auto-blue-600'
                        : 'text-auto-gray-600 hover:text-auto-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/login" className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        pathname === item.href
                          ? 'text-auto-blue-600 bg-auto-blue-50'
                          : 'text-auto-gray-600 hover:text-auto-gray-900 hover:bg-auto-gray-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.name && (
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-auto-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setOpenDropdown(null)
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? 'text-auto-blue-600 bg-auto-blue-50'
                        : 'text-auto-gray-600 hover:text-auto-gray-900 hover:bg-auto-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 px-3">
                <button className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <Link href="/login" className="p-2 text-auto-gray-400 hover:text-auto-gray-600 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop for dropdown */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </nav>
  )
} 