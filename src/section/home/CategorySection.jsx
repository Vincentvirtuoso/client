import { motion } from "framer-motion";
import {
  LuMonitor,
  LuShirt,
  LuSparkles,
  LuDumbbell,
  LuBookOpen,
} from "react-icons/lu";
import { FiHome } from "react-icons/fi";

export default function CategorySection() {
  const categories = [
    {
      name: "Electronics",
      icon: LuMonitor,
      count: "2,500+",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Fashion",
      icon: LuShirt,
      count: "5,000+",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Home & Living",
      icon: FiHome,
      count: "3,000+",
      gradient: "from-orange-500 to-red-500",
    },
    {
      name: "Beauty",
      icon: LuSparkles,
      count: "1,800+",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Sports",
      icon: LuDumbbell,
      count: "2,000+",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Books",
      icon: LuBookOpen,
      count: "4,000+",
      gradient: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of products across our curated categories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-white rounded-2xl p-6 h-full shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Icon container */}
                  <div className="relative mb-4 flex justify-center">
                    <div
                      className={`w-16 h-16 rounded-xl bg-linear-to-br ${cat.gradient} p-3.5 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                    >
                      <Icon
                        className="w-full h-full text-white"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative text-center">
                    <h3 className="font-semibold text-gray-900 text-base mb-2 group-hover:text-gray-700 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium text-gray-500">
                        {cat.count}
                      </span>
                      <span className="text-xs text-gray-400">products</span>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-gray-900 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" /> */}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional: View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
            Browse All Categories
          </button>
        </motion.div>
      </div>
    </section>
  );
}
