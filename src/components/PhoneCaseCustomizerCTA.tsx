import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Palette, Type, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Phone Case Customizer CTA Component
 * 
 * Add this to your homepage or products page to promote the customizer
 * 
 * Usage:
 * import PhoneCaseCustomizerCTA from '@/components/PhoneCaseCustomizerCTA';
 * 
 * <PhoneCaseCustomizerCTA />
 */
export default function PhoneCaseCustomizerCTA() {
    return (
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Design Your Custom Phone Case
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mt-2">
                    Create a unique phone case with your photos, text, and decorations
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm font-semibold text-gray-700">Multiple Models</p>
                        <p className="text-xs text-gray-500">iPhone, Samsung, OnePlus</p>
                    </div>

                    <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <Palette className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                        <p className="text-sm font-semibold text-gray-700">8 Colors</p>
                        <p className="text-xs text-gray-500">Premium case colors</p>
                    </div>

                    <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <Type className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-700">Custom Text</p>
                        <p className="text-xs text-gray-500">7 fonts, any color</p>
                    </div>

                    <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm font-semibold text-gray-700">Stickers</p>
                        <p className="text-xs text-gray-500">24+ decorations</p>
                    </div>
                </div>

                {/* CTA Button */}
                <Link to="/customize-phone-case" className="block">
                    <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Start Designing Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>

                {/* Pricing */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Starting at <span className="text-2xl font-bold text-purple-600">₹499</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Free shipping on orders over ₹999</p>
                </div>
            </CardContent>
        </Card>
    );
}
