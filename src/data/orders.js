import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";

export const dummyOrders = [
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

export const statusConfig = {
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
