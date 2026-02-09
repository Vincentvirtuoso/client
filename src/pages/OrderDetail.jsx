import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiMapPin,
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import * as Icons from "react-icons/fi";
import { useOrder } from "../hooks/useOrder";
import { formatCurrency, formatDate } from "../utils/helpers";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchOrderById, cancelOrder } = useOrder();

  const statusConfig = {
    pending: {
      text: "Pending",
      icon: "FiClock",
      color: "bg-yellow-500",
    },
    success: {
      text: "Success",
      icon: "FiCheckCircle",
      color: "bg-green-500",
    },
    confirmed: {
      text: "Confirmed",
      icon: "FiCheckCircle",
      color: "bg-blue-500",
    },
    processing: {
      text: "Processing",
      icon: "FiPackage",
      color: "bg-purple-500",
    },
    shipped: {
      text: "Shipped",
      icon: "FiTruck",
      color: "bg-indigo-500",
    },
    in_transit: {
      text: "In Transit",
      icon: "FiTruck",
      color: "bg-orange-500",
    },
    out_for_delivery: {
      text: "Out for Delivery",
      icon: "FiTruck",
      color: "bg-pink-500",
    },
    delivered: {
      text: "Delivered",
      icon: "FiCheckCircle",
      color: "bg-green-500",
    },
    cancelled: {
      text: "Cancelled",
      icon: "FiXCircle",
      color: "bg-red-500",
    },
    refunded: {
      text: "Refunded",
      icon: "FiDollarSign",
      color: "bg-gray-500",
    },
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderById(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      console.error("Error loading order:", err);
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, []);

  const getIconComponent = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const IconName = statusConfig[normalizedStatus]?.icon;

    return Icons[IconName] || FiPackage;
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(orderId, "Cancelled by customer");
      // Reload order data
      const updatedOrder = await fetchOrderById(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      alert("Failed to cancel order: " + err.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>

          <div className="text-center py-12">
            <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h1>
            <p className="text-gray-600">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Back to Orders
            </button>
            {(error === "Something went wrong" ||
              error === "Network Error") && (
              <button
                onClick={loadOrder}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getIconComponent(statusConfig[order.status]?.icon);
  const statusColor = statusConfig[order.status]?.color || "bg-gray-500";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.dates?.placedAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor} text-white`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusConfig[order.status]?.text || order.status}
              </span>

              {/* Cancel button for pending orders */}
              {["pending", "confirmed", "processing"].includes(
                order.status,
              ) && (
                <button
                  onClick={handleCancelOrder}
                  className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FiPackage className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product?.name || `Item ${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        {item.price?.unit && (
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price.unit)} × {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(
                          (item.price?.unit || 0) * item.quantity,
                        )}
                      </p>
                      {item.tax?.amount && item.tax.amount > 0 && (
                        <p className="text-sm text-gray-600">
                          Tax: {formatCurrency(item.tax.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2 text-red-500" />
                Shipping Information
              </h2>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.customer?.firstName} {order.customer?.lastName}
                </p>
                <p>{order.shipping?.address?.addressLine1 || "Not provided"}</p>
                {order.shipping?.address?.addressLine2 && (
                  <p>{order.shipping.address.addressLine2}</p>
                )}
                <p>
                  {order.shipping?.address?.city || ""},{" "}
                  {order.shipping?.address?.state || ""}{" "}
                  {order.shipping?.address?.postalCode || ""}
                </p>
                <p>{order.shipping?.address?.country || ""}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Phone: {order.customer?.phone || "Not provided"}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {order.customer?.email || "Not provided"}
                </p>

                {/* Shipping method */}
                {order.shipping?.method && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                      Shipping Method:{" "}
                      <span className="font-normal capitalize">
                        {order.shipping.method.replace("_", " ")}
                      </span>
                    </p>
                    {order.shipping?.trackingNumber && (
                      <p className="text-sm text-gray-600 mt-1">
                        Tracking: {order.shipping.trackingNumber}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Timeline
              </h2>
              <div className="space-y-4">
                {order.statusHistory?.map((history, index) => {
                  const normalizedStatus = history.status?.toLowerCase();
                  const HistoryIcon = getIconComponent(history.status);
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 ${statusConfig[normalizedStatus]?.color || "bg-red-500"} rounded-full mt-2`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          {HistoryIcon && (
                            <HistoryIcon className="w-4 h-4 mr-2 text-gray-400" />
                          )}
                          <p className="font-medium text-gray-900">
                            {statusConfig[history.status]?.text ||
                              history.status}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(history.timestamp)}
                        </p>
                        {history.note && (
                          <p className="text-sm text-gray-500 mt-1">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {(!order.statusHistory || order.statusHistory.length === 0) && (
                  <p className="text-gray-500 text-sm italic">
                    No status history available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(order.pricing?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatCurrency(order.pricing?.shipping || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(order.pricing?.tax?.total || 0)}</span>
                </div>
                {order.pricing?.discount?.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">
                      -{formatCurrency(order.pricing.discount.amount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">
                    {formatCurrency(order.pricing?.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiDollarSign className="w-5 h-5 mr-2 text-red-500" />
                Payment Information
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium capitalize">
                    {order.payment?.method?.replace("_", " ") || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium capitalize ${
                      order.payment?.status === "paid"
                        ? "text-green-600"
                        : order.payment?.status === "failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {order.payment?.status || "N/A"}
                  </span>
                </div>
                {order.payment?.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-sm truncate max-w-[150px]">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
                {order.payment?.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At</span>
                    <span className="font-medium">
                      {formatDate(order.payment.paidAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Important Dates
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Placed</span>
                  <span>{formatDate(order.dates?.placedAt)}</span>
                </div>
                {order.dates?.paymentProcessedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Processed</span>
                    <span>{formatDate(order.dates.paymentProcessedAt)}</span>
                  </div>
                )}
                {order.dates?.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Confirmed</span>
                    <span>{formatDate(order.dates.confirmedAt)}</span>
                  </div>
                )}
                {order.dates?.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Processed</span>
                    <span>{formatDate(order.dates.processedAt)}</span>
                  </div>
                )}
                {order.dates?.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipped</span>
                    <span>{formatDate(order.dates.shippedAt)}</span>
                  </div>
                )}
                {order.dates?.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered</span>
                    <span>{formatDate(order.dates.deliveredAt)}</span>
                  </div>
                )}
                {order.dates?.expectedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Delivery</span>
                    <span>{formatDate(order.dates.expectedDelivery)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Actions */}
            {(order.status === "delivered" || order.status === "refunded") && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Actions
                </h2>
                <div className="space-y-2">
                  {order.status === "delivered" && (
                    <>
                      <button
                        onClick={() =>
                          alert(
                            "Download invoice functionality to be implemented",
                          )
                        }
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Download Invoice
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            "Request return functionality to be implemented",
                          )
                        }
                        className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Request Return
                      </button>
                    </>
                  )}
                  {order.status === "refunded" && (
                    <button
                      onClick={() =>
                        alert(
                          "View refund details functionality to be implemented",
                        )
                      }
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Refund Details
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
