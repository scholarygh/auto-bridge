'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import Dialog from '@/components/ui/Dialog'
import { useDialog } from '@/hooks/useDialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  // Dialog management
  const { dialog, showSuccess, showError, hideDialog } = useDialog()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('📧 Submitting contact form:', formData)
      
      // Submit to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        console.log('✅ Contact form submitted successfully')
        showSuccess(
          'Message Sent Successfully! 🎉',
          'Thank you for contacting us. We\'ll get back to you within 24 hours.'
        )
        
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        const errorData = await response.json()
        showError(
          'Message Failed to Send',
          errorData.error || 'Failed to send message. Please try again.'
        )
      }
    } catch (error) {
      console.error('❌ Error submitting contact form:', error)
      showError(
        'Network Error',
        'Failed to send message. Please check your internet connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team. We're here to help!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <Input
                label="Subject *"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="What's this about?"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions about our services? Need help with your vehicle import? 
                We're here to assist you every step of the way.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600 mb-2">hello@auto-bridge.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600 mb-2">+233 XX XXX XXXX</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM GMT</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600 mb-2">Accra, Ghana</p>
                  <p className="text-sm text-gray-500">By appointment only</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-blue-800">How long does vehicle import take?</p>
                  <p className="text-blue-700">Typically 2-4 weeks from sourcing to delivery.</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">What documents do I need?</p>
                  <p className="text-blue-700">Valid ID, proof of address, and vehicle specifications.</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Do you offer financing?</p>
                  <p className="text-blue-700">Yes, we have flexible payment plans available.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Dialog Component */}
      <Dialog {...dialog} onClose={hideDialog} />
    </div>
  )
} 