import { useParams } from "react-router-dom";
import { dummyOrders, statusConfig } from "../data/orders";
import { FiPackage, FiDollarSign, FiMapPin, FiArrowLeft } from "react-icons/fi";

const OrderDetail = () => {
  const { orderId } = useParams();
  const order = dummyOrders.find((o) => o._id === orderId); // Replace "1" with dynamic ID as needed
  const StatusIcon = statusConfig[order.status].icon;

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
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
                Placed on {formatDate(order.dates.placedAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  statusConfig[order.status].color
                } text-white`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusConfig[order.status].text}
              </span>
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
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Product {item.product}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.price.unit)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price.final * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tax: {formatCurrency(item.tax.amount)}
                      </p>
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
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p>{order.shipping.address.addressLine1}</p>
                {order.shipping.address.addressLine2 && (
                  <p>{order.shipping.address.addressLine2}</p>
                )}
                <p>
                  {order.shipping.address.city}, {order.shipping.address.state}{" "}
                  {order.shipping.address.postalCode}
                </p>
                <p>{order.shipping.address.country}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Phone: {order.customer.phone}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {order.customer.email}
                </p>
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Timeline
              </h2>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {statusConfig[history.status]?.text || history.status}
                      </p>
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
                ))}
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
                  <span>{formatCurrency(order.pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatCurrency(order.pricing.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(order.pricing.tax.total)}</span>
                </div>
                {order.pricing.discount.amount > 0 && (
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
                    {formatCurrency(order.pricing.total)}
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
                    {order.payment.method.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">
                    {order.payment.status}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
                {order.payment.paidAt && (
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
                  <span>{formatDate(order.dates.placedAt)}</span>
                </div>
                {order.dates.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Confirmed</span>
                    <span>{formatDate(order.dates.paidAt)}</span>
                  </div>
                )}
                {order.dates.processedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Processed</span>
                    <span>{formatDate(order.dates.processedAt)}</span>
                  </div>
                )}
                {order.dates.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipped</span>
                    <span>{formatDate(order.dates.shippedAt)}</span>
                  </div>
                )}
                {order.dates.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered</span>
                    <span>{formatDate(order.dates.deliveredAt)}</span>
                  </div>
                )}
                {order.dates.expectedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Delivery</span>
                    <span>{formatDate(order.dates.expectedDelivery)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
