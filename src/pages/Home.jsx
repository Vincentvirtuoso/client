import { motion } from "framer-motion";
import {
  LuShoppingBag,
  LuStar,
  LuChevronRight,
  LuTrendingUp,
  LuPackage,
} from "react-icons/lu";
import Hero from "../section/home/Hero";
import FeaturesSection from "./FeaturesSection";
import NewsletterSection from "./NewsletterSection";
import StatCard from "../components/ui/StatCard";

// Enhanced Categories Section
const CategoriesSection = () => {
  const categories = [
    {
      name: "Electronics",
      icon: "📱",
      count: "2.5k+",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: "Fashion",
      icon: "👗",
      count: "5k+",
      gradient: "from-pink-400 to-pink-600",
    },
    {
      name: "Beauty",
      icon: "💄",
      count: "1.8k+",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      name: "Sports",
      icon: "⚽",
      count: "2k+",
      gradient: "from-orange-400 to-orange-600",
    },
    {
      name: "Home",
      icon: "🏠",
      count: "3k+",
      gradient: "from-green-400 to-green-600",
    },
    {
      name: "Books",
      icon: "📚",
      count: "4k+",
      gradient: "from-indigo-400 to-indigo-600",
    },
  ];

  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">Explore our curated collections</p>
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          className="hidden sm:flex items-center gap-2 text-red-600 font-semibold"
        >
          View All <LuChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <StatCard
            key={index}
            {...category}
            title={category.name}
            value={category.count}
            enableHover
            showBackgroundEffect
            enableIconAnimation
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Stats Section
const StatsSection = () => {
  const stats = [
    { icon: <LuShoppingBag />, value: "50K+", label: "Products" },
    { icon: <LuStar />, value: "4.9/5", label: "Rating" },
    { icon: <LuTrendingUp />, value: "100K+", label: "Happy Customers" },
    { icon: <LuPackage />, value: "24h", label: "Fast Delivery" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-linear-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 mb-16 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="text-white text-4xl mb-3 flex justify-center"
            >
              {stat.icon}
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className="text-4xl font-bold text-white mb-2"
            >
              {stat.value}
            </motion.div>
            <div className="text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        <FeaturesSection />
        <CategoriesSection />
        <StatsSection />
        <NewsletterSection />
      </main>
    </div>
  );
};

export default Home;
