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
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import StripeBuyButton from "@/components/StripePayButton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProductPage() {
  const { id } = useParams(); 
  const { t } = useLanguage();

  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        const res = await fetch(
          `https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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
  try {
    const res = await fetch("https://z0vx5pwf-3000.inc1.devtunnels.ms/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`, },
      body: JSON.stringify({ productId: id }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // redirect to Stripe Checkout
    } else {
      alert("Failed to create checkout session");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Something went wrong");
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

          <p className="text-xl mb-4 font-semibold">₹{product.price}</p>

          {/* Color Picker */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Color</p>
            <div className="flex gap-3">
              {["black", "white", "blue", "pink"].map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border cursor-pointer ${
                    selectedColor === color ? "ring-2 ring-pink-500" : ""
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

          {/* 🟣 BUY NOW → Stripe & QR */}
         <Button
  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
  onClick={handleBuy}
>
  Buy Now
</Button>

        </div>
      </div>

      {/* --------------------------- */}
      {/* STRIPE CHECKOUT POPUP */}
      {/* --------------------------- */}
  
    </div>
  );
}

// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { useLanguage } from "@/contexts/LanguageContext";

// export default function ProductPage() {
//   const { id } = useParams(); // product id from URL
//   const { t } = useLanguage();

//   const [product, setProduct] = useState<any>(null);
//   const [selectedColor, setSelectedColor] = useState("black");
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   /** Fetch product by ID */
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           `https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products/${id}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODcxZjAzMTgxMmEzMzFmMmY3MTAzZiIsImVtYWlsIjoiaWFtcml5YXNoeWRlckBnbWFpbC5jb20iLCJpYXQiOjE3NzA2MzM0MzUsImV4cCI6MTc3MTIzODIzNX0.rLH5OeeCIaudl3QYrnvZ-qHObRICDqADgQq8HkuwOdc`,
//             },
//           }
//         );

//         const data = await res.json();
//         setProduct(data.product);
//       } catch (err) {
//         console.error("Failed to load product", err);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   /** Loading UI */
//   if (!product) {
//     return (
//       <div className="h-screen flex justify-center items-center text-xl font-semibold">
//         Loading product...
//       </div>
//     );
//   }

//   /** Upload Image */
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => setSelectedImage(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   /** Download Final Image */
//   const handleDownload = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const link = document.createElement("a");
//     link.download = `${product.name}-design.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       {/* Page Title */}
//       <h1 className="text-4xl font-bold mb-10 text-center">
//         Design Your {product.name}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
//         {/* --- LEFT: Phone / Product Preview --- */}
//         <div className="flex flex-col items-center bg-white shadow-xl p-6 rounded-3xl">
//           <canvas
//             ref={canvasRef}
//             width={400}
//             height={700}
//             className="rounded-3xl border"
//           />

//           <p className="mt-3 text-gray-500 text-sm">Live Preview</p>
//         </div>

//         {/* --- RIGHT PANEL --- */}
//         <div>
//           <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

//           {/* Product Price */}
//           <p className="text-xl mb-4 font-semibold">₹{product.price}</p>

//           {/* Color Picker */}
//           <div className="mb-6">
//             <p className="font-semibold mb-2">Select Color</p>
//             <div className="flex gap-3">
//               {["black", "white", "blue", "pink"].map((color) => (
//                 <div
//                   key={color}
//                   onClick={() => setSelectedColor(color)}
//                   className={`w-10 h-10 rounded-full border cursor-pointer ${
//                     selectedColor === color ? "ring-2 ring-pink-500" : ""
//                   }`}
//                   style={{ backgroundColor: color }}
//                 ></div>
//               ))}
//             </div>
//           </div>

//           {/* Upload Image */}
//           <div className="mb-6">
//             <p className="font-semibold mb-2">{t("uploadDesign")}</p>

//             <input
//               type="file"
//               accept="image/*"
//               ref={fileInputRef}
//               onChange={handleImageUpload}
//               className="hidden"
//             />

//             <Button onClick={() => fileInputRef.current?.click()}>
//               Upload Image
//             </Button>
//           </div>

//           {/* Preview uploaded image */}
//           {selectedImage && (
//             <div className="mt-4">
//               <p className="font-semibold mb-2">{t("yourDesign")}</p>
//               <img
//                 src={selectedImage}
//                 alt="Uploaded"
//                 className="w-40 border rounded-lg shadow"
//               />
//             </div>
//           )}

//           {/* Download Button */}
//           <Button className="mt-6 w-full" onClick={handleDownload}>
//             Download Design
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

/* ---------------- PHONE MODELS ---------------- */
 
// const PHONE_MODELS = {
//   samsung: {
//     label: 'Samsung Galaxy S23',
//     printArea: { w: 120, h: 260 }
//   },
//   iphone: {
//     label: 'iPhone 14',
//     printArea: { w: 110, h: 250 }
//   },
//   vivo: {
//     label: 'Vivo V29',
//     printArea: { w: 115, h: 255 }
//   }
// };


// const ProductPage = () => {
//   const { category } = useParams();
//   const { t } = useLanguage();

//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [openQR, setOpenQR] = useState(false);
//   const [phoneModel, setPhoneModel] =
//     useState<keyof typeof PHONE_MODELS>('samsung');

//   const [frame, setFrame] = useState({
//     translate: [0, 0] as number[],
//     rotate: 0,
//     scale: [1, 1] as number[]
//   });

//   React.useEffect(() => {
//   setFrame({
//     translate: [0, 0],
//     rotate: 0,
//     scale: [1, 1]
//   });
// }, [phoneModel]);

//   const designRef = useRef<HTMLDivElement | null>(null);

//   const stripePublishableKey =
//     'pk_test_51SM4NxB1vnNHXKbOwO0L7ceXixPxsgYX1YMXo3YHeY0CaoilnCbG2kJU4hUA8RoAVslBgiSHqhNnE1mkcIxmTbO400sn3FWtee';

//   const productData = {
//     'phone-case': {
//       name: t('products.phoneCase'),
//       emoji: '📱',
//       price: '$19.99',
//       description: 'Premium quality phone cases with your custom design',
//       features: [
//         'Durable TPU material',
//         'Scratch resistant',
//         'Precise camera cutouts',
//         'Wireless charging compatible'
//       ],
//       stripeLink: 'https://buy.stripe.com/test_8x27sK5Ya4VH7r0g0K9k400',
//       buyButtonId: 'buy_btn_1SM6QPB1vnNHXKbOb15zK5uj'
//     }
//   };

//   const product =
//     productData[category as keyof typeof productData] ||
//     productData['phone-case'];

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = ev => setUploadedImage(ev.target?.result as string);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <Header />

//       <main className="max-w-7xl mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* LEFT */}
//           <div>
//             <div className="bg-white rounded-3xl p-8 shadow-lg">
//               <h2 className="text-2xl font-bold mb-6">
//                 Design Your {product.name}
//               </h2>

//               {/* Upload */}
//               <div className="border-2 border-dashed rounded-2xl p-8 text-center mb-4">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="upload"
//                 />
//                 <label htmlFor="upload" className="cursor-pointer block">
//                   <Upload className="mx-auto mb-2" />
//                   Upload Image
//                 </label>
//               </div>

//               {/* Phone selector */}
//               <select
//                 value={phoneModel}
//                 onChange={e =>
//                   setPhoneModel(e.target.value as keyof typeof PHONE_MODELS)
//                 }
//                 className="w-full mb-4 p-2 border rounded"
//               >
//                 {Object.entries(PHONE_MODELS).map(([k, v]) => (
//                   <option key={k} value={k}>
//                     {v.label}
//                   </option>
//                 ))}
//               </select>

//               {/* Preview */}
//               <div className="bg-gray-100 rounded-2xl p-6 text-center">
//   <div className="flex justify-center items-center mb-4">
//     <Eye className="mr-2" /> Preview
//   </div>

//   {/* FIXED PREVIEW SPACE */}
//   <div className="relative mx-auto w-[200px] h-[400px] bg-white rounded-xl shadow-inner flex items-center justify-center">

//     {/* PRINT FRAME (changes per phone) */}
//     <div
//       className="relative border-2 border-dashed border-gray-400 rounded-xl"
//       style={{
//         width: PHONE_MODELS[phoneModel].printArea.w,
//         height: PHONE_MODELS[phoneModel].printArea.h
//       }}
//     >
//       {/* USER IMAGE */}
//       {uploadedImage && (
//         <div
//           ref={designRef}
//           className="absolute inset-0 rounded-xl overflow-hidden"
//           style={{
//             transform: `
//               translate(${frame.translate[0]}px, ${frame.translate[1]}px)
//               rotate(${frame.rotate}deg)
//               scale(${frame.scale[0]}, ${frame.scale[1]})
//             `,
//             touchAction: 'none'
//           }}
//         >
//           <img
//             src={uploadedImage}
//             className="w-full h-full object-cover pointer-events-none"
//             draggable={false}
//           />
//         </div>
//       )}
//     </div>
//   </div>

//   {/* MOVEABLE CONTROLS */}
//   {uploadedImage && designRef.current && (
//     <Moveable
//       target={designRef.current}
//       draggable
//       scalable
//       rotatable
//       keepRatio
//       onDrag={({ beforeTranslate }) =>
//         setFrame({ ...frame, translate: beforeTranslate })
//       }
//       onScale={({ scale }) =>
//         setFrame({ ...frame, scale })
//       }
//       onRotate={({ beforeRotate }) =>
//         setFrame({ ...frame, rotate: beforeRotate })
//       }
//     />
//   )}
// </div>

//             </div>
//           </div>

//           {/* RIGHT */}
//           <div>
//             <Card>
//               <CardContent className="p-6">
//                 <h1 className="text-3xl font-bold">{product.name}</h1>
//                 <p className="text-xl mt-2">{product.price}</p>

//                 <Button
//                   className="w-full mt-6"
//                   onClick={() => setOpenQR(true)}
//                 >
//                   Add to Cart
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       <Dialog open={openQR} onClose={() => setOpenQR(false)}>
//         <DialogTitle>Buy Now</DialogTitle>
//         <DialogContent>
//           <QRCodeCanvas value={product.stripeLink} size={200} />
//           <StripeBuyButton
//             buyButtonId={product.buyButtonId}
//             publishableKey={stripePublishableKey}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProductPage;

// const PHONE_MODELS = {
//   samsung: {
//     label: 'Samsung Galaxy S23',
//     mockup: '/phone-mockups/phone-mockup-1.png',
//     printArea: { x: 40, y: 120, w: 120, h: 260 }
//   },
//   iphone: {
//     label: 'iPhone 14',
//     mockup: '/phone-mockups/phone-mockup-2.png',
//     printArea: { x: 45, y: 130, w: 110, h: 250 }
//   },
//   oneplus: {
//     label: 'OnePlus 11',
//     mockup: '/phone-mockups/phone-mockup-3.png',
//     printArea: { x: 42, y: 125, w: 115, h: 255 }
//   }
// };


// import React, { useState } from 'react';
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

// const ProductPage = () => {
//   const { category } = useParams();
//   const { t } = useLanguage();
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [openQR, setOpenQR] = useState(false);

//   // Stripe publishable key (frontend-safe)
//   const stripePublishableKey = 'pk_test_51SM4NxB1vnNHXKbOwO0L7ceXixPxsgYX1YMXo3YHeY0CaoilnCbG2kJU4hUA8RoAVslBgiSHqhNnE1mkcIxmTbO400sn3FWtee';

//   const [phoneModel, setPhoneModel] =
//   useState<keyof typeof PHONE_MODELS>('samsung');

// const [frame, setFrame] = useState({
//   translate: [0, 0],
//   rotate: 0,
//   scale: [1, 1]
// });

//   const productData = {
//     'phone-case': {
//       name: t('products.phoneCase'),
//       emoji: '📱',
//       price: '$19.99',
//       description: 'Premium quality phone cases with your custom design',
//       features: [
//         'Durable TPU material',
//         'Scratch resistant',
//         'Precise camera cutouts',
//         'Wireless charging compatible'
//       ],
//       stripeLink: 'https://buy.stripe.com/test_8x27sK5Ya4VH7r0g0K9k400',
//        buyButtonId: 'buy_btn_1SM6QPB1vnNHXKbOb15zK5uj'
//     },
//     'mug': {
//       name: t('products.mug'),
//       emoji: '☕',
//       price: '$14.99',
//       description: 'Ceramic mugs perfect for your morning coffee',
//       features: [
//         'High-quality ceramic',
//         'Dishwasher safe',
//         '11oz capacity',
//         'Fade-resistant print'
//       ],
//       stripeLink: 'https://buy.stripe.com/test_28EaEWcmy87T7r07ue9k401',
//        buyButtonId: 'buy_btn_1SM76ZB1vnNHXKbODER3Bdw7'
//     },
//     'bottle': {
//       name: t('products.bottle'),
//       emoji: '🍶',
//       price: '$24.99',
//       description: 'Insulated water bottles for everyday use',
//       features: [
//         'Double-wall insulation',
//         'Keeps drinks cold 24hrs',
//         'BPA-free materials', 
//         '500ml capacity'
//       ],
//       stripeLink: 'https://buy.stripe.com/test_fZu5kC4U6gEpeTseWG9k402',
//        buyButtonId: 'buy_btn_1SM77MB1vnNHXKbObjMJH4jp'
//     }
//   };
 
//   const product = productData[category as keyof typeof productData] || productData['phone-case'];

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setUploadedImage(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddToCart = () => setOpenQR(true);
//   const handleClose = () => setOpenQR(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <Header />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Customizer */}
//           <div className="space-y-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Your {product.name}</h2>

//               {/* Upload Section */}
//               <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="image-upload"
//                 />
//                 <label htmlFor="image-upload" className="cursor-pointer block">
//                   <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-lg font-medium text-gray-900 mb-2">{t('common.upload')}</p>
//                   <p className="text-gray-600">Drop your image here or click to browse</p>
//                 </label>
//               </div>

// <select
//   value={phoneModel}
//   onChange={(e) => setPhoneModel(e.target.value as any)}
//   className="w-full mb-4 p-2 rounded-lg border"
// >
//   {Object.entries(PHONE_MODELS).map(([key, model]) => (
//     <option key={key} value={key}>
//       {model.label}
//     </option>
//   ))}
// </select>

//               {/* Live Preview */}
//               <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <Eye className="h-5 w-5 text-gray-600 mr-2" />
//                   <span className="font-medium text-gray-900">{t('common.preview')}</span>
//                 </div>

// <div className="relative mx-auto w-[200px] h-[400px] perspective-1000">

//   {/* DESIGN */}
//   {uploadedImage && (
//     <div
//       id="design-layer"
//       className="absolute rounded-xl overflow-hidden"
//       style={{
//         width: PHONE_MODELS[phoneModel].printArea.w,
//         height: PHONE_MODELS[phoneModel].printArea.h,
//         top: PHONE_MODELS[phoneModel].printArea.y,
//         left: PHONE_MODELS[phoneModel].printArea.x,
//         transform: `
//           translate(${frame.translate[0]}px, ${frame.translate[1]}px)
//           rotate(${frame.rotate}deg)
//           scale(${frame.scale[0]}, ${frame.scale[1]})
//         `,
//         touchAction: 'none',
//         zIndex: 5
//       }}
//     >
//       <img
//         src={uploadedImage}
//         className="w-full h-full object-cover"
//       />
//     </div>
//   )}

//   {/* SAFE PRINT AREA */}
//   <div
//     className="absolute border-2 border-dashed border-white/50 rounded-xl pointer-events-none"
//     style={{
//       width: PHONE_MODELS[phoneModel].printArea.w,
//       height: PHONE_MODELS[phoneModel].printArea.h,
//       top: PHONE_MODELS[phoneModel].printArea.y,
//       left: PHONE_MODELS[phoneModel].printArea.x
//     }}
//   />

//   {/* PHONE MOCKUP */}
//   <img
//     src={PHONE_MODELS[phoneModel].mockup}
//     className="absolute inset-0 w-full h-full object-contain z-10"
//   />
// </div>

//                 {/* <div className="relative mx-auto" style={{ width: '200px', height: '200px' }}>
//                   <div className="text-8xl mb-4">{product.emoji}</div>
//                   {uploadedImage && (
//                     <div className="absolute inset-0 rounded-lg overflow-hidden opacity-80">
//                       <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
//                     </div>
//                   )}
//                 </div>
//               </div> */}

//               <Button size="lg" className="w-full mt-6">
//                 {t('common.startDesigning')}
//               </Button>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
//               <div className="flex items-center space-x-4 mb-6">
//                 <div className="text-6xl">{product.emoji}</div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//                   <p className="text-2xl font-bold text-primary mt-2">{product.price}</p>
//                 </div>
//               </div>

//               <p className="text-gray-600 text-lg mb-6">{product.description}</p>

//               {/* Features */}
//               <div className="space-y-3 mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900">Features:</h3>
//                 <ul className="space-y-2">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-primary rounded-full"></div>
//                       <span className="text-gray-700">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Trust Badges */}
//               <div className="grid grid-cols-2 gap-4 mb-8">
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Shield className="h-4 w-4 text-green-500" />
//                   <span>Quality Guarantee</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Truck className="h-4 w-4 text-blue-500" />
//                   <span>Free Shipping</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <RotateCcw className="h-4 w-4 text-orange-500" />
//                   <span>30-Day Returns</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Star className="h-4 w-4 text-yellow-500" />
//                   <span>5-Star Rated</span>
//                 </div>
//               </div>

//               <Button size="lg" variant="outline" className="w-full" onClick={handleAddToCart}>
//                 Add to Cart
//               </Button>
//             </div>

//             {/* Customer Reviews */}
//             <Card className="border-0 bg-white/80 backdrop-blur-sm">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
//                 <div className="space-y-4">
//                   {[1, 2].map((i) => (
//                     <div key={i} className="flex items-start space-x-3">
//                       <div className="flex space-x-1">
//                         {[...Array(5)].map((_, j) => (
//                           <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         ))}
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-700">
//                           "Amazing quality! The print came out perfect."
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">- Sarah M.</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       {/* QR Code Dialog */}

// <Dialog open={openQR} onClose={handleClose}>
//   <DialogTitle>Scan QR Code or Buy Now</DialogTitle>
//   <DialogContent style={{ padding: '50px' }}>
//   <div className="flex flex-col items-center justify-center space-y-6">
//     {/* QR Option */}
//     <QRCodeCanvas value={product.stripeLink} size={200} />

//     {/* OR Stripe Buy Button */}
//     <StripeBuyButton 
//       buyButtonId={product.buyButtonId}
//       publishableKey={stripePublishableKey}
//     />
//   </div>
// </DialogContent>

// </Dialog>


//     </div>
//   );
// };

// export default ProductPage;





// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import Header from '@/components/Layout/Header';
// import Footer from '@/components/Layout/Footer';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { Upload, Eye, Star, Shield, Truck, RotateCcw } from 'lucide-react';

// const ProductPage = () => {
//   const { category } = useParams();
//   const { t } = useLanguage();
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);

//   const productData = {
//     'phone-case': {
//       name: t('products.phoneCase'),
//       emoji: '📱',
//       price: '$19.99',
//       description: 'Premium quality phone cases with your custom design',
//       features: [
//         'Durable TPU material',
//         'Scratch resistant',
//         'Precise camera cutouts',
//         'Wireless charging compatible'
//       ]
//     },
//     'mug': {
//       name: t('products.mug'),
//       emoji: '☕',
//       price: '$14.99',
//       description: 'Ceramic mugs perfect for your morning coffee',
//       features: [
//         'High-quality ceramic',
//         'Dishwasher safe',
//         '11oz capacity',
//         'Fade-resistant print'
//       ]
//     },
//     'bottle': {
//       name: t('products.bottle'),
//       emoji: '🍶',
//       price: '$24.99',
//       description: 'Insulated water bottles for everyday use',
//       features: [
//         'Double-wall insulation',
//         'Keeps drinks cold 24hrs',
//         'BPA-free materials',
//         '500ml capacity'
//       ]
//     }
//   };

//   const product = productData[category as keyof typeof productData] || productData['phone-case'];

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setUploadedImage(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <Header />
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Customizer */}
//           <div className="space-y-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Your {product.name}</h2>
              
//               {/* Upload Section */}
//               <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-6">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="image-upload"
//                 />
//                 <label
//                   htmlFor="image-upload"
//                   className="cursor-pointer block"
//                 >
//                   <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-lg font-medium text-gray-900 mb-2">
//                     {t('common.upload')}
//                   </p>
//                   <p className="text-gray-600">
//                     Drop your image here or click to browse
//                   </p>
//                 </label>
//               </div>

//               {/* Live Preview */}
//               <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <Eye className="h-5 w-5 text-gray-600 mr-2" />
//                   <span className="font-medium text-gray-900">{t('common.preview')}</span>
//                 </div>
                
//                 <div className="relative mx-auto" style={{ width: '200px', height: '200px' }}>
//                   <div className="text-8xl mb-4">{product.emoji}</div>
//                   {uploadedImage && (
//                     <div className="absolute inset-0 rounded-lg overflow-hidden opacity-80">
//                       <img
//                         src={uploadedImage}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Button size="lg" className="w-full mt-6">
//                 {t('common.startDesigning')}
//               </Button>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
//               <div className="flex items-center space-x-4 mb-6">
//                 <div className="text-6xl">{product.emoji}</div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//                   <p className="text-2xl font-bold text-primary mt-2">{product.price}</p>
//                 </div>
//               </div>

//               <p className="text-gray-600 text-lg mb-6">{product.description}</p>

//               {/* Features */}
//               <div className="space-y-3 mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900">Features:</h3>
//                 <ul className="space-y-2">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-primary rounded-full"></div>
//                       <span className="text-gray-700">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Trust Badges */}
//               <div className="grid grid-cols-2 gap-4 mb-8">
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Shield className="h-4 w-4 text-green-500" />
//                   <span>Quality Guarantee</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Truck className="h-4 w-4 text-blue-500" />
//                   <span>Free Shipping</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <RotateCcw className="h-4 w-4 text-orange-500" />
//                   <span>30-Day Returns</span>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <Star className="h-4 w-4 text-yellow-500" />
//                   <span>5-Star Rated</span>
//                 </div>
//               </div>

//               <Button size="lg" variant="outline" className="w-full">
//                 Add to Cart
//               </Button>
//             </div>

//             {/* Reviews Preview */}
//             <Card className="border-0 bg-white/80 backdrop-blur-sm">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-3">
//                     <div className="flex space-x-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       ))}
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-700">"Amazing quality! The print came out perfect."</p>
//                       <p className="text-xs text-gray-500 mt-1">- Sarah M.</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-3">
//                     <div className="flex space-x-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       ))}
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-700">"Fast delivery and exactly what I ordered!"</p>
//                       <p className="text-xs text-gray-500 mt-1">- Mike R.</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default ProductPage;