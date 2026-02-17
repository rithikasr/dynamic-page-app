# Dynamic Pricing Integration Guide

## Overview
The frontend now fetches pricing dynamically from the backend API instead of using hardcoded values. This allows admins to update prices through the backend without requiring frontend code changes.

---

## ✅ What Was Implemented

### 1. **API Constants Updated** (`src/constants/apiConstants.ts`)

Added pricing endpoints:
```typescript
PRICING: {
    PHONE_CASE: `${API_BASE_URL}/api/pricing/phone-case`,
    T_SHIRT: `${API_BASE_URL}/api/pricing/t-shirt`,
    ADMIN: {
        ALL: `${API_BASE_URL}/api/admin/pricing`,
        INITIALIZE: `${API_BASE_URL}/api/admin/pricing/initialize`,
        PHONE_CASE: `${API_BASE_URL}/api/admin/pricing/phone-case`,
        T_SHIRT: `${API_BASE_URL}/api/admin/pricing/t-shirt`,
        DELETE: (type: string) => `${API_BASE_URL}/api/admin/pricing/${type}`,
    },
}
```

---

### 2. **Phone Case Customizer** (`src/pages/PhoneCaseCustomizer.tsx`)

#### Changes Made:

**Added State:**
```typescript
const [phoneCasePrice, setPhoneCasePrice] = useState(499); // Dynamic pricing from backend
```

**Added Pricing Fetch:**
```typescript
useEffect(() => {
    const fetchPricing = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.PRICING.PHONE_CASE);
            const data = await res.json();
            if (data.success && data.pricing) {
                setPhoneCasePrice(data.pricing.basePrice);
            }
        } catch (err) {
            console.error('Failed to fetch phone case pricing:', err);
            // Keep default price of 499
        }
    };
    fetchPricing();
}, []);
```

**Updated Checkout:**
```typescript
const handleBuy = async () => {
    const price = targetProduct?.price || phoneCasePrice; // Uses dynamic price
    
    await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            productId: targetProduct._id || targetProduct.id,
            price: price, // Dynamic price from admin
            metadata: { ... }
        })
    });
};
```

---

### 3. **T-Shirt Customizer** (`src/pages/TShirtCustomizer.tsx`)

#### Changes Made:

**Added State:**
```typescript
const [tshirtPricing, setTshirtPricing] = useState<Record<string, number>>({
    'half-sleeve': 599,
    'v-neck': 649,
    'polo': 799,
    'full-sleeve': 699,
    'oversized': 749,
    'sweatshirt': 999
});
```

**Added Pricing Fetch:**
```typescript
useEffect(() => {
    const fetchPricing = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.PRICING.T_SHIRT);
            const data = await res.json();
            if (data.success && data.pricing && data.pricing.tshirtTypes) {
                const priceMap: Record<string, number> = {};
                data.pricing.tshirtTypes.forEach((type: any) => {
                    priceMap[type.id] = type.price;
                });
                setTshirtPricing(priceMap);
            }
        } catch (err) {
            console.error('Failed to fetch t-shirt pricing:', err);
            // Keep default prices
        }
    };
    fetchPricing();
}, []);
```

**Updated UI Display:**
```tsx
{/* T-Shirt type selection */}
<span className="text-xs text-gray-500">₹{tshirtPricing[type.id] || type.price}</span>

{/* Preview modal */}
<span className="text-2xl font-bold">
    ₹{tshirtPricing[shirtType] || targetProduct?.price || 599}
</span>
```

**Updated Checkout:**
```typescript
const handleBuy = async () => {
    const price = tshirtPricing[shirtType] || targetProduct?.price || 599;
    
    await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            productId: targetProduct._id || targetProduct.id,
            price: price, // Dynamic price from admin
            metadata: { ... }
        })
    });
};
```

---

## 🔄 How It Works

### Data Flow:

```
1. Component Mounts
   ↓
2. useEffect Triggers
   ↓
3. Fetch Pricing from Backend
   ↓
4. Update State (phoneCasePrice or tshirtPricing)
   ↓
5. UI Re-renders with Dynamic Prices
   ↓
6. User Clicks "Buy Now"
   ↓
7. Send Dynamic Price to Backend
   ↓
8. Backend Creates Stripe Session
   ↓
9. User Redirected to Stripe Checkout
```

---

## 🧪 Testing

### Test Phone Case Pricing:

1. **Initialize Backend Pricing** (if not done):
   ```bash
   POST http://localhost:3000/api/admin/pricing/initialize
   ```

2. **Open Phone Case Customizer**:
   - Navigate to `/customize-phone-case/:productId`
   - Check browser console for: "Fetching pricing..."
   - Verify no errors

3. **Check Network Tab**:
   - Should see: `GET /api/pricing/phone-case`
   - Response should contain: `{ success: true, pricing: { basePrice: 499 } }`

4. **Test Price Update**:
   ```bash
   POST http://localhost:3000/api/admin/pricing/phone-case
   Body: { "basePrice": 599 }
   ```

5. **Refresh Customizer**:
   - Price should update to ₹599

---

### Test T-Shirt Pricing:

1. **Open T-Shirt Customizer**:
   - Navigate to `/customize-t-shirt/:productId`
   - Check browser console for: "Fetching pricing..."

2. **Check Network Tab**:
   - Should see: `GET /api/pricing/t-shirt`
   - Response should contain array of t-shirt types with prices

3. **Verify UI**:
   - Each t-shirt type should display its price
   - Selecting different types should show different prices

4. **Test Price Update**:
   ```bash
   POST http://localhost:3000/api/admin/pricing/t-shirt
   Body: {
     "tshirtTypes": [
       { "id": "polo", "name": "Polo T-Shirt", "price": 899 }
       // ... other types
     ]
   }
   ```

5. **Refresh Customizer**:
   - Polo price should update to ₹899

---

## 🛡️ Fallback Strategy

The implementation includes multiple fallback levels:

### Phone Case:
1. **Product price** from database (if available)
2. **Dynamic price** from pricing API
3. **Default** ₹499 (hardcoded)

### T-Shirt:
1. **Dynamic price** from pricing API for selected type
2. **Product price** from database (if available)
3. **Default** ₹599 (hardcoded)

This ensures the app continues to work even if:
- Backend pricing API is down
- Pricing hasn't been initialized
- Network request fails

---

## 📊 API Response Formats

### Phone Case Pricing Response:
```json
{
  "success": true,
  "pricing": {
    "_id": "...",
    "productType": "phone-case",
    "basePrice": 499,
    "isActive": true,
    "createdAt": "2026-02-16T...",
    "updatedAt": "2026-02-16T..."
  }
}
```

### T-Shirt Pricing Response:
```json
{
  "success": true,
  "pricing": {
    "_id": "...",
    "productType": "t-shirt",
    "tshirtTypes": [
      { "id": "half-sleeve", "name": "Rounded Neck (Half Sleeve)", "price": 599 },
      { "id": "v-neck", "name": "V-Neck T-Shirt", "price": 649 },
      { "id": "polo", "name": "Polo T-Shirt", "price": 799 },
      { "id": "full-sleeve", "name": "Full Sleeve T-Shirt", "price": 699 },
      { "id": "oversized", "name": "Oversized T-Shirt", "price": 749 },
      { "id": "sweatshirt", "name": "Sweatshirt", "price": 999 }
    ],
    "isActive": true,
    "createdAt": "2026-02-16T...",
    "updatedAt": "2026-02-16T..."
  }
}
```

---

## 🚀 Next Steps

### 1. Initialize Backend Pricing

Run this once to set up default pricing in your database:

```bash
POST http://localhost:3000/api/admin/pricing/initialize
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
```

### 2. Create Admin Pricing Panel

See `ADMIN_PRICING_PANEL.md` for a complete admin component to manage pricing.

### 3. Optional Enhancements

- **Caching**: Cache pricing in localStorage to reduce API calls
- **Loading States**: Show loading spinner while fetching prices
- **Error Handling**: Display user-friendly error messages
- **Real-time Updates**: Use WebSockets to update prices without refresh

---

## 🐛 Troubleshooting

### Issue: Prices not updating

**Check:**
1. Backend pricing API is running
2. Pricing has been initialized in database
3. No CORS errors in browser console
4. Network tab shows successful API call

**Solution:**
```bash
# Re-initialize pricing
POST /api/admin/pricing/initialize
```

---

### Issue: Console error "Failed to fetch pricing"

**Check:**
1. API_BASE_URL is correct in `.env`
2. Backend server is running
3. Pricing endpoints exist

**Solution:**
- Verify backend routes are registered
- Check backend logs for errors
- Ensure pricing collection exists in MongoDB

---

### Issue: Wrong price charged in Stripe

**Check:**
1. Backend is using `req.body.price` from request
2. Frontend is sending correct price in payload
3. Stripe session creation uses the price correctly

**Solution:**
- Check backend checkout endpoint implementation
- Verify price is multiplied by 100 for Stripe (paise)
- Check Stripe dashboard for session details

---

## 📝 Summary

✅ **Phone Case Customizer**: Fetches single base price from `/api/pricing/phone-case`
✅ **T-Shirt Customizer**: Fetches type-specific prices from `/api/pricing/t-shirt`
✅ **Fallback Defaults**: Hardcoded defaults ensure app works if API fails
✅ **Dynamic Checkout**: Prices sent to backend are always current
✅ **Admin Control**: Admins can update prices without frontend deployment

The pricing system is now fully dynamic and admin-configurable! 🎉
