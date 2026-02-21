import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, ShoppingCart, ArrowLeft, Heart, Archive, Loader2, Package, Palette, X, ZoomIn } from 'lucide-react';
import { STORAGE_KEYS, API_ENDPOINTS, getAuthHeaders } from '@/constants/apiConstants';
import {
    getCart,
    removeFromCart,
    removeFromSaved,
    saveForLater,
    moveBackToCart,
    CartItem,
    CartProduct,
    CartCustomization,
} from '@/api/cart';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Extract product fields whether or not the product is populated. */
const getProductInfo = (item: CartItem): { id: string; name: string; price: number; image: string } => {
    if (typeof item.product === 'string') {
        return { id: item.product, name: 'Product', price: 0, image: '' };
    }
    const p = item.product as CartProduct;
    return {
        id: p._id,
        name: p.name,
        price: p.price,
        image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '',
    };
};

// ─── Design Customization Badge ───────────────────────────────────────────────

const CustomizationBadge = ({ c }: { c: CartCustomization }) => {
    if (!c?.hasCustomDesign) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-1 items-center">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                <Palette className="h-3 w-3" /> Custom Design
            </span>
            {c.phoneModel && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    📱 {c.phoneModel}
                </span>
            )}
            {c.caseColor && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    <span
                        className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                        style={{ backgroundColor: c.caseColor }}
                    />
                    Case
                </span>
            )}
            {c.shirtType && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600">
                    👕 {c.shirtType}
                </span>
            )}
            {c.shirtSize && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    Size: {c.shirtSize}
                </span>
            )}
            {c.shirtColor && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                    <span
                        className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                        style={{ backgroundColor: c.shirtColor }}
                    />
                    Colour
                </span>
            )}
        </div>
    );
};

// ─── Full-screen Design Lightbox ─────────────────────────────────────────────

const DesignLightbox = ({ url, onClose }: { url: string; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.88)' }}
            onClick={onClose}
        >
            {/* Close button */}
            <button
                id="lightbox-close-btn"
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2 transition-all hover:bg-black/70 z-10"
                onClick={onClose}
                aria-label="Close preview"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Image — stop click propagation so clicking the image doesn't close */}
            <div
                className="relative max-w-[92vw] max-h-[92vh] flex items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={url}
                    alt="Custom design full view"
                    className="rounded-2xl shadow-2xl object-contain"
                    style={{ maxWidth: '90vw', maxHeight: '88vh' }}
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white/80 text-xs px-3 py-1 rounded-full">
                    Press ESC or click outside to close
                </div>
            </div>
        </div>
    );
};

// ─── Product Image (with custom design overlay) ───────────────────────────────

const ItemImage = ({
    productImage,
    customization,
    name,
    size = 24,
    onOpenLightbox,
}: {
    productImage: string;
    customization?: CartCustomization | null;
    name: string;
    size?: number;
    onOpenLightbox?: (url: string) => void;
}) => {
    const cls = `flex-shrink-0 overflow-hidden rounded-lg bg-gray-100`;
    const style = { width: size * 4, height: size * 4 };

    const designUrl = customization?.designImageUrl;

    if (designUrl) {
        // Show the captured design screenshot — clickable for full view
        return (
            <div
                className={`${cls} relative cursor-zoom-in group`}
                style={style}
                onClick={() => onOpenLightbox?.(designUrl)}
                title="Click to view full design"
            >
                <img
                    src={designUrl}
                    alt={`Custom design for ${name}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
            </div>
        );
    }

    if (productImage) {
        return (
            <div className={cls} style={style}>
                <img src={productImage} alt={name} className="w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className={`${cls} flex items-center justify-center text-gray-300 text-xs`} style={style}>
            No Image
        </div>
    );
};

// ─── Component ───────────────────────────────────────────────────────────────

const Cart = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedItems, setSavedItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    // Use composite key `${productId}-${index}` for per-row loading
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // ── Fetch cart ─────────────────────────────────────────────────────────

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCartItems(data.cartItems);
            setSavedItems(data.savedForLater);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load cart',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, []);

    // ── Cart total ──────────────────────────────────────────────────────────

    const total = cartItems.reduce((acc, item) => {
        const { price } = getProductInfo(item);
        return acc + price * item.quantity;
    }, 0);

    // ── Action handlers ─────────────────────────────────────────────────────

    const handleRemoveFromCart = async (productId: string, itemIndex: number) => {
        const key = `cart-${productId}-${itemIndex}`;
        setActionLoading(key);
        try {
            await removeFromCart(productId, itemIndex);
            await fetchCart();
            toast({ title: '🗑️ Removed from cart' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveFromSaved = async (productId: string, itemIndex: number) => {
        const key = `saved-${productId}-${itemIndex}`;
        setActionLoading(key);
        try {
            await removeFromSaved(productId, itemIndex);
            await fetchCart();
            toast({ title: '🗑️ Removed from saved list' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveForLater = async (productId: string, itemIndex: number) => {
        const key = `save-${productId}-${itemIndex}`;
        setActionLoading(key);
        try {
            await saveForLater(productId, itemIndex);
            await fetchCart();
            toast({ title: '💾 Saved for later' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleMoveToCart = async (productId: string, itemIndex: number) => {
        const key = `move-${productId}-${itemIndex}`;
        setActionLoading(key);
        try {
            await moveBackToCart(productId, itemIndex);
            await fetchCart();
            toast({ title: '🛒 Moved back to cart' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setActionLoading(null);
        }
    };

    // ── Stripe Checkout ─────────────────────────────────────────────────────

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setCheckoutLoading(true);
        try {
            // Build the payload: one entry per cart item
            const lineItems = cartItems.map((item) => {
                const { id, name, price } = getProductInfo(item);
                return {
                    productId: id,
                    productName: name,
                    price,
                    quantity: item.quantity,
                    customization: item.customization ?? null,
                };
            });

            const res = await fetch(API_ENDPOINTS.PAYMENT.CART_CHECKOUT_SESSION, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ cartItems: lineItems }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast({
                    title: 'Checkout failed',
                    description: data.message || 'Unknown error',
                    variant: 'destructive',
                });
                return;
            }

            if (data.url) {
                // Redirect to Stripe-hosted checkout page
                window.location.href = data.url;
            } else {
                toast({ title: 'Error', description: 'No checkout URL returned', variant: 'destructive' });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setCheckoutLoading(false);
        }
    };

    // ── Loading state ───────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    <p className="text-sm font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Full-screen design lightbox */}
            {lightboxUrl && (
                <DesignLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
            )}

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => navigate(-1)} id="cart-back-btn">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ───── Left Column: Cart Items + Saved For Later ───── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Cart Items */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-purple-600" />
                                Cart Items ({cartItems.length})
                            </h2>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-sm">Your cart is empty</p>
                                    <Button
                                        variant="link"
                                        className="mt-2 text-purple-600"
                                        onClick={() => navigate('/explore')}
                                        id="explore-products-btn"
                                    >
                                        Explore Products
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {cartItems.map((item, idx) => {
                                        const { id, name, price, image } = getProductInfo(item);
                                        const key = `cart-${id}-${idx}`;
                                        const isActing = actionLoading === key ||
                                            actionLoading === `save-${id}-${idx}` ||
                                            actionLoading === `cart-${id}-${idx}`;

                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col sm:flex-row gap-4 border-b last:border-0 pb-5 last:pb-0"
                                            >
                                                {/* Product / Design Image */}
                                                <ItemImage
                                                    productImage={image}
                                                    customization={item.customization}
                                                    name={name}
                                                    size={24}
                                                    onOpenLightbox={setLightboxUrl}
                                                />

                                                {/* Details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold text-gray-800">{name}</h3>
                                                        <p className="font-bold text-gray-900">₹{price}</p>
                                                    </div>

                                                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>

                                                    {/* Customization badges */}
                                                    {item.customization && (
                                                        <CustomizationBadge c={item.customization} />
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex gap-2 mt-3">
                                                        <Button
                                                            id={`save-later-btn-${id}-${idx}`}
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={isActing}
                                                            onClick={() => handleSaveForLater(id, idx)}
                                                        >
                                                            {isActing ? (
                                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                            ) : (
                                                                <Heart className="h-3 w-3 mr-1" />
                                                            )}
                                                            Save for Later
                                                        </Button>

                                                        <Button
                                                            id={`remove-cart-btn-${id}-${idx}`}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isActing}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleRemoveFromCart(id, idx)}
                                                        >
                                                            {isActing ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-3 w-3" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Saved for Later */}
                        {savedItems.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Archive className="h-5 w-5 text-indigo-500" />
                                    Saved for Later ({savedItems.length})
                                </h2>
                                <div className="space-y-4">
                                    {savedItems.map((item, idx) => {
                                        const { id, name, price, image } = getProductInfo(item);
                                        const key = `saved-${id}-${idx}`;
                                        const isActing = actionLoading === key ||
                                            actionLoading === `move-${id}-${idx}`;

                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col sm:flex-row gap-4 border-b last:border-0 pb-4 last:pb-0"
                                            >
                                                {/* Product / Design Image */}
                                                <ItemImage
                                                    productImage={image}
                                                    customization={item.customization}
                                                    name={name}
                                                    size={20}
                                                    onOpenLightbox={setLightboxUrl}
                                                />

                                                {/* Details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium text-gray-800">{name}</h3>
                                                        <p className="font-bold text-sm text-gray-900">₹{price}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>

                                                    {/* Customization badges */}
                                                    {item.customization && (
                                                        <CustomizationBadge c={item.customization} />
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex gap-2 mt-3 justify-end">
                                                        <Button
                                                            id={`remove-saved-btn-${id}-${idx}`}
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isActing}
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleRemoveFromSaved(id, idx)}
                                                        >
                                                            {isActing ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Remove'}
                                                        </Button>

                                                        <Button
                                                            id={`move-to-cart-btn-${id}-${idx}`}
                                                            size="sm"
                                                            variant="secondary"
                                                            disabled={isActing}
                                                            onClick={() => handleMoveToCart(id, idx)}
                                                        >
                                                            {isActing ? (
                                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                            ) : (
                                                                <ShoppingCart className="h-3 w-3 mr-1" />
                                                            )}
                                                            Move to Cart
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ───── Right Column: Order Summary ───── */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                {cartItems.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-4">No items in cart</p>
                                ) : (
                                    <>
                                        <div className="space-y-2 mb-4">
                                            {cartItems.map((item, idx) => {
                                                const { name, price } = getProductInfo(item);
                                                const isCustom = item.customization?.hasCustomDesign;
                                                return (
                                                    <div key={`summary-${idx}`} className="flex justify-between text-sm text-gray-600">
                                                        <span className="truncate mr-2">
                                                            {name} {isCustom && '🎨'} × {item.quantity}
                                                        </span>
                                                        <span className="flex-shrink-0">₹{price * item.quantity}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="border-t pt-3 mt-3 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span>₹{total}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Shipping</span>
                                                <span className="text-green-600 font-medium">Free</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                                <span>Total</span>
                                                <span>₹{total}</span>
                                            </div>
                                        </div>

                                        <Button
                                            id="checkout-btn"
                                            size="lg"
                                            className="w-full mt-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                                            disabled={checkoutLoading}
                                            onClick={handleCheckout}
                                        >
                                            {checkoutLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Redirecting to Payment...
                                                </>
                                            ) : (
                                                'Proceed to Checkout'
                                            )}
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
