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
  customerId: string;
  customerName: string;
  products: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  address: string;
}

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Bedsheets',
    slug: 'bedsheets',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    description: 'Premium quality bedsheets for ultimate comfort'
  },
  {
    id: 'cat-2',
    name: 'Pillows',
    slug: 'pillows',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',
    description: 'Soft and supportive pillows for restful sleep'
  },
  {
    id: 'cat-3',
    name: 'Curtains',
    slug: 'curtains',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    description: 'Elegant curtains to transform your space'
  },
  {
    id: 'cat-4',
    name: 'Quilts',
    slug: 'quilts',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    description: 'Cozy quilts for warmth and style'
  },
  {
    id: 'cat-5',
    name: 'Quilt Covers',
    slug: 'quilt-covers',
    image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80',
    description: 'Stylish quilt covers in various designs'
  },
  {
    id: 'cat-6',
    name: 'Loose Fabrics',
    slug: 'loose-fabrics',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
    description: 'Quality fabrics for custom creations'
  }
];

export const subcategories: Subcategory[] = [
  { id: 'sub-1', categoryId: 'cat-1', name: 'Single Bedsheet', slug: 'single-bedsheet' },
  { id: 'sub-2', categoryId: 'cat-1', name: 'Double Bedsheet (4 Pillows)', slug: 'double-bedsheet-4-pillows' },
  { id: 'sub-3', categoryId: 'cat-1', name: 'King Size Bedsheet', slug: 'king-size-bedsheet' },
  { id: 'sub-4', categoryId: 'cat-2', name: 'Memory Foam Pillows', slug: 'memory-foam-pillows' },
  { id: 'sub-5', categoryId: 'cat-2', name: 'Fiber Pillows', slug: 'fiber-pillows' },
  { id: 'sub-6', categoryId: 'cat-2', name: 'Decorative Pillows', slug: 'decorative-pillows' },
  { id: 'sub-7', categoryId: 'cat-3', name: 'Blackout Curtains', slug: 'blackout-curtains' },
  { id: 'sub-8', categoryId: 'cat-3', name: 'Sheer Curtains', slug: 'sheer-curtains' },
  { id: 'sub-9', categoryId: 'cat-3', name: 'Velvet Curtains', slug: 'velvet-curtains' },
  { id: 'sub-10', categoryId: 'cat-4', name: 'Cotton Quilts', slug: 'cotton-quilts' },
  { id: 'sub-11', categoryId: 'cat-4', name: 'Silk Quilts', slug: 'silk-quilts' },
  { id: 'sub-12', categoryId: 'cat-5', name: 'Printed Covers', slug: 'printed-covers' },
  { id: 'sub-13', categoryId: 'cat-5', name: 'Plain Covers', slug: 'plain-covers' },
  { id: 'sub-14', categoryId: 'cat-6', name: 'Cotton Fabric', slug: 'cotton-fabric' },
  { id: 'sub-15', categoryId: 'cat-6', name: 'Silk Fabric', slug: 'silk-fabric' },
  { id: 'sub-16', categoryId: 'cat-6', name: 'Linen Fabric', slug: 'linen-fabric' }
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Luxury Cotton King Bedsheet Set',
    categoryId: 'cat-1',
    subcategoryId: 'sub-3',
    originalPrice: 4999,
    discountedPrice: 3499,
    showOnHomePage: true,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
    description: 'Premium 400 thread count cotton bedsheet set with 4 pillow covers',
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'prod-2',
    name: 'Memory Foam Comfort Pillow',
    categoryId: 'cat-2',
    subcategoryId: 'sub-4',
    originalPrice: 1999,
    discountedPrice: 1499,
    showOnHomePage: true,
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80'],
    description: 'Ergonomic memory foam pillow for optimal neck support',
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'prod-3',
    name: 'Velvet Blackout Curtains',
    categoryId: 'cat-3',
    subcategoryId: 'sub-7',
    originalPrice: 3499,
    discountedPrice: 2799,
    showOnHomePage: true,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80'],
    description: 'Luxurious velvet curtains with 100% blackout lining',
    inStock: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: 'prod-4',
    name: 'Premium Silk Quilt',
    categoryId: 'cat-4',
    subcategoryId: 'sub-11',
    originalPrice: 8999,
    discountedPrice: 6999,
    showOnHomePage: true,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'],
    description: 'Handcrafted silk quilt with natural filling',
    inStock: true,
    rating: 4.7,
    reviews: 45
  },
  {
    id: 'prod-5',
    name: 'Floral Print Quilt Cover',
    categoryId: 'cat-5',
    subcategoryId: 'sub-12',
    originalPrice: 2999,
    discountedPrice: 2299,
    showOnHomePage: true,
    images: ['https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80'],
    description: 'Beautiful floral print quilt cover in soft cotton',
    inStock: true,
    rating: 4.5,
    reviews: 78
  },
  {
    id: 'prod-6',
    name: 'Pure Linen Fabric (Per Meter)',
    categoryId: 'cat-6',
    subcategoryId: 'sub-16',
    originalPrice: 899,
    discountedPrice: 699,
    showOnHomePage: true,
    images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80'],
    description: 'Premium quality linen fabric for custom projects',
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'prod-7',
    name: 'Double Bedsheet Floral Set',
    categoryId: 'cat-1',
    subcategoryId: 'sub-2',
    originalPrice: 3999,
    discountedPrice: 2999,
    showOnHomePage: false,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'],
    description: 'Elegant floral double bedsheet with 4 matching pillow covers',
    inStock: true,
    rating: 4.4,
    reviews: 92
  },
  {
    id: 'prod-8',
    name: 'Decorative Throw Pillow Set',
    categoryId: 'cat-2',
    subcategoryId: 'sub-6',
    originalPrice: 1499,
    discountedPrice: 1199,
    showOnHomePage: false,
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80'],
    description: 'Set of 4 decorative throw pillows in neutral tones',
    inStock: true,
    rating: 4.3,
    reviews: 56
  }
];

export const customers: Customer[] = [
  { id: 'cust-1', name: 'Yaseen Mehta', email: 'mehtayaseen@gmail.com', phone: '+92 300 1234567', orderCount: 5, joinedDate: '2024-01-15' },
  { id: 'cust-2', name: 'Ayesha Khan', email: 'ayesha@example.com', phone: '+92 321 2345678', orderCount: 3, joinedDate: '2024-02-20' },
  { id: 'cust-3', name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '+92 333 3456789', orderCount: 8, joinedDate: '2023-11-10' },
  { id: 'cust-4', name: 'Fatima Zahra', email: 'fatima@example.com', phone: '+92 345 4567890', orderCount: 2, joinedDate: '2024-03-05' },
  { id: 'cust-5', name: 'Hassan Raza', email: 'hassan@example.com', phone: '+92 300 5678901', orderCount: 6, joinedDate: '2023-12-22' }
];

export const orders: Order[] = [
  {
    id: 'ord-1',
    customerId: 'cust-1',
    customerName: 'Yaseen Mehta',
    products: [{ productId: 'prod-1', quantity: 1, price: 3499 }],
    total: 3499,
    status: 'delivered',
    orderDate: '2024-03-10',
    address: '123 Main Street, Karachi'
  },
  {
    id: 'ord-2',
    customerId: 'cust-2',
    customerName: 'Ayesha Khan',
    products: [{ productId: 'prod-2', quantity: 2, price: 1499 }, { productId: 'prod-3', quantity: 1, price: 2799 }],
    total: 5797,
    status: 'shipped',
    orderDate: '2024-03-12',
    address: '456 Garden Road, Lahore'
  },
  {
    id: 'ord-3',
    customerId: 'cust-3',
    customerName: 'Ahmed Ali',
    products: [{ productId: 'prod-4', quantity: 1, price: 6999 }],
    total: 6999,
    status: 'pending',
    orderDate: '2024-03-14',
    address: '789 Business Center, Islamabad'
  },
  {
    id: 'ord-4',
    customerId: 'cust-4',
    customerName: 'Fatima Zahra',
    products: [{ productId: 'prod-5', quantity: 2, price: 2299 }],
    total: 4598,
    status: 'delivered',
    orderDate: '2024-03-08',
    address: '321 Peace Avenue, Faisalabad'
  },
  {
    id: 'ord-5',
    customerId: 'cust-5',
    customerName: 'Hassan Raza',
    products: [{ productId: 'prod-6', quantity: 5, price: 699 }],
    total: 3495,
    status: 'cancelled',
    orderDate: '2024-03-06',
    address: '654 Industrial Area, Multan'
  }
];

// Analytics Data
export const analyticsData = {
  totalRevenue: 156780,
  totalOrders: 342,
  totalCustomers: 156,
  totalProducts: 48,
  wishlistCount: 89,
  monthlyRevenue: [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 18200 },
    { month: 'Apr', revenue: 14600 },
    { month: 'May', revenue: 21300 },
    { month: 'Jun', revenue: 19400 }
  ],
  topProducts: [
    { name: 'King Bedsheet Set', sales: 45 },
    { name: 'Memory Foam Pillow', sales: 38 },
    { name: 'Velvet Curtains', sales: 32 },
    { name: 'Silk Quilt', sales: 28 },
    { name: 'Linen Fabric', sales: 24 }
  ],
  ordersByStatus: {
    pending: 23,
    shipped: 45,
    delivered: 256,
    cancelled: 18
  }
};
