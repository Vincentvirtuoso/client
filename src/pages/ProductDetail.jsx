import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuStar,
  LuStarHalf,
  LuShoppingCart,
  LuHeart,
  LuShare2,
  LuTruck,
  LuShield,
  LuArrowLeft,
  LuCheck,
  LuPlus,
  LuMinus,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuAward,
  LuSparkles,
} from "react-icons/lu";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import CartQuantityUpdater from "../components/common/CartQuantityUpdater";
import ProductImage from "../components/ui/ProductImage";

const StarRating = ({ rating, size = "md" }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <LuStar key={i} className={`${iconSize} text-yellow-400 fill-current`} />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <LuStarHalf
        key="half"
        className={`${iconSize} text-yellow-400 fill-current`}
      />
    );
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <LuStar key={`empty-${i}`} className={`${iconSize} text-gray-300`} />
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {/* <nav className="bg-white shadow-sm border-b border-gray-300 sticky top-16 z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LuArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <LuShare2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? "bg-red-50 text-red-600"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <LuHeart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav> */}

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
            <div className="relative rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-square flex items-center justify-center">
              <div className="w-full h-full relative">
                <ProductImage
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  size={"full"}
                />
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
              {product.images.length > 1 && (
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
                {product.isNew && (
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
                {product.discount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full"
                  >
                    {product.discount}% OFF
                  </motion.span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
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
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{product.category}</span>
            <span>•</span>
            <span>{product.subCategory}</span>
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
              <StarRating rating={product.rating} size="lg" />
              <span className="text-lg font-semibold text-gray-900">
                {product.rating}
              </span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{product.reviewCount} reviews</span>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-4xl font-bold text-gray-900">
                ₦{product.price.toLocaleString()}
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
            {product.discount > 0 && (
              <p className="text-green-600 font-medium">
                {product.discount}% discount applied
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              product.inStock
                ? product.availabilityType === "limited"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.inStock ? (
              <>
                <LuCheck className="w-4 h-4" />
                {product.availabilityType === "limited" ? (
                  <span>Only {product.stockCount} left in stock</span>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <CartQuantityUpdater product={product} textSize={"lg"} />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!product.inStock}
              className={`py-2 px-8 rounded-xl font-semibold text-lg border transition-colors ${
                product.inStock
                  ? "btn-outline"
                  : "border-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Buy Now
            </motion.button>
          </div>

          {/* Features */}
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
                <p className="font-medium">2-Year Warranty</p>
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

        {/* Additional Information Tabs */}
        <motion.div
          variants={itemVariants}
          className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="border-b border-gray-200 overflow-x-auto overflow-y-hidden">
            <nav className="grid grid-cols-4 -mb-px p-1 whitespace-nowrap">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "reviews", label: "Reviews" },
                { id: "shipping", label: "Shipping & Returns" },
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
                        {product.tags.map((tag, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <LuCheck className="w-4 h-4 text-green-500" />
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </li>
                        ))}
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
                          <dd className="font-medium">{product.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Subcategory</dt>
                          <dd className="font-medium">{product.subCategory}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">SKU</dt>
                          <dd className="font-medium">
                            PROD-{product.id.toString().padStart(4, "0")}
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
                        <dd className="font-medium">{product.category}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Availability</dt>
                        <dd className="font-medium">
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Pricing & Reviews
                    </h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Original Price</dt>
                        <dd className="font-medium">
                          ₦{product.originalPrice.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Current Price</dt>
                        <dd className="font-medium text-green-600">
                          ₦{product.price.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-gray-600">Rating</dt>
                        <dd className="font-medium">{product.rating} / 5.0</dd>
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
                    <StarRating rating={product.rating} size="lg" />
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {product.rating} out of 5
                    </p>
                    <p className="text-gray-600 mt-1">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700">
                      ⭐ This product is highly rated by customers
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "shipping" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Shipping Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <LuTruck className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">
                              Free Standard Shipping
                            </p>
                            <p className="text-sm text-gray-600">
                              3-5 business days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Return Policy
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <LuCheck className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium">30-Day Returns</p>
                            <p className="text-sm text-gray-600">
                              No questions asked
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <LuShield className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="font-medium">2-Year Warranty</p>
                            <p className="text-sm text-gray-600">
                              Manufacturer warranty
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
