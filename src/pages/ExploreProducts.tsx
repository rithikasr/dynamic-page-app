import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const ExploreProducts = () => {
  const { t } = useLanguage();

  const products = [
    {
      id: 'phone-case',
      name: t('products.phoneCase'),
      image: '📱',
      description: 'Protect your phone with style using our custom phone cases.',
      price: 'From $19.99'
    },
    {
      id: 'mug',
      name: t('products.mug'),
      image: '☕',
      description: 'Start your day with a personalized mug featuring your favorite photo.',
      price: 'From $14.99'
    },
    {
      id: 'bottle',
      name: t('products.bottle'),
      image: '🍶',
      description: 'Stay hydrated with a custom water bottle that reflects your personality.',
      price: 'From $24.99'
    },
    {
      id: 'tshirt',
      name: t('products.tshirt'),
      image: '👕',
      description: 'Wear your memories with our premium quality custom t-shirts.',
      price: 'From $29.99'
    },
    {
      id: 'clock',
      name: t('products.clock'),
      image: '🕐',
      description: 'Keep time in style with a personalized hug clock featuring your loved ones.',
      price: 'From $34.99'
    },
    {
      id: 'stickers',
      name: t('products.stickers'),
      image: '🏷️',
      description: 'Express yourself with durable vinyl stickers for any surface.',
      price: 'From $9.99'
    },
    {
      id: 'pencil-case',
      name: t('products.pencilCase'),
      image: '✏️',
      description: 'Organize your supplies with a custom pencil case that stands out.',
      price: 'From $16.99'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Explore Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our full range of customizable products. Transform your favorite photos 
            into unique, personalized items that make perfect gifts or treasured keepsakes.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary-glow/10 flex items-center justify-center">
                  <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      {product.price}
                    </span>
                    <Button asChild size="sm">
                      <Link to={`/product/${product.id}`}>
                        {t('common.startDesigning')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gift Ideas Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Perfect Gift Ideas
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Looking for the perfect gift? Our custom products make thoughtful presents 
            for birthdays, anniversaries, holidays, and special occasions.
          </p>
          <Button size="lg" asChild>
            <Link to="/product/phone-case">
              {t('common.beginDesigning')}
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExploreProducts;