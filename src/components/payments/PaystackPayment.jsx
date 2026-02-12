import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useOrder } from "../../hooks/useOrder";

const PaystackPayment = ({
  amount,
  email,
  prepareOrderData,
  handleSaveShippingInfo,
}) => {
  const [loading, setLoading] = useState(false);
  const { createOrder } = useOrder();

  const handlePayment = async () => {
    if (!email || amount <= 0) {
      toast.error("Invalid payment details");
      return;
    }

    setLoading(true);
    handleSaveShippingInfo?.();

    const timestamp = Date.now();
    const reference = `PSK-${uuidv4()}-${timestamp}`;

    const orderData = prepareOrderData ? prepareOrderData() : null;

    if (!orderData) {
      setLoading(false);
      toast.error("Failed to prepare order data");
      return;
    }

    try {
      const result = await createOrder({
        ...orderData,
        paymentMethod: "paystack",
        paymentReference: reference,
        paymentStatus: "pending",
        amount,
      });

      const order = result?.data?.order;
      const payment = result?.data?.payment;

      console.log("Order created:", order);
      console.log("Payment data:", payment);

      if (!order?.id) {
        throw new Error("Order creation failed");
      }

      // ✅ Redirect to Paystack's hosted payment page
      if (payment?.authorization_url) {
        // Store order info in sessionStorage for the callback page
        sessionStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount,
            reference: payment.reference,
          }),
        );

        // Redirect to Paystack
        window.location.href = payment.authorization_url;
      } else {
        throw new Error("Payment URL not generated");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setLoading(false);
      toast.error(err?.message || "Failed to create order. Try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !email || amount <= 0}
      className="w-full bg-linear-to-r from-cyan-600 to-blue-600 text-white font-semibold py-4 rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-3"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>Pay ₦{amount.toLocaleString()} with Paystack</>
      )}
    </button>
  );
};

export default PaystackPayment;
