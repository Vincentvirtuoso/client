import { motion } from "framer-motion";

const ShoppingBagSVG = () => {
  return (
    <motion.svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <defs>
        {/* Bag body – aligned with bg gradient */}
        <linearGradient id="bagGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399" /> {/* emerald-400 */}
          <stop offset="50%" stopColor="#10B981" /> {/* emerald-500 */}
          <stop offset="100%" stopColor="#059669" /> {/* emerald-600 */}
        </linearGradient>

        {/* Handle – softer, lighter green */}
        <linearGradient id="handleGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>

        {/* Ambient glow */}
        <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft glow to separate from bg */}
      <circle cx="200" cy="200" r="140" fill="url(#ambientGlow)" />

      {/* Floating particles (very subtle) */}
      <motion.circle
        cx="95"
        cy="95"
        r="5"
        fill="#D1FAE5"
        animate={{ y: [0, -16, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="305"
        cy="115"
        r="4"
        fill="#A7F3D0"
        animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />

      {/* Bag body */}
      <motion.path
        d="M120 140 L120 180 C120 205 135 220 160 220 L240 220 C265 220 280 205 280 180 L280 140 Z"
        fill="url(#bagGradient)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      {/* Bag handle */}
      <motion.path
        d="M160 140 Q160 95 200 95 Q240 95 240 140"
        stroke="url(#handleGradient)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      {/* Minimal sparkles (kept elegant) */}
      <motion.circle
        cx="260"
        cy="165"
        r="3.5"
        fill="#ECFDF5"
        animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="145"
        cy="195"
        r="3"
        fill="#D1FAE5"
        animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.1,
        }}
      />
    </motion.svg>
  );
};

export default ShoppingBagSVG;
