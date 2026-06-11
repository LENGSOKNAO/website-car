export interface CarMake {
  id: string
  name: string
  logo_url: string | null
  country: string | null
  models: CarModel[]
}

export interface CarModel {
  id: string
  make_id: string
  name: string
  start_year: number | null
  end_year: number | null
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  is_primary: boolean
  sort_order: number
}

export interface SellerProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  location: string | null
  is_dealer: boolean
  dealer_name: string | null
}

export interface CarListing {
  id: string
  seller_id: string
  make_id: string
  model_id: string
  category_id: string | null
  year: number
  price: number
  original_price: number | null
  mileage: number | null
  fuel_type: string | null
  transmission: string | null
  engine_size: string | null
  color: string | null
  interior_color: string | null
  condition: string | null
  owners_count: number | null
  vin: string | null
  description: string | null
  location: string | null
  status: string
  views_count: number | null
  created_at: string
  make: CarMake
  model: CarModel
  images: ListingImage[]
  primary_image: ListingImage | null
  seller: SellerProfile
  features?: { id: string; name: string; category: string }[]
}

export interface User {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  location: string | null
  is_dealer: boolean
  dealer_name: string | null
  role: string
  roles: string[]
}

export interface SavedListing {
  id: string
  listing_id: string
  saved_at: string
  listing: CarListing
}

export interface Inquiry {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  message: string
  phone_number: string | null
  preferred_contact: string | null
  status: string
  sent_at: string
  listing: CarListing
}

export interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  offered_price: number
  message: string | null
  status: string
  expires_at: string | null
  payment_method: 'finance' | 'cash' | null
  down_payment: number | null
  loan_term: number | null
  accessories: { id: string; name: string; price: number }[] | null
  listing: CarListing
  created_at: string
}

export interface Conversation {
  id: string
  sender_id: string
  receiver_id: string
  listing_id: string | null
  subject: string | null
  last_message_at: string | null
  sender: SellerProfile
  receiver: SellerProfile
  listing: CarListing | null
  last_message: string | null
  unread: boolean
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

export interface OrderInstallment {
  id: string
  order_id: string
  month_number: number
  amount: number
  due_at: string
  paid_at: string | null
  status: 'pending' | 'paid' | 'overdue'
  transaction_id: string | null
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  order_number: string
  status: string
  subtotal: number
  tax: number
  fees: number
  total: number
  notes: string | null
  placed_at: string
  completed_at: string | null
  payment_method: 'finance' | 'cash' | null
  down_payment: number | null
  loan_term: number | null
  monthly_payment: number | null
  accessories: { id: string; name: string; price: number }[] | null
  next_payment_due_at: string | null
  items: OrderItem[]
  installments: OrderInstallment[]
  seller: SellerProfile
}

export interface OrderItem {
  id: string
  listing_id: string
  price: number
  condition: string | null
  listing: CarListing
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedData<T> {
  current_page: number
  data: T[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export type ListingStatus = 'in_stock' | 'out_of_stock' | 'coming_soon'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered'
export type InquiryStatus = 'new' | 'read' | 'replied' | 'archived'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled'

export interface ListingsFilters {
  make?: string
  model?: string
  min_price?: number
  max_price?: number
  min_year?: number
  max_year?: number
  mileage_max?: number
  fuel_type?: string
  transmission?: string
  condition?: string
  color?: string
  location?: string
  search?: string
  sort?: string
  page?: number
  per_page?: number
}
