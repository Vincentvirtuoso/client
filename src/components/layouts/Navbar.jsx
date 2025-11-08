import React, { useState, useEffect, useRef } from "react";
import useCart from "../../hooks/useCart";
import CartDrawer from "../common/CartDrawer";
import {
  LuMenu as Menu,
  LuX as X,
  LuShoppingCart as ShoppingCart,
  LuChevronDown as ChevronDown,
  LuSearch as Search,
  LuUser as User,
  LuHeart as Heart,
  LuPackage as Package,
  LuLogOut as LogOut,
  LuSettings as Settings,
} from "react-icons/lu";
import { motion } from "framer-motion";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";

const Navbar = ({
  wishlistCount = 0,
  isAuthenticated = false,
  userName = "Guest",
  onSearch,
  onCartClick,
  onWishlistClick,
  onSignIn,
  onSignOut,
  logo = "ShopVerse",
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const categoryRef = useRef(null);
  const userMenuRef = useRef(null);

  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      href: "/products?categories=Electronics",
      icon: "📱",
    },
    {
      id: "fashion",
      name: "Fashion",
      href: "/products?categories=Fashion",
      icon: "👕",
    },
    {
      id: "accessories",
      name: "Accessories",
      href: "/products?categories=Accessories",
      icon: "⌚",
    },
    {
      id: "sports",
      name: "Sports",
      href: "/products?categories=Sports",
      icon: "⚽",
    },
    {
      id: "books",
      name: "Books",
      href: "/products?categories=Books",
      icon: "📚",
    },
  ];

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useBodyScrollLock(mobileOpen);

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const { items, openCart } = useCart() || {
    totalItems: 0,
    openCart: () => {},
  };
  const cartCountValue = items?.length;

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-gray-700 hover:text-red-600 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <motion.a
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
              </motion.a>

              <nav className="hidden lg:flex items-center gap-8">
                <NavLink
                  to="/"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Home
                </NavLink>

                <div className="relative" ref={categoryRef}>
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium transition-colors"
                    aria-expanded={categoryOpen}
                  >
                    Categories
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        categoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {categoryOpen && (
                    <div className="absolute left-0 mt-3 w-64 bg-white shadow-xl rounded-xl border border-gray-100 py-2">
                      {categories.map((cat) => (
                        <NavLink
                          key={cat.name}
                          to={cat.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => setCategoryOpen(false)}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink
                  to="/products"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  All products
                </NavLink>

                <NavLink
                  to="#about"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  About
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  placeholder="Search products..."
                  className="px-4 py-2 text-sm w-60 bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-red-600 text-white px-4 py-2 h-full hover:bg-red-700 transition-colors absolute right-0 top-0 rounded-r-lg"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <button
                className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onWishlistClick}
                className="hidden sm:flex relative text-gray-700 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-50"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="hidden sm:block relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-red-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          user@email.com
                        </p>
                      </div>

                      <NavLink
                        to="#profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </NavLink>

                      <NavLink
                        to="#orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </NavLink>

                      <NavLink
                        to="#settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </NavLink>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={onSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignIn}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors font-medium text-sm"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              <button
                onClick={onCartClick || openCart}
                className="relative flex items-center gap-2 text-gray-600 rounded-lg  transition-colors font-medium "
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCountValue > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
          categories={categories}
        />
      )}
    </>
  );
};

export default Navbar;
