# Dynamic Pricing Setup Guide

## Quick Start

Follow these steps to set up dynamic pricing in your application.

---

## Step 1: Backend Setup

### 1.1 Initialize Default Pricing

Run this API call once to create default pricing in your database:

```bash
POST http://localhost:3000/api/admin/pricing/initialize
Headers:
  Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
  Content-Type: application/json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Default pricing initialized successfully",
  "pricing": [...]
}
```

---

## Step 2: Verify Frontend Integration

### 2.1 Check API Constants

Verify `src/constants/apiConstants.ts` includes:
```typescript
PRICING: {
    PHONE_CASE: `${API_BASE_URL}/api/pricing/phone-case`,
    T_SHIRT: `${API_BASE_URL}/api/pricing/t-shirt`,
    ADMIN: { ... }
}
```

✅ **Already configured!**

---

### 2.2 Test Phone Case Customizer

1. Navigate to: `/customize-phone-case/:productId`
2. Open browser DevTools → Network tab
3. Look for: `GET /api/pricing/phone-case`
4. Verify response contains `basePrice: 499`

---

### 2.3 Test T-Shirt Customizer

1. Navigate to: `/customize-t-shirt/:productId`
2. Open browser DevTools → Network tab
3. Look for: `GET /api/pricing/t-shirt`
4. Verify response contains array of t-shirt types with prices

---

## Step 3: Add Admin Pricing Panel (Optional)

### 3.1 Add Route

Update `src/App.tsx`:

```tsx
import PricingManagement from './pages/admin/PricingManagement';

// Inside Routes:
<Route path="/admin/pricing" element={<PricingManagement />} />
```

### 3.2 Add Navigation Link

Update your admin navigation to include:

```tsx
<Link to="/admin/pricing">Pricing Management</Link>
```

---

## Step 4: Test Price Updates

### 4.1 Update Phone Case Price

```bash
POST http://localhost:3000/api/admin/pricing/phone-case
Headers:
  Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "basePrice": 599
}
```

### 4.2 Verify Update

1. Refresh phone case customizer
2. Price should now show ₹599

---

### 4.3 Update T-Shirt Prices

```bash
POST http://localhost:3000/api/admin/pricing/t-shirt
Headers:
  Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
  Content-Type: application/json
Body:
{
  "tshirtTypes": [
    { "id": "half-sleeve", "name": "Rounded Neck (Half Sleeve)", "price": 649 },
    { "id": "v-neck", "name": "V-Neck T-Shirt", "price": 699 },
    { "id": "polo", "name": "Polo T-Shirt", "price": 849 },
    { "id": "full-sleeve", "name": "Full Sleeve T-Shirt", "price": 749 },
    { "id": "oversized", "name": "Oversized T-Shirt", "price": 799 },
    { "id": "sweatshirt", "name": "Sweatshirt", "price": 1099 }
  ]
}
```

### 4.4 Verify Update

1. Refresh t-shirt customizer
2. Prices should reflect new values

---

## Step 5: Test Checkout Flow

### 5.1 Phone Case Checkout

1. Go to phone case customizer
2. Select a phone model
3. Click "Buy Now"
4. Check Network tab → `POST /api/payment/create-checkout-session`
5. Verify payload includes: `"price": 599` (or your updated price)

---

### 5.2 T-Shirt Checkout

1. Go to t-shirt customizer
2. Select "Polo T-Shirt"
3. Click "Buy Now"
4. Check Network tab → `POST /api/payment/create-checkout-session`
5. Verify payload includes: `"price": 849` (or your updated price)

---

## Troubleshooting

### Issue: "Failed to fetch pricing"

**Solution:**
1. Ensure backend is running
2. Check API_BASE_URL in `.env`
3. Verify CORS is configured correctly
4. Run initialization endpoint

---

### Issue: Prices not updating

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check backend logs for errors
4. Verify pricing exists in database:
   ```javascript
   db.productpricings.find()
   ```

---

### Issue: Admin panel not accessible

**Solution:**
1. Ensure you're logged in as admin
2. Check JWT token is valid
3. Verify admin route is protected correctly

---

## PowerShell Testing Commands

### Initialize Pricing
```powershell
$headers = @{
    'Authorization' = 'Bearer YOUR_JWT_TOKEN'
    'Content-Type' = 'application/json'
}

Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/pricing/initialize' `
  -Method POST `
  -Headers $headers
```

### Update Phone Case Price
```powershell
$body = @{basePrice=599} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/pricing/phone-case' `
  -Method POST `
  -Headers $headers `
  -Body $body
```

### Update T-Shirt Prices
```powershell
$tshirtTypes = @(
  @{id='half-sleeve'; name='Rounded Neck (Half Sleeve)'; price=649},
  @{id='v-neck'; name='V-Neck T-Shirt'; price=699},
  @{id='polo'; name='Polo T-Shirt'; price=849},
  @{id='full-sleeve'; name='Full Sleeve T-Shirt'; price=749},
  @{id='oversized'; name='Oversized T-Shirt'; price=799},
  @{id='sweatshirt'; name='Sweatshirt'; price=1099}
)
$body = @{tshirtTypes=$tshirtTypes} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/pricing/t-shirt' `
  -Method POST `
  -Headers $headers `
  -Body $body
```

---

## Verification Checklist

- [ ] Backend pricing initialized
- [ ] Phone case customizer fetches pricing
- [ ] T-shirt customizer fetches pricing
- [ ] Prices display correctly in UI
- [ ] Checkout sends correct prices
- [ ] Admin panel accessible (if implemented)
- [ ] Price updates work via API
- [ ] Fallback prices work if API fails

---

## Next Steps

1. **Monitor Pricing**: Check backend logs for pricing fetch requests
2. **Set Production Prices**: Update prices to production values
3. **Add Caching**: Consider caching pricing in localStorage
4. **Add Webhooks**: Notify frontend when prices change
5. **Add Audit Log**: Track who changed prices and when

---

## Support

For issues or questions:
1. Check `DYNAMIC_PRICING_INTEGRATION.md` for detailed documentation
2. Review backend API logs
3. Verify database pricing collection
4. Test with curl/Postman first

---

## Summary

✅ **Frontend**: Fetches dynamic pricing on component mount
✅ **Backend**: Provides pricing via REST API
✅ **Admin**: Can update prices without code changes
✅ **Fallback**: Hardcoded defaults ensure app works if API fails
✅ **Real-time**: Price changes take effect immediately

Your dynamic pricing system is ready to use! 🎉
