import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuFilter, LuX, LuSearch } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/common/ProductCard";
import AdvancedFilters from "../section/productList/AdvancedFilters";

function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("categories")
      ? searchParams.get("categories").split(",")
      : []
  );
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice")) || 0,
    parseInt(searchParams.get("maxPrice")) || 300000,
  ]);
  const [minRating, setMinRating] = useState(
    parseInt(searchParams.get("minRating")) || 0
  );
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    []
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 300000)
      params.set("maxPrice", priceRange[1].toString());
    if (minRating > 0) params.set("minRating", minRating.toString());
    if (inStockOnly) params.set("inStock", "true");
    if (sortBy !== "featured") params.set("sort", sortBy);

    // Replace current URL without causing navigation
    navigate(`?${params.toString()}`, { replace: true });
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
    navigate,
  ]);

  // Re-apply filters whenever URL or pathname changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearchTerm(params.get("search") || "");

    const urlCategories = params.get("categories");
    if (urlCategories) {
      const validCategories = urlCategories
        .split(",")
        .filter((cat) => categories.includes(cat));
      setSelectedCategories(validCategories);
    } else {
      setSelectedCategories([]);
    }

    setPriceRange([
      parseInt(params.get("minPrice")) || 0,
      parseInt(params.get("maxPrice")) || 300000,
    ]);

    setMinRating(parseInt(params.get("minRating")) || 0);
    setInStockOnly(params.get("inStock") === "true");
    setSortBy(params.get("sort") || "featured");
  }, [location.pathname, location.search, categories]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags &&
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesStock
      );
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        // Featured sorting - best sellers and new items first
        filtered.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
    }

    return filtered;
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 300000]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced for better performance
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className=""
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              Product Collection
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Discover our carefully curated selection of premium products
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, brands, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Best Discount</option>
          </select>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 ${
              !showFilters
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "border border-red-600 text-red-600 hover:bg-red-50"
            } rounded-lg transition-colors place-self-end text-sm`}
          >
            {showFilters ? (
              <LuX className="w-5 h-5" />
            ) : (
              <LuFilter className="w-5 h-5" />
            )}{" "}
            {showFilters ? "Close" : "Filters"}
          </button>
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AdvancedFilters
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setInStockOnly={setInStockOnly}
                setMinRating={setMinRating}
                minRating={minRating}
                inStockOnly={inStockOnly}
                setPriceRange={setPriceRange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {(searchTerm ||
            selectedCategories.length > 0 ||
            minRating > 0 ||
            inStockOnly ||
            priceRange[0] > 0 ||
            priceRange[1] < 300000) && (
            <button
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${filteredProducts.length}-${sortBy}`} // Change key when content changes
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className="h-full"
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} query={searchTerm} compact />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <LuSearch className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
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
}

export default ProductList;
