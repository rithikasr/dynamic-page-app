import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import ExploreProducts from "./pages/ExploreProducts";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import AdminRoute from "./routes/AdminRoute";
import AdminOrders from "./pages/admin/Orders";
import AdminAuthGuard from "./components/admin/AdminAuthGuard";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:category" element={<ProductPage />} />
            <Route path="/explore" element={<ExploreProducts />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
              {/*  Admin only */}
              <Route path="/admin/orders" element={<AdminAuthGuard/>} />
  {/* <Route
    path="/admin/orders"
    element={
      <AdminRoute>
        <AdminOrders />
      </AdminRoute>
    }
  /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
