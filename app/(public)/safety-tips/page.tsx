'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Car, 
  Truck,
  Zap,
  Clock,
  Users,
  FileText,
  Download,
  Play,
  ChevronRight,
  Star,
  Info,
  Lightbulb,
  Heart,
  Eye,
  Gauge,
  Wrench,
  MapPin,
  Phone
} from 'lucide-react'

const safetyCategories = [
  {
    id: 'vehicle-inspection',
    title: 'Vehicle Inspection Safety',
    icon: Eye,
    color: 'bg-blue-100 text-blue-600',
    tips: [
      {
        title: 'Pre-Purchase Inspection Checklist',
        description: 'Essential safety checks before buying any vehicle',
        priority: 'High',
        content: [
          'Check for structural damage and frame integrity',
          'Inspect all safety systems (brakes, airbags, seatbelts)',
          'Verify engine and transmission condition',
          'Test all electrical systems and lights',
          'Review vehicle history for accidents or recalls'
        ]
      },
      {
        title: 'Professional Inspection Importance',
        description: 'Why you should always get a professional inspection',
        priority: 'High',
        content: [
          'Certified mechanics can identify hidden issues',
          'Professional tools detect problems you might miss',
          'Inspection reports provide documentation for warranty claims',
          'Peace of mind knowing your vehicle is safe',
          'Can save money by avoiding problematic vehicles'
        ]
      },
      {
        title: 'Common Safety Issues to Watch For',
        description: 'Red flags that indicate potential safety problems',
        priority: 'Medium',
        content: [
          'Rust in structural areas (not just cosmetic)',
          'Uneven tire wear indicating alignment issues',
          'Strange noises from brakes or suspension',
          'Warning lights on dashboard',
          'Fluid leaks under the vehicle'
        ]
      }
    ]
  },
  {
    id: 'driving-safety',
    title: 'Safe Driving Practices',
    icon: Car,
    color: 'bg-green-100 text-green-600',
    tips: [
      {
        title: 'Defensive Driving Techniques',
        description: 'Essential skills for safe driving in Ghana',
        priority: 'High',
        content: [
          'Always maintain safe following distance',
          'Scan the road ahead for potential hazards',
          'Use mirrors frequently to check blind spots',
          'Signal your intentions clearly and early',
          'Avoid distractions like phones while driving'
        ]
      },
      {
        title: 'Weather and Road Conditions',
        description: 'How to drive safely in different conditions',
        priority: 'Medium',
        content: [
          'Reduce speed during rainy weather',
          'Increase following distance on wet roads',
          'Use headlights during poor visibility',
          'Avoid driving through flooded areas',
          'Check tire pressure regularly for optimal grip'
        ]
      },
      {
        title: 'Night Driving Safety',
        description: 'Tips for safe driving after dark',
        priority: 'Medium',
        content: [
          'Ensure all lights are working properly',
          'Use high beams only when no oncoming traffic',
          'Reduce speed and increase following distance',
          'Watch for pedestrians and animals',
          'Take regular breaks on long night journeys'
        ]
      }
    ]
  },
  {
    id: 'maintenance-safety',
    title: 'Maintenance Safety',
    icon: Wrench,
    color: 'bg-purple-100 text-purple-600',
    tips: [
      {
        title: 'Regular Maintenance Schedule',
        description: 'Essential maintenance for vehicle safety',
        priority: 'High',
        content: [
          'Oil changes every 5,000-7,500 km',
          'Brake inspection every 10,000 km',
          'Tire rotation and alignment checks',
          'Air filter replacement as needed',
          'Coolant and brake fluid checks'
        ]
      },
      {
        title: 'DIY vs Professional Maintenance',
        description: 'When to do it yourself vs when to call a professional',
        priority: 'Medium',
        content: [
          'Simple tasks: oil changes, air filters, wiper blades',
          'Professional needed: brakes, suspension, electrical',
          'Always use quality parts and fluids',
          'Keep detailed maintenance records',
          'Follow manufacturer recommendations'
        ]
      },
      {
        title: 'Emergency Kit Essentials',
        description: 'What to keep in your vehicle for emergencies',
        priority: 'Medium',
        content: [
          'First aid kit and emergency contact numbers',
          'Jumper cables and basic tools',
          'Spare tire and jack in good condition',
          'Flashlight and reflective warning triangles',
          'Water and non-perishable snacks'
        ]
      }
    ]
  },
  {
    id: 'child-safety',
    title: 'Child Passenger Safety',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    tips: [
      {
        title: 'Car Seat Safety Guidelines',
        description: 'Proper car seat installation and usage',
        priority: 'High',
        content: [
          'Use age and weight appropriate car seats',
          'Install car seats in the back seat only',
          'Ensure proper harness fit and positioning',
          'Never use second-hand car seats',
          'Replace car seats after any accident'
        ]
      },
      {
        title: 'Child Safety Best Practices',
        description: 'Additional safety measures for children',
        priority: 'High',
        content: [
          'Always buckle children in properly',
          'Never leave children alone in vehicles',
          'Use child safety locks on doors',
          'Keep children away from airbags',
          'Teach children about vehicle safety'
        ]
      }
    ]
  },
  {
    id: 'road-safety',
    title: 'Road Safety Awareness',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-600',
    tips: [
      {
        title: 'Traffic Rules and Regulations',
        description: 'Important traffic laws to follow',
        priority: 'High',
        content: [
          'Always wear seatbelts (driver and passengers)',
          'Obey speed limits and traffic signals',
          'Never drive under the influence of alcohol',
          'Use proper lanes and signaling',
          'Respect pedestrian crossings'
        ]
      },
      {
        title: 'Emergency Response',
        description: 'What to do in case of accidents or breakdowns',
        priority: 'Medium',
        content: [
          'Move to a safe location if possible',
          'Call emergency services immediately',
          'Exchange information with other parties',
          'Document the scene with photos',
          'Contact your insurance company'
        ]
      }
    ]
  }
]

const safetyVideos = [
  {
    title: 'Vehicle Safety Inspection Guide',
    duration: '12:30',
    description: 'Step-by-step guide to inspecting your vehicle for safety issues',
    thumbnail: '/safety/inspection-guide.jpg'
  },
  {
    title: 'Safe Driving in Ghana',
    duration: '18:45',
    description: 'Tips and techniques for safe driving on Ghanaian roads',
    thumbnail: '/safety/driving-tips.jpg'
  },
  {
    title: 'Child Car Seat Installation',
    duration: '8:20',
    description: 'Proper installation and usage of child car seats',
    thumbnail: '/safety/car-seat.jpg'
  },
  {
    title: 'Emergency Response Procedures',
    duration: '15:10',
    description: 'What to do in case of accidents or vehicle emergencies',
    thumbnail: '/safety/emergency.jpg'
  }
]

const safetyChecklists = [
  {
    title: 'Daily Safety Check',
    items: [
      'Check tire pressure and condition',
      'Test all lights (headlights, brake lights, turn signals)',
      'Ensure windshield wipers work properly',
      'Check fuel level and warning lights',
      'Adjust mirrors and seat position'
    ]
  },
  {
    title: 'Weekly Safety Check',
    items: [
      'Inspect brake fluid level',
      'Check engine oil level and condition',
      'Test horn and emergency flashers',
      'Inspect seatbelts for damage',
      'Check for any fluid leaks'
    ]
  },
  {
    title: 'Monthly Safety Check',
    items: [
      'Inspect brake pads and rotors',
      'Check suspension components',
      'Test battery terminals and connections',
      'Inspect exhaust system',
      'Check air filter condition'
    ]
  }
]

export default function SafetyTipsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedTips, setExpandedTips] = useState<{ [key: string]: boolean }>({})
  const [showVideoModal, setShowVideoModal] = useState(false)

  const toggleTip = (categoryId: string, tipIndex: number) => {
    const key = `${categoryId}-${tipIndex}`
    setExpandedTips(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-600'
      case 'Medium': return 'bg-yellow-100 text-yellow-600'
      case 'Low': return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const displayedCategories = selectedCategory 
    ? safetyCategories.filter(cat => cat.id === selectedCategory)
    : safetyCategories

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Safety First
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Vehicle Safety Tips
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Essential safety information, driving tips, and maintenance guidelines to keep you and your family safe on the road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('safety-tips')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                View Safety Tips
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Stats */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">95%</div>
              <div className="text-sm text-gray-600">Accidents Preventable</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Safety Tips</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Emergency Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Safety Commitment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {safetyCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section id="safety-tips" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety Tips & Guidelines</h2>
            <p className="text-lg text-gray-600">Comprehensive safety information organized by category</p>
          </div>
          
          <div className="space-y-8">
            {displayedCategories.map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    {category.tips.map((tip, tipIndex) => {
                      const key = `${category.id}-${tipIndex}`
                      const isExpanded = expandedTips[key]
                      
                      return (
                        <div key={tipIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => toggleTip(category.id, tipIndex)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tip.priority)}`}>
                                  {tip.priority} Priority
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">{tip.description}</p>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                          
                          {isExpanded && (
                            <div className="px-6 pb-6 border-t border-gray-100">
                              <div className="pt-4">
                                <h5 className="font-medium text-gray-900 mb-3">Key Points:</h5>
                                <ul className="space-y-2">
                                  {tip.content.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Checklists */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety Checklists</h2>
            <p className="text-lg text-gray-600">Printable checklists for regular safety inspections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safetyChecklists.map((checklist, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{checklist.title}</h3>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {checklist.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Checklist
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Videos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety Video Tutorials</h2>
            <p className="text-lg text-gray-600">Watch step-by-step safety guides and demonstrations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyVideos.map((video, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-12 h-12 text-gray-400" />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{video.description}</p>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Watch Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Emergency Contacts</h2>
          <p className="text-xl text-red-100 mb-8">
            Save these important numbers for emergency situations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Police</h3>
              <p className="text-red-100">191</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Ambulance</h3>
              <p className="text-red-100">193</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Fire Service</h3>
              <p className="text-red-100">192</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Help */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Safety Information?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact our safety experts for personalized advice and guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/contact')}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Contact Safety Team
            </button>
            <button 
              onClick={() => router.push('/support')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Safety Support
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Safety Video Tutorial</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Safety video would be embedded here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 