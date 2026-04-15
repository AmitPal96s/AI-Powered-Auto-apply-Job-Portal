import React from "react";
import { motion } from "framer-motion";

void motion;

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3 sm:text-base";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:opacity-90",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
