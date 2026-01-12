import { motion, AnimatePresence } from "framer-motion";

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

export default GiftBoxSVG;
