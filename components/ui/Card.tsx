import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }: CardProps) => (
  <div className={`mt-6 ${className}`}>{children}</div>
);
