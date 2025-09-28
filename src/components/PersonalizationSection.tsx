import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PersonalizationSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            The Perfect Gift, Made by You
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            大切な人への特別な贈り物に。
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">Celebrate</h3>
              <p className="text-lg text-gray-600">
                birthdays, anniversaries, graduations, with a one-of-a-kind gift they'll never forget.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">🎂</div>
                  <p className="text-sm font-medium">Birthday</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">💕</div>
                  <p className="text-sm font-medium">Anniversary</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">🎓</div>
                  <p className="text-sm font-medium">Graduation</p>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">🎄</div>
                  <p className="text-sm font-medium">Holiday</p>
                </CardContent>
              </Card>
            </div>
            
            <Button variant="secondary" size="lg" className="w-full">
              Start Personalizing
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl p-6">
                <div className="w-full h-2/3 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl mb-4 flex items-center justify-center">
                  <span className="text-6xl text-white">👨‍👩‍👧‍👦</span>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Family Memories</h4>
                  <p className="text-sm text-gray-600">Custom phone case with your favorite family photo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizationSection;