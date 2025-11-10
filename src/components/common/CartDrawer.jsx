import React from "react";
import useCart from "../../hooks/useCart";
import { LuX, LuPlus, LuMinus, LuTrash, LuShoppingBag } from "react-icons/lu";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import ProductImage from "../ui/ProductImage";
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, onInc, onDec, onRemove }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-300 last:border-b-0">
    <div className="relative aspect-square bg-amber-50 w-18">
      <ProductImage size="full" src={item.image} alt={item.name} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <div className="truncate">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500">
            ₦{item.price.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <LuTrash className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => onDec(item.id)}
          disabled={item.quantity <= 1}
          className={`px-2 py-1 rounded-md bg-red-500 ${
            item.quantity > 1
              ? "hover:bg-red-400"
              : "opacity-50 cursor-not-allowed"
          } text-white`}
        >
          <LuMinus className="w-4 h-4" />
        </button>
        <div className="px-3 py-1 rounded-md text-sm min-w-8 text-center">
          {item.quantity}/{item.maxUnits}
        </div>
        <button
          onClick={() => onInc(item.id)}
          className={`px-2 py-1 rounded-md text-white hover:bg-emerald-400 bg-emerald-500 ${
            item.quantity !== item.maxUnits
              ? ""
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <LuPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const CartDrawer = () => {
  const {
    cartOpen,
    closeCart,
    items,
    totalItems,
    subtotal,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  useBodyScrollLock(cartOpen);

  const handleNavigateToCart = () => {
    navigate("/cart");
    closeCart();
  };

  // Close cart with ESC key
  React.useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          cartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden={!cartOpen}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-260px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
              <LuShoppingBag className="w-12 h-12 mb-3 opacity-70" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-gray-400 mt-1">
                Start adding items to see them here.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onInc={incrementQuantity}
                onDec={decrementQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-lg font-semibold">{totalItems}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-lg font-semibold">
                ₦{subtotal.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <button
                className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors ${
                  totalItems <= 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "btn-primary "
                }`}
                disabled={totalItems === 0}
                onClick={handleNavigateToCart}
              >
                View Cart
              </button>
              <button
                onClick={closeCart}
                className="w-full border border-gray-300 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
