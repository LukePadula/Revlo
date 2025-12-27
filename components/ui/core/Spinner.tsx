"use client";

import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "brand" | "minimal";
  className?: string;
}

export default function DocumentSpinner({
  size = "large",
  variant = "default",
  className = "",
}: SpinnerProps = {}) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const variantStyles = {
    default: "text-brand",
    brand: "text-brand",
    minimal: "text-gray-400",
  };

  return (
    <div className={`flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Main Spinner */}
        <motion.div
          className={`${sizeClasses[size]} ${variantStyles[variant]}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32 56"
              className="opacity-20"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32 56"
              strokeDashoffset="16"
              className="opacity-60"
            />
          </svg>
        </motion.div>

        {/* Optional: Subtle pulse effect */}
        {variant === "default" && (
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-brand/10 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
    </div>
  );
}

// Inline spinner for use in buttons and small spaces
export function InlineSpinner({
  size = "small",
  className = "",
}: {
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  return (
    <motion.svg
      className={`${sizeClasses[size]} text-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="24 48"
        className="opacity-25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="24 48"
        strokeDashoffset="12"
        className="opacity-75"
      />
    </motion.svg>
  );
}

// Compact spinner for cards and containers
export function CompactSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        className="w-10 h-10 text-brand"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="28 56"
            className="opacity-20"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="28 56"
            strokeDashoffset="14"
            className="opacity-60"
          />
        </svg>
      </motion.div>
    </div>
  );
}
