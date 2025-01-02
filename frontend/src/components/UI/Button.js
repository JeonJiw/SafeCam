import React from "react";

function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  fullWidth = false,
}) {
  const baseStyle =
    "flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;
