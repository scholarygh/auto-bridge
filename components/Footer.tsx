import React from 'react'
import Link from 'next/link'
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-auto-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-auto-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold">Auto-Bridge</span>
            </div>
            <p className="text-auto-gray-300 mb-6">
              Connecting car enthusiasts with trusted sellers. Find your perfect vehicle or sell with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-auto-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-auto-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-auto-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-auto-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="text-auto-gray-300 hover:text-white transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-auto-gray-300 hover:text-white transition-colors">
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-auto-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-auto-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-auto-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help-center" className="text-auto-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-auto-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-auto-gray-300 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-auto-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-auto-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/safety-tips" className="text-auto-gray-300 hover:text-white transition-colors">
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-auto-blue-400" />
                <span className="text-auto-gray-300">info@auto-bridge.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-auto-blue-400" />
                <span className="text-auto-gray-300">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-auto-blue-400" />
                <span className="text-auto-gray-300">Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-auto-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-auto-gray-400 text-sm">
            © 2024 Auto-Bridge. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-auto-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-auto-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-auto-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 