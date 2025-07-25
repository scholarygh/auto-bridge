'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Home, 
  Car, 
  MessageSquare, 
  Users, 
  HelpCircle, 
  Briefcase,
  Settings,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

const siteStructure = [
  {
    title: 'Main Pages',
    icon: Home,
    pages: [
      { name: 'Home', path: '/', description: 'Welcome to Auto-Bridge - Your trusted vehicle import partner' },
      { name: 'About Us', path: '/about', description: 'Learn about our company, mission, and values' },
      { name: 'Services', path: '/services', description: 'Comprehensive vehicle import solutions' },
      { name: 'Contact', path: '/contact', description: 'Get in touch with our team' }
    ]
  },
  {
    title: 'Vehicle Pages',
    icon: Car,
    pages: [
      { name: 'Browse Vehicles', path: '/cars', description: 'View our available vehicle inventory' },
      { name: 'Vehicle Details', path: '/vehicles/[id]', description: 'Detailed information about specific vehicles' },
      { name: 'Sell Your Car', path: '/sell', description: 'Submit your vehicle for sale consideration' }
    ]
  },
  {
    title: 'Support & Help',
    icon: HelpCircle,
    pages: [
      { name: 'FAQ', path: '/faq', description: 'Frequently asked questions and answers' },
      { name: 'Support Center', path: '/support', description: 'Get help and troubleshooting assistance' },
      { name: 'Blog & News', path: '/blog', description: 'Latest articles and industry insights' }
    ]
  },
  {
    title: 'Company',
    icon: Users,
    pages: [
      { name: 'Careers', path: '/careers', description: 'Job opportunities and career information' },
      { name: 'Privacy Policy', path: '/privacy', description: 'How we protect your personal information' },
      { name: 'Terms of Service', path: '/terms', description: 'Terms and conditions for using our services' }
    ]
  }
]

const quickLinks = [
  { name: 'Latest Vehicles', path: '/cars', icon: Car },
  { name: 'Import Services', path: '/services', icon: FileText },
  { name: 'Contact Support', path: '/support', icon: MessageSquare },
  { name: 'About Auto-Bridge', path: '/about', icon: Users },
  { name: 'Sell Your Car', path: '/sell', icon: Car },
  { name: 'View Blog', path: '/blog', icon: FileText },
  { name: 'Careers', path: '/careers', icon: Briefcase },
  { name: 'FAQ', path: '/faq', icon: HelpCircle }
]

export default function SitemapPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sitemap</h1>
              <p className="text-gray-600">Complete overview of all pages and sections on Auto-Bridge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
            <p className="text-lg text-gray-600">Jump directly to the most popular pages</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => router.push(link.path)}
                className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <link.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {link.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Site Structure */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Site Structure</h2>
            <p className="text-lg text-gray-600">Organized overview of all pages and sections</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {siteStructure.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {section.pages.map((page, pageIndex) => (
                      <div key={pageIndex} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <button
                              onClick={() => router.push(page.path)}
                              className="text-left group"
                            >
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                {page.name}
                              </h4>
                              <p className="text-sm text-gray-600">{page.description}</p>
                            </button>
                          </div>
                          <button
                            onClick={() => router.push(page.path)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Resources</h2>
            <p className="text-lg text-gray-600">Helpful information and external links</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Phone:</strong> +233 XX XXX XXXX</p>
                <p><strong>Email:</strong> info@auto-bridge.com</p>
                <p><strong>Address:</strong> Accra, Ghana</p>
                <p><strong>Business Hours:</strong> Mon-Fri 8AM-8PM GMT</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Pages</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/privacy')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Privacy Policy
                </button>
                <button
                  onClick={() => router.push('/terms')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </button>
                <button
                  onClick={() => router.push('/faq')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Frequently Asked Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Tips */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Use our search functionality or contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/support')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Get Support
            </button>
            <button 
              onClick={() => router.push('/contact')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 