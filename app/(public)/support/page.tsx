'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Clock,
  Users,
  Shield,
  Truck,
  Car,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react'

const faqCategories = [
  {
    title: 'Getting Started',
    icon: Car,
    color: 'bg-blue-100 text-blue-600',
    faqs: [
      {
        question: 'How do I start the vehicle import process?',
        answer: 'Start by browsing our available vehicles or contact us for a consultation. We\'ll discuss your requirements, budget, and preferences to find the perfect vehicle for you.'
      },
      {
        question: 'What documents do I need to import a vehicle?',
        answer: 'You\'ll need a valid ID, proof of address, and vehicle specifications. We handle all the complex documentation including customs declarations and import permits.'
      },
      {
        question: 'How long does the entire process take?',
        answer: 'The complete process typically takes 5-7 weeks from sourcing to delivery. This includes vehicle selection, purchase, shipping, and customs clearance.'
      },
      {
        question: 'Can I import any type of vehicle?',
        answer: 'We can import most vehicles, but some restrictions apply based on age, emissions standards, and local regulations. Contact us to discuss your specific vehicle requirements.'
      }
    ]
  },
  {
    title: 'Pricing & Payment',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
    faqs: [
      {
        question: 'How much does vehicle import cost?',
        answer: 'Total costs include vehicle price, shipping, customs duties, and our service fees. We provide transparent pricing with no hidden costs. Contact us for a detailed quote.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, mobile money, and cash payments. We also offer flexible payment plans for qualified customers.'
      },
      {
        question: 'Do you offer financing options?',
        answer: 'Yes, we have partnerships with local banks and financial institutions to offer competitive financing options for vehicle imports.'
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees. We provide complete transparency with detailed breakdowns of all costs including vehicle price, shipping, duties, and our service fees.'
      }
    ]
  },
  {
    title: 'Shipping & Delivery',
    icon: Truck,
    color: 'bg-purple-100 text-purple-600',
    faqs: [
      {
        question: 'How do you ship vehicles to Ghana?',
        answer: 'We use container shipping with reliable international carriers. Vehicles are securely packed and insured for the entire journey.'
      },
      {
        question: 'Can I track my vehicle during shipping?',
        answer: 'Yes, we provide real-time tracking updates throughout the shipping process. You\'ll receive regular updates via email and SMS.'
      },
      {
        question: 'What happens if my vehicle is damaged during shipping?',
        answer: 'All vehicles are fully insured during shipping. In the rare event of damage, we handle all insurance claims and ensure you\'re fully compensated.'
      },
      {
        question: 'Where do you deliver vehicles?',
        answer: 'We offer door-to-door delivery throughout Ghana. We can deliver to your home, office, or any preferred location.'
      }
    ]
  },
  {
    title: 'Quality & Warranty',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    faqs: [
      {
        question: 'How do you ensure vehicle quality?',
        answer: 'Every vehicle undergoes thorough inspection by certified mechanics. We only source vehicles from reputable dealers and auctions.'
      },
      {
        question: 'Do you provide warranties?',
        answer: 'Yes, all vehicles come with our quality guarantee and we can arrange extended warranties through our partner providers.'
      },
      {
        question: 'What if I\'m not satisfied with my vehicle?',
        answer: 'We stand behind our vehicles with a satisfaction guarantee. If you\'re not completely satisfied, we\'ll work to resolve any issues.'
      },
      {
        question: 'Can I inspect the vehicle before purchase?',
        answer: 'While physical inspection isn\'t always possible, we provide detailed photos, videos, and inspection reports for every vehicle.'
      }
    ]
  }
]

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageSquare,
    color: 'bg-blue-600',
    action: () => window.open('https://wa.me/233XXXXXXXXX', '_blank'),
    buttonText: 'Start Chat'
  },
  {
    title: 'Phone Support',
    description: 'Call us directly for immediate assistance',
    icon: Phone,
    color: 'bg-green-600',
    action: () => window.location.href = 'tel:+233XXXXXXXXX',
    buttonText: 'Call Now'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    color: 'bg-purple-600',
    action: () => window.location.href = 'mailto:support@auto-bridge.com',
    buttonText: 'Send Email'
  },
  {
    title: 'Visit Office',
    description: 'Meet us in person at our office',
    icon: MapPin,
    color: 'bg-orange-600',
    action: () => window.open('https://maps.google.com/?q=Accra,Ghana', '_blank'),
    buttonText: 'Get Directions'
  }
]

const troubleshootingGuides = [
  {
    title: 'Vehicle Selection Guide',
    description: 'Learn how to choose the right vehicle for your needs and budget',
    icon: Car,
    steps: [
      'Determine your budget and requirements',
      'Research vehicle types and features',
      'Consider maintenance and running costs',
      'Check import regulations and restrictions'
    ]
  },
  {
    title: 'Import Process Timeline',
    description: 'Understand the complete timeline from selection to delivery',
    icon: Clock,
    steps: [
      'Initial consultation (1-2 days)',
      'Vehicle sourcing (1-2 weeks)',
      'Purchase and documentation (3-5 days)',
      'Shipping and transit (3-4 weeks)',
      'Customs clearance (1-2 weeks)',
      'Final delivery (1-2 days)'
    ]
  },
  {
    title: 'Documentation Checklist',
    description: 'Ensure you have all required documents for smooth import',
    icon: FileText,
    steps: [
      'Valid government-issued ID',
      'Proof of address/residence',
      'Vehicle specifications and requirements',
      'Financial proof for payment',
      'Import permit (if required)'
    ]
  }
]

export default function SupportPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({})

  const toggleFaq = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`
    setExpandedFaqs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Support Center
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find answers to common questions, get troubleshooting help, or contact our support team for personalized assistance.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Help Fast</h2>
            <p className="text-lg text-gray-600">Choose the best way to get the support you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{option.description}</p>
                <button
                  onClick={option.action}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {option.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Find answers to the most common questions about our services</p>
          </div>
          
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.faqs.map((faq, faqIndex) => {
                    const key = `${categoryIndex}-${faqIndex}`
                    const isExpanded = expandedFaqs[key]
                    
                    return (
                      <div key={faqIndex} className="px-6 py-4">
                        <button
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                          className="w-full flex items-center justify-between text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 pr-4">{faq.question}</h4>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="mt-4 pl-2">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting Guides */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Troubleshooting Guides</h2>
            <p className="text-lg text-gray-600">Step-by-step guides to help you through common processes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {troubleshootingGuides.map((guide, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <guide.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{guide.description}</p>
                <ol className="space-y-2">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/contact')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Support
            </button>
            <button 
              onClick={() => window.location.href = 'tel:+233XXXXXXXXX'}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </button>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Support Hours</h3>
              <div className="space-y-2 text-gray-300">
                <p>Monday - Friday: 8:00 AM - 8:00 PM GMT</p>
                <p>Saturday: 9:00 AM - 6:00 PM GMT</p>
                <p>Sunday: 10:00 AM - 4:00 PM GMT</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Emergency Support</h3>
              <p className="text-gray-300 mb-4">
                For urgent matters outside business hours, please call our emergency line.
              </p>
              <button 
                onClick={() => window.location.href = 'tel:+233XXXXXXXXX'}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Emergency: +233 XX XXX XXXX
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 