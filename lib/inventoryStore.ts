import { create } from 'zustand'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  trim: string
  price: number
  originalPrice: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  transmission: 'automatic' | 'manual'
  color: string
  interior: string
  vin: string
  location: string
  status: 'available' | 'reserved' | 'sold' | 'maintenance'
  images: string[]
  features: string[]
  description: string
  dateAdded: string
  lastUpdated: string
  views: number
  inquiries: number
  isFeatured: boolean
}

interface InventoryStore {
  vehicles: Vehicle[]
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'dateAdded' | 'lastUpdated' | 'views' | 'inquiries' | 'isFeatured'>) => void
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void
  getVehicle: (id: string) => Vehicle | undefined
  getStats: () => {
    totalVehicles: number
    availableVehicles: number
    soldVehicles: number
    totalValue: number
    avgPrice: number
    lowStock: number
  }
}

// Initial mock data
const initialVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    trim: 'xDrive40i',
    price: 85000,
    originalPrice: 89000,
    condition: 'excellent',
    mileage: 15000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    color: 'Alpine White',
    interior: 'Black',
    vin: 'WBA5A7C50FD123456',
    location: 'Accra, Ghana',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'
    ],
    features: ['Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Sunroof'],
    description: 'Excellent condition BMW X5 with full service history. One owner, no accidents.',
    dateAdded: '2024-01-15',
    lastUpdated: '2024-01-22',
    views: 45,
    inquiries: 8,
    isFeatured: true
  },
  {
    id: '2',
    make: 'Mercedes',
    model: 'C-Class',
    year: 2024,
    trim: 'C 300',
    price: 72000,
    originalPrice: 75000,
    condition: 'excellent',
    mileage: 8000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    color: 'Obsidian Black',
    interior: 'Cream',
    vin: 'WDDWF4HB0FR789012',
    location: 'Kumasi, Ghana',
    status: 'reserved',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop'
    ],
    features: ['AMG Package', 'Premium Sound', 'Heated Seats', 'LED Headlights'],
    description: 'Brand new Mercedes C-Class with AMG styling package. Premium features included.',
    dateAdded: '2024-01-10',
    lastUpdated: '2024-01-20',
    views: 32,
    inquiries: 5,
    isFeatured: false
  },
  {
    id: '3',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    trim: 'XSE',
    price: 45000,
    originalPrice: 48000,
    condition: 'good',
    mileage: 25000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    color: 'Midnight Black',
    interior: 'Black',
    vin: '4T1B11HK5KU123456',
    location: 'Accra, Ghana',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'
    ],
    features: ['Sport Package', 'JBL Audio', 'Safety Sense 2.0', 'Smart Key'],
    description: 'Well-maintained Toyota Camry with low mileage. Great fuel efficiency and reliability.',
    dateAdded: '2024-01-05',
    lastUpdated: '2024-01-18',
    views: 28,
    inquiries: 3,
    isFeatured: false
  }
]

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  vehicles: initialVehicles,

  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'dateAdded' | 'lastUpdated' | 'views' | 'inquiries' | 'isFeatured'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      views: 0,
      inquiries: 0,
      isFeatured: false
    }
    
    set((state: InventoryStore) => ({
      vehicles: [...state.vehicles, newVehicle]
    }))
  },

  updateVehicle: (id: string, updates: Partial<Vehicle>) => {
    set((state: InventoryStore) => ({
      vehicles: state.vehicles.map((vehicle: Vehicle) => 
        vehicle.id === id 
          ? { ...vehicle, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : vehicle
      )
    }))
  },

  deleteVehicle: (id: string) => {
    set((state: InventoryStore) => ({
      vehicles: state.vehicles.filter((vehicle: Vehicle) => vehicle.id !== id)
    }))
  },

  getVehicle: (id: string) => {
    return get().vehicles.find((vehicle: Vehicle) => vehicle.id === id)
  },

  getStats: () => {
    const vehicles = get().vehicles
    const totalVehicles = vehicles.length
    const availableVehicles = vehicles.filter(v => v.status === 'available').length
    const soldVehicles = vehicles.filter(v => v.status === 'sold').length
    const totalValue = vehicles.reduce((sum, v) => sum + v.price, 0)
    const avgPrice = totalVehicles > 0 ? Math.round(totalValue / totalVehicles) : 0
    const lowStock = vehicles.filter(v => v.status === 'maintenance').length

    return {
      totalVehicles,
      availableVehicles,
      soldVehicles,
      totalValue,
      avgPrice,
      lowStock
    }
  }
})) 