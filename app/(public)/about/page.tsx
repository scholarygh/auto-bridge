'use client'

import React, { useState, useEffect } from 'react'
import { Car, Shield, Users, Award, MapPin, Phone, Mail, Loader2 } from 'lucide-react'

export default function AboutPage() {
  const [stats, setStats] = useState({
    carsSold: 0,
    happyCustomers: 0,
    cities: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading about page statistics...')
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return
      }
      
      // Dynamic import to prevent build-time initialization
      const { VehicleService } = await import('@/lib/vehicleService')
      const result = await VehicleService.getVehicles(1, 1000)
      
      if (result.success && result.vehicles) {
        const vehicles = result.vehicles
        
        // Calculate real statistics
        const totalVehicles = vehicles.length
        const soldVehicles = vehicles.filter((v: any) => v.status === 'sold').length
        const uniqueLocations = new Set(vehicles.map((v: any) => v.location).filter(Boolean)).size
        
        setStats({
          carsSold: soldVehicles,
          happyCustomers: totalVehicles, // Using total vehicles as proxy for customers
          cities: uniqueLocations
        })
        
        console.log('✅ About page statistics loaded')
      }
    } catch (err) {
      console.error('❌ Error loading about page statistics:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-auto-blue-600 to-auto-blue-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-display font-bold mb-6">
            About Auto-Bridge
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Connecting car enthusiasts with trusted sellers. We're building the future of automotive commerce.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-auto-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-auto-gray-600 mb-6">
                At Auto-Bridge, we believe buying and selling cars should be simple, transparent, and trustworthy. 
                Our platform connects car enthusiasts with verified sellers, making the automotive marketplace 
                more accessible and reliable than ever before.
              </p>
              <p className="text-lg text-auto-gray-600 mb-8">
                Founded in 2024, we've helped thousands of people find their perfect vehicle or sell their car 
                with confidence. Our commitment to quality, transparency, and customer satisfaction drives 
                everything we do.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-auto-blue-600">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : `${stats.carsSold}+`}
                  </div>
                  <div className="text-auto-gray-600">Cars Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-auto-blue-600">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : `${stats.happyCustomers}+`}
                  </div>
                  <div className="text-auto-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-auto-blue-600">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : `${stats.cities}+`}
                  </div>
                  <div className="text-auto-gray-600">Cities</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-auto-gray-200 rounded-2xl h-96 flex items-center justify-center">
                <Car className="w-32 h-32 text-auto-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-auto-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-auto-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-auto-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Auto-Bridge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-auto-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-auto-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-auto-gray-900 mb-4">
                Trust & Transparency
              </h3>
              <p className="text-auto-gray-600">
                We verify every seller and provide detailed information about each vehicle to ensure 
                complete transparency in every transaction.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-auto-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-auto-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-auto-gray-900 mb-4">
                Community First
              </h3>
              <p className="text-auto-gray-600">
                We're building more than a marketplace – we're creating a community of car enthusiasts 
                who share our passion for quality vehicles.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-auto-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-auto-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-auto-gray-900 mb-4">
                Quality Assurance
              </h3>
              <p className="text-auto-gray-600">
                Every car on our platform meets our strict quality standards, ensuring buyers get 
                the best possible vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-auto-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-auto-gray-600 max-w-2xl mx-auto">
              The passionate people behind Auto-Bridge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-auto-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-auto-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-auto-gray-900 mb-2">
                John Smith
              </h3>
              <p className="text-auto-blue-600 mb-2">CEO & Founder</p>
              <p className="text-auto-gray-600">
                Automotive enthusiast with 15+ years in the industry
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-auto-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-auto-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-auto-gray-900 mb-2">
                Sarah Johnson
              </h3>
              <p className="text-auto-blue-600 mb-2">CTO</p>
              <p className="text-auto-gray-600">
                Technology leader passionate about building great products
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-auto-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-16 h-16 text-auto-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-auto-gray-900 mb-2">
                Mike Davis
              </h3>
              <p className="text-auto-blue-600 mb-2">Head of Operations</p>
              <p className="text-auto-gray-600">
                Ensuring smooth operations and customer satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-auto-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-auto-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-auto-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-auto-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-auto-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-auto-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-auto-gray-600">
                123 Auto Street<br />
                San Francisco, CA 94105
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-auto-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-auto-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-auto-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-auto-gray-600">
                +1 (555) 123-4567<br />
                Mon-Fri 9AM-6PM PST
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-auto-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-auto-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-auto-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-auto-gray-600">
                hello@auto-bridge.com<br />
                support@auto-bridge.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 