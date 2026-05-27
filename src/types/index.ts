export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  gallery: string[];
  category_id: string;
  category: Category;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  warranty: string;
  free_shipping: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  product_id: string;
  user_id: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Competitor {
  id: string;
  name: string;
  type: string;
  description?: string;
  created_at?: string;
}

export interface Provider {
  id: string;
  name: string;
  service: string;
  notes?: string;
  created_at?: string;
}

export interface PotentialClient {
  id: string;
  commercial_name: string;
  sector: string;
  status: string;
  notes?: string;
  created_at?: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features?: string[];
  active?: boolean;
  created_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  started_at?: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
}
