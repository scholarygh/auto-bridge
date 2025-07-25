"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Users,
  Shield,
  Truck,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Eye,
  Sparkles,
  Zap,
  X,
} from "lucide-react";
import { formatPriceGHS, convertUSDToGHSSync, formatMileageForDisplay } from "@/lib/utils";
import FeatureDisplay from "@/components/ui/FeatureDisplay";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    if (params.id) loadVehicle();
  }, [params.id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const { VehicleService } = await import("@/lib/vehicleService");
      const result = await VehicleService.getVehicleById(params.id as string);
      if (result.success && result.vehicle) setVehicle(result.vehicle);
      else setError(result.error || "Vehicle not found");
    } catch (err) {
      setError("Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    
    try {
      const response = await fetch('/api/vehicle-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inquiryForm,
          vehicleId: vehicle.id,
          vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Inquiry submitted successfully! We will contact you soon.');
        setShowInquiryForm(false);
        setInquiryForm({ name: '', email: '', phone: '', message: '' });
      } else {
        alert(result.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="inline-block animate-spin text-blue-600 mb-4">
            <Eye className="w-8 h-8" />
          </span>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }
  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <span className="inline-block mb-4 text-red-500">
            <X className="w-10 h-10" />
          </span>
          <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "This vehicle may have been removed or is no longer available."}</p>
          <button onClick={() => router.push("/cars")} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-2">Browse Other Vehicles</button>
          <button onClick={() => router.back()} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">Go Back</button>
        </div>
      </div>
    );
  }

  // Responsive: single column on mobile, two columns on desktop
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Vehicles
          </button>
          <div className="flex-1 text-right">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 text-right">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
            <p className="text-sm text-gray-500 text-right">{vehicle.location || "USA"}</p>
          </div>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="relative flex items-center justify-center bg-gray-100 aspect-[16/9]">
                <img
                  src={vehicle.images?.[currentImageIndex] || "/placeholder.png"}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onClick={() => setShowImageModal(true)}
                />
                {/* Navigation */}
                {vehicle.images && vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((i) => (i === 0 ? vehicle.images.length - 1 : i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((i) => (i === vehicle.images.length - 1 ? 0 : i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                      {currentImageIndex + 1} / {vehicle.images.length}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2 overflow-x-auto">
                    {vehicle.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-28 h-20 rounded border-2 ${idx === currentImageIndex ? "border-blue-600" : "border-gray-200 hover:border-gray-400"}`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover rounded" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
              <div className="flex flex-wrap gap-4 mb-4 items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Available
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {vehicle.location || "USA"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  VIN: {vehicle.vin || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Calendar className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <div className="text-xs text-gray-500">Year</div>
                  <div className="font-semibold">{vehicle.year}</div>
                </div>
                <div className="text-center">
                  <Gauge className="w-5 h-5 mx-auto text-green-600 mb-1" />
                  <div className="text-xs text-gray-500">Mileage</div>
                  <div className="font-semibold">{vehicle.mileage ? formatMileageForDisplay(vehicle.mileage) : "N/A"}</div>
                </div>
                <div className="text-center">
                  <Fuel className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <div className="text-xs text-gray-500">Fuel</div>
                  <div className="font-semibold capitalize">{vehicle.fuel_type || "N/A"}</div>
                </div>
                <div className="text-center">
                  <Cog className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                  <div className="text-xs text-gray-500">Transmission</div>
                  <div className="font-semibold capitalize">{vehicle.transmission || "N/A"}</div>
                </div>
              </div>
              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" /> Features
                </h3>
                <FeatureDisplay features={vehicle.features} maxFeatures={12} />
              </div>
              {/* Description */}
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" /> Description
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p
                    className={`text-gray-700 leading-relaxed text-base transition-all ${isDescriptionExpanded ? '' : 'line-clamp-4'}`}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {vehicle.description}
                  </p>
                  {vehicle.description && vehicle.description.length > 200 && (
                    <button
                      className="mt-2 text-blue-600 hover:underline text-sm font-medium focus:outline-none"
                      onClick={() => setIsDescriptionExpanded((v) => !v)}
                    >
                      {isDescriptionExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (desktop) / stacked (mobile) */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="text-center mb-6">
                {vehicle.price ? (
                  <>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatPriceGHS(convertUSDToGHSSync(vehicle.price))}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${vehicle.price.toLocaleString()} USD
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">Price on Request</div>
                )}
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" /> Make Inquiry
                </button>
                <button
                  onClick={() => window.location.href = 'tel:+233XXXXXXXXX'}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" /> Call Now
                </button>
                <button
                  onClick={() => window.location.href = 'mailto:info@auto-bridge.com'}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" /> Email Inquiry
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Views</span>
                  <span>{vehicle.views || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Inquiries</span>
                  <span>{vehicle.inquiries || 0}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" /> Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">+233 XX XXX XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">info@auto-bridge.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Accra, Ghana</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Make Inquiry</h3>
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your interest in this vehicle..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submittingInquiry ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 