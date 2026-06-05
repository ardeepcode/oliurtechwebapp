/**
 * Shared Type Definitions for Oliur Tech E-Commerce & Service Platform
 */

export type ProductCategory = 'desktop' | 'laptop' | 'monitor' | 'cctv' | 'smartphone' | 'accessories';

export interface ProductSpec {
  [key: string]: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: ProductCategory;
  brand: string;
  stock: number;
  rating: number;
  images: string[];
  specs: ProductSpec;
  reviews: Review[];
  featured?: boolean;
  bestSelling?: boolean;
  newArrival?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'user' | 'admin';
  passwordHash?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentTxnId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId?: string;
  serviceType: 'computer' | 'cctv';
  specificService: string; // e.g., 'Laptop Repair', 'DVR Configuration', etc.
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
}
