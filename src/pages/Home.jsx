import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuShoppingCart,
  LuChevronRight,
  LuChevronLeft,
  LuStar,
  LuTruck,
  LuShield,
  LuRefreshCw,
  LuArrowRight,
  LuClock,
  LuPackage,
  LuAward,
} from "react-icons/lu";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      type: "promotion",
      title: "Summer Collection 2026",
      subtitle: "Up to 50% Off",
      description: "Discover the hottest trends of the season",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      ctaText: "Shop Now",
      ctaLink: "#",
      badge: "Limited Time",
      overlay: 0.4,
    },
    {
      type: "product",
      title: "Wireless Headphones Pro",
      subtitle: "$129.99",
      description: "Premium sound quality with noise cancellation",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
      ctaText: "Buy Now",
      ctaLink: "#",
      badge: "Bestseller",
      rating: 4.8,
      reviews: 2450,
      overlay: 0.3,
    },
    {
      type: "flyer",
      title: "Flash Sale Weekend",
      subtitle: "Everything Must Go!",
      description: "Massive discounts on all categories",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
      ctaText: "View Deals",
      ctaLink: "#",
      badge: "48 Hours Only",
      countdown: true,
      overlay: 0.5,
    },
    {
      type: "collection",
      title: "Home & Living",
      subtitle: "Comfort Meets Style",
      description: "Transform your space with our curated collection",
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop",
      ctaText: "Explore Collection",
      ctaLink: "#",
      badge: "New Arrivals",
      itemCount: 150,
      overlay: 0.4,
    },
    {
      type: "brand",
      title: "Premium Electronics",
      subtitle: "Tech That Inspires",
      description: "Shop from world's leading brands",
      image:
        "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&h=600&fit=crop",
      ctaText: "Discover More",
      ctaLink: "#",
      badge: "Authorized Dealer",
      brands: ["Apple", "Samsung", "Sony"],
      overlay: 0.35,
    },
  ];

  const categories = [
    { name: "Electronics", icon: "💻", count: "2.5k+" },
    { name: "Fashion", icon: "👗", count: "5k+" },
    { name: "Home & Living", icon: "🏠", count: "3k+" },
    { name: "Beauty", icon: "💄", count: "1.8k+" },
    { name: "Sports", icon: "⚽", count: "2k+" },
    { name: "Books", icon: "📚", count: "4k+" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      tag: "Bestseller",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 299.99,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      tag: "New",
    },
    {
      id: 3,
      name: "Designer Backpack",
      price: 89.99,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      tag: "Sale",
    },
    {
      id: 4,
      name: "Premium Sunglasses",
      price: 159.99,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      tag: "Trending",
    },
  ];

  const features = [
    {
      icon: <LuTruck className="w-8 h-8" />,
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      icon: <LuShield className="w-8 h-8" />,
      title: "Secure Payment",
      desc: "100% protected",
    },
    {
      icon: <LuRefreshCw className="w-8 h-8" />,
      title: "Easy Returns",
      desc: "30-day guarantee",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const renderSlideContent = (slide) => {
    const baseContent = (
      <>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="absolute top-8 left-8"
        >
          <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {slide.badge}
          </span>
        </motion.div>

        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 10 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg text-white"
          >
            {slide.title}
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 10 }}
            className="text-2xl md:text-3xl lg:text-4xl text-red-400 mb-3 font-semibold drop-shadow-md"
          >
            {slide.subtitle}
          </motion.p>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", damping: 10 }}
            className="text-lg md:text-xl mb-8 drop-shadow-md"
          >
            {slide.description}
          </motion.p>

          {/* Type-specific content */}
          {slide.type === "product" && slide.rating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <LuStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(slide.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-semibold">{slide.rating}</span>
              <span className="text-gray-300">({slide.reviews} reviews)</span>
            </motion.div>
          )}

          {slide.type === "flyer" && slide.countdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <LuClock className="w-6 h-6 text-red-400" />
              <div className="flex gap-3">
                {[
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2"
                  >
                    <div className="text-3xl font-bold text-red-400">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {slide.type === "collection" && slide.itemCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mb-6 text-lg"
            >
              <LuPackage className="w-5 h-5 text-red-400" />
              <span className="font-semibold">{slide.itemCount}+ Items</span>
            </motion.div>
          )}

          {slide.type === "brand" && slide.brands && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mb-6 flex-wrap"
            >
              <LuAward className="w-5 h-5 text-red-400" />
              {slide.brands.map((brand, idx) => (
                <span
                  key={idx}
                  className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1 rounded-full font-semibold text-red-500"
                >
                  {brand}
                </span>
              ))}
            </motion.div>
          )}

          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", damping: 10 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto hover:bg-red-600 transition-all shadow-xl"
          >
            {slide.ctaText} <LuArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </>
    );

    return baseContent;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <section
        className="relative h-[600px] md:h-[700px] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroSlides[currentSlide].image})`,
              }}
            >
              <motion.div
                className="w-full h-full flex items-center justify-center relative"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${heroSlides[currentSlide].overlay})`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 1 }}
                />

                {/* Content */}
                <div className="z-10 w-full">
                  {renderSlideContent(heroSlides[currentSlide])}
                </div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-red-500 p-3 rounded-full transition-all z-20"
        >
          <LuChevronLeft size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-red-500 p-3 rounded-full transition-all z-20"
        >
          <LuChevronRight size={20} />
        </motion.button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
          {heroSlides.map((slide, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="group relative"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "bg-red-500 w-12"
                    : "bg-white bg-opacity-50 w-2 hover:bg-opacity-75"
                }`}
              />
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center space-x-4 p-4"
              >
                <div className="text-red-500">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Shop by Category
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.count} items</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Products
            </h2>
            <motion.button
              whileHover={{ x: 5 }}
              className="text-red-500 font-semibold flex items-center gap-2"
            >
              View All <LuChevronRight />
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <LuStar className="text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-500">
                      ${product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={addToCart}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <LuShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-red-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white text-lg mb-8">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
