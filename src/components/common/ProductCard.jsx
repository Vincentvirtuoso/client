import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import useCart from "../../hooks/useCart";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  LuHeart,
  LuZoomIn,
  LuStar,
  LuShare2,
  LuStarHalf,
  LuSparkles,
  LuAward,
  LuInfo,
} from "react-icons/lu";
import CartQuantityUpdater from "./CartQuantityUpdater";
import HighlightText from "./HighlightText";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Memoized Star component
const Star = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <LuStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <LuStarHalf
        key="half"
        className="w-4 h-4 text-yellow-400 fill-current"
      />,
    );
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<LuStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProductCard = ({
  product,
  onQuickView,
  onShare,
  showDiscount = true,
  showRating = true,
  showStock = true,
  imageClassName = "",
  cardClassName = "",
  slideshowInterval = 4000,
  enableHoverEffects = true,
  compact = false,
  query,
}) => {
  const {
    id,
    name,
    brand,
    price,
    originalPrice,
    rating = 0,
    reviewCount = 0,
    image,
    images = [],
    category,
    // tags = [],
    inStock = true,
    stockCount,
    discount,
    isNew = false,
    isBestSeller = false,
  } = product;

  // Memoize derived values
  const displayImages = useMemo(
    () => (images.length > 0 ? images : [image]),
    [images, image],
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { savedForLater, toggleFavorite } = useCart();

  const isSavedForLater = savedForLater.some((item) => item.id === id);

  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentImageIndex]);

  const navigate = useNavigate();

  // Auto-cycle through images only on hover
  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, slideshowInterval);

    return () => clearInterval(interval);
  }, [displayImages.length, slideshowInterval]);

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = useMemo(
    () =>
      hasDiscount
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : discount,
    [hasDiscount, originalPrice, price, discount],
  );

  const handleQuickView = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView?.(product);
    },
    [onQuickView, product],
  );

  const handleToggleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(product);
      toast(isSavedForLater ? "Removed from Favorites" : "Added to Favorites", {
        iconTheme: isSavedForLater ? "info" : "success",
        icon: <LuInfo />,
      });
    },
    [toggleFavorite, product],
  );

  const handleShare = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onShare?.(product);
    },
    [onShare, product],
  );

  const handleCardClick = useCallback(() => {
    navigate(`/product/${id}`);
  }, [id, navigate]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick],
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <motion.article
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${cardClassName} flex flex-col h-full ${
        compact ? "compact-mode" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="article"
      aria-label={`Product: ${name}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* IMAGE SECTION - FIXED */}
      <div className="relative w-full bg-gray-50 overflow-hidden rounded-t-xl">
        {/* Fixed aspect ratio container */}
        <div className="relative w-full pb-[100%]">
          {/* Image wrapper with absolute positioning */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              {!imageError ? (
                <LazyLoadImage
                  src={displayImages[currentImageIndex]}
                  alt={name}
                  effect="blur"
                  className={`absolute inset-0 w-full h-full object-contain transition-transform duration-500 ${
                    isHovered && enableHoverEffects ? "scale-110" : "scale-100"
                  } ${imageClassName}`}
                  wrapperClassName="absolute inset-0"
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center p-4">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">Image unavailable</p>
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              )}
            </motion.div>
          </div>
        </div>

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10">
          {isNew && (
            <motion.span
              className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LuSparkles className="inline-flex mr-0.5" /> NEW
            </motion.span>
          )}
          {isBestSeller && (
            <motion.span
              className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <LuAward className="inline-flex mr-0.5" /> BEST SELLER
            </motion.span>
          )}
          {showDiscount && discountPercentage > 0 && (
            <motion.span
              className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              -{discountPercentage}%
            </motion.span>
          )}
          {showStock && (!inStock || stockCount === 0) && (
            <span className="bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
        >
          <motion.button
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 ${
              isSavedForLater
                ? "text-red-500"
                : "text-gray-700 hover:text-red-500"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={
              isSavedForLater ? "Remove from favorites" : "Add to favorites"
            }
          >
            <LuHeart
              className={`w-5 h-5 ${isSavedForLater ? "fill-current" : ""}`}
            />
          </motion.button>

          {onQuickView && (
            <motion.button
              onClick={handleQuickView}
              className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Quick view"
            >
              <LuZoomIn className="w-5 h-5" />
            </motion.button>
          )}

          {onShare && (
            <motion.button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg text-gray-700 hover:text-green-600 transition-all duration-200 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Share product"
            >
              <LuShare2 className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* IMAGE DOTS INDICATOR */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {showStock && (!inStock || stockCount === 0) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <span className="text-white text-lg font-bold tracking-wider px-4 py-2 rounded-lg border-2 border-white/80">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className={`p-4 flex flex-col flex-1 ${compact ? "p-3" : ""}`}>
        {/* Category */}
        {category && !compact && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-medium">
            {category}
          </p>
        )}

        {/* Product Name */}
        <h3
          className={`font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors ${
            compact ? "text-sm min-h-0" : "text-lg leading-snug"
          }`}
        >
          {query ? <HighlightText text={name} query={query} /> : name}
        </h3>

        {/* Brand */}
        {brand && !compact && (
          <p className="text-sm text-gray-600 mb-2">
            by <span className="font-semibold text-gray-800">{brand}</span>
          </p>
        )}

        {/* Rating */}
        {showRating && rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              <Star rating={rating} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {rating.toFixed(1)}
            </span>
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500">
                ({reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xl font-bold text-gray-900">
            ₦{price.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₦{originalPrice.toLocaleString()}
              </span>
              {!compact && (
                <span className="text-sm font-medium text-red-500">
                  Save ₦{(originalPrice - price).toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>

        {/* Stock Warning */}
        {showStock &&
          inStock &&
          stockCount !== undefined &&
          stockCount <= 10 && (
            <p className="text-sm text-orange-600 font-medium mb-3">
              ⚠️ Only {stockCount} left in stock
            </p>
          )}

        {/* Add to Cart Button */}
        <CartQuantityUpdater
          textSize="text-sm"
          product={product}
          compact={compact}
        />
      </div>
    </motion.article>
  );
};

export default React.memo(ProductCard);
