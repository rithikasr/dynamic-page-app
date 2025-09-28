import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestimonialSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Renew Your Phone Face
          </h2>
          <p className="text-xl text-gray-600">
            All the phone models are available
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Amazing Quality!</h3>
                    <p className="text-gray-600 text-sm">
                      "The phone case quality exceeded my expectations. The print is vibrant and the case feels durable. Highly recommend!"
                    </p>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Perfect Gift</h3>
                    <p className="text-gray-600 text-sm">
                      "Made custom cases for my whole family with our vacation photos. Everyone loved them!"
                    </p>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl p-6 mx-auto">
              <div className="w-full h-2/3 bg-gradient-to-br from-green-400 to-blue-600 rounded-2xl mb-4 flex items-center justify-center">
                <span className="text-6xl text-white">🐕</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pet Love</h4>
                <p className="text-sm text-gray-600">Show off your furry friend with a custom pet photo case</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="default" size="lg" className="text-lg px-8 py-6">
            Easy to Change Your Phone Face Perfect Your Phone Inside
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;