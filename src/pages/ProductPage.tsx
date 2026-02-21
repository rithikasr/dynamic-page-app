// import { useState } from 'react';

// import React, { useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import Header from '@/components/Layout/Header';
// import Footer from '@/components/Layout/Footer';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { Upload, Eye, Star, Shield, Truck, RotateCcw } from 'lucide-react';
// import { QRCodeCanvas } from 'qrcode.react';
// import StripeBuyButton from '@/components/StripePayButton';
// import { Dialog, DialogTitle, DialogContent } from '@mui/material';
// import Moveable from 'react-moveable';

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import StripeBuyButton from "@/components/StripePayButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_ENDPOINTS, getAuthHeaders, STORAGE_KEYS } from "@/constants/apiConstants";
import { addToCart } from "@/api/cart";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  const [openCheckout, setOpenCheckout] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Stripe publishable key */
  const stripePublishableKey =
    "pk_test_51SM4NxB1vnNHXKbOwO0L7ceXixPxsgYX1YMXo3YHeY0CaoilnCbG2kJU4hUA8RoAVslBgiSHqhNnE1mkcIxmTbO400sn3FWtee";

  /** Fetch product by ID */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id!), {
          headers: getAuthHeaders(),
        });

        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        Loading product...
      </div>
    );
  }

  /** Stripe Checkout */
  const handleBuy = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong");
    }
  };

  /** Add to Cart */
  const handleAddToCart = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      navigate('/login');
      return;
    }
    if (!id) return;
    setCartLoading(true);
    try {
      await addToCart(id, 1);
      toast({
        title: 'ðŸ›’ Added to Cart!',
        description: `${product?.name} has been added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add to cart',
        variant: 'destructive',
      });
    } finally {
      setCartLoading(false);
    }
  };


  /** Upload Image */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  /** Download Final Image */
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${product.name}-design.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        Design Your {product.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: Canvas Preview */}
        <div className="flex flex-col items-center bg-white shadow-xl p-6 rounded-3xl">
          <canvas
            ref={canvasRef}
            width={400}
            height={700}
            className="rounded-3xl border"
          />

          <p className="mt-3 text-gray-500 text-sm">Live Preview</p>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

          <p className="text-xl mb-4 font-semibold">â‚¹{product.price}</p>

          {/* Color Picker */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Color</p>
            <div className="flex gap-3">
              {["black", "white", "blue", "pink"].map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border cursor-pointer ${selectedColor === color ? "ring-2 ring-pink-500" : ""
                    }`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          {/* Upload Image */}
          <div className="mb-6">
            <p className="font-semibold mb-2">{t("uploadDesign")}</p>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <Button onClick={() => fileInputRef.current?.click()}>
              Upload Image
            </Button>
          </div>

          {/* Preview uploaded image */}
          {selectedImage && (
            <div className="mt-4">
              <p className="font-semibold mb-2">{t("yourDesign")}</p>
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-40 border rounded-lg shadow"
              />
            </div>
          )}

          {/* Download Button */}
          <Button className="mt-6 w-full" onClick={handleDownload}>
            Download Design
          </Button>

          {/* Add to Cart + Buy Now */}
          <div className="flex flex-col gap-3 mt-6">
            <Button
              id="add-to-cart-btn"
              className="w-full bg-white border border-purple-600 text-purple-700 hover:bg-purple-50"
              variant="outline"
              disabled={cartLoading}
              onClick={handleAddToCart}
            >
              {cartLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </Button>

            <Button
              id="buy-now-btn"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleBuy}
            >
              Buy Now
            </Button>
          </div>
        </div>

      </div>{/* end grid */}

      {/* --------------------------- */}
      {/* STRIPE CHECKOUT POPUP */}
      {/* --------------------------- */}
      <Dialog open={openCheckout} onClose={() => setOpenCheckout(false)}>
        <DialogTitle>Complete Your Purchase</DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center gap-4 py-4">
            <StripeBuyButton
              buyButtonId="buy_btn_1SM4NxB1vnNHXKbOwO0L"
              publishableKey={stripePublishableKey}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

