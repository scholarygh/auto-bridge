'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  ArrowLeft,
  CheckCircle,
  Info
} from 'lucide-react'

export default function CookiesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and understand how you use our site.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                    <p className="text-gray-600">Required for website functionality and security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                    <p className="text-gray-600">Help us understand how visitors use our website</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Preference Cookies</h3>
                    <p className="text-gray-600">Remember your settings and preferences</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>View and delete existing cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Block cookies from specific websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set preferences for cookie acceptance</span>
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We may use third-party services that also place cookies on your device. These services help us provide better functionality and analytics.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Need Help?</h3>
                    <p className="text-blue-700 text-sm">
                      If you have questions about our cookie policy, please contact us at{' '}
                      <a href="mailto:privacy@auto-bridge.com" className="underline hover:text-blue-800">
                        privacy@auto-bridge.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 