'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, 
  Users, 
  Award, 
  Heart, 
  Zap,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Shield,
  Globe,
  Target,
  TrendingUp,
  FileText,
  Send,
  CheckCircle,
  Star
} from 'lucide-react'

const jobOpenings = [
  {
    id: 1,
    title: 'Vehicle Import Specialist',
    department: 'Operations',
    location: 'Accra, Ghana',
    type: 'Full-time',
    experience: '3-5 years',
    salary: 'Competitive',
    description: 'We are looking for an experienced Vehicle Import Specialist to join our operations team. You will be responsible for managing the entire import process from sourcing to delivery.',
    responsibilities: [
      'Manage vehicle sourcing and procurement from US markets',
      'Coordinate with shipping partners and logistics providers',
      'Handle customs documentation and clearance procedures',
      'Ensure compliance with import regulations and requirements',
      'Maintain relationships with dealers and auction houses'
    ],
    requirements: [
      'Bachelor\'s degree in Business, Logistics, or related field',
      'Minimum 3 years experience in vehicle import/export',
      'Strong knowledge of customs procedures and regulations',
      'Excellent communication and negotiation skills',
      'Proficiency in Microsoft Office and logistics software'
    ],
    benefits: [
      'Competitive salary and performance bonuses',
      'Health insurance and wellness programs',
      'Professional development opportunities',
      'Flexible work arrangements',
      'Team building activities and events'
    ],
    posted: '2024-01-15',
    urgent: true
  },
  {
    id: 2,
    title: 'Customer Success Manager',
    department: 'Customer Service',
    location: 'Accra, Ghana',
    type: 'Full-time',
    experience: '2-4 years',
    salary: 'Competitive',
    description: 'Join our customer success team to ensure exceptional customer experiences throughout the vehicle import journey.',
    responsibilities: [
      'Manage customer relationships and provide ongoing support',
      'Handle customer inquiries and resolve issues promptly',
      'Coordinate with internal teams to meet customer needs',
      'Monitor customer satisfaction and gather feedback',
      'Develop and implement customer success strategies'
    ],
    requirements: [
      'Bachelor\'s degree in Business, Marketing, or related field',
      'Minimum 2 years experience in customer service or sales',
      'Excellent communication and problem-solving skills',
      'Strong attention to detail and organizational abilities',
      'Experience with CRM systems preferred'
    ],
    benefits: [
      'Competitive salary with commission structure',
      'Comprehensive health and dental coverage',
      'Paid time off and holidays',
      'Career growth opportunities',
      'Modern office environment'
    ],
    posted: '2024-01-12',
    urgent: false
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Accra, Ghana',
    type: 'Full-time',
    experience: '2-3 years',
    salary: 'Competitive',
    description: 'Help us grow our brand and reach more customers through innovative marketing strategies and campaigns.',
    responsibilities: [
      'Develop and execute marketing campaigns across multiple channels',
      'Manage social media presence and content creation',
      'Analyze market trends and competitor activities',
      'Coordinate with external agencies and partners',
      'Track and report on marketing performance metrics'
    ],
    requirements: [
      'Bachelor\'s degree in Marketing, Communications, or related field',
      'Minimum 2 years experience in digital marketing',
      'Proficiency in social media platforms and marketing tools',
      'Strong analytical and creative thinking skills',
      'Experience with Google Analytics and advertising platforms'
    ],
    benefits: [
      'Competitive salary and performance bonuses',
      'Flexible work environment',
      'Professional development budget',
      'Health and wellness benefits',
      'Creative and collaborative team culture'
    ],
    posted: '2024-01-10',
    urgent: false
  },
  {
    id: 4,
    title: 'Logistics Coordinator',
    department: 'Logistics',
    location: 'Accra, Ghana',
    type: 'Full-time',
    experience: '1-3 years',
    salary: 'Competitive',
    description: 'Coordinate shipping and logistics operations to ensure smooth vehicle delivery from the US to Ghana.',
    responsibilities: [
      'Coordinate with shipping partners and freight forwarders',
      'Track shipments and provide updates to customers',
      'Handle documentation for international shipping',
      'Manage port operations and customs clearance',
      'Optimize shipping routes and costs'
    ],
    requirements: [
      'Bachelor\'s degree in Logistics, Supply Chain, or related field',
      'Minimum 1 year experience in logistics or shipping',
      'Knowledge of international shipping procedures',
      'Strong organizational and communication skills',
      'Proficiency in logistics software and tools'
    ],
    benefits: [
      'Competitive salary with performance incentives',
      'Health insurance and retirement benefits',
      'Professional certification support',
      'International travel opportunities',
      'Dynamic and fast-paced work environment'
    ],
    posted: '2024-01-08',
    urgent: false
  }
]

const companyValues = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from customer service to vehicle quality.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Our customers are at the heart of every decision we make and every action we take.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We operate with honesty, transparency, and ethical business practices.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Users,
    title: 'Teamwork',
    description: 'We believe in the power of collaboration and supporting each other to achieve common goals.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We continuously innovate to improve our services and stay ahead of industry trends.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    description: 'We embrace diversity and bring global best practices to the local market.',
    color: 'bg-indigo-100 text-indigo-600'
  }
]

const benefits = [
  {
    icon: DollarSign,
    title: 'Competitive Compensation',
    description: 'Attractive salary packages with performance bonuses and incentives'
  },
  {
    icon: Shield,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs'
  },
  {
    icon: Calendar,
    title: 'Work-Life Balance',
    description: 'Flexible work arrangements and generous time-off policies'
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Professional development opportunities and career advancement paths'
  },
  {
    icon: Users,
    title: 'Great Team',
    description: 'Work with talented professionals in a collaborative environment'
  },
  {
    icon: Award,
    title: 'Recognition',
    description: 'Regular recognition and rewards for outstanding performance'
  }
]

export default function CareersPage() {
  const router = useRouter()
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: '',
    resume: null as File | null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }))
    }
  }

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the application data to your backend
    console.log('Application submitted:', applicationData)
    alert('Thank you for your application! We will review it and get back to you soon.')
    setShowApplicationForm(false)
    setApplicationData({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      message: '',
      resume: null
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              Join Our Team
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Build Your Career with Auto-Bridge
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Join our dynamic team and help us revolutionize vehicle imports in Ghana. We're looking for passionate professionals who share our vision and values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                View Open Positions
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact HR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Work With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Auto-Bridge, we believe in creating an environment where our team can thrive, grow, and make a real impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Benefits & Perks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive benefits to support your health, growth, and work-life balance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our current job openings and find the perfect role for your skills and career goals.
            </p>
          </div>
          
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      {job.urgent && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted {formatDate(job.posted)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {job.experience} experience
                      </span>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        {job.salary} salary
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setApplicationData(prev => ({ ...prev, position: job.title }))
                        setShowApplicationForm(true)
                      }}
                      className="bg-transparent border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
                
                {selectedJob === job.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Job Application</h3>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicationData.name}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                  <input
                    type="text"
                    required
                    value={applicationData.position}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="text"
                  required
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                <textarea
                  rows={4}
                  value={applicationData.message}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact HR */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Questions About Working With Us?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our HR team is here to help you with any questions about our company culture, benefits, or application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = 'mailto:hr@auto-bridge.com'}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email HR Team
            </button>
            <button 
              onClick={() => window.location.href = 'tel:+233XXXXXXXXX'}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call HR
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 