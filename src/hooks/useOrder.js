import { useCallback, useEffect, useState } from "react";
import { useApi } from "./useApi";

export const useOrder = () => {
  const { loading, error, callApi, abort } = useApi();
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    delivered: 0,
    processing: 0,
    inTransit: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const createOrder = useCallback(
    async (orderData) => {
      return await callApi({
        endpoint: "/orders",
        method: "POST",
        body: orderData,
      });
    },
    [callApi]
  );

  const fetchOrders = useCallback(
    async (params = {}) => {
      try {
        const queryParams = new URLSearchParams({
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          ...params,
        });

        const data = await callApi({
          endpoint: `/orders/my-orders?${queryParams}`,
          key: "fetchOrders",
          cancelPrevious: true,
        });

        if (data) {
          setOrders(data.data.orders || []);
          setPagination(data.data.pagination || {});
          return data.data.orders;
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        throw err;
      }
    },
    [callApi, pagination.page, pagination.limit]
  );

  const fetchOrderById = useCallback(
    async (orderId) => {
      try {
        const data = await callApi({ endpoint: `/orders/${orderId}` });
        return data?.data.order || null;
      } catch (err) {
        console.error(`Error fetching order ${orderId}:`, err);
        throw err;
      }
    },
    [callApi]
  );

  const fetchOrderStats = useCallback(async () => {
    try {
      const data = await callApi({
        endpoint: "/orders/my-orders?limit=1000",
        key: "fetchOrderStats",
      });

      if (data?.data?.orders) {
        const stats = {
          total: data.data.orders.length,
          delivered: data.data.orders.filter((o) => o.status === "delivered")
            .length,
          processing: data.data.orders.filter((o) => o.status === "processing")
            .length,
          inTransit: data.data.orders.filter((o) =>
            ["shipped", "in_transit", "out_for_delivery"].includes(o.status)
          ).length,
        };

        setOrderStats(stats);
        return stats;
      }
    } catch (err) {
      console.error("Error fetching order stats:", err);
      throw err;
    }
  }, [callApi]);

  const updateOrderStatus = useCallback(
    async (orderId, status, notes = "") => {
      try {
        const data = await callApi({
          endpoint: `/orders/${orderId}/status`,
          method: "PATCH",
          body: {
            status,
            notes,
          },
        });

        // Update local state
        if (data?.data) {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === orderId ? { ...order, ...data.data } : order
            )
          );
        }

        return data?.data || null;
      } catch (err) {
        console.error(`Error updating order ${orderId} status:`, err);
        throw err;
      }
    },
    [callApi]
  );

  const cancelOrder = useCallback(
    async (orderId, reason = "") => {
      try {
        const data = await callApi({
          endpoint: `/orders/${orderId}/cancel`,
          method: "PATCH",
          body: {
            reason,
          },
        });

        if (data?.data) {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === orderId ? { ...order, status: "cancelled" } : order
            )
          );
        }

        return data?.data || null;
      } catch (err) {
        console.error(`Error cancelling order ${orderId}:`, err);
        throw err;
      }
    },
    [callApi]
  );

  const requestReturn = useCallback(
    async (id, returnData) => {
      return await callApi({
        endpoint: `/orders/${id}/returns`,
        method: "POST",
        body: returnData,
      });
    },
    [callApi]
  );

  const getInvoice = useCallback(
    async (id) => {
      return await callApi({
        endpoint: `/orders/${id}/invoice`,
        method: "GET",
      });
    },
    [callApi]
  );

  const confirmCashOnDelivery = useCallback(
    async (id, data) => {
      return await callApi({
        endpoint: `/orders/${id}/confirm-cod`,
        method: "POST",
        body: data,
      });
    },
    [callApi]
  );

  const simulatePaystackPayment = useCallback(
    async (paymentData) => {
      return await callApi({
        endpoint: "/orders/webhook/paystack/simulate",
        method: "POST",
        body: paymentData,
      });
    },
    [callApi]
  );

  const getOrderStatus = (order) => {
    const statusMap = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      payment_pending: {
        label: "Payment Pending",
        color: "bg-blue-100 text-blue-800",
      },
      paid: { label: "Paid", color: "bg-green-100 text-green-800" },
      processing: {
        label: "Processing",
        color: "bg-purple-100 text-purple-800",
      },
      ready_to_ship: {
        label: "Ready to Ship",
        color: "bg-indigo-100 text-indigo-800",
      },
      shipped: { label: "Shipped", color: "bg-blue-100 text-blue-800" },
      out_for_delivery: {
        label: "Out for Delivery",
        color: "bg-cyan-100 text-cyan-800",
      },
      delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
      completed: {
        label: "Completed",
        color: "bg-emerald-100 text-emerald-800",
      },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
      on_hold: { label: "On Hold", color: "bg-orange-100 text-orange-800" },
      failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[order.status] || {
        label: order.status,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const searchOrders = useCallback(
    async (searchTerm, statusFilter = "all") => {
      const params = {};

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      return await fetchOrders(params);
    },
    [fetchOrders]
  );

  // Pagination functions
  const goToPage = useCallback(
    async (page) => {
      if (page < 1 || page > pagination.totalPages) return;
      await fetchOrders({ page });
    },
    [fetchOrders, pagination.totalPages]
  );

  const nextPage = useCallback(async () => {
    if (pagination.hasNextPage) {
      await fetchOrders({ page: pagination.page + 1 });
    }
  }, [fetchOrders, pagination.page, pagination.hasNextPage]);

  const prevPage = useCallback(async () => {
    if (pagination.hasPrevPage) {
      await fetchOrders({ page: pagination.page - 1 });
    }
  }, [fetchOrders, pagination.page, pagination.hasPrevPage]);

  // Load initial data
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();

    return () => {
      abort();
    };
  }, []);

  return {
    // State
    loading,
    error,
    orders,
    orderStats,
    pagination,
    fetchOrders,
    fetchOrderById,
    fetchOrderStats,
    updateOrderStatus,
    cancelOrder,
    searchOrders,
    goToPage,
    nextPage,
    prevPage,
    abort,
    createOrder,
    requestReturn,
    getInvoice,
    confirmCashOnDelivery,
    simulatePaystackPayment,
    getOrderStatus,
    formatOrderItems: (items) => {
      return items.map((item) => ({
        ...item,
        formattedPrice: `₦${(
          item.price?.final ||
          item.price?.unit ||
          0
        ).toLocaleString()}`,
        totalPrice: `₦${(
          (item.price?.final || item.price?.unit || 0) * item.quantity
        ).toLocaleString()}`,
      }));
    },

    calculateOrderTotal: (order) => {
      const subtotal = order.pricing?.subtotal || 0;
      const shipping = order.pricing?.shipping || 0;
      const tax = order.pricing?.tax?.total || 0;
      const discount = order.pricing?.discount?.amount || 0;
      return subtotal + shipping + tax - discount;
    },
  };
};

export const prepareOrderItemsFromCart = (cartItems) => {
  return cartItems.map((item) => ({
    productId: item.id || item._id,
    quantity: item.quantity,
    variantId: item.variantId || null,
    price: item.price,
    name: item.name,
    image: item.image,
  }));
};

// Utility function for preparing shipping data
export const prepareShippingData = (formData, user = null) => {
  return {
    shippingAddress: {
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2 || "",
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country || "Nigeria",
    },
    customer: user
      ? {
          user: user._id,
          email: user.email,
          firstName: formData.firstName || user.firstName,
          lastName: formData.lastName || user.lastName,
          phone: formData.phone || user.phoneNumber,
          isGuest: !user,
        }
      : {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          isGuest: true,
        },
  };
};

// Utility function for calculating order totals
export const calculateOrderTotals = (items, shippingFee = 0, discount = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + shippingFee - discountAmount;

  return {
    subtotal,
    shipping: shippingFee,
    discount: discountAmount,
    total,
  };
};
