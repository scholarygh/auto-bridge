'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Car,
  Truck,
  DollarSign,
  Shield,
  Clock,
  Users
} from 'lucide-react'

const faqCategories = [
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    color: 'bg-blue-100 text-blue-600',
    faqs: [
      {
        question: 'What is Auto-Bridge?',
        answer: 'Auto-Bridge is a leading vehicle import company based in Ghana. We specialize in sourcing, importing, and delivering vehicles from the United States to Ghana, providing end-to-end services including vehicle selection, shipping, customs clearance, and delivery.'
      },
      {
        question: 'How long has Auto-Bridge been in business?',
        answer: 'Auto-Bridge has been serving customers in Ghana for over 5 years, building a reputation for reliability, transparency, and excellent customer service in the vehicle import industry.'
      },
      {
        question: 'Where is Auto-Bridge located?',
        answer: 'Our main office is located in Accra, Ghana. We also have partnerships and networks across the United States for vehicle sourcing and in major ports for shipping operations.'
      },
      {
        question: 'What types of vehicles do you import?',
        answer: 'We import a wide range of vehicles including sedans, SUVs, trucks, luxury vehicles, and commercial vehicles. We can source vehicles from various brands and models based on your specific requirements.'
      }
    ]
  },
  {
    id: 'process',
    title: 'Import Process',
    icon: Truck,
    color: 'bg-green-100 text-green-600',
    faqs: [
      {
        question: 'How does the vehicle import process work?',
        answer: 'Our process involves 6 main steps: 1) Initial consultation to understand your needs, 2) Vehicle sourcing from our network, 3) Quality inspection and verification, 4) Purchase and documentation, 5) Shipping and transit, 6) Customs clearance and delivery.'
      },
      {
        question: 'How long does the entire import process take?',
        answer: 'The complete process typically takes 5-7 weeks from initial consultation to final delivery. This timeline includes vehicle sourcing (1-2 weeks), purchase and documentation (3-5 days), shipping (3-4 weeks), and customs clearance (1-2 weeks).'
      },
      {
        question: 'What documents do I need to provide?',
        answer: 'You\'ll need to provide a valid government-issued ID, proof of address, and vehicle specifications. We handle all the complex documentation including customs declarations, import permits, and regulatory compliance.'
      },
      {
        question: 'Can I track my vehicle during the process?',
        answer: 'Yes, we provide real-time tracking updates throughout the entire process. You\'ll receive regular updates via email and SMS, and can also check the status through our customer portal.'
      }
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing & Payment',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-600',
    faqs: [
      {
        question: 'How much does it cost to import a vehicle?',
        answer: 'Total costs include the vehicle price, shipping fees, customs duties, and our service fees. The exact cost depends on the vehicle type, value, and shipping method. We provide transparent pricing with no hidden costs.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, mobile money (MTN, Vodafone, AirtelTigo), and cash payments. We also offer flexible payment plans for qualified customers.'
      },
      {
        question: 'When do I need to make payments?',
        answer: 'We require a 30% deposit upon vehicle selection, with the remaining 70% due before shipping begins. Additional fees like customs duties are typically paid during the clearance process.'
      },
      {
        question: 'Do you offer financing options?',
        answer: 'Yes, we have partnerships with local banks and financial institutions to offer competitive financing options for vehicle imports. Contact us to discuss available financing solutions.'
      }
    ]
  },
  {
    id: 'quality',
    title: 'Quality & Warranty',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    faqs: [
      {
        question: 'How do you ensure vehicle quality?',
        answer: 'Every vehicle undergoes thorough inspection by certified mechanics before purchase. We only source vehicles from reputable dealers and auctions, and provide detailed inspection reports with photos and videos.'
      },
      {
        question: 'Do you provide warranties?',
        answer: 'Yes, all vehicles come with our quality guarantee. We can also arrange extended warranties through our partner providers for additional peace of mind.'
      },
      {
        question: 'What if I\'m not satisfied with my vehicle?',
        answer: 'We stand behind our vehicles with a satisfaction guarantee. If you\'re not completely satisfied, we\'ll work to resolve any issues and ensure your complete satisfaction.'
      },
      {
        question: 'Can I inspect the vehicle before purchase?',
        answer: 'While physical inspection isn\'t always possible due to distance, we provide comprehensive virtual inspections with detailed photos, videos, and inspection reports for every vehicle.'
      }
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    icon: Truck,
    color: 'bg-red-100 text-red-600',
    faqs: [
      {
        question: 'How do you ship vehicles to Ghana?',
        answer: 'We use container shipping with reliable international carriers. Vehicles are securely packed and fully insured for the entire journey from the US to Ghana.'
      },
      {
        question: 'Where do you deliver vehicles?',
        answer: 'We offer door-to-door delivery throughout Ghana. We can deliver to your home, office, or any preferred location within the country.'
      },
      {
        question: 'What happens if my vehicle is damaged during shipping?',
        answer: 'All vehicles are fully insured during shipping. In the rare event of damage, we handle all insurance claims and ensure you\'re fully compensated for any issues.'
      },
      {
        question: 'Can I choose my preferred shipping method?',
        answer: 'We offer different shipping options including container shipping and roll-on/roll-off (RORO) shipping. We\'ll recommend the best option based on your vehicle and timeline requirements.'
      }
    ]
  },
  {
    id: 'support',
    title: 'Customer Support',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600',
    faqs: [
      {
        question: 'How can I contact Auto-Bridge?',
        answer: 'You can contact us through multiple channels: phone (+233 XX XXX XXXX), email (info@auto-bridge.com), WhatsApp, or by visiting our office in Accra. We\'re available during business hours and offer emergency support.'
      },
      {
        question: 'What are your business hours?',
        answer: 'Our business hours are Monday to Friday 8:00 AM - 8:00 PM GMT, Saturday 9:00 AM - 6:00 PM GMT, and Sunday 10:00 AM - 4:00 PM GMT. Emergency support is available outside these hours.'
      },
      {
        question: 'Do you provide after-sales support?',
        answer: 'Yes, we provide comprehensive after-sales support including maintenance advice, parts sourcing, and ongoing customer service. We\'re here to help you throughout your vehicle ownership journey.'
      },
      {
        question: 'Can I get a consultation before deciding?',
        answer: 'Absolutely! We offer free consultations to discuss your vehicle needs, budget, and requirements. This helps us provide personalized recommendations and ensures you make an informed decision.'
      }
    ]
  }
]

const quickActions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageSquare,
    color: 'bg-blue-600',
    action: () => window.open('https://wa.me/233XXXXXXXXX', '_blank'),
    buttonText: 'Start Chat'
  },
  {
    title: 'Call Us',
    description: 'Speak directly with our experts',
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
    description: 'Meet us in person',
    icon: MapPin,
    color: 'bg-orange-600',
    action: () => window.open('https://maps.google.com/?q=Accra,Ghana', '_blank'),
    buttonText: 'Get Directions'
  }
]

export default function FAQPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({})
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const toggleFaq = (categoryId: string, faqIndex: number) => {
    const key = `${categoryId}-${faqIndex}`
    setExpandedFaqs(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const displayedCategories = selectedCategory 
    ? filteredCategories.filter(cat => cat.id === selectedCategory)
    : filteredCategories

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Got Questions?
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find answers to the most common questions about our vehicle import services. Can't find what you're looking for? Contact our support team.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Fast?</h2>
            <p className="text-lg text-gray-600">Choose the best way to get the support you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{action.description}</p>
                <button
                  onClick={action.action}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {action.buttonText}
                </button>
              </div>
            ))}
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
            {faqCategories.map((category) => (
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

      {/* FAQ Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {displayedCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all categories.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(null)
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View All Questions
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
                  
                  <div className="divide-y divide-gray-200">
                    {category.faqs.map((faq, faqIndex) => {
                      const key = `${category.id}-${faqIndex}`
                      const isExpanded = expandedFaqs[key]
                      
                      return (
                        <div key={faqIndex} className="px-6 py-4">
                          <button
                            onClick={() => toggleFaq(category.id, faqIndex)}
                            className="w-full flex items-center justify-between text-left hover:bg-gray-100 rounded-lg p-2 transition-colors"
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
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you with any questions or concerns about our services.
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