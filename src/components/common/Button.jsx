import React from "react";
import classNames from "classnames";

const Button = ({ label, variant, icon, onClick }) => {
  const baseClasses =
    "flex items-center px-4 py-2 rounded font-medium text-sm transition-all duration-200";
  const variants = {
    primary:
      "bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500",
    secondary:
      "bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500",
  };

  return (
    <button
      className={classNames(variants[variant], baseClasses)}
      onClick={onClick}
    >
      {icon && (
        <span className="mr-2 font-bold text-white text-xl ">{icon}</span>
      )}
      {label}
    </button>
  );
};

export default Button;
