import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import { MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

type IconName = keyof typeof dynamicIconImports;

type ButtonType = "button" | "submit" | "reset";
type ButtonVariant =
  | "brand"
  | "neutral"
  | "outline"
  | "ghost"
  | "link"
  | "danger"
  | "success";
type ButtonSize = "small" | "medium" | "large";
type IconPosition = "left" | "right";

interface Props {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: IconName;
  iconPosition?: IconPosition;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
  children?: ReactNode;
}

export default function Button({
  label,
  variant = "brand",
  size = "medium",
  iconName,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className = "",
  ariaLabel,
  children,
}: Props) {
  const isDisabled = disabled || loading;

  // Ensure variant and size are not undefined for TypeScript
  const buttonVariant: ButtonVariant = variant;
  const buttonSize: ButtonSize = size;

  const baseStyles = clsx(
    "inline-flex items-center justify-center",
    "rounded-lg font-medium",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "active:scale-[0.98]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    className
  );

  const variantStyles: Record<ButtonVariant, string> = {
    brand: clsx(
      "bg-brand text-white",
      "hover:bg-brand/90 hover:shadow-md",
      "focus:ring-brand/50",
      "active:bg-brand/95"
    ),
    neutral: clsx(
      "bg-gray-600 text-white",
      "hover:bg-gray-700 hover:shadow-md",
      "focus:ring-gray-500/50",
      "active:bg-gray-800"
    ),
    outline: clsx(
      "border-2 border-brand text-brand bg-transparent",
      "hover:bg-brand/10 hover:border-brand/80",
      "focus:ring-brand/30",
      "active:bg-brand/20"
    ),
    ghost: clsx(
      "text-gray-700 bg-transparent",
      "hover:bg-gray-100",
      "focus:ring-gray-300/50",
      "active:bg-gray-200"
    ),
    link: clsx(
      "brand-text-colour bg-transparent p-0",
      "hover:underline",
      "focus:ring-brand/30 rounded-sm",
      "active:opacity-80"
    ),
    danger: clsx(
      "bg-red-600 text-white",
      "hover:bg-red-700 hover:shadow-md",
      "focus:ring-red-500/50",
      "active:bg-red-800"
    ),
    success: clsx(
      "bg-emerald-600 text-white",
      "hover:bg-emerald-700 hover:shadow-md",
      "focus:ring-emerald-500/50",
      "active:bg-emerald-800"
    ),
  };

  const sizeStyles: Record<ButtonSize, string> = {
    small: "px-3 py-1.5 text-xs gap-1.5 min-h-[32px]",
    medium: "px-5 py-2.5 text-sm gap-2 min-h-[40px]",
    large: "px-5 py-2.5 text-base gap-2.5 min-h-[44px]",
  };

  const iconSizes: Record<ButtonSize, number> = {
    small: 14,
    medium: 16,
    large: 18,
  };

  const iconElement = iconName && !loading && (
    <DynamicIcon
      name={iconName}
      size={iconSizes[buttonSize]}
      strokeWidth={2.5}
      className="shrink-0"
    />
  );

  const loadingSpinner = loading && (
    <motion.svg
      className="shrink-0"
      width={iconSizes[buttonSize]}
      height={iconSizes[buttonSize]}
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

  return (
    <button
      onClick={onClick}
      className={clsx(
        baseStyles,
        variantStyles[buttonVariant],
        sizeStyles[buttonSize],
        fullWidth && "w-full",
        isDisabled && "opacity-60 cursor-not-allowed"
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={ariaLabel || label}
      aria-busy={loading}
      type={type}
    >
      {loading && iconPosition === "left" && loadingSpinner}
      {!loading && iconPosition === "left" && iconElement}

      {children || <span className="whitespace-nowrap">{label}</span>}

      {loading && iconPosition === "right" && loadingSpinner}
      {!loading && iconPosition === "right" && iconElement}
    </button>
  );
}
