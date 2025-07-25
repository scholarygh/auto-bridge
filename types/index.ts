// Export all types from vehicle.ts
export * from './vehicle';

// Legacy Car interface for backward compatibility
export interface Car {
  id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug-in-hybrid'
  transmission: 'automatic' | 'manual' | 'cvt'
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd'
  engine: string
  exteriorColor: string
  interiorColor: string
  vin: string
  description: string
  features: string[]
  images: string[]
  location: {
    city: string
    state: string
    zipCode: string
  }
  seller: {
    id: string
    name: string
    phone: string
    email: string
    rating: number
    verified: boolean
  }
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  status: 'available' | 'sold' | 'pending' | 'reserved'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  verified: boolean
  rating: number
  totalSales: number
  memberSince: string
  location: {
    city: string
    state: string
  }
}

export interface SearchFilters {
  make?: string
  model?: string
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  mileageMax?: number
  fuelType?: string[]
  transmission?: string[]
  drivetrain?: string[]
  condition?: string[]
  location?: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
  carId: string
}

export interface ListingForm {
  title: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  drivetrain: string
  engine: string
  exteriorColor: string
  interiorColor: string
  vin: string
  description: string
  features: string[]
  images: File[]
  condition: string
  location: {
    city: string
    state: string
    zipCode: string
  }
} 