import React from "react";

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
    <div className="w-full mb-4">
      {label && (
        <label className="block text-gray-700 mb-1 font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;