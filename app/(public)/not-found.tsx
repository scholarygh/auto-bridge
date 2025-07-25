'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  AlertTriangle, 
  Home, 
  Car, 
  MessageSquare, 
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  const quickActions = [
    {
      title: 'Go Home',
      description: 'Return to the homepage',
      icon: Home,
      action: () => router.push('/'),
      color: 'bg-blue-600'
    },
    {
      title: 'Browse Vehicles',
      description: 'View our available inventory',
      icon: Car,
      action: () => router.push('/cars'),
      color: 'bg-green-600'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: MessageSquare,
      action: () => router.push('/contact'),
      color: 'bg-purple-600'
    },
    {
      title: 'Search Site',
      description: 'Find what you\'re looking for',
      icon: Search,
      action: () => router.push('/sitemap'),
      color: 'bg-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">What would you like to do?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/about')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => router.push('/services')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => router.push('/sell')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sell Your Car
            </button>
            <button
              onClick={() => router.push('/faq')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => router.push('/support')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Support
            </button>
            <button
              onClick={() => router.push('/blog')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Blog
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            If you can't find what you're looking for, our support team is here to help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Call Us</p>
                <p className="text-sm text-gray-600">+233 XX XXX XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Email Us</p>
                <p className="text-sm text-gray-600">info@auto-bridge.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Visit Us</p>
                <p className="text-sm text-gray-600">Accra, Ghana</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/contact')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
} 