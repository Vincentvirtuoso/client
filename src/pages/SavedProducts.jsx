import React, { useContext, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LuHeart,
  LuShoppingCart,
  LuTrash2,
  LuArrowLeft,
  LuShare2,
  LuEye,
  LuFilter,
  LuList,
  LuSearch,
} from "react-icons/lu";
import CartContext from "../context/CartContext";
import ProductCard from "../components/common/ProductCard";
import EmptyState from "../components/common/EmptyState";
import { FiGrid } from "react-icons/fi";
import ProductImage from "../components/ui/ProductImage";

const SavedProducts = () => {
  const { savedForLater, toggleFavorite, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from saved items
  const categories = useMemo(() => {
    return [...new Set(savedForLater.map((item) => item.category))];
  }, [savedForLater]);

  // Filter and sort saved products
  const filteredProducts = useMemo(() => {
    let filtered = savedForLater.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "recent":
      default:
        return filtered; // Already in recent order from context
    }
  }, [savedForLater, searchTerm, selectedCategories, sortBy]);

  // Handlers
  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: Show toast notification
  };

  const handleRemoveFavorite = (product) => {
    toggleFavorite(product);
  };

  const handleQuickView = (product) => {
    // Navigate to product detail or open modal
    navigate(`/product/${product.id}`);
  };

  const handleShare = async (product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `${window.location.origin}/product/${product.id}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/product/${product.id}`
      );
      // Optional: Show copied notification
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSortBy("recent");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  if (savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={<LuHeart className="w-16 h-16 text-red-400" />}
            title="No Saved Items"
            description="Items you save for later will appear here"
            actionLabel="Start Shopping"
            onAction={() => navigate("/products")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LuArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Saved Items
                </h1>
                <p className="text-gray-600 mt-1">
                  {savedForLater.length}{" "}
                  {savedForLater.length === 1 ? "item" : "items"} saved for
                  later
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <LuHeart className="w-4 h-4 text-red-500" />
                <span>Your favorites</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500"
                }`}
              >
                <LuList className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm ${
                showFilters
                  ? "border-red-600 text-red-600 bg-red-50"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              <LuFilter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories((prev) => [
                                ...prev,
                                category,
                              ]);
                            } else {
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== category)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {savedForLater.length} saved
            items
            {searchTerm && (
              <span>
                {" "}
                for "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </p>

          {(searchTerm || selectedCategories.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear filters
            </button>
          )}
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${filteredProducts.length}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id + index}
                variants={itemVariants}
                layout
                className={
                  viewMode === "list"
                    ? "bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    : "h-full"
                }
              >
                {viewMode === "list" ? (
                  // List View
                  <div className="flex gap-4">
                    <div className="w-20 h-25 relative">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        size="full"
                        className="shrink-0"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {product.brand}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₦{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₦{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Add to cart"
                          >
                            <LuShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickView(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Quick view"
                          >
                            <LuEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(product)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Share"
                          >
                            <LuShare2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from saved"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Grid View
                  <div className="relative group">
                    <ProductCard
                      product={product}
                      query={searchTerm}
                      showFavorite={false}
                      compact
                    />

                    {/* Overlay Actions */}
                    <div className="absolute top-15 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-green-600 hover:bg-green-50"
                        title="Add to cart"
                      >
                        <LuShoppingCart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleQuickView(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-blue-600 hover:bg-blue-50"
                        title="Quick view"
                      >
                        <LuEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-purple-600 hover:bg-purple-50"
                        title="Share"
                      >
                        <LuShare2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(product)}
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-red-600 hover:bg-red-50"
                        title="Remove from saved"
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty Filter State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <LuSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No saved items found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;
