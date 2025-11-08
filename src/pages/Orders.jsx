import React, { useState } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiShoppingBag,
  FiArrowLeft,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy data matching your schema
const dummyOrders = [
  {
    _id: "1",
    orderNumber: "ORD-20231215-12345",
    customer: {
      user: "user123",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+2348012345678",
      isGuest: false,
    },
    items: [
      {
        product: "prod1",
        quantity: 2,
        price: {
          unit: 25000,
          final: 22500,
        },
        tax: {
          amount: 3375,
        },
      },
      {
        product: "prod2",
        quantity: 1,
        price: {
          unit: 15000,
          final: 15000,
        },
        tax: {
          amount: 2250,
        },
      },
    ],
    shipping: {
      address: {
        addressLine1: "123 Main Street",
        addressLine2: "Suite 45",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
      cost: 1500,
    },
    payment: {
      method: "paystack",
      status: "paid",
      transactionId: "TRX-001",
      paidAt: new Date("2023-12-15T10:30:00Z"),
    },
    pricing: {
      subtotal: 37500,
      shipping: 1500,
      tax: {
        total: 5625,
      },
      discount: {
        amount: 5000,
        code: "WELCOME10",
      },
      total: 39625,
      currency: "NGN",
    },
    status: "delivered",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date("2023-12-15T10:00:00Z"),
        note: "Order placed",
        updatedBy: "user123",
      },
      {
        status: "paid",
        timestamp: new Date("2023-12-15T10:30:00Z"),
        note: "Payment confirmed",
        updatedBy: "system",
      },
    ],
    returns: [],
    dates: {
      placedAt: new Date("2023-12-15T10:00:00Z"),
      paidAt: new Date("2023-12-15T10:30:00Z"),
      processedAt: new Date("2023-12-16T09:00:00Z"),
      shippedAt: new Date("2023-12-17T14:20:00Z"),
      deliveredAt: new Date("2023-12-19T11:15:00Z"),
      expectedDelivery: new Date("2023-12-20T00:00:00Z"),
    },
    isDeleted: false,
  },
  {
    _id: "2",
    orderNumber: "ORD-20231220-67890",
    customer: {
      user: "user123",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+2348012345678",
      isGuest: false,
    },
    items: [
      {
        product: "prod3",
        quantity: 1,
        price: {
          unit: 45000,
          final: 45000,
        },
        tax: {
          amount: 6750,
        },
      },
    ],
    shipping: {
      address: {
        addressLine1: "123 Main Street",
        addressLine2: "Suite 45",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
      cost: 1200,
    },
    payment: {
      method: "paystack",
      status: "paid",
      transactionId: "TRX-002",
      paidAt: new Date("2023-12-20T08:15:00Z"),
    },
    pricing: {
      subtotal: 45000,
      shipping: 1200,
      tax: {
        total: 6750,
      },
      discount: {
        amount: 0,
        code: "",
      },
      total: 52950,
      currency: "NGN",
    },
    status: "processing",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date("2023-12-20T08:00:00Z"),
        note: "Order placed",
        updatedBy: "user123",
      },
      {
        status: "paid",
        timestamp: new Date("2023-12-20T08:15:00Z"),
        note: "Payment confirmed",
        updatedBy: "system",
      },
    ],
    returns: [],
    dates: {
      placedAt: new Date("2023-12-20T08:00:00Z"),
      paidAt: new Date("2023-12-20T08:15:00Z"),
      expectedDelivery: new Date("2023-12-27T00:00:00Z"),
    },
    isDeleted: false,
  },
  {
    _id: "3",
    orderNumber: "ORD-20231210-54321",
    customer: {
      user: "user123",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "+2348012345678",
      isGuest: false,
    },
    items: [
      {
        product: "prod4",
        quantity: 3,
        price: {
          unit: 8000,
          final: 7200,
        },
        tax: {
          amount: 3240,
        },
      },
    ],
    shipping: {
      address: {
        addressLine1: "123 Main Street",
        addressLine2: "Suite 45",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
      cost: 1000,
    },
    payment: {
      method: "cash_on_delivery",
      status: "pending",
      transactionId: null,
    },
    pricing: {
      subtotal: 21600,
      shipping: 1000,
      tax: {
        total: 3240,
      },
      discount: {
        amount: 2400,
        code: "SALE20",
      },
      total: 21440,
      currency: "NGN",
    },
    status: "payment_pending",
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date("2023-12-10T15:45:00Z"),
        note: "Order placed",
        updatedBy: "user123",
      },
    ],
    returns: [],
    dates: {
      placedAt: new Date("2023-12-10T15:45:00Z"),
      expectedDelivery: new Date("2023-12-17T00:00:00Z"),
    },
    isDeleted: false,
  },
];

// Status configuration with colors and icons
const statusConfig = {
  pending: { color: "bg-yellow-500", icon: FiClock, text: "Pending" },
  payment_pending: {
    color: "bg-orange-500",
    icon: FiClock,
    text: "Payment Pending",
  },
  paid: { color: "bg-blue-500", icon: FiDollarSign, text: "Paid" },
  processing: { color: "bg-purple-500", icon: FiPackage, text: "Processing" },
  ready_to_ship: {
    color: "bg-indigo-500",
    icon: FiPackage,
    text: "Ready to Ship",
  },
  shipped: { color: "bg-teal-500", icon: FiTruck, text: "Shipped" },
  out_for_delivery: {
    color: "bg-green-500",
    icon: FiTruck,
    text: "Out for Delivery",
  },
  delivered: { color: "bg-green-600", icon: FiCheckCircle, text: "Delivered" },
  completed: { color: "bg-green-700", icon: FiCheckCircle, text: "Completed" },
  cancelled: { color: "bg-red-500", icon: FiClock, text: "Cancelled" },
  refunded: { color: "bg-gray-500", icon: FiDollarSign, text: "Refunded" },
  on_hold: { color: "bg-yellow-600", icon: FiClock, text: "On Hold" },
  failed: { color: "bg-red-600", icon: FiClock, text: "Failed" },
};

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = dummyOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data for order statistics
  const orderStats = [
    { month: "Jan", orders: 4, revenue: 120000 },
    { month: "Feb", orders: 7, revenue: 185000 },
    { month: "Mar", orders: 5, revenue: 150000 },
    { month: "Apr", orders: 8, revenue: 220000 },
    { month: "May", orders: 6, revenue: 175000 },
    { month: "Jun", orders: 9, revenue: 245000 },
  ];

  const statusDistribution = [
    { name: "Delivered", value: 12, color: "#16a34a" },
    { name: "Processing", value: 8, color: "#8b5cf6" },
    { name: "Shipped", value: 5, color: "#0d9488" },
    { name: "Pending", value: 3, color: "#eab308" },
    { name: "Cancelled", value: 2, color: "#dc2626" },
  ];

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
                <FiShoppingBag className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FiCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FiPackage className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <FiTruck className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Orders & Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value) : value,
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="orders"
                  fill="#ef4444"
                  name="orders"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Orders"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or product..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                {Object.keys(statusConfig).map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <div
                  key={order._id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.dates.placedAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Items</p>
                          <p className="font-medium">
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{" "}
                            items
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-medium text-red-600">
                            {formatCurrency(order.pricing.total)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment</p>
                          <p className="font-medium capitalize">
                            {order.payment.method.replace("_", " ")} •{" "}
                            {order.payment.status}
                          </p>
                        </div>
                      </div>

                      {order.dates.expectedDelivery && (
                        <div className="mt-3 flex items-center text-sm text-gray-600">
                          <FiClock className="w-4 h-4 mr-1" />
                          Expected delivery:{" "}
                          {formatDate(order.dates.expectedDelivery)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Detail Component
const OrderDetail = ({ order, onBack }) => {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
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

export default OrdersPage;
