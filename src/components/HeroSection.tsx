import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-gradient-primary min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Print Your Story
          </h1>
          <p className="text-xl text-white/90 max-w-md mx-auto lg:mx-0">
            Turn your favorite memories into beautiful keepsakes. Create phone cases, mugs, as unique as your memories.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Start Creating
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
              Browse Gallery
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="w-80 h-96 bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-4xl">📱</span>
                  </div>
                  <p className="text-lg font-semibold">Your Custom Design</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;