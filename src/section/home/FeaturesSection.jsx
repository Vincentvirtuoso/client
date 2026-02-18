import { motion } from "framer-motion";
import { LuTruck, LuShield, LuHeadphones, LuCreditCard } from "react-icons/lu";

const FeaturesSection = () => {
  const features = [
    {
      icon: <LuTruck className="w-7 h-7" />,
      title: "Free Shipping",
      description: "On orders over ₦50,000",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: <LuShield className="w-7 h-7" />,
      title: "Secure Payment",
      description: "100% protected transactions",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      icon: <LuHeadphones className="w-7 h-7" />,
      title: "24/7 Support",
      description: "Dedicated customer service",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      icon: <LuCreditCard className="w-7 h-7" />,
      title: "Easy Returns",
      description: "30-day money-back guarantee",
      gradient: "from-orange-500 to-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
        >
          <motion.div
            className={`absolute inset-0 bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          />

          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={`w-14 h-14 rounded-xl bg-linear-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
          >
            {feature.icon}
          </motion.div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {feature.description}
          </p>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-gray-200 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturesSection;
