import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import * as Icons from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import { formatCurrency, formatDate, getStatusConfig } from "../utils/helpers";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localSearch, setLocalSearch] = useState("");

  const {
    orders,
    orderStats,
    pagination,
    loading,
    error,
    searchOrders,
    goToPage,
    nextPage,
    prevPage,
  } = useOrder();

  const navigate = useNavigate();
  const statusConfig = getStatusConfig();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        setSearchTerm(localSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, searchTerm]);

  // Trigger search when filters change
  useEffect(() => {
    const performSearch = async () => {
      try {
        await searchOrders(searchTerm, statusFilter);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    performSearch();
  }, [searchTerm, statusFilter, searchOrders]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = async (e) => {
    const value = e.target.value;
    setStatusFilter(value);
  };

  // Get icon component from string
  const getIconComponent = (iconName) => {
    const Icon = Icons[iconName];
    return Icon || FiPackage;
  };

  // Render loading state
  if (loading && !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to load orders
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || "An error occurred while fetching your orders."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
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
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.total}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.delivered}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.processing}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats.inTransit}
                </p>
              </div>
            </div>
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
                  value={localSearch}
                  onChange={handleSearchChange}
                  disabled={loading}
                />
                {loading && (
                  <FiLoader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
                )}
              </div>
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={statusFilter}
                onChange={handleStatusChange}
                disabled={loading}
              >
                <option value="all">All Status</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && orders.length > 0 && (
            <div className="p-4 text-center">
              <FiLoader className="w-5 h-5 text-red-500 animate-spin inline mr-2" />
              <span className="text-sm text-gray-600">Updating...</span>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {orders.map((order) => {
              const StatusIcon = getIconComponent(
                statusConfig[order.status]?.icon
              );
              const statusColor =
                statusConfig[order.status]?.color || "bg-gray-500";

              return (
                <div
                  key={order._id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.dates?.placedAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor} text-white`}
                          >
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig[order.status]?.text || order.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Items</p>
                          <p className="font-medium">
                            {order.items?.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            ) || 0}{" "}
                            items
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="font-medium text-red-600">
                            {formatCurrency(order.pricing?.total || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment</p>
                          <p className="font-medium capitalize">
                            {order.payment?.method?.replace("_", " ") || "N/A"}{" "}
                            • {order.payment?.status || "N/A"}
                          </p>
                        </div>
                      </div>

                      {order.dates?.expectedDelivery && (
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

          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't placed any orders yet."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={!pagination.hasPrevPage || loading}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    !pagination.hasPrevPage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="hidden md:flex items-center space-x-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map(
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          disabled={loading}
                          className={`w-10 h-10 rounded-lg ${
                            pagination.page === pageNum
                              ? "bg-red-500 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={nextPage}
                  disabled={!pagination.hasNextPage || loading}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    !pagination.hasNextPage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Next
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
