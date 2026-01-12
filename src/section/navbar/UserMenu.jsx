import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  LuUser as User,
  LuHeart as Heart,
  LuPackage as Package,
  LuLogOut as LogOut,
  LuSettings as Settings,
  LuChevronRight,
  LuChevronDown,
  LuLogIn,
  LuCircleHelp,
  LuBell,
  LuCircleAlert,
  LuShield,
  LuCreditCard,
  LuStar,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

const UserMenu = ({
  isAuthenticated = false,
  onSignIn = () => {},
  userName = "",
  userInitial = "",
  wishlistCount = 0,
  orderCount = 0,
  notificationCount = 0,
  onSignOut = () => {},
  user = null,
  loading = false,
  className = "",
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const userMenuRef = useRef(null);
  const buttonRef = useRef(null);
  // const navigate = useNavigate();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && userMenuOpen) {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [userMenuOpen]);

  // Close menu and navigate

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setUserMenuOpen(false);
      setIsClosing(false);
    }, 150);
  }, []);

  const toggleMenu = useCallback(() => {
    if (!isClosing) {
      setUserMenuOpen((prev) => !prev);
    }
  }, [isClosing]);

  // Menu items configuration
  const menuItems = useMemo(
    () => [
      {
        icon: User,
        label: "My Profile",
        href: "/profile",
        badge: null,
        description: "View and edit your profile",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        icon: Package,
        label: "My Orders",
        href: "/orders",
        badge: orderCount,
        description: "Track and manage orders",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        icon: Heart,
        label: "Wishlist",
        href: "/wishlist",
        badge: wishlistCount > 0 ? wishlistCount : null,
        description: "Your saved items",
        color: "text-pink-600",
        bgColor: "bg-pink-50",
      },
      {
        icon: LuBell,
        label: "Notifications",
        href: "/notifications",
        badge: notificationCount,
        description: "Your latest alerts",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/settings",
        badge: null,
        description: "Account preferences",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
      },
      {
        icon: LuCircleHelp,
        label: "Help & Support",
        href: "/support",
        badge: null,
        description: "Get assistance",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
    ],
    [orderCount, wishlistCount, notificationCount]
  );

  // Get user initial
  const getUserInitial = useCallback(() => {
    if (userInitial) return userInitial.charAt(0).toUpperCase();
    if (userName) return userName.charAt(0).toUpperCase();
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    return "U";
  }, [userInitial, userName, user]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <button
        onClick={onSignIn}
        className={`
          hidden sm:flex items-center gap-2 px-4 py-2.5
          text-gray-700 border border-gray-300 rounded-lg
          hover:border-red-600 hover:text-red-600
          transition-all duration-200 font-medium text-sm
          hover:shadow-md active:scale-95
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          ${className}
        `}
        aria-label="Sign in to your account"
      >
        <User className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={userMenuRef}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`
          flex items-center gap-2 p-2 rounded-lg
          transition-all duration-200 font-medium
          
              text-gray-700 hover:text-red-600 hover:bg-gray-50
          }
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        `}
        aria-expanded={userMenuOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {getUserInitial()}
          </div>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </div>
        <LuChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 z-50 overflow-hidden"
            role="menu"
            aria-label="User menu"
          >
            {/* User Info Section */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50/90 to-pink-50/90">
              <div className="flex items-start gap-3">
                <div className="relative">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.fullName || "User"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`
            w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 
            flex items-center justify-center text-white font-bold text-lg
            border-2 border-white shadow-sm
            ${user?.profileImage ? "hidden" : "flex"}
          `}
                  >
                    {getUserInitial()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.fullName || userName || "Welcome Back"}
                  </p>
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {user?.email || "Manage your account"}
                  </p>

                  {/* Account status - only show if user exists */}
                  {user?.membership && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold rounded-full">
                      <LuStar className="w-2.5 h-2.5" />
                      {user.membership}
                    </div>
                  )}
                </div>
              </div>

              {/* Reauth warning - only show if user exists */}
              {user?.needsReauth && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <LuCircleAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">
                      Session expired. Please sign in again.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats - only show if user exists */}
            {user && (
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {orderCount}
                    </div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {wishlistCount}
                    </div>
                    <div className="text-xs text-gray-600">Wishlist</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {notificationCount}
                    </div>
                    <div className="text-xs text-gray-600">Alerts</div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items - show regardless of user auth status */}
            <div className="py-2 max-h-99 overflow-y-auto custom-scrollbar">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const hasBadge = item.badge != null && item.badge > 0;
                const badgeValue = item.badge > 99 ? "99+" : item.badge;

                return (
                  <NavLink
                    key={`menu-item-${index}`}
                    to={item.href}
                    className={`
            flex items-center gap-3 px-5 py-3 w-full
            transition-all duration-200 group
            hover:bg-gray-50 active:bg-gray-100
            text-left
            ${index === 0 ? "rounded-t-lg" : ""}
            ${index === menuItems.length - 1 ? "rounded-b-lg" : ""}
          `}
                    role="menuitem"
                  >
                    <div
                      className={`p-2 rounded-lg ${item.bgColor} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {item.label}
                        </span>
                        {hasBadge && (
                          <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse">
                            {badgeValue}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <LuChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </NavLink>
                );
              })}
            </div>

            {user && (
              <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50">
                <button
                  onClick={() => {
                    onSignOut();
                    closeMenu();
                  }}
                  className="
          flex items-center justify-between w-full px-4 py-3
          text-gray-700 hover:text-red-600 hover:bg-red-50
          transition-all duration-200 active:bg-red-100
          rounded-lg group
        "
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-red-100 transition-colors">
                      <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    </div>
                    <span className="text-sm font-medium">Sign Out</span>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
