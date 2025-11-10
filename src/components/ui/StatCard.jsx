import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,

  // Styling props
  className = "",
  theme = "default",
  gradient = "from-blue-500 to-purple-500",
  size = "md",

  // Animation props
  animationDelay = 0,
  enableHover = false,
  enableStagger = false,
  enableIconAnimation = false,

  // Interaction props
  onClick,
  href,

  // Layout props
  alignment = "center",
  showBackgroundEffect = false,

  // Additional props
  ...rest
}) => {
  // Theme configurations
  const themes = {
    default: {
      bg: "bg-white",
      text: "text-gray-900",
      subtitle: "text-gray-500",
      shadow: "shadow-md hover:shadow-xl",
      border: "",
    },
    minimal: {
      bg: "bg-transparent",
      text: "text-gray-900",
      subtitle: "text-gray-600",
      shadow: "shadow-none hover:shadow-lg",
      border: "border border-gray-200",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-white",
      subtitle: "text-gray-300",
      shadow: "shadow-lg hover:shadow-2xl",
      border: "",
    },
    gradient: {
      bg: `bg-gradient-to-r ${gradient}`,
      text: "text-white",
      subtitle: "text-white/80",
      shadow: "shadow-lg hover:shadow-xl",
      border: "",
    },
  };

  // Size configurations
  const sizes = {
    sm: {
      card: "p-4 rounded-lg",
      icon: "text-3xl mb-2",
      title: "text-sm font-semibold",
      value: "text-lg font-bold",
      subtitle: "text-xs",
    },
    md: {
      card: "p-6 rounded-2xl",
      icon: "text-4xl mb-3",
      title: "text-base font-bold",
      value: "text-2xl font-bold",
      subtitle: "text-sm",
    },
    lg: {
      card: "p-8 rounded-3xl",
      icon: "text-5xl mb-4",
      title: "text-lg font-bold",
      value: "text-3xl font-bold",
      subtitle: "text-base",
    },
  };

  // Alignment configurations
  const alignments = {
    center: "text-center",
    left: "text-left",
    right: "text-right",
  };

  const currentTheme = themes[theme] || themes.default;
  const currentSize = sizes[size] || sizes.md;
  const currentAlignment = alignments[alignment] || alignments.center;

  // Base card classes
  const cardClasses = `
    relative transition-all duration-300 overflow-hidden group ${
      enableHover ? "cursor-pointer" : ""
    }
    ${currentTheme.bg}
    ${currentTheme.border}
    ${enableHover ? currentTheme.shadow : "shadow-md"}
    ${currentSize.card}
    ${currentAlignment}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: enableStagger ? animationDelay : 0,
        duration: 0.5,
      },
    },
  };

  const hoverVariants = enableHover
    ? {
        hover: {
          scale: 1.05,
          y: -5,
          transition: { duration: 0.2 },
        },
      }
    : {};

  const iconVariants = enableIconAnimation
    ? {
        hover: {
          scale: 1.2,
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.3 },
        },
      }
    : {};

  // Render content
  const renderContent = () => (
    <>
      {/* Background effect */}
      {showBackgroundEffect && theme !== "gradient" && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          whileHover={enableHover ? { opacity: 0.1 } : {}}
        />
      )}

      {/* Icon */}
      {icon && (
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          className={`${currentSize.icon} ${currentTheme.text} relative z-10`}
        >
          {icon}
        </motion.div>
      )}

      {/* Value (main number/stat) */}
      {value && (
        <motion.div
          className={`${currentSize.value} ${currentTheme.text} mb-1 relative z-10`}
        >
          {value}
        </motion.div>
      )}

      {/* Title */}
      {title && (
        <h3
          className={`${currentSize.title} ${currentTheme.text} mb-1 relative z-10`}
        >
          {title}
        </h3>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`${currentSize.subtitle} ${currentTheme.subtitle} relative z-10`}
        >
          {subtitle}
        </p>
      )}
    </>
  );

  // Render as different components based on props
  if (href) {
    return (
      <motion.a
        href={href}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={enableHover ? "hover" : {}}
        className={cardClasses}
        {...rest}
      >
        {renderContent()}
      </motion.a>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={enableHover ? "hover" : {}}
      className={cardClasses}
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : -1}
      {...rest}
    >
      {renderContent()}
    </motion.div>
  );
};

// Default props for convenience
StatCard.defaultProps = {
  theme: "default",
  size: "md",
  alignment: "center",
  enableHover: true,
  enableStagger: true,
  enableIconAnimation: true,
  showBackgroundEffect: true,
};

export default StatCard;
