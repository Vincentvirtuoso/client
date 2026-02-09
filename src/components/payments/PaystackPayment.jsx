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
  const { createOrder, verifyPayment } = useOrder();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!ready) {
      toast.error("Payment system loading");
      return;
    }
    if (!email || amount <= 0) {
      toast.error("Invalid payment details");
      return;
    }

    setLoading(true);

  const [reference] = useState(() => 
    `PSK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

    // 1️⃣ Create order immediately before verification
    let order;
    let payment;
    try {
      const result = await createOrder({
        ...orderData,
        paymentMethod: "paystack",
        paymentReference: reference,
        paymentStatus: "pending",
        amount,
      });
      order = result?.data?.order;
      console.log(result?.data?.order);

      payment = result?.data?.payment;
      if (!order?.id) throw new Error("Order creation failed");
    } catch (err) {
      console.log(err);

      setLoading(false);
      toast.error(err?.message || "Failed to create order. Try again.");
      return;
    }

    // 2️⃣ Start Paystack payment
    pay({
      amount,
      email,
      reference,
      onSuccess: async (paystackResponse) => {
        try {
          // Verify payment after the order exists
          const verificationResult = await verifyPayment(
            paystackResponse.reference,
          );

          if (verificationResult?.data?.verified) {
            toast.success("Payment verified successfully");
          } else {
            toast.error(
              "Payment could not be verified. Please contact support.",
            );
          }

          clearCart?.();

          // Navigate to order success page regardless
          navigate("/order-success", {
            state: {
              orderId: order._id,
              orderNumber: order.orderNumber,
              amount,
              paymentMethod: "paystack",
              reference: paystackResponse.reference,
            },
          });
        } catch (err) {
          console.error("Payment verification error:", err);
          toast.error(
            "Payment processed but verification failed. Contact support.",
          );
          navigate("/order-success", {
            state: {
              orderId: order._id,
              orderNumber: order.orderNumber,
              amount,
              paymentMethod: "paystack",
              reference: paystackResponse.reference,
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

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !ready || !email || amount <= 0}
      className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-3"
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
