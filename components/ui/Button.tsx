import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 focus:ring-blue-500",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 focus:ring-zinc-500",
    outline: "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 focus:ring-zinc-500",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800 focus:ring-zinc-500",
    danger: "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
