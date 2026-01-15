import { useCallback } from "react";
import { useApi } from "./useApi";

export const useOrder = () => {
  const { loading, error, callApi } = useApi();

  const createOrder = useCallback(
    async (orderData) => {
      return await callApi("/orders", "POST", orderData);
    },
    [callApi]
  );

  const getOrder = useCallback(
    async (id) => {
      return await callApi(`/orders/${id}`, "GET");
    },
    [callApi]
  );

  const getMyOrders = useCallback(
    async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/orders/my-orders${
        queryString ? `?${queryString}` : ""
      }`;
      return await callApi(endpoint, "GET");
    },
    [callApi]
  );

  const cancelOrder = useCallback(
    async (id, reason = "") => {
      return await callApi(`/orders/${id}/cancel`, "PATCH", { reason });
    },
    [callApi]
  );

  const requestReturn = useCallback(
    async (id, returnData) => {
      return await callApi(`/orders/${id}/returns`, "POST", returnData);
    },
    [callApi]
  );

  const getInvoice = useCallback(
    async (id) => {
      return await callApi(`/orders/${id}/invoice`, "GET");
    },
    [callApi]
  );

  const confirmCashOnDelivery = useCallback(
    async (id, data) => {
      return await callApi(`/orders/${id}/confirm-cod`, "POST", data);
    },
    [callApi]
  );

  const simulatePaystackPayment = useCallback(
    async (paymentData) => {
      return await callApi(
        "/orders/webhook/paystack/simulate",
        "POST",
        paymentData
      );
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

  return {
    // State
    loading,
    error,

    // Methods
    createOrder,
    getOrder,
    getMyOrders,
    cancelOrder,
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
