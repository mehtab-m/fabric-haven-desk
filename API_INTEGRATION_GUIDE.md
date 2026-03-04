# Frontend-Backend API Integration Guide

## Overview
This document explains how the frontend (`fabric-haven-desk`) connects to the backend server and all the API endpoints that are now being used.

## Backend Server Configuration
- **Base URL**: `http://localhost:5000/api`
- **Environment Variable**: `VITE_API_URL` (in `.env.local`)

## Architecture

### API Service Layer (`src/services/api.ts`)
A centralized API service module handles all HTTP requests to the backend. This provides:
- Automatic token management (JWT)
- Consistent error handling
- Request/response mapping between frontend and backend formats

### Context + API Integration
All contexts (Auth, Cart) now use the API service to make real requests to the backend instead of using mock data locally.

---

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
**Frontend**: `authAPI.register(data)`
```typescript
// Request
{
  name: string;
  email: string;
  password: string;
}

// Response
{
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
  token: string;
}
```
**Usage**: `AuthContext.signup()` → User registration

---

#### POST `/api/auth/login`
**Frontend**: `authAPI.login(data)`
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
  token: string;
}
```
**Usage**: `AuthContext.login()` → User login

---

#### GET `/api/auth/me`
**Frontend**: `authAPI.getProfile()`
**Auth Required**: Bearer Token
**Response**: `{ user: { id, name, email, role } }`
**Usage**: Retrieve authenticated user profile

---

#### POST `/api/auth/logout`
**Frontend**: `authAPI.logout()`
**Auth Required**: Bearer Token
**Usage**: `AuthContext.logout()` → User logout

---

#### POST `/api/auth/forgot-password`
**Frontend**: `authAPI.forgotPassword(data)`
```typescript
// Request
{
  email: string;
}

// Response
{
  message: string;
}
```

---

#### POST `/api/auth/verify-pin`
**Frontend**: `authAPI.verifyPin(data)`
```typescript
// Request
{
  email: string;
  pin: string;
}

// Response
{
  verified: boolean;
}
```

---

#### POST `/api/auth/reset-password`
**Frontend**: `authAPI.resetPassword(data)`
```typescript
// Request
{
  email: string;
  newPassword: string;
  pin: string;
}

// Response
{
  message: string;
}
```

---

### Products (`/api/products`)

#### GET `/api/products`
**Frontend**: `productAPI.getAll(params?)`
```typescript
// Query Parameters (all optional)
{
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  q?: string;          // Search query
  sort?: string;       // Sort by field
}

// Response
{
  items: [
    {
      id: string;
      title: string;
      slug: string;
      price: number;
      images: string[];
      categoryId: string;
      subcategoryId: string;
      description: string;
      stock: number;
    }
  ];
  total: number;
}
```
**Usage**: Pages: `Products.tsx`, `Home.tsx` (featured products), `CategoryPage.tsx`

---

#### GET `/api/products/:id`
**Frontend**: `productAPI.getById(id)`
```typescript
// Response
{
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: { id, name };
  subcategory: { id, name };
  details: object;
  stock: number;
}
```
**Usage**: `ProductDetail.tsx` page

---

#### POST `/api/products`
**Frontend**: `productAPI.create(data)`
**Auth Required**: Bearer Token (Admin only)
```typescript
// Request
{
  title: string;
  slug?: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
  images: string[];
  description: string;
  stock: number;
}

// Response
{
  product: { id, title, price, ... };
}
```
**Usage**: Admin Dashboard - Add Product

---

#### PUT `/api/products/:id`
**Frontend**: `productAPI.update(id, data)`
**Auth Required**: Bearer Token (Admin only)
```typescript
// Request
{
  // Partial product fields
  title?: string;
  price?: number;
  stock?: number;
  ...
}

// Response
{
  product: { ... };
}
```
**Usage**: Admin Dashboard - Edit Product

---

#### DELETE `/api/products/:id`
**Frontend**: `productAPI.delete(id)`
**Auth Required**: Bearer Token (Admin only)
**Response**: `{ success: true }`
**Usage**: Admin Dashboard - Delete Product

---

### Categories (`/api/categories`)

#### GET `/api/categories`
**Frontend**: `categoryAPI.getAll()`
```typescript
// Response
[
  {
    id: string;
    name: string;
    slug: string;
    image: string;
  }
]
```
**Usage**: Pages: `Categories.tsx`, `Home.tsx`, `Products.tsx` (filter dropdown)

---

#### GET `/api/categories/:id`
**Frontend**: `categoryAPI.getById(id)`
```typescript
// Response
{
  id: string;
  name: string;
  subcategories: [
    { id: string; name: string }
  ];
}
```

---

#### POST `/api/categories`
**Frontend**: `categoryAPI.create(data)`
**Auth Required**: Bearer Token (Admin only)
```typescript
// Request
{
  name: string;
  slug?: string;
  image: string;
}
```

---

#### PUT `/api/categories/:id`
**Frontend**: `categoryAPI.update(id, data)`
**Auth Required**: Bearer Token (Admin only)

---

#### DELETE `/api/categories/:id`
**Frontend**: `categoryAPI.delete(id)`
**Auth Required**: Bearer Token (Admin only)

---

### Subcategories (`/api/subcategories`)

#### GET `/api/subcategories`
**Frontend**: `subcategoryAPI.getAll()`
```typescript
// Response
[
  {
    id: string;
    name: string;
    categoryId: string;
  }
]
```
**Usage**: Pages: `Products.tsx` (subcategory filters)

---

#### POST `/api/subcategories`
**Frontend**: `subcategoryAPI.create(data)`
**Auth Required**: Bearer Token (Admin only)
```typescript
// Request
{
  name: string;
  categoryId: string;
}
```

---

#### PUT `/api/subcategories/:id`
**Frontend**: `subcategoryAPI.update(id, data)`
**Auth Required**: Bearer Token (Admin only)

---

#### DELETE `/api/subcategories/:id`
**Frontend**: `subcategoryAPI.delete(id)`
**Auth Required**: Bearer Token (Admin only)

---

### Cart (`/api/cart`)

#### GET `/api/cart`
**Frontend**: `cartAPI.getCart()`
**Auth Required**: Bearer Token
```typescript
// Response
{
  items: [
    {
      id: string;
      productId: string;
      quantity: number;
      price: number;
      title: string;
      image: string;
    }
  ];
  subtotal: number;
}
```
**Usage**: `CartContext.loadCart()` → Load cart on login

---

#### POST `/api/cart`
**Frontend**: `cartAPI.addItem(data)`
**Auth Required**: Bearer Token
```typescript
// Request
{
  productId: string;
  quantity: number;
}

// Response
{
  id: string;
  cart: { ... };
}
```
**Usage**: `CartContext.addToCart()` → Add product to cart

---

#### PUT `/api/cart/items/:itemId`
**Frontend**: `cartAPI.updateItem(itemId, data)`
**Auth Required**: Bearer Token
```typescript
// Request
{
  quantity: number;
}

// Response
{
  cart: { ... };
}
```
**Usage**: `CartContext.updateQuantity()` → Update item quantity

---

#### DELETE `/api/cart/items/:itemId`
**Frontend**: `cartAPI.deleteItem(itemId)`
**Auth Required**: Bearer Token
**Response**: `{ success: true }`
**Usage**: `CartContext.removeFromCart()` → Remove item from cart

---

### Orders (`/api/`)

#### POST `/api/create-order`
**Frontend**: `orderAPI.create(data)`
**Auth Required**: Bearer Token
```typescript
// Request
{
  products: [
    {
      productId: string;
      quantity: number;
      price: number;
    }
  ];
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
  };
}

// Response
{
  orderId: string;
  message: string;
}
```
**Usage**: `Checkout.tsx` → Create order

---

#### GET `/api/:id`
**Frontend**: `orderAPI.getById(id)`
**Auth Required**: Bearer Token
**Response**: Order details

---

#### GET `/api/`
**Frontend**: `orderAPI.getAll()`
**Auth Required**: Bearer Token
**Response**: List of user's orders

---

## Updated Pages & Components

### Pages Using API

| Page | API Calls | Purpose |
|------|-----------|---------|
| `Home.tsx` | `productAPI.getAll()`, `categoryAPI.getAll()` | Load featured products and categories |
| `Products.tsx` | `productAPI.getAll()`, `categoryAPI.getAll()`, `subcategoryAPI.getAll()` | Load and filter products |
| `Categories.tsx` | `categoryAPI.getAll()` | Display all categories |
| `Cart.tsx` | Uses `CartContext` | Manage cart items |
| `Checkout.tsx` | `orderAPI.create()` | Create new order |
| `ProductDetail.tsx` | `productAPI.getById()` | Load product details |

### Contexts Using API

| Context | Methods | Purpose |
|---------|---------|---------|
| `AuthContext` | `login()`, `signup()`, `logout()`, `getProfile()` | User authentication |
| `CartContext` | `addToCart()`, `removeFromCart()`, `updateQuantity()`, `getCart()`, `clearCart()` | Cart management |

---

## Error Handling

All API calls include error handling:
1. **Network Errors**: Caught and shown as toast notifications
2. **API Errors**: Backend error messages are forwarded to user
3. **Fallback**: Mock data is used as fallback for non-critical operations (categories, products)

Example:
```typescript
try {
  const data = await productAPI.getAll();
} catch (error) {
  console.error('Failed to load products:', error);
  // Use mock data or show error message
}
```

---

## Authentication & Token Management

### Token Storage
- **Location**: `localStorage.authToken`
- **User Data**: `localStorage.user`

### Token Usage
- Automatically added to all requests via `Authorization: Bearer {token}` header
- Set after login/signup: `localStorage.setItem('authToken', response.token)`
- Cleared on logout: `localStorage.removeItem('authToken')`

### Protected Routes
Protected routes check `isAuthenticated` from `AuthContext` via `ProtectedRoute.tsx` component

---

## Development Setup

### Backend Requirements
- Node.js with Express server running on `http://localhost:5000`
- MongoDB database for persistence
- Environment variables configured in `.env`

### Frontend Configuration
1. Ensure `.env.local` has:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. Start the backend server:
   ```bash
   cd server
   npm install
   npm start
   # or npm run dev for development with nodemon
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

---

## Testing API Connectivity

### Check Backend Status
```bash
curl http://localhost:5000/
# Should return: "API is running..."
```

### Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test Protected Endpoint
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues & Solutions

### Issue: "Failed to fetch" or CORS errors
**Solution**: Ensure backend has CORS enabled and is running on port 5000

### Issue: 401 Unauthorized on protected routes
**Solution**: Check that token is valid and stored in localStorage

### Issue: API returns 404 for endpoints
**Solution**: Verify backend routes are properly defined in route files

### Issue: Products/Categories show as empty
**Solution**: Backend data might not be seeded. Use mock data fallback is enabled

---

## Migration from Mock Data to Real API

### What Changed:
1. **Removed**: Hardcoded mock data calls in components
2. **Added**: Real API calls through service layer
3. **Updated**: Contexts to use async/await for API calls
4. **Enhanced**: Error handling and loading states

### Backwards Compatibility:
- Mock data is still available as fallback
- Pages gracefully degrade if API is unavailable
- All interfaces remain the same

---

## Future Enhancements

1. **Wishlist API**: Integrate real wishlist endpoints
2. **Search**: Implement server-side search with full-text indexing
3. **Pagination**: Implement proper pagination for products list
4. **Analytics**: Track product views and user behavior
5. **Reviews & Ratings**: Add real review system
6. **Admin Dashboard**: Connect admin pages to backend APIs

---

## Contact & Support
For issues or questions about the API integration, refer to:
- Backend documentation in `server/README.md`
- API endpoint definitions in `server/routes/`
- Controller implementations in `server/controllers/`
