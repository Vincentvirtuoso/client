import { useState } from "react";
import { LuShield, LuArrowRight, LuMail, LuHeart } from "react-icons/lu";
import { motion } from "framer-motion";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-3xl p-12 mb-16 text-white overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <LuMail className="w-16 h-16 mx-auto mb-6" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Stay Updated
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-8 text-white/95"
        >
          Subscribe to our newsletter for exclusive deals and new arrivals
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-full text-red-400 focus:outline-none transition-all placeholder:text-gray-500 bg-red-50"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            type="submit"
            className="bg-white text-red-600 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all relative overflow-hidden"
          >
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              className="relative z-10 flex items-center justify-center gap-2"
            >
              Subscribe
              <LuArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.form>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-8 text-sm text-white/80"
        >
          <div className="flex items-center gap-2">
            <LuHeart className="w-4 h-4" />
            <span>100K+ subscribers</span>
          </div>
          <div className="flex items-center gap-2">
            <LuShield className="w-4 h-4" />
            <span>No spam, ever</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NewsletterSection;
