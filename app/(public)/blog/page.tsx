'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  Search, 
  ArrowRight,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Filter,
  ChevronDown
} from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to Importing Vehicles to Ghana in 2024",
    excerpt: "Everything you need to know about the vehicle import process, regulations, and best practices for importing cars to Ghana.",
    content: "Importing vehicles to Ghana requires careful planning and understanding of local regulations. This comprehensive guide covers everything from documentation requirements to customs procedures...",
    author: "Auto-Bridge Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Import Guide",
    tags: ["Import", "Regulations", "Ghana"],
    image: "/blog/import-guide.jpg",
    views: 1247,
    featured: true
  },
  {
    id: 2,
    title: "Top 10 Most Popular Vehicles for Import in Ghana",
    excerpt: "Discover which vehicles are most in demand and why they're the preferred choice for Ghanaian importers.",
    content: "Based on our extensive market research and customer preferences, we've compiled a list of the most sought-after vehicles for import to Ghana...",
    author: "Market Research Team",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Market Insights",
    tags: ["Popular Vehicles", "Market Trends", "SUV"],
    image: "/blog/popular-vehicles.jpg",
    views: 892,
    featured: false
  },
  {
    id: 3,
    title: "Understanding Vehicle Import Duties and Taxes",
    excerpt: "A detailed breakdown of all costs involved in vehicle importation and how to calculate your total expenses.",
    content: "Vehicle import duties and taxes can significantly impact your total cost. Understanding these charges upfront helps you budget accurately...",
    author: "Finance Team",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "Finance",
    tags: ["Duties", "Taxes", "Costs", "Budget"],
    image: "/blog/import-duties.jpg",
    views: 1563,
    featured: false
  },
  {
    id: 4,
    title: "How to Choose the Right Vehicle for Your Needs",
    excerpt: "Expert tips on selecting the perfect vehicle based on your lifestyle, budget, and requirements.",
    content: "Choosing the right vehicle is crucial for your satisfaction and long-term ownership experience. Consider factors like fuel efficiency, maintenance costs, and resale value...",
    author: "Vehicle Experts",
    date: "2024-01-05",
    readTime: "7 min read",
    category: "Buying Guide",
    tags: ["Vehicle Selection", "Buying Tips", "Lifestyle"],
    image: "/blog/vehicle-selection.jpg",
    views: 734,
    featured: false
  },
  {
    id: 5,
    title: "Auto-Bridge Expands Services to New Regions",
    excerpt: "We're excited to announce the expansion of our vehicle import services to additional regions in Ghana.",
    content: "Auto-Bridge is proud to announce the expansion of our services to new regions across Ghana. This expansion allows us to serve more customers...",
    author: "Auto-Bridge Team",
    date: "2024-01-03",
    readTime: "4 min read",
    category: "Company News",
    tags: ["Expansion", "Services", "Growth"],
    image: "/blog/expansion.jpg",
    views: 445,
    featured: false
  },
  {
    id: 6,
    title: "Maintenance Tips for Imported Vehicles",
    excerpt: "Essential maintenance advice to keep your imported vehicle in top condition and maximize its lifespan.",
    content: "Proper maintenance is key to ensuring your imported vehicle performs optimally and maintains its value over time...",
    author: "Service Team",
    date: "2023-12-28",
    readTime: "9 min read",
    category: "Maintenance",
    tags: ["Maintenance", "Care", "Longevity"],
    image: "/blog/maintenance.jpg",
    views: 678,
    featured: false
  }
]

const categories = [
  "All Posts",
  "Import Guide",
  "Market Insights", 
  "Finance",
  "Buying Guide",
  "Company News",
  "Maintenance"
]

export default function BlogPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("All Posts")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = (post: any) => {
    const url = `${window.location.origin}/blog/${post.id}`
    const text = `Check out this article: ${post.title}`
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Blog & News
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Auto-Bridge Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Stay updated with the latest insights, guides, and news about vehicle imports, market trends, and industry developments.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
            </div>
            
            <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <FileText className="w-24 h-24 text-white/20" />
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-500 text-sm">{formatDate(featuredPost.date)}</span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {featuredPost.views} views
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => router.push(`/blog/${featuredPost.id}`)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Read Article
                    </button>
                    <button
                      onClick={() => sharePost(featuredPost)}
                      className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">{formatDate(post.date)}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => router.push(`/blog/${post.id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sharePost(post)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {regularPosts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter for the latest articles, industry insights, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 