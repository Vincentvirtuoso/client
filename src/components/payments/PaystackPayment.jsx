import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";
import { usePaystackScript } from "../../hooks/usePaystackScript";
import { usePaystackPayment } from "../../hooks/usePaystackPayment";

const PaystackPayment = ({ amount, email, orderData }) => {
  const [loading, setLoading] = useState(false);

  const ready = usePaystackScript();
  const { pay } = usePaystackPayment();

  const { clearCart } = useCart();
  const { createOrder, verifyPayment } = useOrder();
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!ready) {
      toast.error("Payment system loading");
      return;
    }

    if (!email || amount <= 0) {
      toast.error("Invalid payment details");
      return;
    }

    setLoading(true);

    // Generate a unique reference
    const reference = `PSK-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    pay({
      amount,
      email,
      reference,

      onSuccess: async (paystackResponse) => {
        try {
          // CRITICAL: Verify payment on backend before creating order
          const verificationResult = await verifyPayment(
            paystackResponse.reference
          );

          if (!verificationResult?.data?.verified) {
            throw new Error("Payment verification failed");
          }

          // Only create order after backend confirms payment
          const result = await createOrder({
            ...orderData,
            paymentMethod: "paystack",
            paymentReference: paystackResponse.reference,
            paymentStatus: "paid",
            amount: verificationResult.data.amount / 100, // Convert from kobo
          });

          const order = result?.data?.order;
          if (!order?._id) {
            throw new Error("Order creation failed");
          }

          clearCart?.();
          toast.success("Payment successful");

          navigate("/order-success", {
            state: {
              orderId: order._id,
              orderNumber: order.orderNumber,
              amount: verificationResult.data.amount / 100,
              paymentMethod: "paystack",
              reference: paystackResponse.reference,
            },
          });
        } catch (err) {
          console.error("Payment processing error:", err);
          toast.error(
            err.message || "Payment verified but order failed. Contact support."
          );

          // Navigate to a support page with payment reference
          navigate("/payment-issue", {
            state: {
              reference: paystackResponse.reference,
              amount,
              email,
            },
          });
        } finally {
          setLoading(false);
        }
      },

      onClose: () => {
        setLoading(false);
        toast("Payment cancelled");
      },

      onError: (error) => {
        setLoading(false);
        console.error("Paystack error:", error);
        toast.error("Payment failed. Please try again.");
      },
    });
  };

  const disabled = loading || !ready || !email || amount <= 0;

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-3"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : !ready ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>Pay ₦{amount.toLocaleString()} with Paystack</>
      )}
    </button>
  );
};

export default PaystackPayment;
