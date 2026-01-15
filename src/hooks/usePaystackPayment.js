import toast from "react-hot-toast";

export const usePaystackPayment = () => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Missing Paystack public key");
  }

  const pay = ({ amount, email, reference, onSuccess, onClose }) => {
    if (!window.PaystackPop) {
      toast.error("Payment processor unavailable");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: Math.round(Number(amount) * 100),
      currency: "NGN",
      ref: reference,
      channels: ["card", "bank"],
      callback: onSuccess,
      onClose,
    });

    try {
      handler.openIframe();
    } catch (error) {
      console.error("Paystack iframe error:", error);
      toast.error("Unable to open payment window");
    }
  };

  return { pay };
};
