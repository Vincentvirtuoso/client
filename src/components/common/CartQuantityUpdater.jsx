import React from "react";
import { motion } from "framer-motion";
import { LuMinus, LuPlus, LuShoppingCart } from "react-icons/lu";
import { toast } from "react-hot-toast";
import useCart from "../../hooks/useCart";

const CartQuantityUpdater = ({ textSize, product, compact = true }) => {
  const { stockCount = 1, id, inStock, price, name } = product;
  const { items, addToCart, incrementQuantity, decrementQuantity } = useCart();

  const cartItem = items.find((item) => item.id === id);
  const isInCart = !!cartItem;

  // Add item to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.error("This item is currently out of stock.");
      return;
    }

    addToCart({ ...product, maxUnits: stockCount });
    toast.success(`${name} added to cart 🛒`);
  };

  // Increase quantity
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartItem?.quantity >= stockCount) {
      toast.error(`Only ${stockCount} units available.`);
      return;
    }

    incrementQuantity(id);
    toast.success(`Increased quantity for ${name} ✅`);
  };

  // Decrease quantity
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();

    decrementQuantity(id);
    toast("Removed one unit 🗑️", { icon: "⚠️" });
  };

  // ------------------------
  // Render "Add to Cart" button
  // ------------------------
  if (!isInCart) {
    return (
      <motion.button
        onClick={handleAddToCart}
        disabled={!inStock}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-${
          textSize || "sm"
        } rounded-lg font-semibold transition-all duration-200 mt-auto ${
          inStock
            ? "bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        } ${compact ? `py-2` : ""}`}
        whileHover={inStock ? { scale: 1.02 } : {}}
        whileTap={inStock ? { scale: 0.98 } : {}}
        aria-label={inStock ? `Add ${name} to shopping cart` : "Out of Stock"}
        aria-disabled={!inStock}
      >
        <LuShoppingCart className="w-5 h-5" />
        {inStock ? (
          <>
            Add to Cart
            {!compact && (
              <span className="ml-auto text-sm font-normal opacity-90">
                ₦{price.toLocaleString()}
              </span>
            )}
          </>
        ) : (
          "Notify Me"
        )}
      </motion.button>
    );
  }

  // ------------------------
  // Render Quantity Controller
  // ------------------------
  return (
    <motion.div
      layout
      className="flex items-center justify-between px-1 py-1 border border-red-500/60 rounded-full bg-red-200/20 gap-2 mt-auto"
    >
      <button
        onClick={handleDecrement}
        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-500/80 transition"
      >
        <LuMinus size={18} />
      </button>

      <motion.div
        key={cartItem?.quantity || 0}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`font-semibold text-gray-700 ${textSize || "text-xs"}`}
      >
        {cartItem?.quantity} / {stockCount} Units
      </motion.div>

      <button
        onClick={handleIncrement}
        disabled={cartItem?.quantity >= stockCount}
        className={`p-2 rounded-full transition ${
          cartItem?.quantity >= stockCount
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-500/80"
        }`}
      >
        <LuPlus size={18} />
      </button>
    </motion.div>
  );
};

export default CartQuantityUpdater;
