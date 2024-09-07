import React from "react";
import classNames from "classnames";

const Button = ({ label, variant, icon, onClick }) => {
  const baseClasses = "flex items-center px-4 py-2 rounded font-medium text-sm";
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  return (
    <button
      className={classNames(variants[variant], baseClasses)}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
