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
    <div className="mb-4 w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 sm:text-base">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:px-4 sm:py-3 sm:text-base ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
