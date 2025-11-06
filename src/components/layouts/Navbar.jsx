import React, { useState, useEffect, useRef } from "react";
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

const Navbar = ({
  cartCount = 0,
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
    { name: "Electronics", href: "#electronics", icon: "📱" },
    { name: "Fashion", href: "#fashion", icon: "👕" },
    { name: "Accessories", href: "#accessories", icon: "⌚" },
    { name: "Sports", href: "#sports", icon: "⚽" },
    { name: "Books", href: "#books", icon: "📚" },
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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

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
                href="/"
                className="relative text-2xl font-bold bg-gradient-to-r from-red-600 via-pink-500 to-red-600 bg-clip-text text-transparent hover:from-red-700 hover:to-purple-700 transition-all bg-[length:300%_auto]"
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
                <a
                  href="#"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Home
                </a>

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
                        <a
                          key={cat.name}
                          href={cat.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => setCategoryOpen(false)}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href="#deals"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Deals
                </a>

                <a
                  href="#about"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  About
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Search products..."
                  className="px-4 py-2 text-sm w-64 bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
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
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
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

                      <a
                        href="#profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </a>

                      <a
                        href="#orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </a>

                      <a
                        href="#settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </a>

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
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              <button
                onClick={onCartClick}
                className="relative flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
              <a
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent"
              >
                {logo}
              </a>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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
                  <User className="w-5 h-5" />
                  Sign In / Register
                </button>
              )}
            </div>

            <nav className="px-4 py-6 space-y-2">
              <a
                href="#"
                className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
              >
                Home
              </a>

              <details className="group">
                <summary className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer font-medium transition-colors">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-1 ml-4 space-y-1">
                  {categories.map((cat) => (
                    <a
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </a>
                  ))}
                </div>
              </details>

              <a
                href="#deals"
                className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
              >
                Deals
              </a>

              <a
                href="#about"
                className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
              >
                About
              </a>

              <a
                href="#contact"
                className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
              >
                Contact
              </a>
            </nav>

            {isAuthenticated && (
              <div className="px-4 py-4 border-t border-gray-200 space-y-2">
                <a
                  href="#orders"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </a>

                <a
                  href="#wishlist"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {wishlistCount}
                    </span>
                  )}
                </a>

                <button
                  onClick={onSignOut}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
