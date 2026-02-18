import React, { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import UserSection from "../../section/sidebar/UserSection";
import UserMenu from "../../section/sidebar/UserMenu";
import CategoriesSection from "../../section/sidebar/CategoriesSection";

const Sidebar = ({
  onClose,
  onSignOut,
  onSignIn,
  wishlistCount = 6,
  promoBannerVisible,
  orders = 0,
  ordersLoading,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prevPathnameRef = useRef(pathname);

  const { user, isBooting } = useAuth();
  console.log(user);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      onClose?.();
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  const menuLoaders = {
    orders: ordersLoading,
    wishlist: false,
    notifications: false,
  };

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
        } top-0 left-0 w-70 lg:w-64 h-full bg-white shadow-2xl z-50 lg:z-30 lg:shadow-none border-r border-gray-200 overflow-y-auto  transform transition-all duration-300 lg:translate-x-0 flex flex-col`}
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
        <nav className="p-2 space-y-3 flex-1 overflow-y-auto border-b border-gray-200">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium transition-colors text-sm ${
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
                `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
        <CategoriesSection autoFetch />

        <UserMenu
          user={user}
          wishlistCount={wishlistCount}
          notificationsCount={6}
          onSignOut={onSignOut}
          ordersCount={orders || 0}
          loading={isBooting}
          menuLoaders={menuLoaders}
        />

        <UserSection
          loading={isBooting}
          user={user}
          userName={user?.name || "Guest"}
          onSignIn={onSignIn}
          onProfileClick={() => navigate("/profile")}
        />
      </aside>
    </>
  );
};

export default Sidebar;
