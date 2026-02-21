/**
 * Cart API
 * All cart-related API calls — add, remove, save for later, move back to cart, fetch cart.
 */
import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CartProduct {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    category?: string;
}

export interface CartCustomization {
    designImageUrl?: string | null;
    productType?: string | null;      // 'phone-case' | 't-shirt'
    phoneModel?: string | null;
    caseColor?: string | null;
    shirtType?: string | null;
    shirtSize?: string | null;
    shirtColor?: string | null;
    hasCustomDesign?: boolean;
}

export interface CartItem {
    product: CartProduct | string;     // populated or just ID
    quantity: number;
    customization?: CartCustomization | null;
}

export interface CartData {
    cartItems: CartItem[];
    savedForLater: CartItem[];
}

// ─── Helper ────────────────────────────────────────────────────────────────

const postCart = async (url: string, body: object) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// ─── Get Cart ──────────────────────────────────────────────────────────────

/** Fetch the current user's cart (cartItems + savedForLater, products populated). */
export const getCart = async (): Promise<CartData> => {
    const res = await fetch(API_ENDPOINTS.CART.GET, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to load cart');
    }
    const data = await res.json();
    return {
        cartItems: data.cartItems || [],
        savedForLater: data.savedForLater || [],
    };
};

// ─── Add to Cart ───────────────────────────────────────────────────────────

/**
 * Add a product to the cart, optionally with design customization.
 * For customized items, each call creates a new line (designs are unique).
 */
export const addToCart = async (
    productId: string,
    quantity = 1,
    customization?: CartCustomization | null
) => {
    return postCart(API_ENDPOINTS.CART.ADD, {
        productId,
        quantity,
        customization: customization ?? null,
    });
};

// ─── Remove from Cart ──────────────────────────────────────────────────────

/** Remove from active cart. Pass itemIndex when multiple lines for same product exist. */
export const removeFromCart = async (productId: string, itemIndex?: number) => {
    return postCart(API_ENDPOINTS.CART.REMOVE, {
        productId,
        ...(typeof itemIndex === 'number' ? { itemIndex } : {}),
    });
};

// ─── Remove from Saved For Later ───────────────────────────────────────────

/** Remove from saved-for-later list. Pass itemIndex when needed. */
export const removeFromSaved = async (productId: string, itemIndex?: number) => {
    return postCart(API_ENDPOINTS.CART.REMOVE_SAVED, {
        productId,
        ...(typeof itemIndex === 'number' ? { itemIndex } : {}),
    });
};

// ─── Save for Later ────────────────────────────────────────────────────────

/** Move a product from active cart → saved-for-later list. */
export const saveForLater = async (productId: string, itemIndex?: number) => {
    return postCart(API_ENDPOINTS.CART.SAVE_FOR_LATER, {
        productId,
        ...(typeof itemIndex === 'number' ? { itemIndex } : {}),
    });
};

// ─── Move Back to Cart ─────────────────────────────────────────────────────

/** Move a product from saved-for-later list → active cart. */
export const moveBackToCart = async (productId: string, itemIndex?: number) => {
    return postCart(API_ENDPOINTS.CART.MOVE_TO_CART, {
        productId,
        ...(typeof itemIndex === 'number' ? { itemIndex } : {}),
    });
};
