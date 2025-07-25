'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react'

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of Auto-Bridge's website and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>

            {/* Services Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Description</h2>
              <p className="text-gray-700 mb-4">Auto-Bridge provides vehicle import services including:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vehicle sourcing and procurement from US markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>International shipping and logistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Customs clearance and documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Quality inspection and assurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Customer support and consultation</span>
                </li>
              </ul>
            </div>

            {/* User Eligibility */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Eligibility</h2>
              <p className="text-gray-700 mb-4">To use our services, you must:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Be at least 18 years of age</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Have legal capacity to enter into contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate and complete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comply with all applicable laws and regulations</span>
                </li>
              </ul>
            </div>

            {/* User Obligations */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Obligations</h2>
              <p className="text-gray-700 mb-4">By using our services, you agree to:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate and truthful information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Pay all fees and charges in a timely manner</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Cooperate with our team throughout the import process</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Comply with all import regulations and requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Not use our services for illegal or unauthorized purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Maintain the confidentiality of your account information</span>
                </li>
              </ul>
            </div>

            {/* Payment Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Schedule</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Initial deposit: 30% of total cost upon vehicle selection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Balance payment: 70% before shipping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Additional fees: Customs duties and taxes as applicable</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Methods</h3>
                  <p className="text-gray-700">We accept bank transfers, mobile money, and cash payments. All payments must be made in Ghana Cedis (GHS) or US Dollars (USD).</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Late Payments</h3>
                  <p className="text-gray-700">Late payments may result in additional fees and delays in service delivery. We reserve the right to suspend services for non-payment.</p>
                </div>
              </div>
            </div>

            {/* Service Timeline */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Timeline</h2>
              <p className="text-gray-700 mb-4">Typical service timeline:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vehicle sourcing: 1-2 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Purchase and documentation: 3-5 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Shipping and transit: 3-4 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Customs clearance: 1-2 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Final delivery: 1-2 days</span>
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> Timelines may vary based on vehicle availability, shipping schedules, and customs processing times.
              </p>
            </div>

            {/* Cancellation and Refunds */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation and Refunds</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Before vehicle purchase: 90% refund of deposit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>After vehicle purchase: 50% refund of total payment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>After shipping begins: No refund available</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Processing</h3>
                  <p className="text-gray-700">Refunds will be processed within 7-14 business days using the original payment method.</p>
                </div>
              </div>
            </div>

            {/* Liability and Disclaimers */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Liability and Disclaimers</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Limitations</h3>
                  <p className="text-gray-700 mb-3">Auto-Bridge provides services on an "as is" basis. We do not guarantee:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Specific vehicle availability or pricing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Exact delivery timelines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Vehicle condition beyond our inspection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Changes in import regulations or duties</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Liability Limits</h3>
                  <p className="text-gray-700">Our liability is limited to the amount paid for our services. We are not liable for indirect, incidental, or consequential damages.</p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-4">All content on our website, including text, graphics, logos, and software, is the property of Auto-Bridge and is protected by copyright laws.</p>
              <p className="text-gray-700">You may not reproduce, distribute, or create derivative works without our written permission.</p>
            </div>

            {/* Privacy and Data */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
              <button 
                onClick={() => router.push('/privacy')}
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                View Privacy Policy
              </button>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of Ghana. Any disputes arising from these Terms or our services will be resolved in the courts of Ghana.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">If you have questions about these Terms, please contact us:</p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">legal@auto-bridge.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">+233 XX XXX XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Accra, Ghana</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 text-center">
                These Terms of Service are effective as of {new Date().toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 