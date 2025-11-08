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
  categories,
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
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      <aside className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
        <div className="flex items-center justify-between px-6 h-30 border-b border-gray-200">
          <NavLink href="/" className="overflow-hidden  rounded-full">
            <img
              src="/images/logo.jpg"
              alt=""
              className=" object-cover w-25 h-25"
            />
          </NavLink>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close menu"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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

        <nav className="px-4 py-6 space-y-2">
          <NavLink
            href="/"
            className={`px-4 py-2 rounded-md transition-colors block hover:bg-red-50 font-medium ${
              window.location.pathname === "/"
                ? "text-red-600 font-semibold"
                : "text-gray-700 hover:text-red-500"
            }`}
          >
            Home
          </NavLink>

          <details className="group">
            <summary className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer font-medium transition-colors">
              <span>Categories</span>
              <LuChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-1 ml-4 space-y-1">
              {categories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={cat.href}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md transition-colors block hover:bg-red-50 font-medium ${
                      isActive
                        ? "text-red-600 font-semibold"
                        : "text-gray-700 hover:text-red-500"
                    }`
                  }
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </NavLink>
              ))}
            </div>
          </details>

          {[
            { href: "/products", label: "All Products" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors block hover:bg-red-50 font-medium ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-500"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {isAuthenticated && (
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-500"
                }`
              }
            >
              <LuPackage className="w-5 h-5" />
              <span>My Orders</span>
            </NavLink>

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors ${
                  isActive
                    ? "text-red-600 font-semibold"
                    : "text-gray-700 hover:text-red-500"
                }`
              }
            >
              <LuHeart className="w-5 h-5" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <button
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
            >
              <LuLogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
