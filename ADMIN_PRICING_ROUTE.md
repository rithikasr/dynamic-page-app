# Admin Pricing Management - Quick Reference

## 🎯 Route to Edit Prices

### **URL:**
```
http://localhost:5173/admin/pricing
```

**Or in production:**
```
https://your-domain.com/admin/pricing
```

---

## 🔐 Access Requirements

- Must be logged in as an **admin user**
- Requires valid **JWT token** with admin privileges
- Token is automatically included in API requests via `getAuthHeaders()`

---

## 📋 What You Can Do

### 1. **View Current Pricing**
- See current phone case price
- See all t-shirt type prices
- View pricing summary

### 2. **Update Phone Case Price**
- Change the base price for all phone cases
- Updates apply immediately to new orders

### 3. **Update T-Shirt Prices**
- Modify prices for each t-shirt type:
  - Half Sleeve (Rounded Neck)
  - V-Neck T-Shirt
  - Polo T-Shirt
  - Full Sleeve T-Shirt
  - Oversized T-Shirt
  - Sweatshirt

### 4. **Initialize Default Pricing**
- Set up default pricing if not already configured
- Useful for first-time setup

### 5. **Refresh Pricing**
- Reload current pricing from backend
- Useful to verify changes

---

## 🚀 How to Access

### Option 1: Direct URL
Navigate to: `http://localhost:5173/admin/pricing`

### Option 2: Add to Admin Navigation
Update your admin navigation menu to include a link:

```tsx
<Link to="/admin/pricing">
  Pricing Management
</Link>
```

---

## 💡 Usage Examples

### Update Phone Case Price to ₹599
1. Go to `/admin/pricing`
2. Find "Phone Case Pricing" card
3. Change value to `599`
4. Click "Update Phone Case Price"
5. Wait for success message

### Update Polo T-Shirt to ₹899
1. Go to `/admin/pricing`
2. Find "T-Shirt Pricing" card
3. Locate "Polo T-Shirt" row
4. Change value to `899`
5. Click "Update All T-Shirt Prices"
6. Wait for success message

---

## 🔍 Verification

After updating prices:

1. **Check Customizer Pages:**
   - Open `/customize-phone-case/:productId`
   - Open `/customize-t-shirt/:productId`
   - Verify prices display correctly

2. **Check Network Tab:**
   - Look for `GET /api/pricing/phone-case`
   - Look for `GET /api/pricing/t-shirt`
   - Verify responses contain updated prices

3. **Test Checkout:**
   - Add item to cart
   - Proceed to checkout
   - Verify correct price is charged

---

## 📊 API Endpoints Used

The pricing management page uses these endpoints:

### Public (Read):
- `GET /api/pricing/phone-case` - Fetch phone case pricing
- `GET /api/pricing/t-shirt` - Fetch t-shirt pricing

### Admin (Write):
- `POST /api/admin/pricing/initialize` - Initialize default pricing
- `POST /api/admin/pricing/phone-case` - Update phone case price
- `POST /api/admin/pricing/t-shirt` - Update t-shirt prices

---

## ⚠️ Important Notes

1. **Immediate Effect**: Price changes take effect immediately for new orders
2. **Existing Orders**: Existing orders retain their original pricing
3. **Currency**: All prices are in Indian Rupees (₹)
4. **Minimum Price**: Ensure prices are positive numbers
5. **User Impact**: Users will see updated prices after refreshing the customizer page

---

## 🛠️ Troubleshooting

### Can't Access `/admin/pricing`
- Ensure you're logged in as admin
- Check JWT token is valid
- Verify route is added to `App.tsx`

### Prices Not Updating
- Check browser console for errors
- Verify backend is running
- Check network tab for failed requests
- Ensure JWT token has admin privileges

### "Failed to fetch pricing"
- Backend pricing not initialized
- Run: `POST /api/admin/pricing/initialize`
- Check backend logs

---

## 📱 Mobile Access

The pricing management panel is responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices (in landscape mode recommended)

---

## 🔗 Related Documentation

- `DYNAMIC_PRICING_INTEGRATION.md` - Technical details
- `PRICING_SETUP_GUIDE.md` - Setup instructions
- `API_INTEGRATION_GUIDE.md` - API documentation

---

## ✅ Quick Checklist

Before using the pricing panel:
- [ ] Backend is running
- [ ] Logged in as admin
- [ ] Pricing initialized in database
- [ ] Route added to App.tsx
- [ ] JWT token is valid

---

## 🎉 You're Ready!

Navigate to: **`/admin/pricing`** to start managing your product prices!
