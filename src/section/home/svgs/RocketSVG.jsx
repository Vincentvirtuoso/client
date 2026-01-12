import { motion } from "framer-motion";

const RocketSVG = () => {
  return (
    <motion.svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0, x: -60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <defs>
        {/* Rocket body – aligned with hero gradient */}
        <linearGradient id="rocketGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C" /> {/* orange-400 */}
          <stop offset="50%" stopColor="#EF4444" /> {/* red-500 */}
          <stop offset="100%" stopColor="#EC4899" /> {/* pink-500 */}
        </linearGradient>

        {/* Flame */}
        <linearGradient id="flameGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="45%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Window */}
        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
        </radialGradient>

        {/* Ambient glow */}
        <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft glow to separate from bg */}
      <circle cx="200" cy="200" r="140" fill="url(#ambientGlow)" />

      {/* Rocket body */}
      <motion.path
        d="M 200 80 L 225 200 L 200 225 L 175 200 Z"
        fill="url(#rocketGradient)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Window */}
      <motion.circle
        cx="200"
        cy="135"
        r="15"
        fill="url(#windowGlow)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />

      {/* Fins */}
      <motion.path
        d="M 175 185 L 155 225 L 180 212 Z"
        fill="#FB923C" /* orange accent */
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />
      <motion.path
        d="M 225 185 L 245 225 L 220 212 Z"
        fill="#EC4899" /* pink accent */
        initial={{ x: 16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />

      {/* Flame */}
      <motion.path
        d="M 190 225 L 200 270 L 210 225 Q 205 238 200 242 Q 195 238 190 225 Z"
        fill="url(#flameGradient)"
        animate={{
          scaleY: [1, 1.35, 1],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 0.45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originY: 0 }}
      />

      {/* Stars / particles */}
      <motion.circle
        cx="150"
        cy="100"
        r="3"
        fill="#FED7AA"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="270"
        cy="140"
        r="4"
        fill="#FBCFE8"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />
    </motion.svg>
  );
};

export default RocketSVG;
