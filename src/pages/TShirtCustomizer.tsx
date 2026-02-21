import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import {
    Upload,
    Type,
    Eye,
    Download,
    Trash2,
    ShoppingCart,
    Shirt,
    Search,
    AlertCircle,
    Plus,
    Check,
    Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import Moveable from 'react-moveable';
import { fetchProducts } from '@/api/products';
import { API_ENDPOINTS, getAuthHeaders, STORAGE_KEYS } from '@/constants/apiConstants';

// T-Shirt sizes
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

// T-Shirt colors
const TSHIRT_COLORS = [
    { name: 'White', value: '#ffffff', border: '#e5e7eb' },
    { name: 'Black', value: '#1a1a1a', border: '#1a1a1a' },
    { name: 'Grey', value: '#9ca3af', border: '#9ca3af' },
    { name: 'Navy', value: '#1e3a8a', border: '#1e3a8a' },
    { name: 'Red', value: '#ef4444', border: '#ef4444' },
    { name: 'Blue', value: '#3b82f6', border: '#3b82f6' },
    { name: 'Green', value: '#22c55e', border: '#22c55e' },
    { name: 'Yellow', value: '#eab308', border: '#eab308' },
    { name: 'Purple', value: '#7e22ce', border: '#7e22ce' },
    { name: 'Orange', value: '#f97316', border: '#f97316' },
];

// T-Shirt Types
const TSHIRT_TYPES = [
    { id: 'half-sleeve', name: 'Rounded Neck (Half Sleeve)', price: 599 },
    { id: 'v-neck', name: 'V-Neck T-Shirt', price: 649 },
    { id: 'polo', name: 'Polo T-Shirt', price: 799 },
    { id: 'full-sleeve', name: 'Full Sleeve T-Shirt', price: 699 },
    { id: 'oversized', name: 'Oversized T-Shirt', price: 749 },
    { id: 'sweatshirt', name: 'Sweatshirt', price: 999 },
];

// Decorative stickers 
const STICKERS = [
    '⭐', '❤️', '🌟', '✨', '🌈', '🦋', '🌸', '🌺',
    '🎨', '🎭', '🎪', '🎯', '🎮', '🎵', '🎸', '🎹',
    '☀️', '🌙', '⚡', '🔥', '💫', '🌊', '🍀', '🌻'
];

// Text fonts
const FONTS = [
    'Arial',
    'Georgia',
    'Courier New',
    'Comic Sans MS',
    'Impact',
    'Brush Script MT',
    'Lucida Handwriting'
];

interface DesignElement {
    id: string;
    type: 'image' | 'text' | 'sticker';
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    scale: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}

export default function TShirtCustomizer() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // T-shirt state
    const [shirtType, setShirtType] = useState<string>('half-sleeve');
    const [size, setSize] = useState<string>('L');
    const [color, setColor] = useState('#ffffff');
    const [designElements, setDesignElements] = useState<DesignElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [moveableTarget, setMoveableTarget] = useState<HTMLElement | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [targetProduct, setTargetProduct] = useState<any>(null);

    // Dynamic pricing from backend (fallback to TSHIRT_TYPES defaults)
    const [tshirtPricing, setTshirtPricing] = useState<Record<string, number>>({
        'half-sleeve': 599,
        'v-neck': 649,
        'polo': 799,
        'full-sleeve': 699,
        'oversized': 749,
        'sweatshirt': 999
    });

    // Text editor state
    const [textInput, setTextInput] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(36);
    const [fontFamily, setFontFamily] = useState('Arial');

    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const elementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // T-shirt dimensions
    const TSHIRT_WIDTH = 500;
    const TSHIRT_HEIGHT = 600;

    // Get SVG Path based on type
    const getShirtPath = (type: string) => {
        switch (type) {
            case 'v-neck':
                return "M150,20 L250,90 L350,20 L450,80 L420,180 L390,160 L390,580 L110,580 L110,160 L80,180 L50,80 z";
            case 'full-sleeve':
                return "M150,20 Q250,60 350,20 L450,80 L450,550 L400,550 L390,160 L390,580 L110,580 L110,160 L100,550 L50,550 L50,80 z";
            case 'sweatshirt':
                return "M140,20 Q250,50 360,20 L460,90 L460,560 L410,560 L400,180 L400,590 L100,590 L100,180 L90,560 L40,560 L40,90 z";
            case 'oversized':
                return "M120,20 Q250,60 380,20 L480,100 L450,280 L420,260 L420,600 L80,600 L80,260 L50,280 L20,100 z";
            case 'polo':
            case 'half-sleeve':
            default:
                // Standard Round Neck
                return "M150,20 Q250,60 350,20 L450,80 L420,180 L390,160 L390,580 L110,580 L110,160 L80,180 L50,80 z";
        }
    };

    // Render shirt details (collars, buttons etc)
    const renderShirtDetails = () => {
        if (shirtType === 'polo') {
            return (
                <g className="pointer-events-none">
                    {/* Polo Collar */}
                    <path d="M150,20 Q180,50 220,70 L250,90 L280,70 Q320,50 350,20" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                    <path d="M150,20 L220,70 L250,140 L280,70 L350,20" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                    {/* Placket */}
                    <rect x="235" y="60" width="30" height="120" rx="2" fill="rgba(0,0,0,0.05)" />
                    <circle cx="250" cy="80" r="3" fill="rgba(0,0,0,0.3)" />
                    <circle cx="250" cy="110" r="3" fill="rgba(0,0,0,0.3)" />
                    <circle cx="250" cy="140" r="3" fill="rgba(0,0,0,0.3)" />
                </g>
            );
        }
        if (shirtType === 'sweatshirt') {
            return (
                <g className="pointer-events-none">
                    {/* Cuffs */}
                    <path d="M410,560 L460,560" stroke="rgba(0,0,0,0.1)" strokeWidth="10" />
                    <path d="M40,560 L90,560" stroke="rgba(0,0,0,0.1)" strokeWidth="10" />
                    {/* Bottom hem */}
                    <path d="M100,590 L400,590" stroke="rgba(0,0,0,0.1)" strokeWidth="10" />
                    {/* Neck hem */}
                    <path d="M140,20 Q250,50 360,20" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="8" />
                </g>
            );
        }
        if (shirtType === 'half-sleeve') {
            return (
                <g className="pointer-events-none">
                    {/* Collar Detail */}
                    <path d="M150,20 Q250,60 350,20" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
                </g>
            );
        }
        return null;
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const newElement: DesignElement = {
                id: `img-${Date.now()}`,
                type: 'image',
                content: event.target?.result as string,
                x: 150,
                y: 150,
                width: 200,
                height: 200,
                rotation: 0,
                scale: 1
            };
            setDesignElements([...designElements, newElement]);
            setSelectedElement(newElement.id);
        };
        reader.readAsDataURL(file);
    };

    // Add text
    const handleAddText = () => {
        if (!textInput.trim()) return;

        const newElement: DesignElement = {
            id: `text-${Date.now()}`,
            type: 'text',
            content: textInput,
            x: 150,
            y: 200,
            width: 200,
            height: 60,
            rotation: 0,
            scale: 1,
            fontSize,
            fontFamily,
            color: textColor
        };
        setDesignElements([...designElements, newElement]);
        setSelectedElement(newElement.id);
        setTextInput('');
    };

    // Add sticker
    const handleAddSticker = (sticker: string) => {
        const newElement: DesignElement = {
            id: `sticker-${Date.now()}`,
            type: 'sticker',
            content: sticker,
            x: 200,
            y: 250,
            width: 80,
            height: 80,
            rotation: 0,
            scale: 1
        };
        setDesignElements([...designElements, newElement]);
        setSelectedElement(newElement.id);
    };

    // Delete selected element
    const handleDeleteElement = () => {
        if (!selectedElement) return;
        setDesignElements(designElements.filter(el => el.id !== selectedElement));
        setSelectedElement(null);
    };

    // Update element position/transform
    const updateElement = (id: string, updates: Partial<DesignElement>) => {
        setDesignElements(designElements.map(el =>
            el.id === id ? { ...el, ...updates } : el
        ));
    };

    // Download design
    const handleDownload = async () => {
        alert('Download functionality will export your design');
    };

    // Update moveable target
    useEffect(() => {
        if (selectedElement && elementRefs.current[selectedElement]) {
            setMoveableTarget(elementRefs.current[selectedElement]);
        } else {
            setMoveableTarget(null);
        }
    }, [selectedElement, designElements]);


    const { productId } = useParams();

    // Fetch dynamic pricing from backend
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



    // Fetch product for checkout or restore design
    useEffect(() => {
        const loadProduct = async () => {
            // 0. Check for saved design (restore strategy)
            const savedDesignJSON = localStorage.getItem('TEMP_TSHIRT_DESIGN');
            if (savedDesignJSON) {
                try {
                    const parsed = JSON.parse(savedDesignJSON);

                    // Restore all state
                    if (parsed.shirtType) setShirtType(parsed.shirtType);
                    if (parsed.size) setSize(parsed.size);
                    if (parsed.color) setColor(parsed.color);
                    if (parsed.designElements) setDesignElements(parsed.designElements);
                    if (parsed.targetProduct) setTargetProduct(parsed.targetProduct);

                    // Clear the temporary state
                    localStorage.removeItem('TEMP_TSHIRT_DESIGN');
                    return; // Stop here, use restored data
                } catch (e) {
                    console.error("Error parsing saved design", e);
                    // continue to normal load if error
                }
            }

            // 1. Check if product was passed via navigation state
            if (location.state?.product) {
                setTargetProduct(location.state.product);
                return;
            }

            // 2. Check if productId is in URL
            if (productId) {
                try {
                    const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(productId), {
                        headers: getAuthHeaders(),
                    });
                    const data = await res.json();
                    if (data.product) {
                        setTargetProduct(data.product);
                        return;
                    }
                } catch (err) {
                    console.error("Failed to load product by ID", err);
                }
            }

            try {
                const products = await fetchProducts();
                // Find the t-shirt product
                const found = products.find((p: any) =>
                    p.name.toLowerCase().includes('t-shirt') ||
                    p.category === 't-shirt' ||
                    p.category === 'clothing'
                );

                if (found) {
                    setTargetProduct(found);
                } else {
                    // Fallback mock product
                    setTargetProduct({
                        id: 't-shirt-fallback',
                        name: 'Custom T-Shirt',
                        price: 599,
                        _id: 't-shirt-123'
                    });
                }
            } catch (err) {
                console.error("Failed to load product for checkout", err);
                setTargetProduct({
                    id: 't-shirt-fallback',
                    name: 'Custom T-Shirt',
                    price: 599,
                    _id: 't-shirt-123'
                });
            }
        };
        loadProduct();
    }, [location.state, productId]);


    const handleBuy = async () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            const designState = { shirtType, size, color, designElements, targetProduct };
            localStorage.setItem('TEMP_TSHIRT_DESIGN', JSON.stringify(designState));
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!targetProduct) {
            alert("Product info is loading...");
            return;
        }

        console.log("Checking html2canvas:", html2canvas);
        if (typeof html2canvas === 'undefined' || !html2canvas) {
            alert("Error: html2canvas library is not loaded properly.");
            return;
        }

        // 1. Capture Design
        setSelectedElement(null);
        await new Promise(resolve => setTimeout(resolve, 100));
        let designImageUrl = '';

        if (canvasRef.current) {
            try {
                console.log("Starting design capture...");
                const canvas = await html2canvas(canvasRef.current, {
                    useCORS: true,
                    scale: 2,
                    backgroundColor: null,
                    logging: true // Enable html2canvas logging
                });

                console.log("Canvas created, converting to blob...");
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));

                if (blob) {
                    const formData = new FormData();
                    formData.append('image', blob, 'design.png');

                    const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/design`;
                    console.log("Uploading design to:", uploadUrl);

                    try {
                        const uploadRes = await fetch(uploadUrl, {
                            method: 'POST',
                            body: formData
                        });

                        if (uploadRes.ok) {
                            const uploadData = await uploadRes.json();
                            designImageUrl = uploadData.url;
                            console.log("Design image uploaded successfully:", designImageUrl);
                        } else {
                            const errorText = await uploadRes.text();
                            console.error("Design upload failed. Status:", uploadRes.status, "Response:", errorText);
                            alert(`Warning: Design upload failed (${uploadRes.status}). Proceeding without design image.`);
                        }
                    } catch (uploadErr) {
                        console.error("Network error during design upload:", uploadErr);
                        alert(`Error uploading design: ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}. Check console for details.`);
                    }
                } else {
                    console.error("Failed to create blob from canvas");
                    alert("Error: Could not process design image.");
                }
            } catch (err) {
                console.error("Failed to capture design canvas:", err);
                alert(`Design capture failed: ${err instanceof Error ? err.message : String(err)}. Proceeding without design image...`);
            }
        }

        console.log("Proceeding to checkout with design URL:", designImageUrl);

        // 2. Checkout
        const selectedType = TSHIRT_TYPES.find(t => t.id === shirtType);
        let rawPrice = tshirtPricing[shirtType] || targetProduct?.price || 599;
        let finalPrice = 599;
        if (typeof rawPrice === 'number') finalPrice = rawPrice;
        else if (typeof rawPrice === 'string') {
            const parsed = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
            if (!isNaN(parsed) && parsed > 0) finalPrice = parsed;
        }
        try {
            const res = await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    productId: targetProduct._id || targetProduct.id,
                    price: finalPrice,
                    metadata: {
                        shirtType: selectedType?.name,
                        size,
                        color,
                        customDesign: true,
                        designImage: designImageUrl, // Pass the image URL
                        design_image: designImageUrl // Also pass as snake_case
                    }
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(`Checkout failed: ${data.message || data.error}`);
                return;
            }
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert(`Something went wrong`);
        }
    };

    const selectedElementData = designElements.find(el => el.id === selectedElement);
    const selectedTypeInfo = TSHIRT_TYPES.find(t => t.id === shirtType);

    const { toast } = useToast();
    const [cartLoading, setCartLoading] = useState(false);

    /** Capture the t-shirt canvas and upload the design preview. Returns upload URL or ''. */
    const captureAndUploadDesign = async (): Promise<string> => {
        if (!canvasRef.current) return '';
        try {
            setSelectedElement(null);
            await new Promise(r => setTimeout(r, 120));
            const { default: html2canvas } = await import('html2canvas');
            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: null,
            });
            const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/png'));
            if (!blob) return '';

            const formData = new FormData();
            formData.append('image', blob, 'design.png');
            const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/upload/design`;
            const uploadRes = await fetch(uploadUrl, { method: 'POST', body: formData });
            if (!uploadRes.ok) return '';
            const uploadData = await uploadRes.json();
            return uploadData.url || '';
        } catch (err) {
            console.error('Design capture/upload failed:', err);
            return '';
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            const designState = { shirtType, size, color, designElements, targetProduct };
            localStorage.setItem('TEMP_TSHIRT_DESIGN', JSON.stringify(designState));
            navigate('/login', { state: { from: location } });
            return;
        }
        if (!targetProduct) return;

        setCartLoading(true);
        try {
            const designImageUrl = await captureAndUploadDesign();
            const res = await fetch(API_ENDPOINTS.CART.ADD, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    productId: targetProduct._id || targetProduct.id,
                    quantity: 1,
                    customization: {
                        designImageUrl: designImageUrl || null,
                        productType: 't-shirt',
                        shirtType: TSHIRT_TYPES.find(t => t.id === shirtType)?.name || shirtType,
                        shirtSize: size,
                        shirtColor: color,
                        hasCustomDesign: true
                    }
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast({ title: '🛒 Added to Cart!', description: 'Your custom t-shirt has been saved to cart.' });
                setShowPreview(false);
            } else {
                toast({ title: 'Error', description: data.message || 'Failed to add to cart', variant: 'destructive' });
            }
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
        } finally {
            setCartLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                        👕 Design Your T-Shirt
                    </h1>
                    <p className="text-gray-600 text-lg">Wear your imagination. Custom prints on high-quality cotton.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Design Tools */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-indigo-100">
                            <Tabs defaultValue="tshirt" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 bg-indigo-100">
                                    <TabsTrigger value="tshirt" className="data-[state=active]:bg-white">
                                        <Shirt className="h-4 w-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="image" className="data-[state=active]:bg-white">
                                        <Upload className="h-4 w-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="text" className="data-[state=active]:bg-white">
                                        <Type className="h-4 w-4" />
                                    </TabsTrigger>
                                    <TabsTrigger value="decor" className="data-[state=active]:bg-white">
                                        ✨
                                    </TabsTrigger>
                                </TabsList>

                                {/* T-Shirt Selection */}
                                <TabsContent value="tshirt" className="space-y-4 mt-4">

                                    {/* Type Selection */}
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            👔 T-Shirt Style
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                            {TSHIRT_TYPES.map((type) => (
                                                <div
                                                    key={type.id}
                                                    onClick={() => setShirtType(type.id)}
                                                    className={`cursor-pointer border-2 rounded-lg p-2 text-sm transition-all flex flex-col justify-between ${shirtType === type.id
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                        : 'border-gray-200 hover:border-indigo-300'
                                                        }`}
                                                >
                                                    <span className="font-semibold">{type.name}</span>
                                                    <span className="text-xs text-gray-500">₹{tshirtPricing[type.id] || type.price}</span>
                                                    {shirtType === type.id && <Check className="h-4 w-4 text-indigo-600 self-end mt-1" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            📏 Select Size
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {SIZES.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSize(s)}
                                                    className={`w-12 h-12 rounded-lg border-2 font-bold transition-all ${size === s
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-110'
                                                        : 'bg-white text-gray-700 border-indigo-200 hover:border-indigo-400'
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Selection */}
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            🎨 T-Shirt Color
                                        </Label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {TSHIRT_COLORS.map((c) => (
                                                <button
                                                    key={c.value}
                                                    onClick={() => setColor(c.value)}
                                                    className={`h-10 rounded-lg border-2 transition-all hover:scale-105 ${color === c.value
                                                        ? 'ring-2 ring-indigo-500 scale-110 shadow-md'
                                                        : 'hover:border-indigo-300'
                                                        }`}
                                                    style={{
                                                        backgroundColor: c.value,
                                                        borderColor: c.border
                                                    }}
                                                    title={c.name}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm text-blue-800 font-medium">
                                            <AlertCircle className="inline w-4 h-4 mr-1 mb-1" />
                                            Summary: {selectedTypeInfo?.name}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1 pl-5">
                                            Size: {size} • Color: {TSHIRT_COLORS.find(c => c.value === color)?.name}
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* Image Upload */}
                                <TabsContent value="image" className="space-y-4 mt-4">
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            🖼️ Upload Design
                                        </Label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                                        >
                                            <Upload className="mx-auto h-12 w-12 text-indigo-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">Click to upload</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG recommended (Max 10MB)</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Text Editor */}
                                <TabsContent value="text" className="space-y-4 mt-4">
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            ✍️ Add Text
                                        </Label>
                                        <Input
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            placeholder="Enter your text..."
                                            className="mb-2 border-2 border-indigo-200 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">Font</Label>
                                        <select
                                            value={fontFamily}
                                            onChange={(e) => setFontFamily(e.target.value)}
                                            className="w-full p-2 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            {FONTS.map((font) => (
                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            Size: {fontSize}px
                                        </Label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="120"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="w-full accent-indigo-600"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">Text Color</Label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-indigo-200"
                                            />
                                            <Input
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="flex-1 border-2 border-indigo-200"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleAddText}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg"
                                    >
                                        <Type className="mr-2 h-4 w-4" />
                                        Add Text
                                    </Button>
                                </TabsContent>

                                {/* Decorations */}
                                <TabsContent value="decor" className="space-y-4 mt-4">
                                    <div className="grid grid-cols-6 gap-2 max-h-80 overflow-y-auto p-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
                                        {STICKERS.map((sticker, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAddSticker(sticker)}
                                                className="text-3xl hover:scale-125 transition-transform p-3 hover:bg-white rounded-lg shadow-sm"
                                            >
                                                {sticker}
                                            </button>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>

                        {/* Element Controls */}
                        {selectedElement && selectedElementData && (
                            <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-indigo-100">
                                <h3 className="font-semibold mb-3 text-gray-700">
                                    Selected: {selectedElementData.type}
                                </h3>
                                <Button
                                    onClick={handleDeleteElement}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Element
                                </Button>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-indigo-100 space-y-2">
                            <Button
                                onClick={() => setShowPreview(true)}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="w-full border-2 border-indigo-300 hover:bg-indigo-50"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Design
                            </Button>
                        </Card>
                    </div>

                    {/* Center - Canvas */}
                    <div className="lg:col-span-2">
                        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-indigo-100 min-h-[700px] flex items-center justify-center">
                            <div ref={canvasRef} className="relative" style={{ width: TSHIRT_WIDTH, height: TSHIRT_HEIGHT }}>
                                {/* T-Shirt SVG Shape */}
                                <svg
                                    viewBox="0 0 500 600"
                                    className="absolute inset-0 w-full h-full drop-shadow-2xl transition-all duration-500 ease-in-out"
                                    style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
                                >
                                    <path
                                        d={getShirtPath(shirtType)}
                                        fill={color}
                                        stroke={color === 'transparent' || color === '#ffffff' ? '#e5e7eb' : 'none'}
                                        strokeWidth="2"
                                        className="transition-all duration-500"
                                    />
                                    {renderShirtDetails()}

                                    {/* Sleeves Detail (Generic if matches) */}
                                    {!['full-sleeve', 'sweatshirt', 'oversized'].includes(shirtType) && (
                                        <>
                                            <path d="M110,160 L110,580" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
                                            <path d="M390,160 L390,580" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
                                        </>
                                    )}
                                </svg>

                                {/* Print Area (approximate center chest) */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div
                                        className="relative w-full h-full z-10"
                                    >
                                        {designElements.map((element) => (
                                            <div key={element.id}>
                                                <div
                                                    ref={(el) => (elementRefs.current[element.id] = el)}
                                                    onClick={() => setSelectedElement(element.id)}
                                                    className={`absolute cursor-move select-none ${selectedElement === element.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                                                        }`}
                                                    style={{
                                                        left: element.x,
                                                        top: element.y,
                                                        width: element.width,
                                                        height: element.height,
                                                        transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                                                        transformOrigin: 'center'
                                                    }}
                                                >
                                                    {element.type === 'image' && (
                                                        <img
                                                            src={element.content}
                                                            alt="Design"
                                                            className="w-full h-full object-cover"
                                                            draggable={false}
                                                        />
                                                    )}
                                                    {element.type === 'text' && (
                                                        <div
                                                            className="font-bold select-none leading-none"
                                                            style={{
                                                                fontSize: element.fontSize,
                                                                fontFamily: element.fontFamily,
                                                                color: element.color,
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {element.content}
                                                        </div>
                                                    )}
                                                    {element.type === 'sticker' && (
                                                        <div className="text-6xl select-none flex items-center justify-center w-full h-full">{element.content}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <Moveable
                                            target={moveableTarget}
                                            draggable={true}
                                            scalable={true}
                                            rotatable={true}
                                            keepRatio={designElements.find(el => el.id === selectedElement)?.type === 'image' || designElements.find(el => el.id === selectedElement)?.type === 'sticker'}
                                            snappable={true}
                                            bounds={{ left: 50, top: 80, right: 450, bottom: 580 }} // Constrain to shirt body roughly
                                            onDrag={({ target, left, top }) => {
                                                target.style.left = `${left}px`;
                                                target.style.top = `${top}px`;
                                            }}
                                            onDragEnd={({ target }) => {
                                                if (!selectedElement) return;
                                                const left = parseFloat(target.style.left);
                                                const top = parseFloat(target.style.top);
                                                updateElement(selectedElement, { x: left, y: top });
                                            }}
                                            onScale={({ target, transform }) => {
                                                target.style.transform = transform;
                                            }}
                                            onScaleEnd={({ target }) => {
                                                if (!selectedElement) return;
                                                const transform = target.style.transform;
                                                const scaleMatch = transform.match(/scale\(([^)]+)\)/);
                                                if (scaleMatch) {
                                                    const scale = parseFloat(scaleMatch[1]);
                                                    updateElement(selectedElement, { scale });
                                                }
                                            }}
                                            onRotate={({ target, transform }) => {
                                                target.style.transform = transform;
                                            }}
                                            onRotateEnd={({ target }) => {
                                                if (!selectedElement) return;
                                                const transform = target.style.transform;
                                                const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
                                                if (rotateMatch) {
                                                    const rotation = parseFloat(rotateMatch[1]);
                                                    updateElement(selectedElement, { rotation });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 text-center w-full">
                                <p className="text-sm text-gray-500">
                                    💡 Click elements to edit • Drag to move • Resize & Rotate
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
                <DialogTitle className="text-center font-bold text-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    🎉 Your Custom {selectedTypeInfo?.name}
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-col items-center space-y-6 p-4">
                        <div className="relative w-[300px] h-[360px]">
                            <svg
                                viewBox="0 0 500 600"
                                className="absolute inset-0 w-full h-full drop-shadow-xl"
                            >
                                <path
                                    d={getShirtPath(shirtType)}
                                    fill={color}
                                    stroke={color === 'transparent' || color === '#ffffff' ? '#e5e7eb' : 'none'}
                                    strokeWidth="2"
                                />
                                {renderShirtDetails()}
                            </svg>

                            <div className="absolute inset-0 overflow-hidden scale-[0.6] origin-top-left" style={{ width: '166%', height: '166%' }}>
                                {designElements.map((element) => (
                                    <div
                                        key={element.id}
                                        className="absolute"
                                        style={{
                                            left: element.x,
                                            top: element.y,
                                            width: element.width,
                                            height: element.height,
                                            transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                                            transformOrigin: 'center'
                                        }}
                                    >
                                        {element.type === 'image' && (
                                            <img src={element.content} alt="Design" className="w-full h-full object-cover" />
                                        )}
                                        {element.type === 'text' && (
                                            <div
                                                className="font-bold leading-none"
                                                style={{
                                                    fontSize: element.fontSize,
                                                    fontFamily: element.fontFamily,
                                                    color: element.color,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {element.content}
                                            </div>
                                        )}
                                        {element.type === 'sticker' && (
                                            <div className="text-6xl flex items-center justify-center">{element.content}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 w-full bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl">
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-700">Type:</span>
                                <span className="text-gray-900">{selectedTypeInfo?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-700">Size:</span>
                                <span className="text-gray-900 font-bold">{size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-700">Elements:</span>
                                <span className="text-gray-900">{designElements.length} custom elements</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-3">
                                <span className="font-semibold text-gray-700">Price:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                    ₹{tshirtPricing[shirtType] || targetProduct?.price || 599}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={() => setShowPreview(false)}
                                variant="outline"
                                className="flex-1 border-2 border-indigo-300"
                            >
                                Edit More
                            </Button>
                            <Button
                                id="buy-now-btn"
                                onClick={handleBuy}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg"
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Buy Now
                            </Button>
                        </div>
                        <Button
                            id="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                        >
                            {cartLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                            {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
