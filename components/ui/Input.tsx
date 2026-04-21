import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-medium text-zinc-400 ml-1">{label}</label>}
      <input
        className={`w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-white transition-all placeholder:text-zinc-500 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = ({ label, error, className = "", ...props }: TextAreaProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-medium text-zinc-400 ml-1">{label}</label>}
      <textarea
        className={`w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-white transition-all placeholder:text-zinc-500 resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  );
};
