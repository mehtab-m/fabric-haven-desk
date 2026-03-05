// Mock Data for ZM HOME FABRICS

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  originalPrice: number;
  discountedPrice: number;
  showOnHomePage: boolean;
  images: string[];
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  joinedDate: string;
}

export interface Order {
  id: string;
  orderNumber?: number;
  customerId: string;
  customerName: string;
  products: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  address: string;
}

