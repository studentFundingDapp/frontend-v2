import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, error, className = "", ...props }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = props.value !== undefined ? Boolean(props.value) : Boolean(inputRef.current?.value);

  return (
    <div className={`relative w-full mb-6 ${className}`}>
      <motion.input
        {...props}
        ref={inputRef}
        className={`peer w-full px-4 pt-6 pb-2 bg-white/90 dark:bg-gray-900/80 border-2 rounded-lg outline-none transition-all duration-200 text-base text-gray-900 dark:text-white placeholder-transparent focus:ring-2 focus:ring-indigo-400 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"}`}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        autoComplete={props.autoComplete || "off"}
      />
      <motion.label
        htmlFor={props.id}
        className="absolute left-4 top-1.5 text-gray-500 dark:text-gray-400 pointer-events-none origin-left select-none"
        initial={false}
        animate={focused || hasValue ? { y: 0, scale: 0.85, x: 0, color: "#6366f1" } : { y: 20, scale: 1, x: 0, color: "#6b7280" }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        style={{
          background: "inherit",
          padding: "0 0.25rem",
          zIndex: 2,
        }}
      >
        {label}
      </motion.label>
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute left-0 -bottom-5 text-xs text-red-500"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={false}
        animate={focused ? { boxShadow: "0 0 0 3px #6366f1aa" } : { boxShadow: "none" }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};

export default FloatingLabelInput; 