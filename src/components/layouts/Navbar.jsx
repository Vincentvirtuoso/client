import React, { useState, useEffect, useRef } from "react";
import useCart from "../../hooks/useCart";
import CartDrawer from "../common/CartDrawer";
import {
  LuMenu as Menu,
  LuX as X,
  LuShoppingCart as ShoppingCart,
  LuSearch as Search,
  LuUser as User,
  LuHeart as Heart,
  LuPackage as Package,
  LuLogOut as LogOut,
  LuSettings as Settings,
  LuBell as Bell,
  LuClock as Clock,
  LuTrendingUp as TrendingUp,
  LuCheck,
  LuChevronRight,
  LuChevronDown,
  LuLogIn,
  LuCircleHelp,
  LuBell,
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import Sidebar from "./Sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MobileSearchMenu from "../others/MobileSearchMenu";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({
  isAuthenticated = true,
  // userName = "Guest",
  onCartClick,
  onSignIn,
  onSignOut,
  logo = "ShopVerse",
  promoBannerVisible,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { user } = useAuth();

  const categoryRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // Mock data
  const baseSuggestions = [
    { type: "recent", text: "Wireless headphones" },
    { type: "recent", text: "Running shoes" },
    { type: "trending", text: "Smart watch" },
    { type: "trending", text: "Laptop backpack" },
  ];

  const searchSuggestions = baseSuggestions.map((item) => ({
    ...item,
    href: `/products?search=${encodeURIComponent(item.text)}`,
  }));

  const notifications = [
    {
      id: 1,
      type: "order",
      message: "Your order #12345 has been delivered",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "price",
      message: "Price drop on your wishlist item",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      type: "promo",
      message: "Flash sale: 50% off electronics",
      time: "1 day ago",
      unread: false,
    },
  ];

  const unreadNotifications = notifications.filter((n) => n.unread).length;
  const navigate = useNavigate();

  const onSearch = (href) => {
    if (href) {
      navigate(href);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useBodyScrollLock(mobileOpen);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(`/products?search=${searchQuery}`);
      setSearchFocused(false);
    }
  };

  const { items = [], openCart = () => {}, savedForLater } = useCart() || {};

  const cartCountValue = items?.length;
  const wishlistCount = savedForLater?.length || 0;

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion, href) => {
    setSearchQuery(suggestion);
    if (onSearch) {
      onSearch(href);
    }
    setSearchFocused(false);
  };

  const MotionNavLink = motion(NavLink);

  const userName = user?.fullName.split(" ")[0]?.charAt(0)?.toUpperCase();
  const { pathname } = useLocation();
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Promo Banner */}

      <header
        className={`bg-white fixed lg:left-72 left-0 right-0 z-50 h-20 transition-all duration-300 lg:border-b lg:border-gray-200 ${
          scrolled ? "not-lg:shadow-md" : "not-lg:shadow-sm px-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-gray-700 hover:text-red-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <MotionNavLink
                to="/"
                className="relative text-2xl font-bold bg-linear-to-r from-red-600 via-pink-500 to-red-600 bg-clip-text text-transparent hover:from-red-700 hover:to-purple-700 transition-all bg-size-[300%_auto]"
                animate={{
                  backgroundPosition: ["0% 50%", "200% 50%"],
                }}
                transition={{
                  ease: [0.42, 0, 0.58, 1],
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {logo}
              </MotionNavLink>
            </div>

            <div className="flex items-center gap-2">
              {/* Enhanced Search with Better Suggestions */}
              <div
                ref={searchRef}
                className="hidden md:flex relative items-center flex-1"
              >
                <div
                  className={`flex items-center bg-gray-50 border rounded-xl overflow-hidden transition-all duration-300 relative ${
                    searchFocused
                      ? "border-red-500 ring-2 ring-red-100 shadow-lg w-80"
                      : "border-gray-200 hover:border-gray-300 w-60 xl:w-80"
                  }`}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search products, brands, categories..."
                    className="px-3 py-3 text-sm bg-transparent focus:outline-none placeholder-gray-500 rounded-xl flex-1"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    className="bg-red-600 text-white px-4 py-3 h-full hover:bg-red-700 transition-colors flex items-center gap-2 absolute top-0 bottom-0 right-0"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 " />
                  </button>
                </div>

                {/* Enhanced Search Suggestions Dropdown */}
                <AnimatePresence>
                  {searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 py-3 max-h-96 overflow-y-auto z-50"
                    >
                      {searchQuery ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">
                                Search results for "{searchQuery}"
                              </span>
                              <button
                                onClick={() => setSearchQuery("")}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Quick product suggestions */}
                          <div className="py-2">
                            <div className="grid gap-1">
                              {searchSuggestions
                                .filter((s) =>
                                  s.text
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                )
                                .slice(0, 5)
                                .map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleSuggestionClick(
                                        suggestion.text,
                                        suggestion.href
                                      )
                                    }
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                                  >
                                    <Search className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                    <span className="flex-1">
                                      {suggestion.text}
                                    </span>
                                    <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Recent Searches */}
                          <div className="px-4 py-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                              <Clock className="w-3 h-3" />
                              Recent Searches
                              <button
                                onClick={() => {
                                  /* Clear recent searches logic */
                                }}
                                className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Clear all
                              </button>
                            </div>
                            <div className="space-y-1">
                              {searchSuggestions
                                .filter((s) => s.type === "recent")
                                .slice(0, 4)
                                .map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleSuggestionClick(
                                        suggestion.text,
                                        suggestion.href
                                      )
                                    }
                                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center gap-3 group"
                                  >
                                    <Clock className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                    {suggestion.text}
                                  </button>
                                ))}
                            </div>
                          </div>

                          {/* Trending Searches */}
                          <div className="border-t border-gray-100 px-4 py-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                              <TrendingUp className="w-3 h-3" />
                              Trending Now
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {searchSuggestions
                                .filter((s) => s.type === "trending")
                                .slice(0, 6)
                                .map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleSuggestionClick(
                                        suggestion.text,
                                        suggestion.href
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm transition-colors group"
                                  >
                                    <TrendingUp className="w-3 h-3 text-red-500" />
                                    {suggestion.text}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Search Button */}
              <MobileSearchMenu
                setMobileSearchOpen={setMobileSearchOpen}
                mobileSearchOpen={mobileSearchOpen}
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                handleSearchKeyPress={handleSearchKeyPress}
                setSearchQuery={setSearchQuery}
                setSearchFocused={setSearchFocused}
                searchSuggestions={searchSuggestions}
                handleSuggestionClick={handleSuggestionClick}
                promoBannerVisible={promoBannerVisible}
              />

              {/* Enhanced Notification Bell */}
              <div className="hidden sm:block relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative text-gray-700 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-50 group flex items-center"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                        <Bell className="w-4 h-4" />
                        Notifications
                        {unreadNotifications > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadNotifications} new
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={() => {
                          /* Mark all as read logic */
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors group ${
                              notification.unread
                                ? "bg-blue-50 border-l-4 border-l-blue-500"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                  notification.unread
                                    ? "bg-blue-500 animate-pulse"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 leading-relaxed">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  {notification.time}
                                </p>
                              </div>
                              {notification.unread && (
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 p-1">
                                  <LuCheck className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">
                            No notifications yet
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 text-center bg-gray-50">
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-2 w-full">
                        View all notifications
                        <LuChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Enhanced User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors p-2 rounded-lg hover:bg-gray-50 group"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-xl transition-shadow">
                      {userName || "Unnamed".charAt(0).toUpperCase()}
                    </div>
                    <LuChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl border border-gray-200 pb-2 z-50 backdrop-blur-sm overflow-hidden"
                      role="menu"
                      aria-label="User menu"
                    >
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-red-50/80 to-pink-50/80 rounded-t-xl">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.fullName || "Unnamed"}
                            </p>
                            <p className="text-xs text-gray-600 truncate mt-0.5">
                              {user?.email || "user@email.com"}
                            </p>
                          </div>
                          {user?.profileImages ? (
                            <div className="w-8 h-8 rounded-full bg-linear-to-r from-red-100 to-pink-100 border border-red-200 overflow-hidden">
                              <img
                                src={user.profileImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-linear-to-r from-red-100 to-pink-100 border border-red-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-red-600">
                                {(user?.fullName?.[0] || "U").toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Login reminder - only show if needed */}
                        {user?.needsReauth && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <p className="text-xs text-amber-600 font-medium">
                              Please login again
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {user ? (
                          <>
                            {[
                              {
                                icon: User,
                                label: "My Profile",
                                href: "/profile",
                                badge: null,
                                description: "View and edit your profile",
                              },
                              {
                                icon: Package,
                                label: "My Orders",
                                href: "/orders",
                                badge: 4,
                                description: "Track and manage orders",
                              },
                              {
                                icon: Heart,
                                label: "Wishlist",
                                href: "/wishlist",
                                badge: wishlistCount > 0 ? wishlistCount : null,
                                description: "Your saved items",
                              },
                              {
                                icon: LuBell,
                                label: "Notifications",
                                href: "/notifications",
                                badge: 20,
                                description: "Your latest alerts",
                              },
                              {
                                icon: Settings,
                                label: "Settings",
                                href: "/settings",
                                badge: null,
                                description: "Account preferences",
                              },
                              {
                                icon: LuCircleHelp,
                                label: "Help & Support",
                                href: "/support",
                                badge: null,
                                description: "Get assistance",
                              },
                            ].map((item, index) => {
                              const Icon = item.icon;
                              const hasBadge =
                                item.badge != null && item.badge > 0;

                              return (
                                <NavLink
                                  key={`nav-item-${index}`}
                                  to={item.href}
                                  className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5
                transition-all duration-200
                group relative
                hover:bg-gray-50 active:bg-gray-100
                ${
                  isActive
                    ? "bg-red-50 text-red-700 border-l-2 border-l-red-500 "
                    : "text-gray-700"
                }
              `}
                                  end={item.href === "/profile"}
                                  aria-current={({ isActive }) =>
                                    isActive ? "page" : undefined
                                  }
                                  role="menuitem"
                                >
                                  <div className="relative">
                                    <Icon
                                      className={`
                    w-5 h-5 transition-colors duration-200
                  `}
                                      aria-hidden="true"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium truncate">
                                        {item.label}
                                      </span>
                                      {hasBadge && (
                                        <span className="bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse animate-duration-1000">
                                          {item.badge > 99 ? "99+" : item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate hidden group-hover:block transition-all duration-200">
                                      {item.description}
                                    </p>
                                  </div>

                                  {!hasBadge && (
                                    <LuChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5" />
                                  )}
                                </NavLink>
                              );
                            })}
                          </>
                        ) : (
                          <div className="p-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-linear-to-r from-red-50 to-pink-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-3">
                              <User className="w-6 h-6 text-red-400" />
                            </div>
                            <p className="text-gray-700 text-sm mb-3 font-medium">
                              Sign in to access your account
                            </p>
                            <p className="text-gray-500 text-xs mb-4">
                              Manage orders, wishlist, and preferences
                            </p>
                            <NavLink
                              to="/auth/login"
                              className="
            inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-red-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 active:scale-95 w-full shadow-sm hover:shadow
          "
                              role="menuitem"
                            >
                              <LuLogIn className="w-4 h-4" />
                              Sign In
                            </NavLink>
                          </div>
                        )}
                      </div>

                      {/* Sign Out Section */}
                      {user && (
                        <div className="border-t border-gray-100 pt-1 mt-1">
                          <button
                            onClick={onSignOut}
                            className="
          flex items-center justify-between px-4 py-3
          text-gray-700 hover:text-red-600 hover:bg-red-50
          transition-all duration-200 active:bg-red-100
          w-full group rounded-md mx-1
        "
                            role="menuitem"
                            aria-label="Sign out"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 flex items-center justify-center">
                                <LogOut className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:-translate-x-0.5" />
                              </div>
                              <span className="text-sm font-medium">
                                Sign Out
                              </span>
                            </div>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignIn}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors font-medium text-sm hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {/* Enhanced Cart Button */}
              <button
                onClick={onCartClick || openCart}
                className="relative flex items-center gap-2 text-gray-600 rounded-lg transition-colors font-medium p-2 hover:bg-gray-50 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCountValue > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCountValue > 9 ? "9+" : cartCountValue}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />

      {mobileOpen && (
        <Sidebar
          onClose={() => setMobileOpen(false)}
          logo={logo}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          promoBannerVisible={promoBannerVisible}
        />
      )}
    </>
  );
};

export default Navbar;
