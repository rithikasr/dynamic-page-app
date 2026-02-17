# Stripe Checkout 500 Error - Troubleshooting Guide

## ✅ What Was Fixed

### 1. **Removed Trailing Slash from .env**
**Before:**
```env
VITE_API_BASE_URL=https://4bq8st61-3000.inc1.devtunnels.ms/
```

**After:**
```env
VITE_API_BASE_URL=https://4bq8st61-3000.inc1.devtunnels.ms
```

This prevents double slashes in URLs like `//api/payment/create-checkout-session`

---

### 2. **Enhanced Error Handling**

Both `PhoneCaseCustomizer.tsx` and `TShirtCustomizer.tsx` now have:
- ✅ Detailed console logging before API call
- ✅ HTTP status code checking
- ✅ Specific error messages from backend
- ✅ Better error alerts for users

---

## 🔍 How to Debug the 500 Error

### Step 1: Check Browser Console

After clicking "Buy Now", open DevTools (F12) and check the Console tab. You should see:

```javascript
Creating checkout session with: {
  productId: "...",
  price: 799,
  shirtType: "Polo T-Shirt",
  size: "L",
  color: "#1e3a8a"
}
```

If the request fails, you'll see:
```javascript
Checkout failed: { message: "Specific error from backend" }
```

---

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Click "Buy Now"
3. Find the `create-checkout-session` request
4. Click on it
5. Check the **Response** tab

**Example Error Response:**
```json
{
  "error": "Product not found",
  "message": "No product found with ID: 123abc"
}
```

---

### Step 3: Check Backend Logs

Look at your backend console for detailed error messages. Common errors:

#### **Error: Product not found**
```
Error: Product not found with ID: 6989b4e9056f78d7517dee41
```

**Solution:** Create a product in your database or use a valid product ID.

---

#### **Error: Stripe key missing**
```
Error: No API key provided
```

**Solution:** Add `STRIPE_SECRET_KEY` to your backend `.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

---

#### **Error: Invalid price**
```
Error: Price must be a positive integer
```

**Solution:** Ensure price is a valid number > 0.

---

#### **Error: Metadata too large**
```
Error: Metadata value exceeds maximum length
```

**Solution:** Stripe limits metadata values to 500 characters. Reduce metadata size.

---

## 🧪 Testing Steps

### Test 1: Verify Product Exists

```bash
# Replace with your actual product ID
curl https://4bq8st61-3000.inc1.devtunnels.ms/api/products/YOUR_PRODUCT_ID
```

**Expected Response:**
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "Custom Phone Case",
    "price": 499,
    ...
  }
}
```

---

### Test 2: Test Checkout with curl

```bash
# Replace YOUR_JWT_TOKEN and YOUR_PRODUCT_ID
curl -X POST https://4bq8st61-3000.inc1.devtunnels.ms/api/payment/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "YOUR_PRODUCT_ID",
    "price": 599,
    "metadata": {
      "shirtType": "Polo T-Shirt",
      "size": "L",
      "color": "#ffffff"
    }
  }'
```

**Expected Success Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

### Test 3: Check Browser Console Logs

After clicking "Buy Now", check the console for:

```javascript
// ✅ Good - Shows what's being sent
Creating checkout session with: { productId: "...", price: 799, ... }

// ❌ Bad - Shows error details
Checkout failed: { message: "Product not found" }
```

---

## 🛠️ Common Fixes

### Fix 1: Create a Test Product

If you don't have products in your database:

```javascript
// Using MongoDB or your backend API
{
  "name": "Custom Phone Case",
  "price": 499,
  "category": "phone-case",
  "stock": 100,
  "image": "https://example.com/image.jpg",
  "description": "Customizable phone case"
}
```

---

### Fix 2: Verify Stripe Configuration

**Backend `.env` should have:**
```env
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
```

**Test Stripe connection:**
```javascript
// In your backend
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log('Stripe initialized:', !!stripe);
```

---

### Fix 3: Check JWT Token

Make sure you're logged in and have a valid token:

```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'));
```

If null, log in again.

---

### Fix 4: Restart Dev Server

After changing `.env` file:

```bash
# Stop the server (Ctrl+C)
# Restart it
npm run dev
```

---

## 📋 Debugging Checklist

- [ ] `.env` has no trailing slash
- [ ] Dev server restarted after `.env` change
- [ ] Product exists in database
- [ ] Product ID is valid MongoDB ObjectId
- [ ] User is logged in (JWT token exists)
- [ ] Backend has `STRIPE_SECRET_KEY` in `.env`
- [ ] Backend is running and accessible
- [ ] No CORS errors in browser console
- [ ] Price is a positive number
- [ ] Metadata is not too large

---

## 🎯 Expected Flow

### Successful Checkout:

1. **User clicks "Buy Now"**
2. **Console logs:** `Creating checkout session with: {...}`
3. **API call:** `POST /api/payment/create-checkout-session`
4. **Backend:** Creates Stripe session
5. **Response:** `{ url: "https://checkout.stripe.com/..." }`
6. **Redirect:** User goes to Stripe checkout page

### Failed Checkout:

1. **User clicks "Buy Now"**
2. **Console logs:** `Creating checkout session with: {...}`
3. **API call:** `POST /api/payment/create-checkout-session`
4. **Backend:** Error occurs (product not found, Stripe error, etc.)
5. **Response:** `{ error: "...", message: "..." }`
6. **Alert:** Shows error message to user
7. **Console logs:** `Checkout failed: {...}`

---

## 🚨 Next Steps

1. **Try checkout again** - The enhanced error handling will show you the exact error
2. **Check browser console** - Look for the detailed error message
3. **Check backend logs** - See what error the backend is throwing
4. **Share the error** - Copy the error message and I can help you fix it

---

## 📞 Getting Help

When reporting the error, please provide:

1. **Browser console logs** (the `Checkout failed:` message)
2. **Network tab response** (from the failed request)
3. **Backend console logs** (the actual error from your server)
4. **Product ID** you're trying to checkout with

This will help identify the exact issue! 🎯
