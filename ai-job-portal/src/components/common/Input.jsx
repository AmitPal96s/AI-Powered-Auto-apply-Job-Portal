import React from "react";
import { motion } from "framer-motion";

void motion;

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      className="mb-4 w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 sm:text-base">
          {label}
        </label>
      )}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:px-4 sm:py-3 sm:text-base ${className}`}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
    </motion.div>
  );
};

export default Input;
