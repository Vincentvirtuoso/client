import React, { useEffect, useRef } from "react";
import {
  LuChevronDown,
  LuHeart,
  LuLogOut,
  LuPackage,
  LuUser,
  LuX,
} from "react-icons/lu";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({
  onClose,
  userName = "Felix Vincent",
  isAuthenticated = true,
  onSignIn,
  onSignOut,
  wishlistCount = 6,
  promoBannerVisible,
}) => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      onClose?.();
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      {/* Overlay for mobile only */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      <aside
        className={`fixed ${
          promoBannerVisible ? "pt-14 lg:pt-9" : "pt-0"
        } top-0 left-0 w-72 lg:w-72 h-full bg-white shadow-2xl z-50 lg:z-30 lg:shadow-none border-r border-gray-200 overflow-y-auto  transform transition-all duration-300 lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-gray-200">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-red-600"
          >
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            ShopVerse
          </NavLink>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 lg:hidden"
            aria-label="Close menu"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-5 py-6 space-y-3 flex-1 overflow-y-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? "text-red-600 bg-red-50"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`
            }
          >
            Home
          </NavLink>

          {[
            { href: "/products", label: "All Products" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? "text-red-600 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Account Section */}
        {isAuthenticated && (
          <div className="px-4 py-4 border-t border-gray-200 space-y-2  overflow-y-auto">
            <NavLink
              to="/orders"
              className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LuPackage className="w-5 h-5" />
              My Orders
            </NavLink>

            <NavLink
              to="/wishlist"
              className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LuHeart className="w-5 h-5" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <button
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
            >
              <LuLogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}

        {/* User Section */}
        <div className="px-5 py-5 border-t border-gray-200 bg-white sticky bottom-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{userName}</p>
                <p className="text-sm text-gray-500">View Profile</p>
              </div>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <LuUser className="w-5 h-5" />
              Sign In / Register
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
