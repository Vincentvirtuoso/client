import toast from "react-hot-toast";

export const usePaystackPayment = () => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Missing Paystack public key");
  }

  const pay = ({ amount, email, reference, onSuccess, onClose, onError }) => {
    if (!window.PaystackPop) {
      toast.error("Payment processor unavailable");
      onError?.(new Error("PaystackPop not loaded"));
      return;
    }

    if (!publicKey) {
      toast.error("Payment configuration error");
      onError?.(new Error("Missing public key"));
      return;
    }

    // Validate amount
    const amountInKobo = Math.round(Number(amount) * 100);
    if (isNaN(amountInKobo) || amountInKobo <= 0) {
      toast.error("Invalid payment amount");
      onError?.(new Error("Invalid amount"));
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: amountInKobo,
        currency: "NGN",
        ref: reference,
        channels: [
          "card",
          "bank",
          "ussd",
          "qr",
          "mobile_money",
          "bank_transfer",
        ],

        callback: (response) => {
          // Paystack calls this on successful payment
          console.log("Paystack callback:", response);
          onSuccess?.(response);
        },

        onClose: () => {
          // Called when user closes the payment modal
          console.log("Payment modal closed");
          onClose?.();
        },

        // Additional metadata for tracking
        metadata: {
          custom_fields: [
            {
              display_name: "Order Reference",
              variable_name: "order_reference",
              value: reference,
            },
          ],
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Paystack iframe error:", error);
      toast.error("Unable to open payment window");
      onError?.(error);
    }
  };

  return { pay };
};
