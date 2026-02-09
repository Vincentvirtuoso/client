import React, { useEffect, useRef } from "react";
import {
  LuChevronRight,
  LuHeart,
  LuLogOut,
  LuPackage,
  LuUser,
  LuX,
  LuSettings,
  LuBell,
} from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UserSection = ({
  loading = false,
  user = null,
  onSignIn = () => {},
  onProfileClick = () => {},
  customAvatar = null,
  customSignInText = "Sign In / Register",
  showProfileLink = true,
  avatarBgFrom = "from-red-600",
  avatarBgTo = "to-pink-500",
  className = "",
  sticky = true,
  showBorder = true,
}) => {
  // Determine the user's initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    const names = user?.fullName?.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <div
      className={`
        px-5 py-4 
        ${showBorder ? "border-t border-gray-200" : ""}
        bg-white 
        ${sticky ? "sticky bottom-0" : ""}
        ${className}
      `}
    >
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ) : user ? (
        // Authenticated User State
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="View profile"
        >
          {/* Avatar */}
          {customAvatar || (
            <div
              className={`
                w-12 h-12 
                bg-linear-to-br ${avatarBgFrom} ${avatarBgTo}
                rounded-full 
                flex items-center justify-center 
                text-white font-semibold text-lg
                shrink-0
                ring-2 ring-white ring-offset-1
                transition-transform group-hover:scale-105
              `}
            >
              {getInitials()}
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
              {user?.fullName}
            </p>
            {showProfileLink && (
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                View Profile
              </p>
            )}
          </div>

          {/* Optional Chevron Indicator */}
          {showProfileLink && <LuChevronRight size={20} />}
        </button>
      ) : (
        // Unauthenticated State - Sign In Button
        <button
          onClick={onSignIn}
          className={`
            w-full 
            flex items-center justify-center gap-3 
            px-4 py-3 
            bg-linear-to-r from-red-600 to-pink-500
            text-white 
            rounded-lg 
            hover:from-red-700 hover:to-pink-600
            active:from-red-800 active:to-pink-700
            transition-all duration-200
            font-medium
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            shadow-sm hover:shadow-md
          `}
          aria-label={customSignInText}
        >
          <LuUser className="w-5 h-5 shrink-0" />
          <span>{customSignInText}</span>
        </button>
      )}
    </div>
  );
};

const UserMenu = ({
  user = null,
  wishlistCount = 0,
  notificationsCount = 0,
  onSignOut = () => {},
  menuItems = [],
  customItems = [],
  className = "",
  containerClassName = "",
  showDivider = true,
  variant = "default",
  onItemClick = () => {},
  loading = false,
}) => {
  // Style variants
  const variants = {
    default: {
      link: "text-gray-700 hover:bg-red-50 hover:text-red-600",
      button: "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
      active: "bg-red-50 text-red-600",
      skeleton: "bg-gray-200",
    },
    minimal: {
      link: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      button: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      active: "bg-gray-100 text-gray-900",
      skeleton: "bg-gray-200",
    },
    dark: {
      link: "text-gray-300 hover:bg-gray-700 hover:text-white",
      button: "text-gray-300 hover:bg-gray-700 hover:text-white",
      active: "bg-gray-700 text-white",
      skeleton: "bg-gray-600",
    },
  };

  const currentVariant = variants[variant] || variants.default;

  if (!user && !loading) return null;

  if (loading) {
    return (
      <div
        className={`
          ${showDivider ? "border-t border-gray-200" : ""}
          ${containerClassName}
        `}
      >
        <div className={`px-4 py-3 space-y-2 ${className}`}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="
                flex items-center gap-3
                px-4 py-2.5
                rounded-lg
                animate-pulse
              "
            >
              {/* Icon */}
              <div className={`w-5 h-5 rounded ${currentVariant.skeleton}`} />

              {/* Label */}
              <div className={`h-4 w-32 rounded ${currentVariant.skeleton}`} />

              {/* Badge */}
              <div
                className={`ml-auto h-5 w-8 rounded-full ${currentVariant.skeleton}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const defaultMenuItems = [
    {
      id: "orders",
      label: "My Orders",
      to: "/orders",
      icon: <LuPackage className="w-5 h-5" />,
      type: "link",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      to: "/wishlist",
      icon: <LuHeart className="w-5 h-5" />,
      count: wishlistCount,
      type: "link",
    },
    {
      id: "notifications",
      label: "Notifications",
      to: "/notifications",
      icon: <LuBell className="w-5 h-5" />,
      count: notificationsCount,
      type: "link",
    },
    {
      id: "settings",
      label: "Settings",
      to: "/settings",
      icon: <LuSettings className="w-5 h-5" />,
      type: "link",
    },
  ];

  const allMenuItems = [
    ...(menuItems.length ? menuItems : defaultMenuItems),
    ...customItems,
    {
      id: "signout",
      label: "Sign Out",
      icon: <LuLogOut className="w-5 h-5" />,
      type: "button",
      onClick: onSignOut,
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  const renderCountBadge = (count) => {
    if (!count || count <= 0) return null;

    return (
      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1.5">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  return (
    <div
      className={`
        ${showDivider ? "border-t border-gray-200" : ""}
        ${containerClassName}
      `}
    >
      <div className={`px-4 py-3 space-y-1 ${className}`}>
        {allMenuItems.map((item) => {
          const baseClasses = `
            flex items-center gap-3
            px-4 py-2.5
            rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
            w-full text-left
            ${item.className || ""}
          `;

          if (item.type === "button") {
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  onItemClick(item.id);
                }}
                className={`${baseClasses} ${currentVariant.button}`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {renderCountBadge(item.count)}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? currentVariant.active : currentVariant.link
                }`
              }
              onClick={() => onItemClick(item.id)}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {renderCountBadge(item.count)}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

const Sidebar = ({
  onClose,
  onSignOut,
  onSignIn,
  wishlistCount = 6,
  promoBannerVisible,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prevPathnameRef = useRef(pathname);

  const { user, loading, isBooting } = useAuth();
  console.log(user);

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

        <UserMenu
          user={user}
          wishlistCount={wishlistCount}
          notificationsCount={6}
          onSignOut={onSignOut}
          loading={isBooting}
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
