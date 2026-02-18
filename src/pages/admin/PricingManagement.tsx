import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_ENDPOINTS, getAuthHeaders } from '@/constants/apiConstants';
import { AlertCircle, Check, Loader2, RefreshCw } from 'lucide-react';

interface TShirtType {
    id: string;
    name: string;
    price: number;
}

export default function AdminPricingPanel() {
    const [phoneCasePrice, setPhoneCasePrice] = useState(499);
    const [tshirtTypes, setTshirtTypes] = useState<TShirtType[]>([
        { id: 'half-sleeve', name: 'Rounded Neck (Half Sleeve)', price: 599 },
        { id: 'v-neck', name: 'V-Neck T-Shirt', price: 649 },
        { id: 'polo', name: 'Polo T-Shirt', price: 799 },
        { id: 'full-sleeve', name: 'Full Sleeve T-Shirt', price: 699 },
        { id: 'oversized', name: 'Oversized T-Shirt', price: 749 },
        { id: 'sweatshirt', name: 'Sweatshirt', price: 999 },
    ]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState<'phone' | 'tshirt' | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchAllPricing();
    }, []);

    const fetchAllPricing = async () => {
        setLoading(true);
        try {
            // Fetch phone case pricing
            const phoneCaseRes = await fetch(API_ENDPOINTS.PRICING.PHONE_CASE);
            const phoneCaseData = await phoneCaseRes.json();
            if (phoneCaseData.success && phoneCaseData.pricing) {
                setPhoneCasePrice(phoneCaseData.pricing.basePrice);
            }

            // Fetch t-shirt pricing
            const tshirtRes = await fetch(API_ENDPOINTS.PRICING.T_SHIRT);
            const tshirtData = await tshirtRes.json();
            if (tshirtData.success && tshirtData.pricing && tshirtData.pricing.tshirtTypes) {
                setTshirtTypes(tshirtData.pricing.tshirtTypes);
            }
        } catch (err) {
            console.error('Failed to fetch pricing:', err);
            showMessage('error', 'Failed to load pricing data');
        } finally {
            setLoading(false);
        }
    };

    const updatePhoneCasePrice = async () => {
        setSaving('phone');
        try {
            const res = await fetch(API_ENDPOINTS.PRICING.ADMIN.PHONE_CASE, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ basePrice: phoneCasePrice })
            });

            const data = await res.json();
            if (data.success) {
                showMessage('success', 'Phone case price updated successfully!');
            } else {
                showMessage('error', 'Failed to update phone case price');
            }
        } catch (err) {
            console.error('Error updating phone case price:', err);
            showMessage('error', 'An error occurred while updating');
        } finally {
            setSaving(null);
        }
    };

    const updateTShirtPricing = async () => {
        setSaving('tshirt');
        try {
            const res = await fetch(API_ENDPOINTS.PRICING.ADMIN.T_SHIRT, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ tshirtTypes })
            });

            const data = await res.json();
            if (data.success) {
                showMessage('success', 'T-shirt pricing updated successfully!');
            } else {
                showMessage('error', 'Failed to update t-shirt pricing');
            }
        } catch (err) {
            console.error('Error updating t-shirt pricing:', err);
            showMessage('error', 'An error occurred while updating');
        } finally {
            setSaving(null);
        }
    };

    const initializePricing = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.PRICING.ADMIN.INITIALIZE, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            const data = await res.json();
            if (data.success) {
                showMessage('success', 'Default pricing initialized successfully!');
                fetchAllPricing();
            } else {
                showMessage('error', 'Failed to initialize pricing');
            }
        } catch (err) {
            console.error('Error initializing pricing:', err);
            showMessage('error', 'An error occurred during initialization');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const updateTShirtTypePrice = (id: string, newPrice: number) => {
        setTshirtTypes(prev =>
            prev.map(type =>
                type.id === id ? { ...type, price: newPrice } : type
            )
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Management</h1>
                <p className="text-gray-600">Configure pricing for custom products. Changes take effect immediately.</p>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message.type === 'success' ? (
                        <Check className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mb-6 flex gap-3">
                <Button
                    onClick={fetchAllPricing}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Pricing
                </Button>
                <Button
                    onClick={initializePricing}
                    variant="outline"
                    disabled={loading}
                >
                    Initialize Default Pricing
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phone Case Pricing */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        📱 Phone Case Pricing
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="phonePrice" className="text-sm font-medium text-gray-700">
                                Base Price (₹)
                            </Label>
                            <Input
                                id="phonePrice"
                                type="number"
                                value={phoneCasePrice}
                                onChange={(e) => setPhoneCasePrice(Number(e.target.value))}
                                className="mt-1"
                                min="0"
                                step="1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This price applies to all phone case models
                            </p>
                        </div>
                        <Button
                            onClick={updatePhoneCasePrice}
                            disabled={saving === 'phone'}
                            className="w-full"
                        >
                            {saving === 'phone' ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Phone Case Price'
                            )}
                        </Button>
                    </div>
                </Card>

                {/* T-Shirt Pricing */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        👕 T-Shirt Pricing
                    </h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {tshirtTypes.map((type) => (
                            <div key={type.id} className="flex items-center gap-3">
                                <Label className="flex-1 text-sm font-medium text-gray-700">
                                    {type.name}
                                </Label>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-500">₹</span>
                                    <Input
                                        type="number"
                                        value={type.price}
                                        onChange={(e) => updateTShirtTypePrice(type.id, Number(e.target.value))}
                                        className="w-24"
                                        min="0"
                                        step="1"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={updateTShirtPricing}
                        disabled={saving === 'tshirt'}
                        className="w-full mt-4"
                    >
                        {saving === 'tshirt' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update All T-Shirt Prices'
                        )}
                    </Button>
                </Card>
            </div>

            {/* Current Pricing Summary */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Current Pricing Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Phone Case</p>
                        <p className="text-2xl font-bold text-blue-600">₹{phoneCasePrice}</p>
                    </div>
                    {tshirtTypes.map((type) => (
                        <div key={type.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-xs text-gray-500 mb-1 truncate" title={type.name}>
                                {type.name}
                            </p>
                            <p className="text-2xl font-bold text-indigo-600">₹{type.price}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Important Notes
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>Price changes take effect immediately for new orders</li>
                    <li>Existing orders retain their original pricing</li>
                    <li>All prices are in Indian Rupees (₹)</li>
                    <li>Users will see updated prices after refreshing the customizer page</li>
                </ul>
            </div>
        </div>
    );
}
