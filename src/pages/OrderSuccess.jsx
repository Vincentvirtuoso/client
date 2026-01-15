import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LuCircleCheck, LuPackage, LuMail, LuClock } from "react-icons/lu";
import { useState } from "react";
import { useOrder } from "../hooks/useOrder";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderNumber, amount, paymentMethod, estimatedDelivery } =
    location.state || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getOrder } = useOrder();

  useEffect(() => {
    if (!orderId && !orderNumber) {
      navigate("/");
      return;
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await getOrder(orderId);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const orderDetails = order || {
    orderNumber: orderNumber || `ORD-${Date.now()}`,
    total: amount || 0,
    payment: {
      method: paymentMethod || "cash_on_delivery",
      status: "pending",
    },
    estimatedDelivery: estimatedDelivery || "In 3-5 business days",
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-full">
                <LuCircleCheck className="w-16 h-16 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Confirmed!
            </h1>
            <p className="text-green-100">
              Thank you for your purchase. We'll send you a confirmation email
              shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Order Number */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-xl font-bold text-gray-900">
                      {orderDetails.orderNumber}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Confirmed
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LuPackage className="w-6 h-6 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Payment</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    ₦{orderDetails.total?.toLocaleString()}
                  </p>
                  <p className="text-gray-600 capitalize">
                    {orderDetails.payment?.method.replace("_", " ")}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Status: {orderDetails.payment?.status}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LuClock className="w-6 h-6 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">
                    {orderDetails.estimatedDelivery}
                  </p>
                  <p className="text-gray-600">Standard Delivery</p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll receive tracking information soon
                  </p>
                </div>
              </div>

              {/* What's Next */}
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  What happens next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order Processing
                      </p>
                      <p className="text-gray-600 text-sm">
                        We're preparing your order for shipment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Shipping</p>
                      <p className="text-gray-600 text-sm">
                        Your order will be shipped within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Delivery</p>
                      <p className="text-gray-600 text-sm">
                        Estimated delivery: {orderDetails.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  to="/orders"
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-all text-center"
                >
                  View Order Details
                </Link>
                <Link
                  to="/"
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all text-center"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Help Text */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Need help?{" "}
                  <Link
                    to="/contact"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Contact our support team
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  We'll send order updates to your email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <LuMail className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">
                Email Confirmation
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Check your email for order confirmation and tracking information.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <LuPackage className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Track Your Order</h3>
            </div>
            <p className="text-gray-600 text-sm">
              You can track your order in "My Orders" section.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <LuClock className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Need Changes?</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Contact us within 1 hour if you need to modify your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
