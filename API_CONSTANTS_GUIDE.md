# API Constants Usage Guide

## Overview
This project now uses a centralized API constants system located in `src/constants/apiConstants.ts`. This approach provides:
- **Single source of truth** for all API endpoints
- **Easy maintenance** - update URLs in one place
- **Type safety** with TypeScript
- **Consistent authentication** handling
- **Environment-based configuration**

## File Structure

```
src/
├── constants/
│   └── apiConstants.ts       # Central API configuration
├── api/
│   ├── products.ts           # Product API calls (refactored)
│   └── admin.ts              # Admin API calls (refactored)
└── pages/
    └── [various pages]       # To be refactored
```

## Configuration

### Environment Variables (.env)
```env
VITE_API_BASE_URL=https://z0vx5pwf-3000.inc1.devtunnels.ms
```

## Usage Examples

### 1. Basic API Call with Authentication

```typescript
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

// Fetch data with authentication
const fetchData = async () => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
    headers: getAuthHeaders(),
  });
  return response.json();
};
```

### 2. POST Request with Body

```typescript
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const createProduct = async (productData: any) => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return response.json();
};
```

### 3. Dynamic Endpoint (with ID)

```typescript
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const updateProduct = async (id: string, data: any) => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### 4. Without Content-Type (for FormData)

```typescript
import { API_ENDPOINTS, getAuthHeadersWithoutContentType } from '../constants/apiConstants';

const uploadFile = async (formData: FormData) => {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
    method: 'POST',
    headers: getAuthHeadersWithoutContentType(),
    body: formData,
  });
  return response.json();
};
```

## Available Endpoints

### Authentication
- `API_ENDPOINTS.AUTH.LOGIN`
- `API_ENDPOINTS.AUTH.REGISTER`
- `API_ENDPOINTS.AUTH.LOGOUT`

### Products
- `API_ENDPOINTS.PRODUCTS.BASE`
- `API_ENDPOINTS.PRODUCTS.BY_ID(id)`

### Admin
- `API_ENDPOINTS.ADMIN.ORDERS`

### Orders
- `API_ENDPOINTS.ORDERS.MY_ORDERS`

### Payment
- `API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION`

### Phone Models
- `API_ENDPOINTS.PHONE_MODELS.REQUEST`

## Helper Functions

### `getAuthToken()`
Returns the stored authentication token from localStorage.

```typescript
import { getAuthToken } from '../constants/apiConstants';

const token = getAuthToken();
```

### `getAuthHeaders()`
Returns headers with Content-Type and Authorization (if token exists).

```typescript
import { getAuthHeaders } from '../constants/apiConstants';

const headers = getAuthHeaders();
// Returns:
// {
//   'Content-Type': 'application/json',
//   'Authorization': 'Bearer <token>' // if token exists
// }
```

### `getAuthHeadersWithoutContentType()`
Returns only Authorization header (useful for FormData uploads).

```typescript
import { getAuthHeadersWithoutContentType } from '../constants/apiConstants';

const headers = getAuthHeadersWithoutContentType();
// Returns:
// {
//   'Authorization': 'Bearer <token>' // if token exists
// }
```

## Migration Guide

### Before (Old Way)
```typescript
// ❌ Hardcoded URL and manual token handling
const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
};
```

### After (New Way)
```typescript
// ✅ Using centralized constants
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const fetchProducts = async () => {
  const res = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
    headers: getAuthHeaders(),
  });
  return res.json();
};
```

## Adding New Endpoints

To add a new endpoint, edit `src/constants/apiConstants.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints ...
  
  // Add your new endpoint group
  NEW_FEATURE: {
    BASE: `${API_BASE_URL}/api/new-feature`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/new-feature/${id}`,
    CUSTOM_ACTION: `${API_BASE_URL}/api/new-feature/custom-action`,
  },
} as const;
```

## Files That Need Refactoring

The following files still use hardcoded URLs and should be refactored:

1. ✅ `src/api/products.ts` - **DONE**
2. ✅ `src/api/admin.ts` - **DONE**
3. ⏳ `src/pages/TShirtCustomizer.tsx`
4. ⏳ `src/pages/ProductPage.tsx`
5. ⏳ `src/pages/orders/MyOrders.tsx`
6. ⏳ `src/pages/Login.tsx`
7. ⏳ `src/pages/Index.tsx`
8. ⏳ `src/pages/PhoneCaseCustomizer.tsx`
9. ⏳ `src/pages/Register.tsx`

## Benefits

1. **Maintainability**: Change API URL in one place (`.env` file)
2. **Type Safety**: TypeScript ensures correct endpoint usage
3. **Consistency**: All API calls follow the same pattern
4. **Security**: Centralized token management
5. **Testing**: Easy to mock endpoints for testing
6. **Documentation**: Self-documenting code with clear endpoint names

## Best Practices

1. **Always use constants** instead of hardcoding URLs
2. **Use helper functions** for headers to ensure consistency
3. **Update .env file** when changing environments
4. **Add new endpoints** to apiConstants.ts when needed
5. **Keep token logic centralized** - don't access localStorage directly for tokens
