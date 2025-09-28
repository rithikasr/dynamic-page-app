import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PricingSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Start Creating Now. Phone case Today
          </h2>
          <p className="text-xl text-gray-600">
            Creating image layouts is free.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
            <div className="absolute top-4 right-4">
              <Badge variant="destructive" className="bg-gradient-primary">
                UP TO 70% off
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Phone Case Special
              </CardTitle>
              <p className="text-gray-600">Phone Case is only available for iPhone and Samsung.</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-5xl font-bold text-primary mb-2">$12.99</div>
                <p className="text-gray-500 line-through">$24.99</p>
                <p className="text-sm text-gray-600">Quick Ordering Service</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm">Fast Prototype</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm">Design It on the fly</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm">Durable & High Quality</span>
                </div>
              </div>
              
              <Button variant="success" size="lg" className="w-full">
                Order Now
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                Your phone is not set as iPhone or Samsung? 
                Visit Our site at 9 Nov page and try now.
              </p>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Choose Options</h3>
                    <p className="text-sm text-gray-600">Pick Style</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Background Design</h3>
                    <p className="text-sm text-gray-600">Choose backgrounds design from that easy to start you done in their selection of awesome on templates.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Small Pictures</h3>
                    <p className="text-sm text-gray-600">Different image layouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-block bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-32 h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <div className="w-24 h-24 bg-black grid grid-cols-3 gap-1 p-2 rounded">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-sm"></div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan QR Code</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;