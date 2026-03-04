# Architecture & Data Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FABRIC HAVEN ECOMMERCE                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                          │
│                     fabric-haven-desk (Vite)                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React Components / Pages                   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • Home.tsx      • Products.tsx    • Categories.tsx      │    │
│  │ • Cart.tsx      • Checkout.tsx    • ProductDetail.tsx   │    │
│  │ • AuthModal.tsx • Profile.tsx     • Admin Pages         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            React Contexts (State Management)            │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • AuthContext    (User, Login, Logout)                 │    │
│  │ • CartContext    (Cart Items, Quantities)              │    │
│  │ • WishlistContext (Wishlist Items)                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │          API Service Layer (src/services/api.ts)        │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ authAPI       • productAPI      • categoryAPI           │    │
│  │ cartAPI       • orderAPI        • subcategoryAPI        │    │
│  │                                                         │    │
│  │  Features:                                             │    │
│  │  ✓ Auto JWT token injection                            │    │
│  │  ✓ Error handling                                      │    │
│  │  ✓ Request/Response mapping                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Fetch API / HTTP Requests                  │    │
│  │                                                         │    │
│  │  Authorization: Bearer {JWT Token}                     │    │
│  │  Content-Type: application/json                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│                    CORS Enabled • Port 3000                      │
└──────────────────────────────────────────────────────────────────┘
                              ↕
            HTTP Requests / Responses (REST API)
                              ↕
┌──────────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js/Express)                     │
│                      server (Port 5000)                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Express Server                        │    │
│  │              (CORS Enabled, API Running)                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Route Handlers (30+)                    │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ /api/auth/*         → authRoutes.js                     │    │
│  │ /api/products/*     → productRoutes.js                  │    │
│  │ /api/categories/*   → categoryRoutes.js                 │    │
│  │ /api/cart/*         → cartRoutes.js                     │    │
│  │ /api/create-order   → orderRoutes.js                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Controllers (Business Logic)               │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • authController.js      • productController.js         │    │
│  │ • cartController.js      • orderController.js           │    │
│  │ • categoryController.js                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Middleware (Auth, Validation, Error)          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • authMiddleware.js  (JWT Validation)                   │    │
│  │ • errorMiddleware.js (Error Handling)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Models (Database Schema)                    │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • userModel.js       • productModel.js                  │    │
│  │ • cartModel.js       • orderModel.js                    │    │
│  │ • categoryModel.js   • subcategoryModel.js              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            MongoDB Connection (Mongoose)                │    │
│  │                                                         │    │
│  │  Database: zm-home-fabrics                             │    │
│  │  URL: mongodb+srv://...                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                  ┌───────────────────────┐
                  │      MongoDB          │
                  │    Database           │
                  ├───────────────────────┤
                  │ Collections:          │
                  │ • users               │
                  │ • products            │
                  │ • categories          │
                  │ • subcategories       │
                  │ • carts               │
                  │ • orders              │
                  └───────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

1. LOGIN
   ┌──────────┐                                           ┌──────────┐
   │ User     │                                           │ Browser  │
   │ Clicks   │ ──(Login)──> AuthModal.tsx               │localStorage
   │ Sign In  │                     ↓                     └──────────┘
   └──────────┘           Form Fields Filled                  ↑
                                  ↓                           │
                        authAPI.login(data)                   │
                                  ↓                           │
                    ┌─────────────────────────┐               │
                    │  POST /api/auth/login   │               │
                    │  Headers: JSON          │               │
                    │  Body: {email, pwd}     │               │
                    └─────────────────────────┘               │
                                  ↓                           │
                ┌─────────────────────────────────┐           │
                │       Backend Processing         │           │
                ├─────────────────────────────────┤           │
                │ 1. Validate input               │           │
                │ 2. Hash password comparison     │           │
                │ 3. Generate JWT token           │           │
                │ 4. Return user + token          │           │
                └─────────────────────────────────┘           │
                                  ↓                           │
                    ┌─────────────────────────┐               │
                    │   Response 200 OK       │               │
                    │   {                     │               │
                    │     user: {...},        │               │
                    │     token: "jwt..."     │               │
                    │   }                     │               │
                    └─────────────────────────┘               │
                                  ↓                           │
                        AuthContext.tsx                       │
                        setUser(user)                          │
                        Save Token ──────────────────────────→
                                  ↓                           │
                        setShowAuthModal(false)                │
                        Navigate to Home                       │
                                  ↓
                    ┌─────────────────────────┐
                    │   User Logged In!       │
                    │ • Token in localStorage │
                    │ • User in Context       │
                    │ • Protected routes ok   │
                    └─────────────────────────┘

2. AUTOMATIC TOKEN INJECTION
   ┌──────────────────────────────────────────┐
   │  Every API Request:                      │
   │                                          │
   │  GET token = localStorage.authToken      │
   │  ↓                                        │
   │  Add to headers:                         │
   │  "Authorization": "Bearer " + token      │
   │  ↓                                        │
   │  Backend validates token                 │
   │  ↓                                        │
   │  If valid → Allow request                │
   │  If invalid → Return 401 Unauthorized    │
   └──────────────────────────────────────────┘

3. LOGOUT
   ┌──────────┐         ┌─────────────────────────┐         ┌──────────┐
   │ User     │         │  POST /api/auth/logout  │         │Browser   │
   │ Clicks   │────────→│  Headers: JWT Token     │────────→│localStorage
   │ Logout   │         └─────────────────────────┘         └──────────┘
   └──────────┘                  ↓                                ↓
                        Backend deletes session         Clear authToken
                        (if stored server-side)         Clear user data
                                                               ↓
                                                    ┌─────────────────────┐
                                                    │ User Logged Out!     │
                                                    │ Redirected to Home   │
                                                    │ Protected routes now │
                                                    │ redirect to login    │
                                                    └─────────────────────┘
```

---

## Product Browsing Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PRODUCT BROWSING FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

1. LOAD PRODUCTS PAGE
   ┌──────────────┐
   │ User visits  │
   │ /products    │
   └──────────────┘
            ↓
   Products.tsx mounted
            ↓
   useEffect runs
            ↓
   ┌─────────────────────────────────────────┐
   │ Multiple API Calls (Parallel):          │
   │ • productAPI.getAll(params)             │
   │ • categoryAPI.getAll()                  │
   │ • subcategoryAPI.getAll()               │
   └─────────────────────────────────────────┘
            ↓
   ┌─────────────────────────────────────────┐
   │  Backend Processing:                    │
   │ • Query MongoDB for products            │
   │ • Apply filters (category, search)      │
   │ • Apply pagination                      │
   │ • Return results with total count       │
   └─────────────────────────────────────────┘
            ↓
   ┌──────────────────────────────────────┐
   │ Format Conversion:                   │
   │ Backend: {title, price, ...}         │
   │ Frontend: {name, discountedPrice, ...} │
   └──────────────────────────────────────┘
            ↓
   Display Products Grid
            ↓
   Show Categories Dropdown
            ↓
   Show Filters & Search

2. USER APPLIES FILTERS
   ┌──────────────────┐
   │ User selects:    │
   │ • Category       │
   │ • Subcategory    │
   │ • Sort option    │
   │ • Search term    │
   └──────────────────┘
            ↓
   useEffect triggered
            ↓
   productAPI.getAll({
     category: "cat-id",
     subcategory: "subcat-id",
     q: "search term",
     sort: "price-low"
   })
            ↓
   Backend applies filters
            ↓
   Frontend applies secondary filters
            ↓
   Grid updates with new products
            ↓
   User sees filtered results

3. USER VIEWS PRODUCT DETAILS
   ┌──────────────┐
   │ User clicks  │
   │ on product   │
   └──────────────┘
            ↓
   ProductDetail.tsx mounted
            ↓
   useEffect runs
            ↓
   productAPI.getById(productId)
            ↓
   Backend returns product details
            ↓
   Display:
   • Images (gallery)
   • Title & price
   • Description
   • Ratings & reviews
   • Stock status
   • Add to cart button
```

---

## Shopping Cart Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SHOPPING CART FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

1. USER LOGIN (Cart requires authentication)
   ┌────────────┐
   │ Login page │
   └────────────┘
         ↓
   authAPI.login()
         ↓
   AuthContext updated with user
         ↓
   cartAPI.getCart() called
         ↓
   Load user's existing cart from database
         ↓
   CartContext state populated
         ↓
   ┌──────────────────────────┐
   │ User ready for shopping  │
   └──────────────────────────┘

2. ADD ITEM TO CART
   ┌──────────────────┐
   │ User clicks      │
   │ "Add to Cart"    │
   └──────────────────┘
         ↓
   Check if authenticated
   (If not → show login modal)
         ↓
   cartAPI.addItem({
     productId: "123",
     quantity: 1
   })
         ↓
   ┌────────────────────────────────────┐
   │ Backend:                           │
   │ 1. Validate user (JWT)             │
   │ 2. Check product exists & stock    │
   │ 3. Check if item already in cart   │
   │ 4. If exists → increment quantity  │
   │ 5. If new → create cart item       │
   │ 6. Save to MongoDB                 │
   │ 7. Return updated cart             │
   └────────────────────────────────────┘
         ↓
   Frontend updates local state
         ↓
   Show toast: "Added to cart"
         ↓
   Update cart count in navbar

3. VIEW CART
   ┌─────────────────┐
   │ User clicks     │
   │ Cart icon/page  │
   └─────────────────┘
         ↓
   Cart.tsx rendered
   (Shows items from CartContext state)
         ↓
   Display:
   • Product image, name, price
   • Quantity input
   • Subtotal per item
   • Total price
   • Remove button

4. MODIFY QUANTITY
   ┌──────────────┐
   │ User changes │
   │ quantity     │
   └──────────────┘
         ↓
   cartAPI.updateItem(itemId, {qty})
         ↓
   Backend updates quantity in DB
         ↓
   Frontend updates local state
         ↓
   Totals recalculate
         ↓
   UI updates in real-time

5. REMOVE ITEM
   ┌──────────────┐
   │ User clicks  │
   │ Remove/trash │
   └──────────────┘
         ↓
   cartAPI.deleteItem(itemId)
         ↓
   Backend deletes from cart
         ↓
   Frontend removes from state
         ↓
   Cart updates
         ↓
   Item count decreases

6. PROCEED TO CHECKOUT
   ┌───────────────┐
   │ User clicks   │
   │ Checkout      │
   └───────────────┘
         ↓
   Checkout.tsx mounted
         ↓
   Display order summary
   Display shipping form
   Display payment options
         ↓
   User fills details:
   • Name, email, phone
   • Address, city, state, zip
         ↓
   User submits order
         ↓
   orderAPI.create({
     products: [{productId, qty, price}],
     total: price,
     shippingAddress: {...}
   })
```

---

## Order Creation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ORDER CREATION FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

1. FORM SUBMISSION
   ┌──────────────────────────┐
   │ Checkout.tsx             │
   │ handleSubmit() called     │
   └──────────────────────────┘
         ↓
   Validate all form fields
   (All required for submission)
         ↓
   Build order object:
   {
     products: [
       {productId, quantity, price},
       {productId, quantity, price}
     ],
     total: 5000,
     shippingAddress: {
       name: "John Doe",
       email: "john@example.com",
       phone: "+923001234567",
       street: "123 Main St",
       city: "Karachi",
       state: "Sindh",
       zipCode: "75500"
     }
   }
         ↓

2. API CALL
   POST /api/create-order
         ↓
   Headers: {
     Authorization: "Bearer TOKEN",
     Content-Type: "application/json"
   }
         ↓
   Body: Order data (above)
         ↓

3. BACKEND PROCESSING
   ┌─────────────────────────────────────┐
   │ 1. Validate JWT token               │
   │ 2. Verify user exists               │
   │ 3. Validate all order items exist   │
   │ 4. Check product stock              │
   │ 5. Create order in database         │
   │ 6. Save shipping address            │
   │ 7. Optionally decrease stock        │
   │ 8. Return order ID & confirmation   │
   └─────────────────────────────────────┘
         ↓

4. RESPONSE HANDLING
   ┌──────────────────────┐
   │ Success (200 OK)     │
   │ {                    │
   │   orderId: "123",    │
   │   message: "..."     │
   │ }                    │
   └──────────────────────┘
         ↓
   Frontend:
   • Show success message
   • Clear cart (cartAPI.clearCart())
   • Clear local cart state
   • Delete from localStorage
   • Show order confirmation
   • Redirect to home page
         ↓
   ┌────────────────────┐
   │ ORDER CREATED!     │
   │ Stored in Database │
   └────────────────────┘

   ┌──────────────────────┐
   │ Error Response       │
   │ (4xx, 5xx)          │
   └──────────────────────┘
         ↓
   Frontend:
   • Show error message
   • Keep cart intact
   • Allow user to retry
   • Log error for debugging

5. DATABASE STORAGE
   MongoDB Collections:
   
   orders collection:
   {
     _id: ObjectId,
     userId: "user-123",
     products: [
       {productId, quantity, price}
     ],
     total: 5000,
     shippingAddress: {...},
     status: "pending",
     createdAt: timestamp
   }
   
   carts collection:
   {
     _id: ObjectId,
     userId: "user-123",
     items: []  ← CLEARED after order
   }
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

API Call Issues:
   
   ┌────────────────────────────────────┐
   │ Try to fetch from API              │
   └────────────────────────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │ Possible Errors:                         │
   │ • Network error (no connection)          │
   │ • 401 Unauthorized (invalid token)       │
   │ • 403 Forbidden (no permission)          │
   │ • 404 Not Found (resource missing)       │
   │ • 500 Server error (backend issue)       │
   │ • Timeout (slow network)                 │
   └──────────────────────────────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │ Error Caught by:                         │
   │ • try/catch in component                 │
   │ • API service error handler              │
   │ • Backend error middleware               │
   └──────────────────────────────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │ Handled By:                              │
   │ • Log to console for debugging           │
   │ • Show toast notification to user        │
   │ • Fallback to mock data (if available)   │
   │ • Set error state in component           │
   └──────────────────────────────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │ User Sees:                               │
   │ • "Error loading products. Try again"    │
   │ • "Network error. Check your connection" │
   │ • "Failed to add to cart"                │
   │ • Clear error messages (no tech jargon)  │
   └──────────────────────────────────────────┘
         ↓
   ┌──────────────────────────────────────────┐
   │ Fallback Options:                        │
   │ • Use cached data                        │
   │ • Show mock data                         │
   │ • Keep previous UI state                 │
   │ • Offer retry button                     │
   └──────────────────────────────────────────┘
```

---

## Component Communication

```
┌──────────────────────────────────────────────────────────────────┐
│              COMPONENT & CONTEXT COMMUNICATION                   │
└──────────────────────────────────────────────────────────────────┘

App.tsx (Root)
│
├─ AuthContext.Provider
│  │
│  ├─ AuthModal.tsx
│  │  └─ Uses: useAuth()
│  │     - login(), signup(), logout()
│  │
│  ├─ NavBar.tsx
│  │  └─ Uses: useAuth()
│  │     - Show user name, logout button
│  │
│  └─ ProtectedRoute.tsx
│     └─ Uses: useAuth()
│        - Redirect if not authenticated
│
├─ CartContext.Provider
│  │
│  ├─ ProductCard.tsx
│  │  └─ Uses: useCart()
│  │     - addToCart()
│  │
│  ├─ Cart.tsx
│  │  └─ Uses: useCart()
│  │     - Display items, update quantity, remove items
│  │
│  └─ Checkout.tsx
│     └─ Uses: useCart()
│        - Display order summary, create order
│
├─ Pages
│  ├─ Home.tsx
│  │  └─ API: productAPI.getAll(), categoryAPI.getAll()
│  │
│  ├─ Products.tsx
│  │  └─ API: productAPI.getAll(), categoryAPI.getAll()
│  │
│  ├─ Categories.tsx
│  │  └─ API: categoryAPI.getAll()
│  │
│  ├─ ProductDetail.tsx
│  │  └─ API: productAPI.getById()
│  │
│  ├─ Cart.tsx
│  │  └─ Context: CartContext
│  │
│  ├─ Checkout.tsx
│  │  └─ API: orderAPI.create()
│  │
│  └─ Profile.tsx
│     └─ API: authAPI.getProfile() [to implement]
│
└─ api.ts (Services)
   ├─ authAPI
   ├─ productAPI
   ├─ categoryAPI
   ├─ cartAPI
   ├─ orderAPI
   └─ subcategoryAPI
```

---

## Data Persistence

```
┌─────────────────────────────────────────────────────────────┐
│           DATA PERSISTENCE ACROSS PAGE REFRESH              │
└─────────────────────────────────────────────────────────────┘

Local Storage (Browser)
│
├─ authToken (JWT)
│  └─ Persisted from: localStorage.setItem('authToken', token)
│  └─ Used by: API service (auto-included in requests)
│  └─ Cleared by: logout()
│
└─ user (User data)
   └─ Persisted from: localStorage.setItem('user', JSON.stringify(user))
   └─ Loaded by: AuthContext useEffect on mount
   └─ Cleared by: logout()

Database (MongoDB)
│
├─ User Cart
│  └─ Loaded on login: cartAPI.getCart()
│  └─ Updated on action: cartAPI.addItem(), updateItem(), deleteItem()
│  └─ Persisted permanently
│  └─ Synced with frontend state
│
├─ Orders
│  └─ Created on checkout: orderAPI.create()
│  └─ Stored permanently in database
│  └─ Retrieved on user profile
│
├─ Products
│  └─ Fetched: productAPI.getAll()
│  └─ Not cached by frontend (always fresh from DB)
│
├─ Categories
│  └─ Fetched: categoryAPI.getAll()
│  └─ Could be cached for better performance
│
└─ Users
   └─ Created on signup: authAPI.register()
   └─ Fetched on login: authAPI.login()
   └─ Verified on protected routes

Flow on Page Refresh:

Before Refresh:
  ┌───────────────┐
  │ User logged   │
  │ in, has cart  │
  │ items, token  │
  │ in memory     │
  └───────────────┘
         ↓
       REFRESH
         ↓
After Refresh:
  ┌──────────────────────────────────────────────────┐
  │ 1. App mounted                                   │
  │ 2. AuthContext useEffect runs                    │
  │ 3. Checks localStorage for token & user         │
  │ 4. If found → setUser(user) from localStorage   │
  │ 5. CartContext useEffect runs                    │
  │ 6. If isAuthenticated → cartAPI.getCart()       │
  │ 7. Fetches cart from database                   │
  │ 8. Restores cart items to React state           │
  │ 9. User sees same cart as before refresh        │
  └──────────────────────────────────────────────────┘
         ↓
  ┌────────────────────────────────┐
  │ User is logged in              │
  │ Cart items are loaded          │
  │ Session seamlessly restored    │
  └────────────────────────────────┘
```

---

## Token Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                      JWT TOKEN FLOW                                │
└────────────────────────────────────────────────────────────────────┘

LOGIN/REGISTER:

  User Credentials
       ↓
  POST /api/auth/login or register
       ↓
  Backend Verification
       ↓
  JWT Token Generated
       ↓
  Response: {user, token}
       ↓
  localStorage.setItem('authToken', token)
       ↓
  Token stored in browser


PROTECTED API CALLS:

  Frontend making request
       ↓
  API Service (api.ts)
       ↓
  getToken() from localStorage
       ↓
  Add to headers:
  {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
       ↓
  Fetch request sent
       ↓
  Backend receives request
       ↓
  authMiddleware checks:
  1. Token exists?
  2. Token valid?
  3. Token not expired?
       ↓
  Yes → Allow request → Execute endpoint
  No  → Return 401 Unauthorized
       ↓
  Response sent back


LOGOUT:

  User clicks Logout
       ↓
  authAPI.logout() called
       ↓
  localStorage.removeItem('authToken')
       ↓
  localStorage.removeItem('user')
       ↓
  setUser(null)
       ↓
  isAuthenticated = false
       ↓
  Protected routes redirect to login
       ↓
  Future API calls won't have token
       ↓
  Backend returns 401 if token-protected


TOKEN STRUCTURE (JWT):

  {
    header: {type: "JWT", alg: "HS256"},
    payload: {
      userId: "123",
      role: "user",
      iat: 1234567890,      // issued at
      exp: 1234567890 + 7d   // expires in 7 days
    },
    signature: "encoded..."
  }
  
  Encoded as: xxxxx.yyyyy.zzzzz
  
  Stored in localStorage as:
  localStorage.authToken = "xxxxx.yyyyy.zzzzz"
```

These diagrams show how all components work together to create
a seamless frontend-backend integration with proper authentication,
data persistence, and error handling.
