import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuStar,
  LuStarHalf,
  LuTruck,
  LuShield,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuAward,
  LuSparkles,
} from "react-icons/lu";
import { useParams, useNavigate } from "react-router-dom";
import CartQuantityUpdater from "../components/common/CartQuantityUpdater";
import ProductImage from "../components/ui/ProductImage";
import { useProduct } from "../hooks/useProduct";
import {
  ProductDetailError,
  ProductDetailSkeleton,
} from "../components/skeleton/ProductDetailSkeleton";

const StarRating = ({ rating, size = "md" }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <LuStar key={i} className={`${iconSize} text-yellow-400 fill-current`} />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <LuStarHalf
        key="half"
        className={`${iconSize} text-yellow-400 fill-current`}
      />,
    );
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <LuStar key={`empty-${i}`} className={`${iconSize} text-gray-300`} />,
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading, error } = useProduct();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const res = await getProductById(id);
          if (res && res.data) {
            setProduct(res.data);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length,
      );
    }
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <ProductDetailError
        error={error}
        onRetry={() => getProductById(id)}
        onGoBack={() => navigate("/products")}
      />
    );
  }

  // Calculate discount percentage
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // Check if product is in stock
  const inStock =
    product.inStock || product.availabilityType !== "out-of-stock";
  const stockCount = product.stockCount || 0;
  const isLimitedStock = stockCount > 0 && stockCount <= 10;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Image Gallery */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-square flex items-center justify-center h-[450px] w-full">
              <div className="w-full h-full relative">
                {product.images && product.images[selectedImage] && (
                  <ProductImage
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    size={"full"}
                  />
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    key={selectedImage}
                    className="absolute inset-0 pointer-events-none"
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <LuChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <LuChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                {product.isBestSeller && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full"
                  >
                    <LuAward className="w-4 h-4" />
                    Best Seller
                  </motion.span>
                )}
                {product.isNewArrival && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full uppercase"
                  >
                    <LuSparkles className="w-4 h-4" />
                    New Arrival
                  </motion.span>
                )}
                {discount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full"
                  >
                    {discount}% OFF
                  </motion.span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    } relative`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      size="full"
                      // className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{product.category?.name}</span>
              <span>•</span>
              <span>{product.subCategory || "Uncategorized"}</span>
              <span>•</span>
              <span className="text-gray-900">{product.brand}</span>
            </div>

            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">by {product.brand}</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating || 0} size="lg" />
                <span className="text-lg font-semibold text-gray-900">
                  {product.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {product.reviewCount || 0} reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-4xl font-bold text-gray-900">
                  ₦{product.price?.toLocaleString() || "0"}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 font-medium rounded-lg">
                      Save ₦
                      {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                inStock
                  ? isLimitedStock
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {inStock ? (
                <>
                  <LuCheck className="w-4 h-4" />
                  {isLimitedStock ? (
                    <span>Only {stockCount} left in stock</span>
                  ) : (
                    <span>In Stock</span>
                  )}
                </>
              ) : (
                <>
                  <LuClock className="w-4 h-4" />
                  <span>Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Key Features:</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <LuCheck className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <CartQuantityUpdater product={product} textSize={"lg"} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!inStock}
                className={`py-2 px-8 rounded-xl font-semibold text-lg border transition-colors whitespace-nowrap ${
                  inStock
                    ? "btn-outline"
                    : "border-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Shipping & Warranty Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <LuTruck className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm">On orders over ₦100</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <LuShield className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="font-medium">
                    {product.specifications?.warranty || "2-Year"} Warranty
                  </p>
                  <p className="text-sm">Full protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <LuCheck className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <p className="font-medium">30-Day Returns</p>
                  <p className="text-sm">No questions asked</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Information Tabs */}
        <motion.div
          variants={itemVariants}
          className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden">
            <nav className="grid grid-cols-3 -mb-px p-1 whitespace-nowrap">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose prose-lg max-w-none"
                >
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Key Features
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        {(product.features || product.tags || []).map(
                          (item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <LuCheck className="w-4 h-4 text-green-500" />
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Product Details
                      </h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Brand</dt>
                          <dd className="font-medium">{product.brand}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Category</dt>
                          <dd className="font-medium">
                            {product.category?.name}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Subcategory</dt>
                          <dd className="font-medium">
                            {product.subCategory || "N/A"}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">SKU</dt>
                          <dd className="font-medium">
                            {product.sku ||
                              `PROD-${product._id?.slice(-6) || "000000"}`}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "specifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      General Specifications
                    </h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Brand</dt>
                        <dd className="font-medium">{product.brand}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Category</dt>
                        <dd className="font-medium">
                          {product.category?.name}
                        </dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Availability</dt>
                        <dd className="font-medium">
                          {inStock ? "In Stock" : "Out of Stock"}
                        </dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Unit</dt>
                        <dd className="font-medium">
                          {product.unit || "Piece"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Technical Details
                    </h4>
                    <dl className="space-y-3">
                      {product.specifications &&
                        typeof product.specifications === "object" && (
                          <>
                            {Object.entries(product.specifications).map(
                              ([key, value]) =>
                                value && (
                                  <div
                                    key={key}
                                    className="flex justify-between py-2 border-b border-gray-100"
                                  >
                                    <dt className="text-gray-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </dt>
                                    <dd className="font-medium">{value}</dd>
                                  </div>
                                ),
                            )}
                          </>
                        )}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Weight</dt>
                        <dd className="font-medium">
                          {product.weight?.value} {product.weight?.unit}
                        </dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Dimensions</dt>
                        <dd className="font-medium">
                          {product.dimensions?.length}×
                          {product.dimensions?.width}×
                          {product.dimensions?.height}{" "}
                          {product.dimensions?.unit}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 flex flex-col items-center"
                >
                  <div className="flex flex-col items-center text-center py-8">
                    <StarRating rating={product.rating || 0} size="lg" />
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {product.rating?.toFixed(1) || "0.0"} out of 5
                    </p>
                    <p className="text-gray-600 mt-1">
                      Based on {product.reviewCount || 0} reviews
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center w-full">
                    <p className="text-red-700">
                      ⭐{" "}
                      {product.rating >= 4
                        ? "This product is highly rated by customers"
                        : product.rating >= 3
                          ? "This product has good customer ratings"
                          : "Be the first to review this product"}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
