/**
 * REFACTORING EXAMPLES
 * 
 * This file shows before/after examples for refactoring pages to use API constants.
 * Use these patterns when updating the remaining pages.
 */

// ============================================================================
// EXAMPLE 1: Login Page
// ============================================================================

// ❌ BEFORE (Login.tsx - Line 27)
/*
const response = await fetch(
  "https://z0vx5pwf-3000.inc1.devtunnels.ms/auth/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS } from '../constants/apiConstants';

const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

// ============================================================================
// EXAMPLE 2: Register Page
// ============================================================================

// ❌ BEFORE (Register.tsx - Line 28)
/*
const response = await fetch(
  "https://z0vx5pwf-3000.inc1.devtunnels.ms/auth/register",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS } from '../constants/apiConstants';

const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name, email, password }),
});

// ============================================================================
// EXAMPLE 3: Product Page with Dynamic ID
// ============================================================================

// ❌ BEFORE (ProductPage.tsx - Line 46)
/*
const res = await fetch(
  `https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products/${id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
  headers: getAuthHeaders(),
});

// ============================================================================
// EXAMPLE 4: Payment Checkout Session
// ============================================================================

// ❌ BEFORE (ProductPage.tsx, TShirtCustomizer.tsx, PhoneCaseCustomizer.tsx)
/*
const res = await fetch(
  "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/payment/create-checkout-session",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(orderData),
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const res = await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
  method: "POST",
  headers: getAuthHeaders(),
  body: JSON.stringify(orderData),
});

// ============================================================================
// EXAMPLE 5: My Orders Page
// ============================================================================

// ❌ BEFORE (MyOrders.tsx - Line 38)
/*
const res = await fetch(
  "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/orders/my-orders",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const res = await fetch(API_ENDPOINTS.ORDERS.MY_ORDERS, {
  headers: getAuthHeaders(),
});

// ============================================================================
// EXAMPLE 6: Phone Models Request
// ============================================================================

// ❌ BEFORE (PhoneCaseCustomizer.tsx - Line 155)
/*
const response = await fetch(
  'https://z0vx5pwf-3000.inc1.devtunnels.ms/api/phone-models/request',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ brand, model }),
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const response = await fetch(API_ENDPOINTS.PHONE_MODELS.REQUEST, {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify({ brand, model }),
});

// ============================================================================
// EXAMPLE 7: Index Page (Products List)
// ============================================================================

// ❌ BEFORE (Index.tsx - Line 32)
/*
const res = await fetch(
  "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
*/

// ✅ AFTER
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

const res = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
  headers: getAuthHeaders(),
});

// ============================================================================
// KEY POINTS TO REMEMBER
// ============================================================================

/*
1. Always import from '../constants/apiConstants' (adjust path as needed)
2. Use API_ENDPOINTS for URLs
3. Use getAuthHeaders() for authenticated requests with JSON
4. Use getAuthHeadersWithoutContentType() for FormData uploads
5. Remove manual localStorage.getItem("token") calls
6. Remove hardcoded "Content-Type": "application/json" when using getAuthHeaders()
*/
