import React, { useState } from "react";
import {
  LuPlus,
  LuMinus,
  LuTrash,
  LuHeart,
  LuShoppingBag,
  LuTag,
  LuPackage,
  LuTruck,
  LuShield,
  LuClock,
  LuX,
  LuCheck,
  LuCircleAlert,
} from "react-icons/lu";
import useCart from "../hooks/useCart";
import ProductImage from "../components/ui/ProductImage";
import { validCodes } from "./mockData";

const Cart = () => {
  const {
    items,
    savedForLater,
    discount,
    subtotal,
    totalItems,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    toggleFavorite,
    applyCoupon,
    clearCoupon,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const shippingFee = subtotal > 100000 ? 0 : 2500;
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal - discountAmount + shippingFee;
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase();

    if (validCodes.includes(code)) {
      setAppliedCoupon(code);
      applyCoupon(code);
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    clearCoupon();
  };

  const moveToCart = (item) => {
    addToCart({ ...item, quantity: 1, maxUnits: 5 });
    toggleFavorite(item);
  };

  const moveToSaved = (item) => {
    toggleFavorite(item);
    removeFromCart(item.id);
  };

  const removeSaved = (id) => {
    const item = savedForLater.find((i) => i.id === id);
    if (item) toggleFavorite(item);
  };

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 flex justify-center items-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-red-100 to-red-100 rounded-full mb-6">
              <LuShoppingBag className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              className="bg-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => handleNavigate("/products")}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <LuPackage className="w-5 h-5" />
                  Cart Items
                </h2>
                <button
                  onClick={() => clearCart()}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="relative w-20">
                      <ProductImage
                        className="object-cover"
                        src={item.image}
                        alt={item.name}
                        size="20"
                      />
                    </div>
                    <div className="flex-1">
                      <div className=" min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold text-red-600 mb-3">
                          ₦{item.price.toLocaleString()}
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => decrementQuantity(item.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                            >
                              <LuMinus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                              disabled={item.quantity >= item.maxUnits}
                            >
                              <LuPlus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => moveToSaved(item)}
                            className="text-sm text-gray-600 hover:text-purple-600 font-medium transition-colors flex items-center gap-1"
                          >
                            <LuHeart className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                          >
                            <LuTrash className="w-4 h-4" />
                          </button>
                        </div>

                        {item.quantity >= item.maxUnits && (
                          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                            <LuCircleAlert className="w-3 h-3" />
                            Maximum quantity reached
                          </p>
                        )}
                      </div>
                      <div className="text-right mt-2">
                        <p className="font-bold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-6">
                    <LuShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <button
                      className="mt-4 bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors"
                      onClick={() => handleNavigate("/products")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Saved for Later */}
            {savedForLater.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LuHeart className="w-5 h-5 text-red-500" />
                  Saved for Later ({savedForLater.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedForLater.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
                    >
                      <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm font-bold text-purple-600 mb-2">
                          ₦{item.price.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveToCart(item)}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Move to cart
                          </button>
                          <button
                            onClick={() => removeSaved(item.id)}
                            className="text-xs text-gray-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div
          // className="lg:col-span-1"
          >
            <div className="space-y-6">
              {/* Coupon Card */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LuTag className="w-5 h-5 text-purple-600" />
                  Apply Coupon
                </h3>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-green-700">
                        {appliedCoupon}
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-green-700 hover:text-green-800"
                      >
                        <LuX className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-green-700 flex items-center gap-1">
                      <LuCheck className="w-4 h-4" />
                      {discount}% discount applied
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        placeholder="Enter code"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <LuCircleAlert className="w-3 h-3" />
                        {couponError}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {validCodes.map((code) => (
                        <button
                          key={code}
                          onClick={() => {
                            setCouponCode(code);
                            setCouponError("");
                          }}
                          className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors font-medium"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
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

                <div className="border-t border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-red-600">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-3"
                  onClick={() => handleNavigate("/checkout")}
                >
                  Proceed to Checkout
                </button>

                <button
                  className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all"
                  onClick={() => handleNavigate("/products")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
