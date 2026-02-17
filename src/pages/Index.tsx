import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";
import Stack from "@/components/Stack"; // TSX Stack component
import { useState, useEffect } from "react";


interface Product {
  id: string;
  name: string;
  price: string;
   image?: string;
  stock: number;
}

const HomeContent = () => {
  const { t } = useLanguage();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products",
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODcxZjAzMTgxMmEzMzFmMmY3MTAzZiIsImVtYWlsIjoiaWFtcml5YXNoeWRlckBnbWFpbC5jb20iLCJpYXQiOjE3NzA2MzgyMDIsImV4cCI6MTc3MTI0MzAwMn0.ZGYxvF1wnrBL3FXxJrn4QNzEF1ZI7DTFs3ULbMMg9PU`,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const mapped = data.products.map((p: any) => ({
  id: p._id,
  name: p.name,
  price: `From ₹${p.price}`,
  image: p.image,
  stock: p.stock,
}));


      
//       const mapped = data.products.map((p: any) => ({
//   id: p._id,
//   name: p.name,
//   emoji: "📦", // your UI expects an emoji, API doesn't provide one
//   price: `From ₹${p.price}`,
//   image: p.image,
//    stock: p.stock,
// }));

      setFeaturedProducts(mapped);
    } catch (err) {
      console.log("Error fetching products", err);
    }
  };

  fetchProducts();
}, []);

  // const featuredProducts: Product[] = [
  //   { id: 'phone-case', name: t('products.phoneCase'), emoji: '📱', price: 'From $19.99' },
  //   { id: 'mug', name: t('products.mug'), emoji: '☕', price: 'From $14.99' },
  //   { id: 'bottle', name: t('products.bottle'), emoji: '🍶', price: 'From $24.99' },
  //   { id: 'tshirt', name: t('products.tshirt'), emoji: '👕', price: 'From $29.99' },
  // ];

  // Hero images for draggable Stack
  const heroImages = [
    { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
    { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
    { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
    { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Text Content */}
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="text-primary font-semibold">Custom Design Studio</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/product/:id">
                    {/* <Link to="/customize-phone-case"> */}
                      {t('hero.cta')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/explore">
                      Explore Products
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Hero Stack */}
              <div className="relative flex justify-center items-center p-8 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-3xl">
                <Stack
                  randomRotation={true}
                  sensitivity={180}
                  sendToBackOnClick={false}
                  cardDimensions={{ width: 200, height: 200 }}
                  cardsData={heroImages}
                />
              </div>
              
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Popular Products
              </h2>
              <p className="text-xl text-gray-600">
                Transform your memories into beautiful custom products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 overflow-hidden rounded-xl">
  <img
    src={product.image || "/placeholder.png"}
    alt={product.name}
    className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
  />
</div>

                    {/* <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {product.emoji}
                    </div> */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
  {product.name}
</h3>

<p className="text-primary font-bold mb-1">
  {product.price}
</p>

{/* ✅ STOCK DISPLAY */}
<p
  className={`text-sm mb-3 font-medium ${
    product.stock > 0 ? "text-green-600" : "text-red-600"
  }`}
>
  {product.stock > 0
    ? `${product.stock} left in stock`
    : "Out of stock"}
</p>

{/* ✅ BUTTON */}
<Button
  size="sm"
  className={`w-full ${
    product.stock <= 0 && "opacity-60 cursor-not-allowed"
  }`}
  disabled={product.stock <= 0}
>
  {product.stock > 0 ? (
    <Link 
      to={product.name.toLowerCase().includes('phone case') ? "/customize-phone-case" : `/product/${product.id}`}
      state={{ product: product }}
    >
      {t("common.startDesigning")}
    </Link>
  ) : (
    "Out of Stock"
  )}
</Button>

                    {/* <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-primary font-bold mb-4">{product.price}</p>
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/product/${product.id}`}>
                        {t('common.startDesigning')}
                      </Link>
                    </Button> */}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-primary-glow/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Printy Glory?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white/50 rounded-2xl p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                <p className="text-gray-600">
                  We use only the finest materials and latest printing technology 
                  to ensure your custom products look amazing and last long.
                </p>
              </div>
              
              <div className="text-center bg-white/50 rounded-2xl p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Design Process</h3>
                <p className="text-gray-600">
                  Our intuitive design studio makes it simple to upload your photos 
                  and preview your custom product in real-time.
                </p>
              </div>
              
              <div className="text-center bg-white/50 rounded-2xl p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your custom products delivered quickly with our expedited 
                  production process and reliable shipping partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gift Ideas Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-12">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Perfect Gift Ideas
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create meaningful gifts that show you care. Custom products make 
              the perfect presents for birthdays, anniversaries, and special occasions.
            </p>
            <Button size="lg" asChild>
              <Link to="/customize-phone-case">
                {t('common.beginDesigning')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
};

export default Index;









// import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";
// import { LanguageProvider } from "@/contexts/LanguageContext";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";

// const HomeContent = () => {
//   const { t } = useLanguage();

//   const featuredProducts = [
//     { id: 'phone-case', name: t('products.phoneCase'), emoji: '📱', price: 'From $19.99' },
//     { id: 'mug', name: t('products.mug'), emoji: '☕', price: 'From $14.99' },
//     { id: 'bottle', name: t('products.bottle'), emoji: '🍶', price: 'From $24.99' },
//     { id: 'tshirt', name: t('products.tshirt'), emoji: '👕', price: 'From $29.99' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50">
//       <Header />
      
//       <main>
//         {/* Hero Section */}
//         <section className="relative py-20 px-6 overflow-hidden">
//           <div className="max-w-7xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//               <div className="text-left">
//                 <div className="flex items-center space-x-2 mb-6">
//                   <Sparkles className="h-6 w-6 text-primary" />
//                   <span className="text-primary font-semibold">Custom Design Studio</span>
//                 </div>
//                 <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
//                   {t('hero.title')}
//                 </h1>
//                 <p className="text-xl text-gray-600 mb-8 max-w-lg">
//                   {t('hero.subtitle')}
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <Button size="lg" asChild>
//                     <Link to="/product/phone-case">
//                       {t('hero.cta')}
//                       <ArrowRight className="ml-2 h-5 w-5" />
//                     </Link>
//                   </Button>
//                   <Button variant="outline" size="lg" asChild>
//                     <Link to="/explore">
//                       Explore Products
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <div className="bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-3xl p-8 text-center">
//                   <div className="text-8xl mb-4">📱</div>
//                   <div className="bg-white/50 rounded-2xl p-6">
//                     <p className="text-gray-700 font-medium">Your Photo Here</p>
//                     <p className="text-sm text-gray-500 mt-2">Upload & Preview in Real-time</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Featured Products */}
//         <section className="py-20 px-6">
//           <div className="max-w-7xl mx-auto">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//                 Popular Products
//               </h2>
//               <p className="text-xl text-gray-600">
//                 Transform your memories into beautiful custom products
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
//               {featuredProducts.map((product) => (
//                 <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
//                       {product.emoji}
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
//                     <p className="text-primary font-bold mb-4">{product.price}</p>
//                     <Button asChild size="sm" className="w-full">
//                       <Link to={`/product/${product.id}`}>
//                         {t('common.startDesigning')}
//                       </Link>
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
            
//             <div className="text-center">
//               <Button variant="outline" size="lg" asChild>
//                 <Link to="/explore">
//                   View All Products
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-primary-glow/10">
//           <div className="max-w-7xl mx-auto">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-bold text-gray-900 mb-4">
//                 Why Choose Printy Glory?
//               </h2>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center bg-white/50 rounded-2xl p-8">
//                 <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                   <Heart className="h-8 w-8 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
//                 <p className="text-gray-600">
//                   We use only the finest materials and latest printing technology 
//                   to ensure your custom products look amazing and last long.
//                 </p>
//               </div>
              
//               <div className="text-center bg-white/50 rounded-2xl p-8">
//                 <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                   <Sparkles className="h-8 w-8 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Design Process</h3>
//                 <p className="text-gray-600">
//                   Our intuitive design studio makes it simple to upload your photos 
//                   and preview your custom product in real-time.
//                 </p>
//               </div>
              
//               <div className="text-center bg-white/50 rounded-2xl p-8">
//                 <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                   <Star className="h-8 w-8 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
//                 <p className="text-gray-600">
//                   Get your custom products delivered quickly with our expedited 
//                   production process and reliable shipping partners.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Gift Ideas Section */}
//         <section className="py-20 px-6">
//           <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-12">
//             <div className="text-6xl mb-6">🎁</div>
//             <h2 className="text-4xl font-bold text-gray-900 mb-6">
//               Perfect Gift Ideas
//             </h2>
//             <p className="text-xl text-gray-600 mb-8">
//               Create meaningful gifts that show you care. Custom products make 
//               the perfect presents for birthdays, anniversaries, and special occasions.
//             </p>
//             <Button size="lg" asChild>
//               <Link to="/product/phone-case">
//                 {t('common.beginDesigning')}
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Link>
//             </Button>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// const Index = () => {
//   return (
//     <LanguageProvider>
//       <HomeContent />
//     </LanguageProvider>
//   );
// };

// export default Index;
