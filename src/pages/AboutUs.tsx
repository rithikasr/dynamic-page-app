import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Target, Users, Award } from 'lucide-react';

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About Printy Glory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe every memory deserves to be cherished. That's why we've created 
            a platform that transforms your favorite photos into beautiful, lasting keepsakes.
          </p>
        </div>

        {/* Brand Story Section */}
        <div className="mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
            <div className="flex items-center mb-8">
              <Heart className="h-8 w-8 text-primary mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">{t('about.brandStory')}</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Founded in 2024, Printy Glory was born from a simple idea: everyone should be able 
                  to turn their precious memories into tangible, beautiful products. Our founders, 
                  passionate about both technology and craftsmanship, noticed a gap in the market 
                  for high-quality, affordable custom products.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  What started as a small project has grown into a platform trusted by thousands 
                  of customers worldwide. We've helped people create everything from personalized 
                  phone cases to custom mugs, each one telling a unique story.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our commitment to quality, customer satisfaction, and innovation drives everything 
                  we do. We're not just printing products; we're helping preserve memories and 
                  create connections.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Journey</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-gray-600">Products Created</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">15+</div>
                    <div className="text-sm text-gray-600">Countries Served</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">4.9★</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-3xl p-12">
            <div className="flex items-center mb-8">
              <Target className="h-8 w-8 text-primary mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">{t('about.vision')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
                <p className="text-gray-700">
                  We're building a global community of creators who celebrate their memories 
                  through personalized products.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Excellence</h3>
                <p className="text-gray-700">
                  Every product we create meets our high standards for durability, 
                  design, and customer satisfaction.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Meaningful Connections</h3>
                <p className="text-gray-700">
                  We help people create products that strengthen bonds and preserve 
                  the moments that matter most.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Values */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="text-4xl">🚀</div>
              <h3 className="font-semibold text-gray-900">Innovation</h3>
              <p className="text-sm text-gray-600">Constantly improving our technology and processes</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">🤝</div>
              <h3 className="font-semibold text-gray-900">Trust</h3>
              <p className="text-sm text-gray-600">Building lasting relationships with our customers</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">🌍</div>
              <h3 className="font-semibold text-gray-900">Sustainability</h3>
              <p className="text-sm text-gray-600">Responsible practices for a better planet</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">💡</div>
              <h3 className="font-semibold text-gray-900">Creativity</h3>
              <p className="text-sm text-gray-600">Empowering self-expression through design</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;