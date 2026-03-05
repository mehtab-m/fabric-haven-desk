// API Service for Backend Communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Utility function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Utility function for API requests
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// Raw upload helper (multipart/form-data, no JSON headers)
const uploadRequest = async <T = any>(
  endpoint: string,
  formData: FormData
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// ===== AUTH ENDPOINTS =====
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  getProfile: () =>
    apiRequest('/auth/me', {
      method: 'GET',
    }),

  forgotPassword: (data: { email: string }) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyPin: (data: { email: string; pin: string }) =>
    apiRequest('/auth/verify-pin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { email: string; newPassword: string; pin: string }) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ===== PRODUCTS ENDPOINTS =====
interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  q?: string;
  sort?: string;
}

export const productAPI = {
  getAll: (params?: ProductsQueryParams) => {
    // Remove undefined/empty params so we don't send "undefined" strings to the backend
    const cleanedParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== undefined && v !== null && v !== '' && v !== ('undefined' as any)
          )
        )
      : undefined;

    const queryString =
      cleanedParams && Object.keys(cleanedParams).length > 0
        ?
          '?' +
          new URLSearchParams(
            Object.entries(cleanedParams).map(([k, v]) => [k, String(v)])
          ).toString()
        : '';
    return apiRequest(`/products${queryString}`, {
      method: 'GET',
    });
  },

  getById: (id: string) =>
    apiRequest(`/products/${id}`, {
      method: 'GET',
    }),

  create: (data: any) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// ===== CATEGORIES ENDPOINTS =====
export const categoryAPI = {
  getAll: () =>
    apiRequest('/categories', {
      method: 'GET',
    }),

  getById: (id: string) =>
    apiRequest(`/categories/${id}`, {
      method: 'GET',
    }),

  create: (data: { name: string; slug?: string; image: string; description?: string }) =>
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

// ===== SUBCATEGORIES ENDPOINTS =====
export const subcategoryAPI = {
  getAll: () =>
    apiRequest('/subcategories', {
      method: 'GET',
    }),

  create: (data: { name: string; categoryId: string }) =>
    apiRequest('/subcategories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/subcategories/${id}`, {
      method: 'DELETE',
    }),
};

// ===== CART ENDPOINTS =====
export const cartAPI = {
  getCart: () =>
    apiRequest('/cart', {
      method: 'GET',
    }),

  addItem: (data: { productId: string; quantity: number }) =>
    apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (itemId: string, data: { quantity: number }) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteItem: (itemId: string) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),
};

// ===== ORDER ENDPOINTS =====
export const orderAPI = {
  create: (data: any) =>
    apiRequest('/orders/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getById: (id: string) =>
    apiRequest(`/orders/${id}`, {
      method: 'GET',
    }),

  getAll: () =>
    apiRequest('/orders', {
      method: 'GET',
    }),

  updateStatus: (id: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') =>
    apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ===== WISHLIST ENDPOINTS =====
export const wishlistAPI = {
  getAll: () =>
    apiRequest('/wishlist', {
      method: 'GET',
    }),

  add: (data: { productId: string }) =>
    apiRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  remove: (productId: string) =>
    apiRequest(`/wishlist/${productId}`, {
      method: 'DELETE',
    }),
};

// ===== ADMIN ENDPOINTS =====
export const adminAPI = {
  getUsers: () =>
    apiRequest('/admin/users', {
      method: 'GET',
    }),

  createUser: (data: { name: string; email: string; phone?: string; password: string; role?: 'user' | 'admin' }) =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ===== UPLOAD ENDPOINTS =====
export const uploadAPI = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return uploadRequest<{ url: string }>('/uploads', formData);
  },
};

export default {
  authAPI,
  productAPI,
  categoryAPI,
  subcategoryAPI,
  cartAPI,
  orderAPI,
  wishlistAPI,
  adminAPI,
  uploadAPI,
};
