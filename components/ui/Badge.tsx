import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "outline";
  className?: string;
}

export const Badge = ({ children, variant = "secondary", className = "" }: BadgeProps) => {
  const variants = {
    primary: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    secondary: "bg-zinc-800 text-zinc-400 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    outline: "border border-zinc-700 text-zinc-400",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  isLoading?: boolean;
}

export const IconButton = ({ icon, isLoading, className = "", ...props }: IconButtonProps) => {
  return (
    <button
      className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full" />
      ) : (
        <span className="text-lg">{icon}</span>
      )}
    </button>
  );
};
