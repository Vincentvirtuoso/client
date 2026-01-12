import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuShield,
  LuArrowRight,
  LuChevronRight,
  LuSparkles,
  LuZap,
} from "react-icons/lu";
import ShoppingBagSVG from "./svgs/ShoppingBag";
import GiftBoxSVG from "./svgs/GiftBox";
import RocketSVG from "./svgs/RocketSVG";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const AnimatedBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "rgba(255,255,255,0.1)", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "rgba(255,255,255,0)", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <motion.circle
            cx="20%"
            cy="30%"
            r="300"
            fill="url(#grad1)"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="80%"
            cy="70%"
            r="250"
            fill="url(#grad1)"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
    );
  };

  const slides = [
    {
      title: "New Season Arrivals",
      subtitle: "Discover the latest trends",
      description: "Shop exclusive collections with up to 50% off",
      cta: "Shop Now",
      gradient: "from-green-500 via-emerald-500 to-green-600",
      illustration: <ShoppingBagSVG />,
    },
    {
      title: "Premium Quality",
      subtitle: "Crafted with excellence",
      description: "Handpicked products for discerning customers",
      cta: "Explore Collection",
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      illustration: <GiftBoxSVG />,
    },
    {
      title: "Flash Sale Today",
      subtitle: "Limited time offer",
      description: "Save big on selected items - Ends midnight!",
      cta: "Grab Deals",
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      illustration: <RocketSVG />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 49000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[650px] overflow-hidden rounded-3xl mb-16 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient}`}
        >
          <AnimatedBackground />

          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="text-white z-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-6 border border-white/30"
                  >
                    <LuSparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {slides[currentSlide].subtitle}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-4xl md:text-7xl font-bold mb-6 mt-4 leading-tight text-white"
                  >
                    {slides[currentSlide].title.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="inline-block mr-3"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-lg md:text-xl mb-10 text-white/95 font-light"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 group"
                  >
                    {slides[currentSlide].cta}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <LuArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="flex items-center gap-8 mt-8"
                  >
                    <div className="flex items-center gap-2">
                      <LuZap className="w-5 h-5 text-yellow-300" />
                      <span className="text-sm text-white/90">
                        Fast Shipping
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuShield className="w-5 h-5 text-green-300" />
                      <span className="text-sm text-white/90">
                        Secure Payment
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Illustration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="relative flex items-center justify-center"
                >
                  {slides[currentSlide].illustration}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-32 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-32 left-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative group"
          >
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentSlide === index ? "w-12 bg-white" : "w-8 bg-white/40"
              }`}
            />
            {currentSlide === index && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-white rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-20 border border-white/30"
      >
        <LuChevronRight className="w-6 h-6 text-white rotate-180" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-20 border border-white/30"
      >
        <LuChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default Hero;
