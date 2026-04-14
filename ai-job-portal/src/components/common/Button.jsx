import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-medium transition duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:opacity-90",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;