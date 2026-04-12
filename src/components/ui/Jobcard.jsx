import React from "react";

const JobCard = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default JobCard;