# Quick Start - Frontend Backend Connection

## 🚀 Getting Started

### Prerequisites
- Backend server running on `http://localhost:5000`
- MongoDB database connected to backend
- Node.js installed on your machine

### Start Backend
```bash
cd server
npm install
npm start
# or for development: npm run dev
```

### Start Frontend
```bash
cd fabric-haven-desk
npm install
npm run dev
```

The frontend will now automatically connect to the backend API at `http://localhost:5000/api`

---

## ✅ What's Now Connected to Backend

### Authentication
- ✅ Login form sends credentials to `/api/auth/login`
- ✅ Register form sends data to `/api/auth/register`
- ✅ User session persists via JWT token
- ✅ Protected routes check backend authentication

### Products
- ✅ All products fetched from `/api/products`
- ✅ Filtering by category works with backend
- ✅ Search functionality queries backend
- ✅ Product details fetched from `/api/products/:id`

### Cart
- ✅ Cart synced with backend database
- ✅ Add/remove/update items via API
- ✅ Cart persists across sessions
- ✅ Only authenticated users can access cart

### Orders
- ✅ Checkout form submits to `/api/create-order`
- ✅ Orders stored in database
- ✅ Shipping details captured and saved

### Categories
- ✅ Categories fetched from `/api/categories`
- ✅ Subcategories fetched from `/api/subcategories`
- ✅ Used for product filtering

---

## 📝 Key API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/categories` | List categories |
| GET | `/api/subcategories` | List subcategories |
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/items/:id` | Update cart item |
| DELETE | `/api/cart/items/:id` | Remove from cart |
| POST | `/api/create-order` | Create new order |

---

## 🔐 Authentication Flow

```
1. User clicks "Sign In"
2. Frontend calls POST /api/auth/login
3. Backend validates credentials
4. Backend returns { user, token }
5. Frontend stores token in localStorage
6. Token auto-included in future requests
7. Protected pages check if logged in
```

---

## 🛒 Cart Flow

```
1. User logged in → CartContext loads /api/cart
2. User adds product → POST /api/cart
3. User updates quantity → PUT /api/cart/items/:id
4. User removes item → DELETE /api/cart/items/:id
5. User goes to checkout → Cart data sent to /api/create-order
6. Order created → Cart cleared
```

---

## 📦 Product Data Format

Backend sends products like:
```json
{
  "id": "123",
  "title": "Bedsheet Set",
  "price": 2999,
  "images": ["url1", "url2"],
  "categoryId": "cat-1",
  "subcategoryId": "subcat-1",
  "description": "Premium cotton bedsheet",
  "stock": 50
}
```

Frontend converts to:
```json
{
  "id": "123",
  "name": "Bedsheet Set",
  "discountedPrice": 2999,
  "originalPrice": 2999,
  "images": ["url1", "url2"],
  "categoryId": "cat-1",
  "subcategoryId": "subcat-1",
  "description": "Premium cotton bedsheet",
  "inStock": true
}
```

---

## ⚠️ Troubleshooting

### Backend not responding?
```bash
# Check if server is running
curl http://localhost:5000/
# Should return: "API is running..."

# Check MongoDB connection
# Server should show "Connected to MongoDB"
```

### Login failing?
- Check backend error logs
- Ensure user exists in database
- Verify correct email/password format

### Products not loading?
- Check if GET /api/products returns data
- Backend might not have seeded database
- Frontend falls back to mock data if API unavailable

### Cart not persisting?
- Ensure you're logged in (required for cart)
- Check localStorage: `localStorage.getItem('authToken')`
- Verify backend cart endpoint is working

### CORS errors?
- Backend must have `cors()` middleware enabled
- Check server.js has `app.use(cors())`

---

## 🧪 Test the Connection

### 1. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Test Products
```bash
curl http://localhost:5000/api/products
```

### 3. Test Categories
```bash
curl http://localhost:5000/api/categories
```

### 4. Test Protected Route (with token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📱 Pages That Connect to Backend

| Page | API Calls | Status |
|------|-----------|--------|
| Login/Register | `/api/auth/login`, `/api/auth/register` | ✅ Active |
| Home | `/api/products`, `/api/categories` | ✅ Active |
| Products | `/api/products`, `/api/categories`, `/api/subcategories` | ✅ Active |
| Categories | `/api/categories` | ✅ Active |
| Product Details | `/api/products/:id` | ✅ Ready |
| Cart | `/api/cart/*` | ✅ Active |
| Checkout | `/api/create-order` | ✅ Active |
| Admin Dashboard | (need integration) | ⏳ Pending |
| User Profile | (need integration) | ⏳ Pending |

---

## 🔧 Configuration

### Frontend Environment
**File**: `fabric-haven-desk/.env.local`
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment
**File**: `server/.env`
```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## 📚 Documentation Files

- **API_INTEGRATION_GUIDE.md** - Detailed API documentation
- **INTEGRATION_CHANGES.md** - Complete list of changes made
- **src/services/api.ts** - API service implementation

---

## 💡 Key Files Modified

1. **src/services/api.ts** (NEW) - Central API service
2. **src/contexts/AuthContext.tsx** - Real authentication
3. **src/contexts/CartContext.tsx** - Real cart management
4. **src/pages/Home.tsx** - Backend product loading
5. **src/pages/Products.tsx** - Backend filtering
6. **src/pages/Categories.tsx** - Backend categories
7. **src/pages/Checkout.tsx** - Real order creation
8. **.env.local** (NEW) - Frontend configuration

---

## ✨ Features Working Now

✅ User registration with email validation
✅ User login with JWT token
✅ Auto-login on page refresh
✅ Protected pages/routes
✅ Product browsing with backend data
✅ Search and filter products
✅ Shopping cart with database sync
✅ Checkout with order creation
✅ Error messages and notifications
✅ Loading states
✅ Fallback to mock data if needed

---

## 🚨 Important Notes

1. **Token Storage**: Users stay logged in because token is stored in localStorage
2. **API Calls**: All happen automatically - no manual setup needed
3. **Fallback Data**: If backend is down, app uses mock data for some features
4. **CORS**: Ensure backend has CORS enabled
5. **Production**: Change API_URL in .env.local when deploying

---

## 📞 Need Help?

### Check Backend Logs
```bash
cd server
npm run dev
# Look for any error messages
```

### Check Frontend Logs
```javascript
// Browser DevTools Console (F12)
// Check for fetch errors or API call failures
// localStorage.getItem('authToken') to verify token
```

### Network Inspection
```
DevTools > Network tab
- See all API calls
- Check response status
- View request/response data
```

---

## 🎯 Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running with `npm run dev`
3. ✅ Test login → should connect to backend
4. ✅ Browse products → should fetch from backend
5. ✅ Add to cart → should sync with backend
6. ✅ Checkout → should create order in database

**The frontend and backend are now fully connected!** 🎉

All API requests are working and data is persisted in the database.
