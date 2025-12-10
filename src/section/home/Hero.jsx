import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuShield,
  LuArrowRight,
  LuChevronRight,
  LuSparkles,
  LuZap,
} from "react-icons/lu";

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

  const ShoppingBagSVG = () => {
    return (
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Floating particles */}
        <motion.circle
          cx="100"
          cy="80"
          r="8"
          fill="white"
          opacity="0.6"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="300"
          cy="100"
          r="6"
          fill="white"
          opacity="0.6"
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Main bag */}
        <motion.path
          d="M120 140 L120 180 C120 200 130 210 150 210 L250 210 C270 210 280 200 280 180 L280 140 Z"
          fill="white"
          opacity="0.95"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Bag handle */}
        <motion.path
          d="M 160 140 Q 160 100 200 100 Q 240 100 240 140"
          stroke="white"
          strokeWidth="8"
          fill="none"
          opacity="0.95"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Sparkles */}
        <motion.circle
          cx="260"
          cy="160"
          r="4"
          fill="white"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.circle
          cx="140"
          cy="190"
          r="3"
          fill="white"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </motion.svg>
    );
  };

  const GiftBoxSVG = () => {
    return (
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Gift Box */}
        <motion.rect
          x="120"
          y="150"
          width="160"
          height="140"
          rx="12"
          fill="#FFCC6F" // 🎁 warm pastel gold
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ originY: 1 }}
        />

        {/* Box shading */}
        <rect
          x="120"
          y="150"
          width="160"
          height="140"
          rx="12"
          fill="rgba(0,0,0,0.05)"
        />

        {/* Vertical Ribbon */}
        <motion.rect
          x="190"
          y="150"
          width="20"
          height="140"
          fill="#FF4F6D" // 🎀 pinkish red
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ originY: 0 }}
        />

        {/* Horizontal Ribbon */}
        <motion.rect
          x="120"
          y="210"
          width="160"
          height="20"
          fill="#FF4F6D" // 🎀 same ribbon color
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ originX: 0.5 }}
        />

        {/* Bow */}
        <motion.path
          d="M 170 150 Q 160 130 180 120 Q 200 115 200 140 Q 200 115 220 120 Q 240 130 230 150 L 200 150 Z"
          fill="#FF728A" // 💝 softer pink
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{ originX: 0.5, originY: 0.5 }}
        />

        {/* Bow highlight */}
        <path
          d="M 170 150 Q 160 130 180 120 Q 200 115 200 140 Q 200 115 220 120 Q 240 130 230 150 L 200 150 Z"
          fill="rgba(255,255,255,0.2)"
        />

        {/* Floating Heart */}
        <motion.path
          d="M 250 180 L 255 185 L 260 180 Q 265 175 260 170 Q 255 167 250 170 Q 245 167 240 170 Q 235 175 240 180 Z"
          fill="#FF6FAE" // 💗 cute heart pink
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    );
  };

  const RocketSVG = () => {
    return (
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Rocket body */}
        <motion.path
          d="M 200 80 L 220 200 L 200 220 L 180 200 Z"
          fill="white"
          opacity="0.95"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Rocket window */}
        <motion.circle
          cx="200"
          cy="130"
          r="15"
          fill="rgba(255,255,255,0.6)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />

        {/* Rocket fins */}
        <motion.path
          d="M 180 180 L 160 220 L 180 210 Z"
          fill="white"
          opacity="0.9"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 0.9 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />
        <motion.path
          d="M 220 180 L 240 220 L 220 210 Z"
          fill="white"
          opacity="0.9"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 0.9 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />

        {/* Flame */}
        <motion.path
          d="M 190 220 L 200 260 L 210 220 Q 205 230 200 235 Q 195 230 190 220 Z"
          fill="white"
          opacity="0.8"
          animate={{
            scaleY: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ originY: 0 }}
        />

        {/* Stars */}
        <motion.circle
          cx="150"
          cy="100"
          r="3"
          fill="white"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.circle
          cx="270"
          cy="140"
          r="4"
          fill="white"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.svg>
    );
  };

  const slides = [
    {
      title: "New Season Arrivals",
      subtitle: "Discover the latest trends",
      description: "Shop exclusive collections with up to 50% off",
      cta: "Shop Now",
      gradient: "from-rose-500 via-pink-500 to-purple-600",
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
      gradient: "from-orange-500 via-red-500 to-pink-600",
      illustration: <RocketSVG />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
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
                    className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
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
