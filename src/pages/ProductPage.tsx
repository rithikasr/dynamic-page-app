import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Eye, Star, Shield, Truck, RotateCcw } from 'lucide-react';

const ProductPage = () => {
  const { category } = useParams();
  const { t } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const productData = {
    'phone-case': {
      name: t('products.phoneCase'),
      emoji: '📱',
      price: '$19.99',
      description: 'Premium quality phone cases with your custom design',
      features: [
        'Durable TPU material',
        'Scratch resistant',
        'Precise camera cutouts',
        'Wireless charging compatible'
      ]
    },
    'mug': {
      name: t('products.mug'),
      emoji: '☕',
      price: '$14.99',
      description: 'Ceramic mugs perfect for your morning coffee',
      features: [
        'High-quality ceramic',
        'Dishwasher safe',
        '11oz capacity',
        'Fade-resistant print'
      ]
    },
    'bottle': {
      name: t('products.bottle'),
      emoji: '🍶',
      price: '$24.99',
      description: 'Insulated water bottles for everyday use',
      features: [
        'Double-wall insulation',
        'Keeps drinks cold 24hrs',
        'BPA-free materials',
        '500ml capacity'
      ]
    }
  };

  const product = productData[category as keyof typeof productData] || productData['phone-case'];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Customizer */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Your {product.name}</h2>
              
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {t('common.upload')}
                  </p>
                  <p className="text-gray-600">
                    Drop your image here or click to browse
                  </p>
                </label>
              </div>

              {/* Live Preview */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Eye className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">{t('common.preview')}</span>
                </div>
                
                <div className="relative mx-auto" style={{ width: '200px', height: '200px' }}>
                  <div className="text-8xl mb-4">{product.emoji}</div>
                  {uploadedImage && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden opacity-80">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button size="lg" className="w-full mt-6">
                {t('common.startDesigning')}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-6xl">{product.emoji}</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-2xl font-bold text-primary mt-2">{product.price}</p>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">{product.description}</p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Quality Guarantee</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4 text-orange-500" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>5-Star Rated</span>
                </div>
              </div>

              <Button size="lg" variant="outline" className="w-full">
                Add to Cart
              </Button>
            </div>

            {/* Reviews Preview */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">"Amazing quality! The print came out perfect."</p>
                      <p className="text-xs text-gray-500 mt-1">- Sarah M.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">"Fast delivery and exactly what I ordered!"</p>
                      <p className="text-xs text-gray-500 mt-1">- Mike R.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;