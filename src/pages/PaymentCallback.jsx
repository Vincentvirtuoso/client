import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useOrder } from "../hooks/useOrder";
import { useCart } from "../hooks/useCart";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const { verifyPayment } = useOrder();
  const { clearCart } = useCart();

  useEffect(() => {
    const handleCallback = async () => {
      const reference = searchParams.get("reference");
      const trxref = searchParams.get("trxref");
      const statusParam = searchParams.get("status");

      // Check for explicit failure from payment gateway
      if (statusParam === "failed" || statusParam === "cancelled") {
        toast.error("Payment was cancelled or failed");
        navigate("/checkout");
        return;
      }

      // Get the actual reference (Paystack uses both params)
      const paymentReference = reference || trxref;

      if (!paymentReference) {
        toast.error("Invalid payment reference");
        navigate("/checkout");
        return;
      }

      try {
        // Verify payment with backend
        const verificationResult = await verifyPayment(paymentReference);

        // Log for debugging
        console.log("Payment verification result:", verificationResult);

        if (
          verificationResult?.status === "success" &&
          verificationResult?.verified
        ) {
          setStatus("success");
          setOrderData(verificationResult.data);

          // Show appropriate message based on payment status
          if (verificationResult.message?.includes("already verified")) {
            toast.success("Payment was already verified!");
          } else {
            toast.success("Payment verified successfully!");
          }

          // Clear cart on successful payment
          clearCart?.();

          // Get order info from sessionStorage
          const pendingOrder = sessionStorage.getItem("pendingOrder");
          const orderInfo = pendingOrder ? JSON.parse(pendingOrder) : null;

          // Clean up sessionStorage
          sessionStorage.removeItem("pendingOrder");

          // Store order data for potential retry or debugging
          localStorage.setItem(
            "lastSuccessfulOrder",
            JSON.stringify(verificationResult.data),
          );

          // Navigate to success page after a brief delay for better UX
          setTimeout(() => {
            navigate("/order-success", {
              state: {
                orderId: verificationResult.data?.orderId || orderInfo?.orderId,
                orderNumber:
                  verificationResult.data?.orderNumber ||
                  orderInfo?.orderNumber,
                amount: verificationResult.data?.amount || orderInfo?.amount,
                currency: verificationResult.data?.currency || "NGN",
                reference: paymentReference,
                paidAt: verificationResult.data?.paidAt,
                verified: verificationResult.verified,
                paymentMethod: "paystack",
                ...(verificationResult.data || {}),
              },
            });
          }, 1500);
        } else if (verificationResult?.status === "pending") {
          setStatus("pending");
          toast.loading("Payment is still processing. Please wait...");
          // You might want to implement polling here for pending payments
          setTimeout(() => {
            navigate("/orders");
          }, 3000);
        } else {
          setStatus("failed");
          const errorMessage =
            verificationResult?.message || "Payment verification failed";
          toast.error(errorMessage);

          // Store failed payment info for debugging/retry
          localStorage.setItem(
            "lastFailedPayment",
            JSON.stringify({
              reference: paymentReference,
              error: errorMessage,
              timestamp: new Date().toISOString(),
            }),
          );

          // Navigate to checkout with error state
          setTimeout(() => {
            navigate("/checkout", {
              state: {
                paymentError: errorMessage,
                reference: paymentReference,
              },
            });
          }, 2000);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        toast.error("Payment verification failed. Please contact support.");

        // Navigate to error page or checkout
        setTimeout(() => {
          navigate("/checkout", {
            state: {
              paymentError: err.message || "Verification error",
              reference: paymentReference,
            },
          });
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, verifyPayment, clearCart]);

  // Render different states
  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Verified!
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecting to order summary...
            </p>
            {orderData && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  Order:{" "}
                  <span className="font-medium">{orderData.orderNumber}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Amount:{" "}
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: orderData.currency || "NGN",
                    }).format(orderData.amount)}
                  </span>
                </p>
              </div>
            )}
          </div>
        );

      case "pending":
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Your payment is being processed. Please check your orders later.
            </p>
          </div>
        );

      case "failed":
      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">Redirecting to checkout...</p>
            <button
              onClick={() => navigate("/checkout")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return to Checkout
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {renderContent()}

        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Debug Info:
            </p>
            <p className="text-xs text-gray-600">
              Reference:{" "}
              {searchParams.get("reference") ||
                searchParams.get("trxref") ||
                "N/A"}
            </p>
            <p className="text-xs text-gray-600">
              Status: {searchParams.get("status") || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
