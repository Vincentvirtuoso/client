import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  LuCircleCheck,
  LuPackage,
  LuMail,
  LuClock,
  LuRefreshCcw,
  LuUser,
  LuMapPin,
  LuCreditCard,
  LuCalendar,
} from "react-icons/lu";
import { useState } from "react";
import { useOrder } from "../hooks/useOrder";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    orderId,
    orderNumber,
    amount,
    paymentMethod,
    reference,
    currency,
    paidAt,
  } = location.state || {};

  console.log("Location state:", location.state);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchOrderById } = useOrder();

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const response = await fetchOrderById(orderId);
      setOrder(response);
      console.log("Order details:", response);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      // If no orderId in state, try to get from URL or redirect
      const params = new URLSearchParams(window.location.search);
      const urlOrderId = params.get("orderId");

      if (urlOrderId) {
        fetchOrderDetails();
      } else {
        // navigate("/");
      }
      return;
    }

    fetchOrderDetails();
  }, [orderId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount, currencyCode = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate estimated delivery date (3-5 business days from order date)
  const calculateEstimatedDelivery = () => {
    const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4); // 3-5 business days

    return deliveryDate.toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Use order data if available, otherwise use location state
  const orderDetails = order || {
    orderNumber: orderNumber || "N/A",
    _id: orderId,
    pricing: {
      total: amount || 0,
      currency: currency || "NGN",
      shipping: 0,
      subtotal: 0,
      tax: { total: 0 },
      discount: { amount: 0 },
    },
    payment: {
      method: paymentMethod || "paystack",
      status: "paid",
      transactionId: reference,
      paidAt: paidAt,
    },
    customer: {
      firstName: "Customer",
      lastName: "",
      email: "",
      phone: "",
    },
    shipping: {
      address: {},
      cost: 0,
    },
    status: "pending",
    createdAt: new Date().toISOString(),
    dates: {
      placedAt: new Date().toISOString(),
    },
  };

  const totalItems = order?.items?.length || 0;
  const estimatedDelivery = calculateEstimatedDelivery();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
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
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-xl font-bold text-gray-900">
                      {orderDetails.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-xl font-bold text-gray-900 truncate">
                      {orderDetails._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(
                        orderDetails.createdAt || orderDetails.dates?.placedAt,
                      )}
                    </p>
                  </div>
                  <div>
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium inline-flex items-center gap-2">
                      <LuCircleCheck className="w-4 h-4" />
                      {orderDetails.payment?.status === "paid"
                        ? "Paid"
                        : orderDetails.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}

              <button
                className={`w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={fetchOrderDetails}
                disabled={loading}
              >
                <LuRefreshCcw
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh Order Status"}
              </button>

              {/* Order Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LuCreditCard className="w-6 h-6 text-gray-600" />
                    <b className="font-semibold text-gray-900 text-xl">
                      Payment Summary
                    </b>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          orderDetails.pricing?.subtotal || 0,
                          orderDetails.pricing?.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          orderDetails.pricing?.shipping || 0,
                          orderDetails.pricing?.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          orderDetails.pricing?.tax?.total || 0,
                          orderDetails.pricing?.currency,
                        )}
                      </span>
                    </div>
                    {orderDetails.pricing?.discount?.amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span className="font-medium">
                          -
                          {formatCurrency(
                            orderDetails.pricing.discount.amount,
                            orderDetails.pricing.currency,
                          )}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-red-600">
                          {formatCurrency(
                            orderDetails.pricing?.total || 0,
                            orderDetails.pricing?.currency,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LuUser className="w-6 h-6 text-gray-600" />
                    <b className="font-semibold text-gray-900 text-xl">
                      Customer Information
                    </b>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {orderDetails.customer?.firstName}{" "}
                      {orderDetails.customer?.lastName}
                    </p>
                    <p className="text-gray-600">
                      {orderDetails.customer?.email}
                    </p>
                    <p className="text-gray-600">
                      {orderDetails.customer?.phone}
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      Items Ordered: {totalItems}
                    </p>
                  </div>
                </div>

                {/* Payment & Delivery */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LuCalendar className="w-6 h-6 text-gray-600" />
                    <b className="font-semibold text-gray-900 text-xl">
                      Timeline
                    </b>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {orderDetails.payment?.method?.replace("_", " ")}
                      </p>
                      {orderDetails.payment?.transactionId && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          Ref: {orderDetails.payment.transactionId}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-medium text-gray-900">
                        {orderDetails.payment?.paidAt
                          ? formatDate(orderDetails.payment.paidAt)
                          : "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Estimated Delivery
                      </p>
                      <p className="font-medium text-gray-900">
                        {estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {orderDetails.shipping?.address && (
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LuMapPin className="w-6 h-6 text-gray-600" />
                    <b className="font-semibold text-xl text-gray-900">
                      Shipping Address
                    </b>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {orderDetails.shipping.address?.addressLine1 || "N/A"}
                      </p>
                      <p className="font-medium text-gray-900">
                        {orderDetails.shipping.address?.addressLine2 || null}
                      </p>
                      <p className="text-gray-600">
                        {orderDetails.shipping.address.city},{" "}
                        {orderDetails.shipping.address.state}
                      </p>
                      <p className="text-gray-600">
                        {orderDetails.shipping.address.country}{" "}
                        {orderDetails.shipping.address.postalCode}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-sm text-gray-500">Shipping Cost</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(
                          orderDetails.shipping.cost || 0,
                          orderDetails.pricing?.currency,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items Preview */}
              {order?.items && order.items.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Order Items ({totalItems})
                  </h3>
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                          {item?.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item?.product.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <LuPackage className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} ×{" "}
                            {formatCurrency(
                              item.product.price || 0,
                              order.pricing?.currency,
                            )}
                          </p>
                        </div>
                        <div className="font-bold">
                          {formatCurrency(
                            (item?.product.price || 0) * (item.quantity || 1),
                            order.pricing?.currency,
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-center text-gray-600 text-sm pt-2">
                        + {order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link
                  to={`/order/${orderDetails._id}`}
                  className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  <LuPackage className="w-5 h-5" />
                  View Complete Order Details
                </Link>
                <Link
                  to="/"
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <LuMail className="w-5 h-5 text-red-600" />
              <strong className="font-semibold text-gray-900">
                Email Confirmation
              </strong>
            </div>
            <p className="text-gray-600 text-xs">
              Check your email ({orderDetails.customer?.email}) for order
              confirmation and tracking information.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <LuPackage className="w-5 h-5 text-red-600" />
              <strong className="font-semibold text-gray-900">
                Track Your Order
              </strong>
            </div>
            <p className="text-gray-600 text-xs">
              You can track your order status in "My Orders" section of your
              account.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <LuClock className="w-5 h-5 text-red-600" />
              <strong className="font-semibold text-gray-900">
                Need Changes?
              </strong>
            </div>
            <p className="text-gray-600 text-xs">
              Contact us within 1 hour if you need to modify your order. Order
              ID: {orderDetails._id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
