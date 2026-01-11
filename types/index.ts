export type UserRole = 'driver' | 'shipper' | 'broker' | 'admin' | 'provider'

export interface User {
  id: string
  phone?: string
  email?: string
  name: string
  role: UserRole
  email?: string
  avatar?: string
  company?: string
  country?: string
  inn?: string
  orgName?: string
  orgAddress?: string
  orgOwner?: string
  orgRegistrationDate?: string
  rating?: number
  verified: boolean
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  createdAt: string
}

export interface Load {
  id: string
  shipperId: string
  brokerId?: string
  driverId?: string
  origin: {
    city: string
    address?: string
    coordinates?: [number, number]
  }
  destination: {
    city: string
    address?: string
    coordinates?: [number, number]
  }
  weight: number
  volume?: number
  cargoType: string
  price: number
  currency: string
  distance: number
  urgent: boolean
  status: 'active' | 'assigned' | 'in_transit' | 'completed' | 'cancelled'
  description?: string
  documents?: string[]
  photos?: string[]
  createdAt: string
  pickupDate?: string
  deliveryDate?: string
  title?: string
  dimensions?: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  text: string
  read: boolean
  createdAt: string
}

export interface Chat {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface LoadApplication {
  id: string
  loadId: string
  driverId: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  createdAt: string
}

export interface BrokerClient {
  id: string
  userId: string
  name: string
  phone: string
  loadsCount: number
  totalRevenue: number
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalLoads: number
  activeLoads: number
  completedLoads: number
  totalRevenue: number
  usersByRole: Record<UserRole, number>
}

export interface Vehicle {
  id: string
  number: string
  vin: string
  category: 'тягач' | 'грузовик' | 'пикап'
  capacity: number
  photos?: string[]
  createdAt: string
}

export interface ResponseItem {
  id: string
  loadId: string
  userId: string
  role: UserRole
  status: 'sent' | 'approved' | 'rejected'
  createdAt: string
}

export interface DriverRating {
  id: string
  driverId: string
  providerId: string
  stars: number
  comment?: string
  providerName: string
  createdAt: string
}

