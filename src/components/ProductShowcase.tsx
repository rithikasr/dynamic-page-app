import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProductShowcase = () => {
  const products = [
    { id: 1, name: "Phone Cases", image: "📱", description: "Custom phone cases for iPhone & Samsung" },
    { id: 2, name: "Mugs", image: "☕", description: "Personalized mugs for your morning coffee" },
    { id: 3, name: "T-Shirts", image: "👕", description: "Custom t-shirts with your favorite photos" },
    { id: 4, name: "Stickers", image: "🏷️", description: "Durable vinyl stickers for any surface" },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Create Something That Truly Yours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your favorite photo and turn it into a custom phone case, mug, or bottle. 
            Make your everyday items as unique as your memories.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="default" size="lg" className="text-lg px-8 py-6">
            Upload Your Photo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;