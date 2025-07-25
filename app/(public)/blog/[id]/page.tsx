'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Bookmark,
  FileText
} from 'lucide-react'

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock blog post data - in a real app, this would come from an API
  const blogPost = {
    id: params.id,
    title: "Complete Guide to Importing Vehicles to Ghana in 2024",
    excerpt: "Everything you need to know about the vehicle import process, regulations, and best practices for importing cars to Ghana.",
    content: `
      <h2>Introduction</h2>
      <p>Importing vehicles to Ghana requires careful planning and understanding of local regulations. This comprehensive guide covers everything from documentation requirements to customs procedures.</p>
      
      <h2>Understanding the Process</h2>
      <p>The vehicle import process involves several key steps that must be completed in the correct order to ensure smooth clearance and delivery.</p>
      
      <h2>Required Documentation</h2>
      <p>You'll need several important documents including:</p>
      <ul>
        <li>Valid government-issued ID</li>
        <li>Proof of address</li>
        <li>Vehicle specifications</li>
        <li>Import permit (if required)</li>
      </ul>
      
      <h2>Customs and Duties</h2>
      <p>Understanding the customs duties and taxes involved is crucial for budgeting your import project.</p>
      
      <h2>Shipping Options</h2>
      <p>There are several shipping methods available, each with their own advantages and costs.</p>
      
      <h2>Conclusion</h2>
      <p>With proper planning and the right partner, importing vehicles to Ghana can be a smooth and profitable process.</p>
    `,
    author: "Auto-Bridge Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Import Guide",
    views: 1247
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = () => {
    const url = `${window.location.origin}/blog/${blogPost.id}`
    const text = `Check out this article: ${blogPost.title}`
    
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt,
        url: url
      })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      alert('Link copied to clipboard!')
    }
  }

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
            Back to Blog
          </button>
          
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {blogPost.category}
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {blogPost.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {blogPost.excerpt}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blogPost.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(blogPost.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {blogPost.readTime}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {blogPost.views} views
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={sharePost}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
                  <p className="text-gray-600">{blogPost.author}</p>
                </div>
                <button
                  onClick={() => router.push('/blog')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Back to Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Top 10 Most Popular Vehicles for Import</h3>
              <p className="text-sm text-gray-600 mb-4">Discover which vehicles are most in demand and why they're preferred.</p>
              <button
                onClick={() => router.push('/blog')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Read More →
              </button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Understanding Vehicle Import Duties</h3>
              <p className="text-sm text-gray-600 mb-4">A detailed breakdown of all costs involved in vehicle importation.</p>
              <button
                onClick={() => router.push('/blog')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Read More →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 