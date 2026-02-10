export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusConfig = () => ({
  pending: {
    text: "Pending",
    icon: "FiClock",
    color: "bg-yellow-500",
  },
  confirmed: {
    text: "Confirmed",
    icon: "FiCheckCircle",
    color: "bg-blue-500",
  },
  paid: {
    text: "Paid",
    icon: "FiCheckCircle",
    color: "bg-green-500",
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
});
export const validateDiscount = (discount, totalAmount) => {
  if (!discount) {
    return { valid: false, amount: 0, details: "No discount applied" };
  }
  if (totalAmount < discount.minPurchase) {
    return { valid: false, amount: 0, details: "Minimum purchase not met" };
  }
  if (discount.type === "percentage") {
    const discountAmount = (totalAmount * discount.value) / 100;
    return {
      valid: true,
      amount: discountAmount,
      details: "Percentage discount applied",
    };
  }
  if (discount.type === "fixed") {
    return {
      valid: true,
      amount: discount.value,
      details: "Fixed discount applied",
    };
  }
  return { valid: false, amount: 0, details: "Invalid discount type" };
};
