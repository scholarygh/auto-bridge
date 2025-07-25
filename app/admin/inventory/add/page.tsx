'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Database, FileText, Upload, Plus } from 'lucide-react'

export default function AddVehiclePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/inventory" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Vehicle
          </h1>
          <p className="text-gray-600">
            Choose how you'd like to add a vehicle to your inventory
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* VIN Extraction */}
          <Link 
            href="/admin/inventory/add/vin"
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              VIN Data Extraction
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Enter a VIN to automatically extract comprehensive vehicle specifications from our proprietary database
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              <Plus className="w-4 h-4 mr-1" />
              Extract Data
            </div>
          </Link>

          {/* Manual Entry */}
          <Link 
            href="/admin/inventory/add/manual"
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manual Entry
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Manually enter all vehicle details and specifications with our comprehensive form
            </p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <Plus className="w-4 h-4 mr-1" />
              Enter Manually
            </div>
          </Link>

          {/* Bulk Import */}
          <Link 
            href="/admin/inventory/add/bulk"
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bulk Import
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Upload a CSV file with multiple vehicles for batch processing and import
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              <Plus className="w-4 h-4 mr-1" />
              Import CSV
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Advanced Vehicle Management Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📊 Comprehensive Data Extraction</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete vehicle specifications</li>
                <li>• Engine and powertrain details</li>
                <li>• Safety and driver assistance features</li>
                <li>• Manufacturing information</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🖼️ Image Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiple image uploads</li>
                <li>• Image categorization (exterior, interior, engine)</li>
                <li>• Primary image selection</li>
                <li>• Automatic image optimization</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📈 Business Intelligence</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vehicle history tracking</li>
                <li>• Pricing analytics</li>
                <li>• Market value estimation</li>
                <li>• Inventory performance metrics</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🔍 Advanced Search & Filtering</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-criteria search</li>
                <li>• Feature-based filtering</li>
                <li>• Price range filtering</li>
                <li>• Year and make filtering</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">100+</div>
            <div className="text-sm text-blue-700">Vehicle Specifications</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">50+</div>
            <div className="text-sm text-green-700">Safety Features</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-sm text-purple-700">Image Uploads</div>
          </div>
        </div>
      </div>
    </div>
  )
} 