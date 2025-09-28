import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import PersonalizationSection from "@/components/PersonalizationSection";
import PricingSection from "@/components/PricingSection";
import TestimonialSection from "@/components/TestimonialSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProductShowcase />
      <PersonalizationSection />
      <PricingSection />
      <TestimonialSection />
    </div>
  );
};

export default Index;
