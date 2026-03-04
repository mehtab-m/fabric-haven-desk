# Developer Checklist & Implementation Guide

## Pre-Implementation Setup

- [ ] **Clone/Setup Repository**
  ```bash
  cd fabric-haven-desk
  npm install
  
  cd server
  npm install
  ```

- [ ] **Configure Environment**
  - [ ] Frontend: Check `.env.local` has `VITE_API_URL=http://localhost:5000/api`
  - [ ] Backend: Check `server/.env` has:
    - `PORT=5000`
    - `MONGO_URI=your_mongodb_connection`
    - `JWT_SECRET=your_secret_key`
    - `NODE_ENV=development`

- [ ] **Database Setup**
  - [ ] MongoDB connection verified
  - [ ] Collections created (or auto-created by Mongoose)
  - [ ] Test data seeded (optional)

---

## Development Environment

- [ ] **Start Backend Server**
  ```bash
  cd server
  npm run dev  # with nodemon for auto-reload
  ```
  Expected output:
  ```
  Server running on port 5000
  Connected to MongoDB
  ```

- [ ] **Start Frontend Dev Server**
  ```bash
  cd fabric-haven-desk
  npm run dev
  ```
  Expected output:
  ```
  VITE v... ready in ... ms
  ➜  Local:   http://localhost:5173/
  ```

- [ ] **Verify Connection**
  - [ ] Backend: `curl http://localhost:5000/` → "API is running..."
  - [ ] Frontend loads without errors
  - [ ] Console shows no CORS errors

---

## API Integration Testing

### Authentication Endpoints

- [ ] **Register New User**
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123"
    }'
  ```
  Expected: 201 Created with user & token

- [ ] **Login User**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123"
    }'
  ```
  Expected: 200 OK with user & token

- [ ] **Get Profile (Protected)**
  ```bash
  curl http://localhost:5000/api/auth/me \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```
  Expected: 200 OK with user data

- [ ] **Logout**
  ```bash
  curl -X POST http://localhost:5000/api/auth/logout \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```
  Expected: 200 OK

### Product Endpoints

- [ ] **Get All Products**
  ```bash
  curl http://localhost:5000/api/products
  ```
  Expected: 200 OK with products array

- [ ] **Get Products with Filters**
  ```bash
  curl "http://localhost:5000/api/products?category=cat-1&limit=10"
  ```
  Expected: 200 OK with filtered results

- [ ] **Get Single Product**
  ```bash
  curl http://localhost:5000/api/products/PRODUCT_ID
  ```
  Expected: 200 OK with product details

### Category Endpoints

- [ ] **Get All Categories**
  ```bash
  curl http://localhost:5000/api/categories
  ```
  Expected: 200 OK with categories array

- [ ] **Get Category Details**
  ```bash
  curl http://localhost:5000/api/categories/CAT_ID
  ```
  Expected: 200 OK with category & subcategories

### Cart Endpoints

- [ ] **Get Cart (Protected)**
  ```bash
  curl http://localhost:5000/api/cart \
    -H "Authorization: Bearer TOKEN"
  ```
  Expected: 200 OK with cart items

- [ ] **Add to Cart (Protected)**
  ```bash
  curl -X POST http://localhost:5000/api/cart \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"productId":"PROD_ID","quantity":1}'
  ```
  Expected: 200 OK with updated cart

### Order Endpoints

- [ ] **Create Order (Protected)**
  ```bash
  curl -X POST http://localhost:5000/api/create-order \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "products":[{"productId":"123","quantity":1,"price":2999}],
      "total":2999,
      "shippingAddress":{...}
    }'
  ```
  Expected: 200/201 with order ID

---

## Frontend Component Testing

### Auth Flow

- [ ] **Sign Up**
  - [ ] Click "Sign In" button
  - [ ] Switch to "Sign Up" tab
  - [ ] Fill name, email, password
  - [ ] Click "Create Account"
  - [ ] Check: User logged in, token saved
  - [ ] Check localStorage.authToken exists
  - [ ] Refresh page → Still logged in

- [ ] **Sign In**
  - [ ] Click "Sign In"
  - [ ] Enter email & password
  - [ ] Click "Sign In"
  - [ ] Check: User logged in
  - [ ] Check: Can access protected pages

- [ ] **Sign Out**
  - [ ] Click user menu → Logout
  - [ ] Check: localStorage cleared
  - [ ] Check: Redirected to home
  - [ ] Check: Cannot access cart without login

### Product Browsing

- [ ] **Home Page**
  - [ ] Products load from API
  - [ ] Categories display
  - [ ] "Shop Now" button works
  - [ ] No console errors

- [ ] **Products Page**
  - [ ] Products load in grid
  - [ ] Search filters work
  - [ ] Category filter works
  - [ ] Subcategory filter works
  - [ ] Sort by price works
  - [ ] Results update in real-time

- [ ] **Categories Page**
  - [ ] All categories display
  - [ ] Clicking category filters products
  - [ ] Back button works

### Shopping Cart

- [ ] **Add to Cart (Must be logged in)**
  - [ ] Click "Add to Cart" on product
  - [ ] Cart icon updates (shows count)
  - [ ] Go to Cart page
  - [ ] Item appears in cart
  - [ ] Price calculated correctly

- [ ] **View Cart**
  - [ ] Cart page shows all items
  - [ ] Each item shows image, name, price
  - [ ] Subtotal displays correctly
  - [ ] Total price correct

- [ ] **Update Quantity**
  - [ ] Click "+" to increase quantity
  - [ ] Check quantity updates
  - [ ] Check total price updates
  - [ ] API call succeeds (check Network tab)

- [ ] **Remove Item**
  - [ ] Click trash icon
  - [ ] Item removed from cart
  - [ ] Total updated
  - [ ] API call succeeds

- [ ] **Cart Persistence**
  - [ ] Add items to cart
  - [ ] Refresh page
  - [ ] Items still in cart
  - [ ] Open in new tab → Items appear

### Checkout

- [ ] **Checkout Form**
  - [ ] Fill all required fields
  - [ ] Form validates
  - [ ] Error messages show if fields empty

- [ ] **Create Order**
  - [ ] Fill checkout form
  - [ ] Click "Place Order"
  - [ ] See loading state
  - [ ] Order success message
  - [ ] Cart cleared
  - [ ] Redirected to home

- [ ] **Order in Database**
  - [ ] Check MongoDB: order created
  - [ ] Order has correct items
  - [ ] Shipping address saved
  - [ ] Total price correct

---

## Error Handling Testing

### Network Errors

- [ ] **Backend Down**
  - [ ] Stop backend server
  - [ ] Try to load products
  - [ ] See error message
  - [ ] Check fallback to mock data (if available)
  - [ ] No white page / crash

- [ ] **Invalid Token**
  - [ ] Manually delete localStorage.authToken
  - [ ] Try to access cart
  - [ ] Redirected to login
  - [ ] No console errors

### API Error Responses

- [ ] **401 Unauthorized**
  - [ ] Make request without token
  - [ ] See "Unauthorized" error
  - [ ] Prompt to login

- [ ] **400 Bad Request**
  - [ ] Submit form with invalid data
  - [ ] See validation error message
  - [ ] Can retry with correct data

- [ ] **404 Not Found**
  - [ ] Try to access non-existent product
  - [ ] See error message
  - [ ] Redirect to products list

---

## Performance Testing

- [ ] **API Response Times**
  - [ ] Products load in < 1s
  - [ ] Categories load in < 1s
  - [ ] Cart operations < 500ms
  - [ ] Check Network tab in DevTools

- [ ] **Loading States**
  - [ ] Loading spinners show
  - [ ] UI doesn't freeze
  - [ ] User can cancel operations

- [ ] **Data Mapping**
  - [ ] Backend format → Frontend format correct
  - [ ] No data loss in conversion
  - [ ] All fields display correctly

---

## Browser DevTools Inspection

### Console
- [ ] No red errors in console
- [ ] No warnings about missing props
- [ ] No CORS errors
- [ ] API calls logged cleanly

### Network Tab
- [ ] All API requests showing
- [ ] Status codes correct (200, 201, etc.)
- [ ] Request/response payloads valid JSON
- [ ] Authorization header present
- [ ] Response times reasonable

### Local Storage
- [ ] `authToken` exists when logged in
- [ ] `user` JSON valid
- [ ] Both cleared on logout
- [ ] Values match what backend returns

### Application Tab (Storage)
- [ ] localStorage values persistent
- [ ] Can see authToken & user
- [ ] No sensitive data exposed

---

## Database Inspection

### MongoDB

- [ ] **Check Collections**
  ```bash
  # In MongoDB Atlas or local MongoDB
  use zm-home-fabrics
  db.users.find()
  db.products.find()
  db.carts.find()
  db.orders.find()
  ```

- [ ] **Users Collection**
  - [ ] New users appear after signup
  - [ ] Password hashed (not plain text)
  - [ ] Role field set correctly

- [ ] **Products Collection**
  - [ ] Products have required fields
  - [ ] Images are arrays
  - [ ] Prices are numbers

- [ ] **Carts Collection**
  - [ ] Carts created for logged-in users
  - [ ] Items array has correct structure
  - [ ] Updates when adding/removing items

- [ ] **Orders Collection**
  - [ ] Orders created on checkout
  - [ ] Has all shipping details
  - [ ] Total price saved
  - [ ] Status field present

---

## Common Issues & Fixes

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- [ ] Ensure backend has `app.use(cors())`
- [ ] Check server.js for CORS middleware
- [ ] Restart backend server

### Issue: 401 Unauthorized on Cart
```
Cannot GET /api/cart 401 Unauthorized
```
**Solution:**
- [ ] User not logged in? → Login first
- [ ] Token expired? → Login again
- [ ] Token not sent? → Check Authorization header in Network tab

### Issue: Products Show Empty
```
No products displayed on Products page
```
**Solution:**
- [ ] Check MongoDB has products
- [ ] Seed database with test data
- [ ] Check API returns data: `curl http://localhost:5000/api/products`
- [ ] Check console for fetch errors

### Issue: Cart Not Persisting
```
Cart empty after page refresh
```
**Solution:**
- [ ] Must be logged in (cart requires auth)
- [ ] Check token in localStorage
- [ ] Check Network tab for cart API call
- [ ] Verify backend cart endpoint works

### Issue: Login Fails
```
Login form submission fails
```
**Solution:**
- [ ] Check backend is running
- [ ] Verify user exists in database
- [ ] Check password is correct
- [ ] Look for error message in console

---

## Deployment Checklist

### Before Going Live

- [ ] All endpoints tested and working
- [ ] Error handling implemented
- [ ] Loading states visible
- [ ] Forms validate input
- [ ] No console errors or warnings
- [ ] No hardcoded localhost URLs
- [ ] Environment variables configured
- [ ] Database backups setup
- [ ] SSL/HTTPS enabled
- [ ] CORS configured for production URL
- [ ] Rate limiting enabled
- [ ] Input validation on backend
- [ ] Password hashing enabled
- [ ] JWT token expiration set
- [ ] Error logging enabled
- [ ] Performance optimized

### Production Configuration

- [ ] Update `VITE_API_URL` to production backend
- [ ] Update backend `NODE_ENV` to production
- [ ] Configure database connection string
- [ ] Set strong `JWT_SECRET`
- [ ] Enable CORS for production domain only
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Setup monitoring (New Relic, etc.)
- [ ] Configure email notifications
- [ ] Setup payment gateway
- [ ] Enable HTTPS only
- [ ] Setup CDN for static assets
- [ ] Configure backup strategy

---

## Maintenance & Monitoring

### Daily Checks
- [ ] API endpoints responding
- [ ] Database connection stable
- [ ] No error logs in backend
- [ ] Response times acceptable

### Weekly Checks
- [ ] Database size & growth
- [ ] Error rates
- [ ] User feedback / bug reports
- [ ] Performance metrics

### Monthly Checks
- [ ] Security updates available
- [ ] Dependency updates
- [ ] Code review of changes
- [ ] Database optimization
- [ ] Backup verification

---

## Documentation to Maintain

- [ ] README updated
- [ ] API docs updated when adding endpoints
- [ ] Component documentation
- [ ] Database schema documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Change log maintained

---

## Testing Summary

### Unit Tests
- [ ] API service functions
- [ ] Context reducers
- [ ] Utility functions
- [ ] Validation functions

### Integration Tests
- [ ] Auth flow (login, logout, register)
- [ ] Cart operations (add, remove, update)
- [ ] Order creation
- [ ] Product filtering

### E2E Tests (Optional)
- [ ] Complete user journey
- [ ] Error scenarios
- [ ] Edge cases

---

## Go-Live Approval

Before deploying to production:

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Database backup confirmed
- [ ] Monitoring setup
- [ ] Rollback plan ready
- [ ] Team trained on troubleshooting
- [ ] Documentation complete
- [ ] Stakeholder approval

---

## Post-Launch

- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Monitor performance
- [ ] Plan improvements based on usage
- [ ] Gather analytics
- [ ] Plan next features
- [ ] Update documentation with learnings

---

**Checklist Version:** 1.0
**Last Updated:** March 2026
**Responsible Team:** Full Stack Development Team
