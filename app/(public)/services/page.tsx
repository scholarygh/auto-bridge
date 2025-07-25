'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Truck, 
  Shield, 
  CheckCircle, 
  Users, 
  Award, 
  Globe,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Zap,
  Target,
  TrendingUp,
  FileText,
  Car,
  Package,
  Navigation,
  Settings,
  HeadphonesIcon
} from 'lucide-react'

// Services data with enhanced descriptions
const services = [
  {
    icon: Search,
    title: 'Premium Car Sourcing',
    description: 'Access to exclusive inventory from top-tier US dealerships and auctions',
    features: ['Curated selection', 'Quality verification', 'Market analysis', 'Price negotiation'],
    color: 'bg-blue-600',
    process: ['Market research', 'Dealer network access', 'Vehicle inspection', 'Price optimization']
  },
  {
    icon: Truck,
    title: 'Global Shipping Network',
    description: 'Seamless door-to-door delivery with real-time tracking and insurance',
    features: ['5-7 weeks delivery', 'Container shipping', 'Live tracking', 'Insurance coverage'],
    color: 'bg-green-600',
    process: ['Container booking', 'Port handling', 'Ocean freight', 'Local delivery']
  },
  {
    icon: Shield,
    title: 'Customs & Compliance',
    description: 'Expert handling of all import procedures and regulatory requirements',
    features: ['Duty optimization', 'Documentation', 'Port clearance', 'Regulatory compliance'],
    color: 'bg-purple-600',
    process: ['Document preparation', 'Customs declaration', 'Duty calculation', 'Clearance processing']
  },
  {
    icon: CheckCircle,
    title: 'Quality Assurance',
    description: 'Comprehensive inspection and warranty coverage for peace of mind',
    features: ['Pre-shipment inspection', 'Warranty coverage', 'Support network', 'Quality guarantee'],
    color: 'bg-orange-600',
    process: ['Vehicle inspection', 'Quality assessment', 'Warranty activation', 'Support setup']
  }
]

const processSteps = [
  {
    step: 1,
    title: 'Initial Consultation',
    description: 'We discuss your requirements, budget, and preferences to understand your needs.',
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    step: 2,
    title: 'Vehicle Sourcing',
    description: 'Our team searches our extensive network to find the perfect vehicle for you.',
    icon: Search,
    color: 'bg-green-100 text-green-600'
  },
  {
    step: 3,
    title: 'Quality Inspection',
    description: 'Every vehicle undergoes thorough inspection and quality verification.',
    icon: CheckCircle,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    step: 4,
    title: 'Purchase & Shipping',
    description: 'We handle the purchase, documentation, and arrange secure shipping.',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600'
  },
  {
    step: 5,
    title: 'Customs Clearance',
    description: 'Expert handling of all import procedures and regulatory compliance.',
    icon: Shield,
    color: 'bg-red-100 text-red-600'
  },
  {
    step: 6,
    title: 'Delivery & Support',
    description: 'Door-to-door delivery and ongoing support for your vehicle.',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600'
  }
]

const benefits = [
  {
    icon: DollarSign,
    title: 'Cost Savings',
    description: 'Save 20-40% compared to local dealerships with our competitive pricing and bulk purchasing power.'
  },
  {
    icon: Clock,
    title: 'Time Efficiency',
    description: 'Streamlined process from sourcing to delivery, typically completed in 5-7 weeks.'
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Every vehicle is thoroughly inspected and comes with our quality assurance guarantee.'
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Access to vehicles from top US dealerships and auctions through our established network.'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Dedicated support team available throughout the entire import process.'
  },
  {
    icon: Award,
    title: 'Proven Track Record',
    description: 'Successfully imported hundreds of vehicles with satisfied customers across Ghana.'
  }
]

const testimonials = [
  {
    name: 'Kwame Asante',
    location: 'Accra, Ghana',
    rating: 5,
    comment: 'Auto-Bridge made importing my BMW M4 seamless. Professional service from start to finish.',
    car: 'BMW M4 Competition',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Ama Osei',
    location: 'Kumasi, Ghana',
    rating: 5,
    comment: 'Exceptional quality and service. They found my dream car and handled everything perfectly.',
    car: 'Mercedes-AMG C63',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Kofi Mensah',
    location: 'Tema, Ghana',
    rating: 5,
    comment: 'The most reliable car import service I\'ve used. Transparent pricing and excellent communication.',
    car: 'Audi RS6 Avant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
]

export default function ServicesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Our Services
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Comprehensive Vehicle Import Solutions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              From sourcing to delivery, we handle every aspect of your vehicle import journey with expertise, transparency, and reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/contact')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Get Started Today
              </button>
              <button 
                onClick={() => router.push('/cars')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                Browse Vehicles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end vehicle import solutions designed to make your car buying experience seamless and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A streamlined 6-step process designed to make vehicle importing simple and transparent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">Step {step.step}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose Auto-Bridge?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're committed to providing the best vehicle import experience with unmatched benefits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-blue-100 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.car}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Import Your Dream Car?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied customers who have successfully imported their vehicles with Auto-Bridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/contact')}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Start Your Import
            </button>
            <button 
              onClick={() => router.push('/cars')}
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Browse Available Vehicles
            </button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = 'tel:+233XXXXXXXXX'}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+233 XX XXX XXXX</span>
                </button>
                <button 
                  onClick={() => window.location.href = 'mailto:info@auto-bridge.com'}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>info@auto-bridge.com</span>
                </button>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Accra, Ghana</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={() => router.push('/cars')} className="block text-gray-300 hover:text-white transition-colors">
                  Browse Vehicles
                </button>
                <button onClick={() => router.push('/sell')} className="block text-gray-300 hover:text-white transition-colors">
                  Sell Your Car
                </button>
                <button onClick={() => router.push('/about')} className="block text-gray-300 hover:text-white transition-colors">
                  About Us
                </button>
                <button onClick={() => router.push('/contact')} className="block text-gray-300 hover:text-white transition-colors">
                  Contact
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 