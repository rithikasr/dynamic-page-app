# API Payload Quick Reference

## 📱 Phone Case Customizer

### Checkout Request Payload
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

### Phone Model Request Payload
```json
{
  "brand": "Samsung",
  "model": "Galaxy S24 Ultra",
  "email": "user@example.com"
}
```

---

## 👕 T-Shirt Customizer

### Checkout Request Payload
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

### T-Shirt Type Prices
| Type | Price (₹) |
|------|-----------|
| Rounded Neck (Half Sleeve) | 599 |
| V-Neck T-Shirt | 649 |
| Polo T-Shirt | 799 |
| Full Sleeve T-Shirt | 699 |
| Oversized T-Shirt | 749 |
| Sweatshirt | 999 |

---

## 🔑 Headers

All protected endpoints require:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

---

## 📍 Endpoints Used

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/products/:id` | GET | Optional | Get product details |
| `/api/payment/create-checkout-session` | POST | Required | Create Stripe checkout |
| `/api/phone-models/request` | POST | Required | Request new phone model |

---

## ✅ Validation Rules

### Phone Case
- `phoneModel`: Required, string
- `caseColor`: Required, hex color code
- `price`: Required, number (default: 499)

### T-Shirt
- `shirtType`: Required, string
- `size`: Required, one of: S, M, L, XL, XXL, 3XL
- `color`: Required, hex color code
- `price`: Required, number (599-999 based on type)

---

## 🧪 Test Data

### Test Phone Case Product
```json
{
  "_id": "6989b4e9056f78d7517dee41",
  "name": "Custom Phone Case",
  "price": 499,
  "category": "phone-case",
  "stock": 100
}
```

### Test T-Shirt Product
```json
{
  "_id": "t-shirt-123",
  "name": "Custom T-Shirt",
  "price": 599,
  "category": "t-shirt",
  "stock": 100
}
```
