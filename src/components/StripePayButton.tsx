import React, { useEffect, useRef } from "react";

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

const StripeBuyButton: React.FC<StripeBuyButtonProps> = ({
  buyButtonId,
  publishableKey,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if the script already exists
    if (!document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Add the buy button once script is ready
    const button = document.createElement("stripe-buy-button");
    button.setAttribute("buy-button-id", buyButtonId);
    button.setAttribute("publishable-key", publishableKey);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(button);
    }
  }, [buyButtonId, publishableKey]);

  return <div ref={containerRef} />;
};

export default StripeBuyButton;
