import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { LuTruck, LuCreditCard, LuWallet, LuShield } from "react-icons/lu";
import { FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import PaystackPayment from "../components/payments/PaystackPayment";
import { useOrder } from "../hooks/useOrder";
import ShippingForm from "../section/checkout/ShippingForm";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    items = [],
    subtotal = 0,
    totalItems = 0,
    clearCart,
    user, // Assuming you have user info from auth context
  } = useCart() || {};

  const shippingFee = subtotal > 100000 ? 0 : 2500;
  const discount = 0;
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    instructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { createOrder } = useOrder();

  // If user has saved addresses, fetch them
  const userAddresses = user?.addresses || [];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !form[field]?.trim(),
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const [saveShippingInfo, setSaveShippingInfo] = useState(false);
  const [savedShippingInfo, setSavedShippingInfo] = useState(null);

  // Initialize form with saved data on component mount
  useEffect(() => {
    loadSavedShippingInfoFromStorage();
  }, []);

  // Load saved shipping info from localStorage
  const loadSavedShippingInfoFromStorage = () => {
    try {
      const saved = localStorage.getItem("shippingInfo");
      if (saved) {
        const parsedInfo = JSON.parse(saved);
        setSavedShippingInfo(parsedInfo);

        // Optionally auto-fill if you want
        // setForm(prev => ({ ...prev, ...parsedInfo }));
      }
    } catch (error) {
      console.error("Error loading saved shipping info:", error);
    }
  };

  // Load saved info into form
  const loadSavedShippingInfo = () => {
    if (savedShippingInfo) {
      setForm((prev) => ({
        ...prev,
        ...savedShippingInfo,
      }));
      toast.success("Saved shipping information loaded!");
    }
  };

  // Save shipping info to localStorage
  const saveShippingInfoToStorage = () => {
    if (!saveShippingInfo) return;

    try {
      const infoToSave = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        instructions: form.instructions,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("shippingInfo", JSON.stringify(infoToSave));
      setSavedShippingInfo(infoToSave);
      toast.success("Shipping information saved for future orders!");
    } catch (error) {
      console.error("Error saving shipping info:", error);
      toast.error("Failed to save shipping information");
    }
  };

  // Clear saved shipping info
  const clearSavedShippingInfo = () => {
    localStorage.removeItem("shippingInfo");
    setSavedShippingInfo(null);
    toast.success("Saved shipping information cleared!");
  };

  const prepareOrderData = () => {
    // Transform cart items to match backend format
    const orderItems = items.map((item) => ({
      productId: item.id, // Assuming item.id is the product ID
      quantity: item.quantity,
      variantId: item.variantId || null,
    }));

    return {
      items: orderItems,
      shippingAddress: {
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || "",
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentMethod,
      discountCode: null,
      notes: form.instructions || "",
      billingAddress: selectedAddress?.isBillingDifferent
        ? {
            addressLine1: form.billingAddressLine1,
            city: form.billingCity,
            state: form.billingState,
            postalCode: form.billingPostalCode,
            country: form.billingCountry,
          }
        : undefined,
    };
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (saveShippingInfo) {
      saveShippingInfoToStorage();
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const orderData = prepareOrderData();

    setIsProcessing(true);

    try {
      if (paymentMethod === "paystack") {
        // For Paystack, you'll handle payment first
        // The order will be created after successful payment via webhook
        return; // Payment component will handle navigation
      }

      // For Cash on Delivery
      const response = await createOrder(orderData);

      if (response.data) {
        toast.success("Order placed successfully!");
        clearCart?.();

        navigate("/order-success", {
          replace: true,
          state: {
            orderId: response.data.order._id,
            orderNumber: response.data.order.orderNumber,
            amount: grandTotal,
            paymentMethod: "cash_on_delivery",
            estimatedDelivery: getEstimatedDelivery(),
          },
        });
      }
    } catch (error) {
      console.error("Order failed:", error);
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);

      // Check for stock issues
      if (error.response?.data?.code === "INSUFFICIENT_STOCK") {
        // Update cart with new stock information
        toast("Some items are out of stock. Updating your cart...");
        // You might want to refresh cart data here
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
    setForm({
      ...form,
      firstName: address.firstName || user?.firstName || "",
      lastName: address.lastName || user?.lastName || "",
      email: user?.email || "",
      phone: address.phone || "",
      addressLine1: address.street || "",
      addressLine2: address.apartment || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "Nigeria",
      instructions: address.instructions || "",
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your purchase securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Addresses */}
          {userAddresses.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAddresses.map((address) => (
                  <div
                    key={address._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddress?._id === address._id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => selectAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium capitalize">
                          {address.type}
                        </h3>
                        {address.isDefault && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      {selectedAddress?._id === address._id && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {address.street}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Shipping Information */}
          <ShippingForm
            form={form}
            handleChange={handleChange}
            saveShippingInfo={saveShippingInfo}
            savedShippingInfo={savedShippingInfo}
            setSaveShippingInfo={setSaveShippingInfo}
            loadSavedShippingInfo={loadSavedShippingInfo}
            clearSavedShippingInfo={clearSavedShippingInfo}
          />

          {/* Payment Method */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <LuCreditCard className="w-5 h-5" />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-500 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paystack"
                  checked={paymentMethod === "paystack"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LuCreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Pay with Paystack</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <LuShield className="w-4 h-4" />
                      <span>Secure</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Secure payment with card, bank transfer, or USSD
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-500 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LuWallet className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <span className="text-sm text-gray-500">₦0 fee</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Pay when your order arrives. Available in all locations.
                  </p>
                </div>
              </label>
            </div>

            {/* Paystack Payment Component */}
            {paymentMethod === "paystack" && (
              <div className="mt-6">
                <PaystackPayment
                  amount={grandTotal}
                  email={form.email}
                  prepareOrderData={prepareOrderData}
                  onClose={() => setIsProcessing(false)}
                />
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Items */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">
              Order Summary ({totalItems})
            </h2>

            <div className="max-h-80 overflow-y-auto mb-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No items in your cart.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-lg">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {item.variant.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₦{item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delivery Estimate */}
            {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-blue-800">
                <LuTruck className="w-4 h-4" />
                <span className="font-medium">Estimated Delivery</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                {getEstimatedDelivery()}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Free shipping on orders over ₦100,000
              </p>
            </div> */}

            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-medium">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span className="font-medium">
                    -₦{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-700">
                <span className="flex items-center gap-1">
                  <LuTruck className="w-4 h-4" />
                  Shipping
                </span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₦${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>

              {subtotal < 100000 && shippingFee > 0 && (
                <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">
                  Add ₦{(100000 - subtotal).toLocaleString()} more for FREE
                  shipping
                </p>
              )}
            </div>

            <div className="border-t border-gray-300 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-red-600">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Inclusive of all taxes
              </p>
            </div>

            {/* Place Order Button for COD */}
            {paymentMethod === "cash_on_delivery" && (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                className="w-full mt-6 bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order - ₦${grandTotal.toLocaleString()}`
                )}
              </button>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => navigate("/cart")}
                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back to Cart
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiLock className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
