import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeaders, STORAGE_KEYS } from '@/constants/apiConstants';
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
    Smartphone,
    Search,
    AlertCircle,
    Plus
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Moveable from 'react-moveable';

import { PHONE_MODELS, PhoneModel } from '@/data/phones';
import { fetchProducts } from '@/api/products';

// Generic/Universal phone template for unavailable models
const GENERIC_PHONE_TEMPLATE: PhoneModel = {
    id: 'generic',
    name: 'Universal Phone',
    brand: 'Generic',
    frameWidth: 350,
    frameHeight: 710,
    printArea: { x: 25, y: 125, width: 300, height: 500 },
    camera: {
        type: 'triple-vertical',
        x: 30,
        y: 30,
        width: 70,
        height: 100,
        borderRadius: '30px'
    },
    available: true
};

// Case colors
const CASE_COLORS = [
    { name: 'Clear', value: 'transparent', border: '#e5e7eb' },
    { name: 'Black', value: '#000000', border: '#000000' },
    { name: 'White', value: '#ffffff', border: '#e5e7eb' },
    { name: 'Navy', value: '#1e3a8a', border: '#1e3a8a' },
    { name: 'Rose', value: '#fda4af', border: '#fda4af' },
    { name: 'Mint', value: '#6ee7b7', border: '#6ee7b7' },
    { name: 'Lavender', value: '#c4b5fd', border: '#c4b5fd' },
    { name: 'Coral', value: '#fb7185', border: '#fb7185' }
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

export default function PhoneCaseCustomizer() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Phone models state
    // Convert array to record for easier lookup
    const initialModels = PHONE_MODELS.reduce((acc, model) => {
        acc[model.id] = model;
        return acc;
    }, {} as Record<string, PhoneModel>);

    const [phoneModels] = useState<Record<string, PhoneModel>>(initialModels);
    const [loadingModels] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModel, setSelectedModel] = useState<string>('iphone-15-pro-max');

    // Model request state
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestBrand, setRequestBrand] = useState('');
    const [requestModel, setRequestModel] = useState('');
    const [requestEmail, setRequestEmail] = useState('');

    const [caseColor, setCaseColor] = useState('#ffffff');
    const [designElements, setDesignElements] = useState<DesignElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [moveableTarget, setMoveableTarget] = useState<HTMLElement | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [targetProduct, setTargetProduct] = useState<any>(null);
    const [phoneCasePrice, setPhoneCasePrice] = useState(499); // Dynamic pricing from backend

    // Text editor state
    const [textInput, setTextInput] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');

    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const elementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const model = phoneModels[selectedModel] || GENERIC_PHONE_TEMPLATE;

    // Filter models based on search
    const filteredModels = Object.values(phoneModels).filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group models by brand
    const modelsByBrand = filteredModels.reduce((acc, model) => {
        if (!acc[model.brand]) {
            acc[model.brand] = [];
        }
        acc[model.brand].push(model);
        return acc;
    }, {} as Record<string, PhoneModel[]>);

    // Handle model request submission
    const handleRequestModel = async () => {
        if (!requestBrand || !requestModel) {
            alert('Please fill in brand and model name');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.PHONE_MODELS.REQUEST, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    brand: requestBrand,
                    model: requestModel,
                    email: requestEmail
                })
            });

            if (response.ok) {
                alert('✅ Thank you! We\'ll add this model soon and notify you.');
                setShowRequestForm(false);
                setRequestBrand('');
                setRequestModel('');
                setRequestEmail('');
            } else {
                alert('Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Failed to submit model request:', error);
            alert('Failed to submit request. Please try again.');
        }
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
                x: 50,
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
            x: 50,
            y: 200,
            width: 150,
            height: 50,
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
            x: 100,
            y: 250,
            width: 60,
            height: 60,
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
        alert('Download functionality will export your design as PNG');
    };

    // Reset design when model changes
    useEffect(() => {
        setDesignElements([]);
        setSelectedElement(null);
    }, [selectedModel]);

    // Update moveable target
    useEffect(() => {
        if (selectedElement && elementRefs.current[selectedElement]) {
            setMoveableTarget(elementRefs.current[selectedElement]);
        } else {
            setMoveableTarget(null);
        }
    }, [selectedElement, designElements]);

    const location = useLocation();

    const { productId } = useParams();

    // Fetch dynamic pricing from backend
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.PRICING.PHONE_CASE);
                const data = await res.json();
                if (data.success && data.pricing) {
                    setPhoneCasePrice(data.pricing.basePrice);
                }
            } catch (err) {
                console.error('Failed to fetch phone case pricing:', err);
                // Keep default price of 499
            }
        };
        fetchPricing();
    }, []);

    // Fetch product for checkout
    useEffect(() => {
        const loadProduct = async () => {
            // 0. Check for saved design (restore strategy)
            const savedDesignJSON = localStorage.getItem('TEMP_PHONE_CASE_DESIGN');
            if (savedDesignJSON) {
                try {
                    const parsed = JSON.parse(savedDesignJSON);

                    // Restore all state
                    if (parsed.selectedModel) setSelectedModel(parsed.selectedModel);
                    if (parsed.caseColor) setCaseColor(parsed.caseColor);
                    if (parsed.designElements) setDesignElements(parsed.designElements);
                    if (parsed.targetProduct) setTargetProduct(parsed.targetProduct);
                    if (parsed.phoneCasePrice) setPhoneCasePrice(parsed.phoneCasePrice);

                    // Clear the temporary state
                    localStorage.removeItem('TEMP_PHONE_CASE_DESIGN');
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
                // Find the phone case product
                const found = products.find((p: any) =>
                    p.name.toLowerCase().includes('phone case') ||
                    p.category === 'phone-case'
                );

                if (found) {
                    setTargetProduct(found);
                } else {
                    // Fallback mock product if not found in API
                    setTargetProduct({
                        id: 'phone-case-fallback',
                        name: 'Custom Phone Case',
                        price: 19.99,
                        _id: '6989b4e9056f78d7517dee41' // Use a valid product ID for testing if needed
                    });
                }
            } catch (err) {
                console.error("Failed to load product for checkout", err);
                // Fallback on error
                setTargetProduct({
                    id: 'phone-case-fallback',
                    name: 'Custom Phone Case',
                    price: 19.99,
                    _id: '6989b4e9056f78d7517dee41'
                });
            }
        };
        loadProduct();
    }, [location.state, productId]);

    const handleBuy = async () => {
        // Check if user is logged in
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            // Save state before redirecting
            const designState = {
                selectedModel,
                caseColor,
                designElements,
                targetProduct,
                phoneCasePrice
            };
            localStorage.setItem('TEMP_PHONE_CASE_DESIGN', JSON.stringify(designState));

            // Navigate to login if not authenticated
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!targetProduct) {
            alert("Product info is loading...");
            return;
        }

        // Get the selected phone model details
        const selectedPhoneModel = phoneModels[selectedModel] || GENERIC_PHONE_TEMPLATE;

        // Ensure price is a number. Check targetProduct.price first, fall back to phoneCasePrice.
        let rawPrice = targetProduct?.price;
        let finalPrice = phoneCasePrice; // Default to the dynamic price from API

        if (typeof rawPrice === 'number') {
            finalPrice = rawPrice;
        } else if (typeof rawPrice === 'string') {
            // Remove non-numeric characters except decimal point
            const parsed = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
            if (!isNaN(parsed) && parsed > 0) {
                finalPrice = parsed;
            }
        }

        // If finalPrice is still invalid, fallback to default
        if (!finalPrice || isNaN(finalPrice)) {
            finalPrice = 499;
        }

        const price = finalPrice;

        console.log('Creating checkout session with:', {
            productId: targetProduct._id || targetProduct.id,
            finalPrice,
            phoneModel: selectedPhoneModel.name,
            caseColor
        });

        try {
            const res = await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    productId: targetProduct._id || targetProduct.id,
                    price: price, // Dynamic price from admin
                    metadata: {
                        phoneModel: selectedPhoneModel.name,
                        caseColor: caseColor,
                        customDesign: true
                    }
                }),
            });

            const data = await res.json();

            // Check if response is not OK (4xx or 5xx)
            if (!res.ok) {
                console.error('Checkout failed:', data);
                alert(`Checkout failed: ${data.message || data.error || 'Unknown error'}`);
                return;
            }

            if (data.url) {
                window.location.href = data.url; // redirect to Stripe Checkout
            } else {
                console.error('No checkout URL in response:', data);
                alert("Failed to create checkout session - no URL returned");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert(`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const selectedElementData = designElements.find(el => el.id === selectedElement);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        🎨 Design Your Phone Case
                    </h1>
                    <p className="text-gray-600 text-lg">Create a unique phone case that's truly yours</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Design Tools */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-100">
                            <Tabs defaultValue="phone" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 bg-purple-100">
                                    <TabsTrigger value="phone" className="data-[state=active]:bg-white">
                                        <Smartphone className="h-4 w-4" />
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

                                {/* Phone Model Selection */}
                                <TabsContent value="phone" className="space-y-4 mt-4">
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            📱 Select Phone Model
                                        </Label>

                                        {/* Search Bar */}
                                        <div className="relative mb-3">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search phone model..."
                                                className="pl-10 border-2 border-purple-200"
                                            />
                                        </div>

                                        {/* Model Dropdown */}
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full p-3 border-2 border-purple-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all max-h-48 overflow-y-auto"
                                            disabled={loadingModels}
                                        >
                                            {loadingModels ? (
                                                <option>Loading models...</option>
                                            ) : Object.keys(modelsByBrand).length === 0 ? (
                                                <option>No models found</option>
                                            ) : (
                                                Object.entries(modelsByBrand).map(([brand, models]) => (
                                                    <optgroup key={brand} label={brand}>
                                                        {models.map((model) => (
                                                            <option key={model.id} value={model.id}>
                                                                {model.name} {!model.available && '(Coming Soon)'}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))
                                            )}
                                        </select>

                                        {/* Model Not Found Message */}
                                        {filteredModels.length === 0 && searchQuery && (
                                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-amber-900">Model not found</p>
                                                        <p className="text-xs text-amber-700 mt-1">
                                                            Can't find "{searchQuery}"? Request it below!
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Request New Model Button */}
                                        <Button
                                            onClick={() => setShowRequestForm(true)}
                                            variant="outline"
                                            className="w-full mt-3 border-2 border-purple-300 hover:bg-purple-50"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Request New Model
                                        </Button>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            🎨 Case Color
                                        </Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {CASE_COLORS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setCaseColor(color.value)}
                                                    className={`h-14 rounded-xl border-2 transition-all hover:scale-105 ${caseColor === color.value
                                                        ? 'ring-4 ring-purple-500 scale-110 shadow-lg'
                                                        : 'hover:border-purple-300'
                                                        }`}
                                                    style={{
                                                        backgroundColor: color.value,
                                                        borderColor: color.border
                                                    }}
                                                    title={color.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Image Upload */}
                                <TabsContent value="image" className="space-y-4 mt-4">
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            🖼️ Upload Your Image
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
                                            className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
                                        >
                                            <Upload className="mx-auto h-12 w-12 text-purple-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">Click to upload</p>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (Max 5MB)</p>
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
                                            className="mb-2 border-2 border-purple-200 focus:border-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">Font Style</Label>
                                        <select
                                            value={fontFamily}
                                            onChange={(e) => setFontFamily(e.target.value)}
                                            className="w-full p-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                                            max="72"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            className="w-full accent-purple-600"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">Text Color</Label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-purple-200"
                                            />
                                            <Input
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="flex-1 border-2 border-purple-200"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleAddText}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                                    >
                                        <Type className="mr-2 h-4 w-4" />
                                        Add Text to Design
                                    </Button>
                                </TabsContent>

                                {/* Decorations */}
                                <TabsContent value="decor" className="space-y-4 mt-4">
                                    <div>
                                        <Label className="text-sm font-semibold mb-2 block text-gray-700">
                                            ✨ Stickers & Emojis
                                        </Label>
                                        <div className="grid grid-cols-6 gap-2 max-h-80 overflow-y-auto p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
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
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>

                        {/* Element Controls */}
                        {selectedElement && selectedElementData && (
                            <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-100">
                                <h3 className="font-semibold mb-3 text-gray-700">
                                    Selected: {selectedElementData.type === 'image' ? '🖼️ Image' :
                                        selectedElementData.type === 'text' ? '📝 Text' : '✨ Sticker'}
                                </h3>
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleDeleteElement}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Element
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-100 space-y-2">
                            <Button
                                onClick={() => setShowPreview(true)}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview Design
                            </Button>
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="w-full border-2 border-purple-300 hover:bg-purple-50"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Design
                            </Button>
                        </Card>
                    </div>

                    {/* Center - Canvas Preview */}
                    <div className="lg:col-span-2">
                        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-purple-100">
                            <div className="flex justify-center items-center">
                                <div
                                    ref={canvasRef}
                                    className="relative rounded-[2.5rem] shadow-2xl overflow-hidden"
                                    style={{
                                        width: model.frameWidth,
                                        height: model.frameHeight,
                                        backgroundColor: caseColor,
                                        border: caseColor === 'transparent' ? '3px solid #e5e7eb' : 'none'
                                    }}
                                >
                                    {/* Phone Frame Outline */}
                                    <div
                                        className="absolute border-[6px] border-gray-900 rounded-[2.5rem] pointer-events-none z-20"
                                        style={{
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        {/* Back Camera Module */}
                                        <div
                                            className="absolute bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl"
                                            style={{
                                                left: model.camera.x,
                                                top: model.camera.y,
                                                width: model.camera.width,
                                                height: model.camera.height,
                                                borderRadius: model.camera.borderRadius,
                                                border: '3px solid #1f2937'
                                            }}
                                        >
                                            {/* Camera Lenses based on type */}
                                            {model.camera.type === 'dual-diagonal' && (
                                                <>
                                                    <div className="absolute top-3 left-3 w-8 h-8 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute bottom-3 right-3 w-8 h-8 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute top-3 right-3 w-3 h-3 bg-blue-400 rounded-full" />
                                                </>
                                            )}
                                            {model.camera.type === 'triple-square' && (
                                                <>
                                                    <div className="absolute top-3 left-3 w-9 h-9 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute top-3 right-3 w-9 h-9 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute bottom-3 left-3 w-9 h-9 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute bottom-3 right-3 w-4 h-4 bg-amber-400 rounded-full" />
                                                </>
                                            )}
                                            {model.camera.type === 'triple-vertical' && (
                                                <>
                                                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                </>
                                            )}
                                            {model.camera.type === 'quad-vertical' && (
                                                <>
                                                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-11 h-11 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-11 h-11 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute top-[4.5rem] left-1/2 transform -translate-x-1/2 w-11 h-11 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-11 h-11 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                </>
                                            )}
                                            {model.camera.type === 'circular-module' && (
                                                <>
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gray-950 rounded-full border-3 border-gray-700" />
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="absolute bottom-2 left-2 w-4 h-4 bg-blue-400 rounded-full" />
                                                </>
                                            )}
                                            {model.camera.type === 'horizontal-bar' && (
                                                <div className="flex items-center gap-4 px-4 h-full">
                                                    <div className="w-16 h-10 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                    <div className="w-4 h-4 bg-gray-950 rounded-full border-2 border-gray-700" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Print Area Guide */}
                                    <div
                                        className="absolute border-2 border-dashed border-gray-400 opacity-20 pointer-events-none z-10"
                                        style={{
                                            left: model.printArea.x,
                                            top: model.printArea.y,
                                            width: model.printArea.width,
                                            height: model.printArea.height
                                        }}
                                    />

                                    {/* Design Elements */}
                                    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                                        {designElements.map((element) => (
                                            <div key={element.id}>
                                                <div
                                                    ref={(el) => (elementRefs.current[element.id] = el)}
                                                    onClick={() => setSelectedElement(element.id)}
                                                    className={`absolute cursor-move select-none ${selectedElement === element.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''
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
                                                            className="w-full h-full object-cover rounded-lg shadow-lg"
                                                            draggable={false}
                                                        />
                                                    )}
                                                    {element.type === 'text' && (
                                                        <div
                                                            className="font-bold select-none"
                                                            style={{
                                                                fontSize: element.fontSize,
                                                                fontFamily: element.fontFamily,
                                                                color: element.color,
                                                                whiteSpace: 'nowrap',
                                                                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                                                            }}
                                                        >
                                                            {element.content}
                                                        </div>
                                                    )}
                                                    {element.type === 'sticker' && (
                                                        <div className="text-6xl select-none">{element.content}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Moveable controls */}
                                        <Moveable
                                            target={moveableTarget}
                                            draggable={true}
                                            scalable={true}
                                            rotatable={true}
                                            keepRatio={designElements.find(el => el.id === selectedElement)?.type === 'image'}
                                            throttleDrag={0}
                                            throttleRotate={0}
                                            throttleScale={0}
                                            snappable={true}
                                            bounds={{ left: 0, top: 0, right: model.frameWidth, bottom: model.frameHeight }}
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

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    💡 <strong>Tip:</strong> Click elements to select • Drag to move • Use handles to resize & rotate
                                </p>
                                <div className="flex justify-center gap-4 text-xs text-gray-500">
                                    <span>📱 Model: {model.brand} {model.name}</span>
                                    <span>•</span>
                                    <span>🎨 Elements: {designElements.length}</span>
                                </div>
                            </div>
                        </Card >
                    </div >
                </div >
            </div >

            {/* Request New Model Dialog */}
            < Dialog open={showRequestForm} onClose={() => setShowRequestForm(false)
            } maxWidth="sm" fullWidth >
                <DialogTitle className="text-center font-bold text-2xl">
                    📱 Request New Phone Model
                </DialogTitle>
                <DialogContent>
                    <div className="space-y-4 p-4">
                        <p className="text-sm text-gray-600 text-center">
                            Can't find your phone model? Let us know and we'll add it!
                        </p>

                        <div>
                            <Label className="text-sm font-semibold mb-2 block">Brand *</Label>
                            <Input
                                value={requestBrand}
                                onChange={(e) => setRequestBrand(e.target.value)}
                                placeholder="e.g., Samsung, Apple, OnePlus"
                                className="border-2 border-purple-200"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-semibold mb-2 block">Model Name *</Label>
                            <Input
                                value={requestModel}
                                onChange={(e) => setRequestModel(e.target.value)}
                                placeholder="e.g., Galaxy S24, iPhone 15 Pro"
                                className="border-2 border-purple-200"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-semibold mb-2 block">Email (Optional)</Label>
                            <Input
                                type="email"
                                value={requestEmail}
                                onChange={(e) => setRequestEmail(e.target.value)}
                                placeholder="We'll notify you when it's added"
                                className="border-2 border-purple-200"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={() => setShowRequestForm(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRequestModel}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                                Submit Request
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >

            {/* Preview Modal - (keeping existing preview code) */}
            < Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth >
                <DialogTitle className="text-center font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🎉 Your Custom Phone Case
                </DialogTitle>
                <DialogContent>
                    <div className="flex flex-col items-center space-y-6 p-4">
                        <div
                            className="relative rounded-[2rem] shadow-2xl"
                            style={{
                                width: model.frameWidth * 0.8,
                                height: model.frameHeight * 0.8,
                                backgroundColor: caseColor,
                                border: caseColor === 'transparent' ? '2px solid #e5e7eb' : 'none'
                            }}
                        >
                            {/* Simplified preview */}
                            <div className="absolute border-[5px] border-gray-900 rounded-[2rem] pointer-events-none w-full h-full z-20">
                                {/* Back Camera Module (scaled) */}
                                <div
                                    className="absolute bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl"
                                    style={{
                                        left: model.camera.x * 0.8,
                                        top: model.camera.y * 0.8,
                                        width: model.camera.width * 0.8,
                                        height: model.camera.height * 0.8,
                                        borderRadius: model.camera.borderRadius,
                                        border: '2px solid #1f2937'
                                    }}
                                >
                                    {/* Simplified camera lenses for preview */}
                                    {/* Detailed camera lenses for preview (scaled 0.8) */}
                                    {model.camera.type === 'dual-diagonal' && (
                                        <>
                                            <div className="absolute top-2 left-2 w-6 h-6 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full" />
                                        </>
                                    )}
                                    {model.camera.type === 'triple-square' && (
                                        <>
                                            <div className="absolute top-2 left-2 w-7 h-7 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute top-2 right-2 w-7 h-7 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute bottom-2 left-2 w-7 h-7 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute bottom-2 right-2 w-3 h-3 bg-amber-400 rounded-full" />
                                        </>
                                    )}
                                    {model.camera.type === 'triple-vertical' && (
                                        <>
                                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-950 rounded-full border border-gray-700" />
                                        </>
                                    )}
                                    {model.camera.type === 'quad-vertical' && (
                                        <>
                                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute top-[3.5rem] left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gray-950 rounded-full border border-gray-700" />
                                        </>
                                    )}
                                    {model.camera.type === 'circular-module' && (
                                        <>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-gray-950 rounded-full border-2 border-gray-700" />
                                            <div className="absolute top-1 right-1 w-5 h-5 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="absolute bottom-1 left-1 w-3 h-3 bg-blue-400 rounded-full" />
                                        </>
                                    )}
                                    {model.camera.type === 'horizontal-bar' && (
                                        <div className="flex items-center gap-2 px-6 h-full">
                                            <div className="w-12 h-6 bg-gray-950 rounded-full border border-gray-700" />
                                            <div className="w-2 h-2 bg-gray-950 rounded-full border border-gray-700" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                                {designElements.map((element) => (
                                    <div
                                        key={element.id}
                                        className="absolute"
                                        style={{
                                            left: element.x * 0.8,
                                            top: element.y * 0.8,
                                            width: element.width * 0.8,
                                            height: element.height * 0.8,
                                            transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                                            transformOrigin: 'center'
                                        }}
                                    >
                                        {element.type === 'image' && (
                                            <img src={element.content} alt="Design" className="w-full h-full object-cover rounded-lg" />
                                        )}
                                        {element.type === 'text' && (
                                            <div
                                                style={{
                                                    fontSize: (element.fontSize || 24) * 0.8,
                                                    fontFamily: element.fontFamily,
                                                    color: element.color,
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {element.content}
                                            </div>
                                        )}
                                        {element.type === 'sticker' && (
                                            <div className="text-5xl">{element.content}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 w-full bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-700">Model:</span>
                                <span className="text-gray-900">{model.brand} {model.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-700">Elements:</span>
                                <span className="text-gray-900">{designElements.length} custom elements</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-3">
                                <span className="font-semibold text-gray-700">Price:</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹499</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button
                                onClick={() => setShowPreview(false)}
                                variant="outline"
                                className="flex-1 border-2 border-purple-300"
                            >
                                Edit More
                            </Button>
                            <Button
                                onClick={handleBuy}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
