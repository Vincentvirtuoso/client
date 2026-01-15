import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const usePaystackScript = () => {
  const [ready, setReady] = useState(!!window.PaystackPop);

  useEffect(() => {
    if (window.PaystackPop) {
      setReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://js.paystack.co/v1/inline.js"]'
    );

    if (existingScript) {
      existingScript.onload = () => setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => {
      if (window.PaystackPop) {
        setReady(true);
      } else {
        toast.error("Paystack failed to initialize");
      }
    };

    script.onerror = () => {
      toast.error("Failed to load Paystack");
    };

    document.body.appendChild(script);
  }, []);

  return ready;
};
