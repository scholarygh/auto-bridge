'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  Play,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Car,
  Truck,
  DollarSign,
  Shield,
  Clock,
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Car,
    color: 'bg-blue-100 text-blue-600',
    articles: [
      {
        title: 'How to Choose the Right Vehicle',
        description: 'Step-by-step guide to selecting the perfect vehicle for your needs',
        readTime: '5 min read',
        difficulty: 'Beginner',
        type: 'guide'
      },
      {
        title: 'Understanding the Import Process',
        description: 'Complete overview of our 6-step vehicle import process',
        readTime: '8 min read',
        difficulty: 'Beginner',
        type: 'guide'
      },
      {
        title: 'Required Documents Checklist',
        description: 'Essential documents you need to prepare for vehicle import',
        readTime: '3 min read',
        difficulty: 'Beginner',
        type: 'checklist'
      },
      {
        title: 'Budget Planning Guide',
        description: 'How to calculate total costs including duties and fees',
        readTime: '6 min read',
        difficulty: 'Beginner',
        type: 'guide'
      }
    ]
  },
  {
    id: 'vehicle-selection',
    title: 'Vehicle Selection',
    icon: Car,
    color: 'bg-green-100 text-green-600',
    articles: [
      {
        title: 'SUV vs Sedan: Which is Right for You?',
        description: 'Compare different vehicle types and their benefits',
        readTime: '7 min read',
        difficulty: 'Intermediate',
        type: 'comparison'
      },
      {
        title: 'Popular Vehicle Brands in Ghana',
        description: 'Most reliable and sought-after vehicle brands',
        readTime: '4 min read',
        difficulty: 'Beginner',
        type: 'guide'
      },
      {
        title: 'Vehicle Inspection Checklist',
        description: 'What to look for when evaluating vehicle condition',
        readTime: '6 min read',
        difficulty: 'Intermediate',
        type: 'checklist'
      },
      {
        title: 'Understanding Vehicle History Reports',
        description: 'How to read and interpret Carfax reports',
        readTime: '5 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      }
    ]
  },
  {
    id: 'shipping-logistics',
    title: 'Shipping & Logistics',
    icon: Truck,
    color: 'bg-purple-100 text-purple-600',
    articles: [
      {
        title: 'Container vs RORO Shipping',
        description: 'Compare different shipping methods and costs',
        readTime: '6 min read',
        difficulty: 'Intermediate',
        type: 'comparison'
      },
      {
        title: 'Tracking Your Shipment',
        description: 'How to monitor your vehicle during transit',
        readTime: '3 min read',
        difficulty: 'Beginner',
        type: 'guide'
      },
      {
        title: 'Shipping Insurance Explained',
        description: 'Understanding coverage and protection options',
        readTime: '4 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      },
      {
        title: 'Port Handling Procedures',
        description: 'What happens when your vehicle arrives at port',
        readTime: '5 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      }
    ]
  },
  {
    id: 'customs-clearance',
    title: 'Customs & Clearance',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    articles: [
      {
        title: 'Customs Duties Calculator',
        description: 'Estimate import duties and taxes for your vehicle',
        readTime: '4 min read',
        difficulty: 'Intermediate',
        type: 'tool'
      },
      {
        title: 'Required Import Permits',
        description: 'Essential permits and documentation for clearance',
        readTime: '5 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      },
      {
        title: 'Common Customs Issues',
        description: 'How to avoid and resolve clearance problems',
        readTime: '6 min read',
        difficulty: 'Advanced',
        type: 'troubleshooting'
      },
      {
        title: 'Vehicle Registration Process',
        description: 'Steps to register your imported vehicle in Ghana',
        readTime: '7 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      }
    ]
  },
  {
    id: 'payment-finance',
    title: 'Payment & Finance',
    icon: DollarSign,
    color: 'bg-red-100 text-red-600',
    articles: [
      {
        title: 'Payment Methods Explained',
        description: 'Available payment options and security measures',
        readTime: '4 min read',
        difficulty: 'Beginner',
        type: 'guide'
      },
      {
        title: 'Financing Options Available',
        description: 'Loan and payment plan options for vehicle imports',
        readTime: '6 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      },
      {
        title: 'Understanding Total Costs',
        description: 'Breakdown of all fees and charges involved',
        readTime: '5 min read',
        difficulty: 'Beginner',
        type: 'guide'
      },
      {
        title: 'Refund and Cancellation Policy',
        description: 'When and how refunds are processed',
        readTime: '4 min read',
        difficulty: 'Beginner',
        type: 'policy'
      }
    ]
  },
  {
    id: 'after-sales',
    title: 'After-Sales Support',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600',
    articles: [
      {
        title: 'Vehicle Maintenance Guide',
        description: 'Essential maintenance tips for imported vehicles',
        readTime: '8 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      },
      {
        title: 'Warranty Coverage Details',
        description: 'What\'s covered and how to make claims',
        readTime: '5 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      },
      {
        title: 'Finding Parts and Service',
        description: 'Recommended service centers and parts suppliers',
        readTime: '4 min read',
        difficulty: 'Beginner',
        type: 'directory'
      },
      {
        title: 'Resale Value Optimization',
        description: 'Tips to maintain your vehicle\'s resale value',
        readTime: '6 min read',
        difficulty: 'Intermediate',
        type: 'guide'
      }
    ]
  }
]

const videoTutorials = [
  {
    title: 'Complete Import Process Walkthrough',
    duration: '15:30',
    thumbnail: '/tutorials/import-process.jpg',
    description: 'Step-by-step video guide through the entire vehicle import process'
  },
  {
    title: 'How to Read Vehicle History Reports',
    duration: '8:45',
    thumbnail: '/tutorials/history-reports.jpg',
    description: 'Learn how to interpret Carfax and other vehicle history reports'
  },
  {
    title: 'Vehicle Inspection Best Practices',
    duration: '12:20',
    thumbnail: '/tutorials/inspection.jpg',
    description: 'Professional tips for inspecting vehicles before purchase'
  },
  {
    title: 'Customs Documentation Guide',
    duration: '10:15',
    thumbnail: '/tutorials/customs.jpg',
    description: 'Complete guide to preparing customs documentation'
  }
]

const downloadableResources = [
  {
    title: 'Import Process Checklist',
    type: 'PDF',
    size: '2.3 MB',
    description: 'Printable checklist for the complete import process',
    icon: FileText
  },
  {
    title: 'Vehicle Inspection Form',
    type: 'PDF',
    size: '1.8 MB',
    description: 'Professional inspection checklist for vehicle evaluation',
    icon: FileText
  },
  {
    title: 'Cost Calculator Spreadsheet',
    type: 'Excel',
    size: '456 KB',
    description: 'Interactive spreadsheet to calculate total import costs',
    icon: Download
  },
  {
    title: 'Documentation Templates',
    type: 'ZIP',
    size: '3.1 MB',
    description: 'Templates for common import documents and forms',
    icon: FileText
  }
]

export default function HelpCenterPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.articles.length > 0)

  const displayedCategories = selectedCategory 
    ? filteredCategories.filter(cat => cat.id === selectedCategory)
    : filteredCategories

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-600'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-600'
      case 'Advanced': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen
      case 'checklist': return CheckCircle
      case 'comparison': return AlertCircle
      case 'tool': return Zap
      case 'troubleshooting': return Info
      case 'policy': return Shield
      case 'directory': return Users
      default: return FileText
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Self-Service Help
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find answers, tutorials, and resources to help you navigate the vehicle import process independently.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search help articles, tutorials, and guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Help Articles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">15+</div>
              <div className="text-sm text-gray-600">Video Tutorials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">10+</div>
              <div className="text-sm text-gray-600">Downloadable Resources</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Available</div>
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Help Articles</h2>
            <p className="text-lg text-gray-600">Comprehensive guides and tutorials organized by topic</p>
          </div>
          
          {displayedCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all categories.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(null)
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View All Articles
              </button>
            </div>
          ) : (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.articles.map((article, index) => {
                        const TypeIcon = getTypeIcon(article.type)
                        
                        return (
                          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TypeIcon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {article.readTime}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                    {article.difficulty}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                              Read Article
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
            <p className="text-lg text-gray-600">Watch step-by-step guides and demonstrations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTutorials.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-gray-400" />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Downloadable Resources</h2>
            <p className="text-lg text-gray-600">Free tools, templates, and guides to help you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloadableResources.map((resource, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{resource.type}</span>
                  <span>{resource.size}</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/support')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </button>
            <button 
              onClick={() => router.push('/faq')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              View FAQ
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
                <h3 className="text-xl font-bold text-gray-900">Video Tutorial</h3>
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
                  <p className="text-gray-600">Video player would be embedded here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 