import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuFilter, LuX, LuSearch, LuTag } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
import AdvancedFilters from "../section/productList/AdvancedFilters";
import { useProduct } from "../hooks/useProduct";
import { FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import {
  ProductListError,
  ProductListSkeleton,
} from "../components/skeleton/ProductListSkeleton";

function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getProducts, loading, products, error } = useProduct();

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
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );

  // Extract categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((product) => product.category))];
  }, [products]);

  const buildApiParams = () => {
    const params = {};

    if (searchTerm) params.search = searchTerm;
    if (selectedCategories.length > 0)
      params.categories = selectedCategories.join(",");
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 300000) params.maxPrice = priceRange[1];
    if (minRating > 0) params.minRating = minRating;
    if (inStockOnly) params.inStock = true;
    if (currentPage > 1) params.page = currentPage;
    params.limit = 12; // Set a default limit

    // Map UI sort options to API parameters
    switch (sortBy) {
      case "price-low":
        params.sortBy = "price";
        params.sortOrder = "asc";
        break;
      case "price-high":
        params.sortBy = "price";
        params.sortOrder = "desc";
        break;
      case "rating":
        params.sortBy = "rating";
        params.sortOrder = "desc";
        break;
      case "discount":
        params.sortBy = "discount";
        params.sortOrder = "desc";
        break;
      case "featured":
        params.sortBy = "isBestSeller";
        params.sortOrder = "desc";
        break;
      default:
        params.sort = "featured"; // Fallback to backend's default
    }

    return params;
  };
  // Update URL params
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
    if (currentPage > 1) params.set("page", currentPage.toString());

    navigate(`?${params.toString()}`, { replace: true });
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    minRating,
    inStockOnly,
    sortBy,
    currentPage,
    navigate,
  ]);

  // Fetch products when filters change
  useEffect(() => {
    const params = buildApiParams();
    getProducts(params);

    // Reset to page 1 when filters change (except page itself)
    const searchParams = new URLSearchParams(location.search);
    const urlPage = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(urlPage);
  }, [location.search, sortBy]);

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearchTerm(params.get("search") || "");

    const urlCategories = params.get("categories");
    if (urlCategories) {
      const validCategories = urlCategories.split(",");
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
    setCurrentPage(parseInt(params.get("page")) || 1);
  }, [location.pathname]);

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filters = [];

    if (searchTerm) {
      filters.push({
        type: "search",
        label: `Search: "${searchTerm}"`,
        onRemove: () => setSearchTerm(""),
      });
    }

    selectedCategories.forEach((category) => {
      filters.push({
        type: "category",
        label: category,
        onRemove: () =>
          setSelectedCategories((prev) =>
            prev.filter((cat) => cat !== category)
          ),
      });
    });

    if (priceRange[0] > 0) {
      filters.push({
        type: "price",
        label: `Min: ₦${priceRange[0].toLocaleString()}`,
        onRemove: () => setPriceRange([0, priceRange[1]]),
      });
    }

    if (priceRange[1] < 300000) {
      filters.push({
        type: "price",
        label: `Max: ₦${priceRange[1].toLocaleString()}`,
        onRemove: () => setPriceRange([priceRange[0], 300000]),
      });
    }

    if (minRating > 0) {
      filters.push({
        type: "rating",
        label: `${minRating}+ Stars`,
        onRemove: () => setMinRating(0),
      });
    }

    if (inStockOnly) {
      filters.push({
        type: "stock",
        label: "In Stock Only",
        onRemove: () => setInStockOnly(false),
      });
    }

    return filters;
  }, [searchTerm, selectedCategories, priceRange, minRating, inStockOnly]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 300000]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  const filterTagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
    return <ProductListSkeleton />;
  }

  if (error) {
    return <ProductListError error={error} onRetry={() => getProducts()} />;
  }

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
          className="flex gap-4 mb-8"
        >
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
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
            className={`flex items-center gap-2 px-4 py-3 ${
              !showFilters
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "text-red-600 hover:bg-red-50"
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

        {/* Active Filters Tags Section */}
        <AnimatePresence>
          {(activeFilters.length > 0 || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              {/* Results Count */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-600">
                  {searchTerm ? (
                    <>
                      Showing {products?.length || 0} results for "
                      <span className="font-semibold">{searchTerm}</span>"
                    </>
                  ) : (
                    <>Showing {products?.length || 0} products</>
                  )}
                </p>

                <button
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors text-sm flex items-center gap-1"
                >
                  <LuX className="w-4 h-4" />
                  Clear all
                </button>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {activeFilters.map((filter, index) => (
                    <motion.div
                      key={`${filter.type}-${filter.label}-${index}`}
                      variants={filterTagVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm shadow-sm hover:shadow-md transition-shadow"
                    >
                      <LuTag className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">{filter.label}</span>
                      <button
                        onClick={filter.onRemove}
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"
                        aria-label={`Remove ${filter.label} filter`}
                      >
                        <LuX className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default Results Count when no filters */}
        {activeFilters.length === 0 && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-gray-600">
              Showing {products?.length || 0} products
            </p>
          </motion.div>
        )}

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {products && products.length > 0 ? (
            <motion.div
              key={`grid-${products.length}-${sortBy}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
            >
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  layout
                  className="h-full"
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} query={searchTerm} compact />
                </motion.div>
              ))}
            </motion.div>
          ) : (
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
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ProductList;
