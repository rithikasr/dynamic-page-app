/**
 * API Configuration Constants
 * 
 * This file contains all API-related constants used throughout the application.
 * Centralizing these values makes it easier to maintain and update API endpoints.
 */

// Base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://z0vx5pwf-3000.inc1.devtunnels.ms';

/**
 * API Endpoints
 * All endpoints are organized by feature/domain
 */
export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
        VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
        RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    },

    // Product endpoints
    PRODUCTS: {
        BASE: `${API_BASE_URL}/api/products`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/products/${id}`,
    },

    // Admin endpoints
    ADMIN: {
        ORDERS: `${API_BASE_URL}/admin/orders`,
    },

    // Order endpoints
    ORDERS: {
        MY_ORDERS: `${API_BASE_URL}/api/orders/my-orders`,
    },

    // Payment endpoints
    PAYMENT: {
        CREATE_CHECKOUT_SESSION: `${API_BASE_URL}/api/payment/create-checkout-session`,
    },

    // Phone models endpoints
    PHONE_MODELS: {
        REQUEST: `${API_BASE_URL}/api/phone-models/request`,
    },

    // Pricing endpoints
    PRICING: {
        PHONE_CASE: `${API_BASE_URL}/api/pricing/phone-case`,
        T_SHIRT: `${API_BASE_URL}/api/pricing/t-shirt`,
        // Admin endpoints
        ADMIN: {
            ALL: `${API_BASE_URL}/api/admin/pricing`,
            INITIALIZE: `${API_BASE_URL}/api/admin/pricing/initialize`,
            PHONE_CASE: `${API_BASE_URL}/api/admin/pricing/phone-case`,
            T_SHIRT: `${API_BASE_URL}/api/admin/pricing/t-shirt`,
            DELETE: (type: string) => `${API_BASE_URL}/api/admin/pricing/${type}`,
        },
    },
} as const;

/**
 * HTTP Headers
 * Common headers used across API requests
 */
export const API_HEADERS = {
    CONTENT_TYPE_JSON: 'application/json',
} as const;

/**
 * Storage Keys
 * Keys used for localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
} as const;

/**
 * Helper function to get authorization token
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Helper function to get common headers with authorization
 */
export const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
        'Content-Type': API_HEADERS.CONTENT_TYPE_JSON,
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

/**
 * Helper function to get headers without content-type (for FormData)
 */
export const getAuthHeadersWithoutContentType = (): HeadersInit => {
    const token = getAuthToken();
    return {
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};
