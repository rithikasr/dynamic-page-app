# API Integration Guide

## Overview
This document explains how the frontend integrates with the custom product backend API for phone case and t-shirt customization.

---

## ✅ Completed Integrations

### 1. **Phone Case Customizer** (`src/pages/PhoneCaseCustomizer.tsx`)

#### Product Loading
The customizer loads product data in the following priority:
1. **Navigation state** - Product passed from Index page
2. **URL parameter** - Product ID from route `/customize-phone-case/:productId`
3. **Fallback search** - Searches all products for phone cases
4. **Mock fallback** - Uses hardcoded product if nothing found

```typescript
// Fetch product by ID from URL
if (productId) {
    const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(productId), {
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.product) {
        setTargetProduct(data.product);
    }
}
```

#### Checkout Integration
When user clicks "Buy Now", the following data is sent:

```typescript
const handleBuy = async () => {
    const selectedPhoneModel = phoneModels[selectedModel] || GENERIC_PHONE_TEMPLATE;
    const price = targetProduct?.price || 499;

    await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            productId: targetProduct._id || targetProduct.id,
            price: price,
            metadata: {
                phoneModel: selectedPhoneModel.name,  // e.g., "iPhone 15 Pro Max"
                caseColor: caseColor,                 // e.g., "#ffffff"
                customDesign: true
            }
        })
    });
};
```

**Metadata Sent:**
- `phoneModel`: Name of the selected phone (e.g., "iPhone 15 Pro Max", "Samsung Galaxy S24")
- `caseColor`: Hex color code of the case (e.g., "#ffffff", "#1a1a1a")
- `customDesign`: Always `true` for customized products

#### Phone Model Request
Users can request new phone models that aren't available:

```typescript
const handleRequestModel = async () => {
    const response = await fetch(API_ENDPOINTS.PHONE_MODELS.REQUEST, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            brand: requestBrand,      // e.g., "Samsung"
            model: requestModel,      // e.g., "Galaxy S24 Ultra"
            email: requestEmail       // Optional
        })
    });
};
```

---

### 2. **T-Shirt Customizer** (`src/pages/TShirtCustomizer.tsx`)

#### Product Loading
Same priority as Phone Case Customizer:
1. Navigation state
2. URL parameter from `/customize-t-shirt/:productId`
3. Fallback search for t-shirts
4. Mock fallback

#### Checkout Integration
When user clicks "Buy Now", the following data is sent:

```typescript
const handleBuy = async () => {
    const selectedType = TSHIRT_TYPES.find(t => t.id === shirtType);
    const price = selectedType?.price || targetProduct?.price || 599;

    await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            productId: targetProduct._id || targetProduct.id,
            price: price,                    // Dynamic price based on t-shirt type
            metadata: {
                shirtType: selectedType?.name,  // e.g., "Polo T-Shirt"
                size: size,                     // e.g., "L"
                color: color,                   // e.g., "#1e3a8a"
                customDesign: true
            }
        })
    });
};
```

**Metadata Sent:**
- `shirtType`: Name of the selected t-shirt style (e.g., "Polo T-Shirt", "V-Neck T-Shirt")
- `size`: Selected size (e.g., "S", "M", "L", "XL")
- `color`: Hex color code of the t-shirt (e.g., "#ffffff", "#1e3a8a")
- `customDesign`: Always `true` for customized products

**Dynamic Pricing:**
Different t-shirt types have different prices:
- Rounded Neck (Half Sleeve): ₹599
- V-Neck T-Shirt: ₹649
- Polo T-Shirt: ₹799
- Full Sleeve T-Shirt: ₹699
- Oversized T-Shirt: ₹749
- Sweatshirt: ₹999

---

## 🔧 API Constants Configuration

### Current Setup (`src/constants/apiConstants.ts`)

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://z0vx5pwf-3000.inc1.devtunnels.ms';

export const API_ENDPOINTS = {
    PRODUCTS: {
        BASE: `${API_BASE_URL}/api/products`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/products/${id}`
    },
    PHONE_MODELS: {
        REQUEST: `${API_BASE_URL}/api/phone-models/request`
    },
    PAYMENT: {
        CREATE_CHECKOUT_SESSION: `${API_BASE_URL}/api/payment/create-checkout-session`
    }
};

export const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};
```

### Environment Variables (`.env`)

```env
VITE_API_BASE_URL=https://z0vx5pwf-3000.inc1.devtunnels.ms
```

**For Production:**
```env
VITE_API_BASE_URL=https://your-production-api.com
```

---

## 🎯 Backend Requirements

Your backend's `create-checkout-session` endpoint should handle the following request format:

### Request Body Structure

```typescript
interface CheckoutRequest {
    productId: string;           // MongoDB ObjectId
    price: number;               // Price in INR (e.g., 799, 499)
    metadata: {
        // For Phone Cases:
        phoneModel?: string;     // e.g., "iPhone 15 Pro Max"
        caseColor?: string;      // e.g., "#ffffff"
        
        // For T-Shirts:
        shirtType?: string;      // e.g., "Polo T-Shirt"
        size?: string;           // e.g., "L"
        color?: string;          // e.g., "#1e3a8a"
        
        customDesign: boolean;   // Always true
    }
}
```

### Backend Implementation Example

```javascript
// Backend: /api/payment/create-checkout-session
app.post('/api/payment/create-checkout-session', authenticateToken, async (req, res) => {
    const { productId, price, metadata } = req.body;
    
    // Fetch product from database
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    // Build product name based on metadata
    let productName = product.name;
    if (metadata.phoneModel) {
        productName = `Custom Phone Case for ${metadata.phoneModel}`;
    } else if (metadata.shirtType) {
        productName = `Custom ${metadata.shirtType}`;
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: productName,
                    description: buildDescription(metadata),
                    images: product.image ? [product.image] : []
                },
                unit_amount: price * 100, // Convert to paise
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: metadata, // Store custom metadata in Stripe
        customer_email: req.user.email
    });
    
    res.json({ url: session.url });
});

function buildDescription(metadata) {
    if (metadata.phoneModel) {
        return `Phone: ${metadata.phoneModel} • Color: ${metadata.caseColor}`;
    } else if (metadata.shirtType) {
        return `Type: ${metadata.shirtType} • Size: ${metadata.size} • Color: ${metadata.color}`;
    }
    return 'Custom Product';
}
```

---

## 🧪 Testing the Integration

### Test Phone Case Checkout

1. Navigate to a phone case product
2. Click "Start Designing"
3. Select a phone model (e.g., iPhone 15 Pro Max)
4. Choose a case color
5. Add custom designs
6. Click "Preview & Buy"
7. Click "Buy Now"

**Expected Request:**
```json
{
    "productId": "6989b4e9056f78d7517dee41",
    "price": 499,
    "metadata": {
        "phoneModel": "iPhone 15 Pro Max",
        "caseColor": "#ffffff",
        "customDesign": true
    }
}
```

### Test T-Shirt Checkout

1. Navigate to a t-shirt product
2. Click "Start Designing"
3. Select t-shirt type (e.g., Polo T-Shirt)
4. Choose size (e.g., L)
5. Choose color
6. Add custom designs
7. Click "Preview & Buy"
8. Click "Buy Now"

**Expected Request:**
```json
{
    "productId": "t-shirt-123",
    "price": 799,
    "metadata": {
        "shirtType": "Polo T-Shirt",
        "size": "L",
        "color": "#1e3a8a",
        "customDesign": true
    }
}
```

### Test Phone Model Request

1. Go to Phone Case Customizer
2. Click "Request New Model"
3. Fill in:
   - Brand: "OnePlus"
   - Model: "OnePlus 12"
   - Email: "user@example.com"
4. Submit

**Expected Request:**
```json
{
    "brand": "OnePlus",
    "model": "OnePlus 12",
    "email": "user@example.com"
}
```

---

## 🔍 Debugging

### Check Network Requests

Open browser DevTools → Network tab → Filter by "Fetch/XHR"

When you click "Buy Now", you should see:
- **Request URL**: `https://your-api.com/api/payment/create-checkout-session`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: Contains `productId`, `price`, and `metadata`

### Common Issues

#### 1. "Product info is loading..."
**Cause**: `targetProduct` is null
**Fix**: Ensure product is loaded via URL param, navigation state, or fallback

#### 2. "Failed to create checkout session"
**Cause**: Backend didn't return a `url` field
**Fix**: Check backend response format and error logs

#### 3. Wrong price charged
**Cause**: Backend not using the `price` field from request
**Fix**: Update backend to use `req.body.price` instead of `product.price`

#### 4. Missing metadata in Stripe
**Cause**: Backend not passing metadata to Stripe session
**Fix**: Add `metadata: metadata` to `stripe.checkout.sessions.create()`

---

## 📊 Data Flow Diagram

```
User Action → Frontend State → API Request → Backend → Stripe → Redirect

Phone Case:
1. User selects iPhone 15 Pro Max
2. selectedModel = 'iphone-15-pro-max'
3. User clicks Buy Now
4. handleBuy() extracts: phoneModels[selectedModel].name
5. POST /api/payment/create-checkout-session
6. Backend creates Stripe session with metadata
7. User redirected to Stripe checkout

T-Shirt:
1. User selects Polo T-Shirt
2. shirtType = 'polo'
3. User clicks Buy Now
4. handleBuy() finds: TSHIRT_TYPES.find(t => t.id === 'polo')
5. Extracts price (₹799) and name
6. POST /api/payment/create-checkout-session
7. Backend creates Stripe session with metadata
8. User redirected to Stripe checkout
```

---

## 🚀 Next Steps

### Required Backend Updates

1. **Update Checkout Endpoint**
   - Accept `price` field in request body
   - Use `req.body.price` instead of database price
   - Pass `metadata` to Stripe session

2. **Create Products in Database**
   ```javascript
   // Phone Case Product
   {
       name: "Custom Phone Case",
       price: 499,
       category: "phone-case",
       stock: 100,
       image: "https://..."
   }
   
   // T-Shirt Product
   {
       name: "Custom T-Shirt",
       price: 599, // Base price (Half Sleeve)
       category: "t-shirt",
       stock: 100,
       image: "https://..."
   }
   ```

3. **Test Stripe Webhooks**
   - Ensure metadata is accessible in webhook events
   - Use metadata to create order records with custom details

### Optional Enhancements

1. **Add Admin Panel for Phone Model Requests**
   - View all requests: `GET /api/phone-models/requests`
   - Approve/reject: `PATCH /api/phone-models/requests/:id/status`

2. **Add Price Validation**
   - Backend validates that price matches expected ranges
   - Prevents price manipulation

3. **Add Design Image Upload**
   - Store custom design images
   - Include image URLs in metadata

---

## 📝 Summary

Both customizers now send complete information to the backend:

✅ **Product ID** - Which base product is being customized
✅ **Price** - Dynamic price based on customization options
✅ **Metadata** - All customization details (phone model, size, color, etc.)

This allows your backend to:
- Create accurate Stripe checkout sessions
- Store complete order details
- Track which customizations are popular
- Send confirmation emails with full details
