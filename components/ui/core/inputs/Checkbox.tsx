"use client";
import { InputHTMLAttributes, useId, ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import clsx from "clsx";

interface CheckboxProps {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  id?: string;
  onChange?: (checked: boolean) => void;
  icon?: ReactNode;
  rightAction?: ReactNode;
  className?: string;
}

export default function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled = false,
  required = false,
  name,
  value,
  id,
  onChange,
  icon,
  rightAction,
  className,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? checked : defaultChecked ?? false;

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    id: checkboxId,
    name,
    value,
    disabled,
    required,
    onChange: (event) => onChange?.(event.target.checked),
    className: "sr-only",
    onClick: (e) => e.stopPropagation(),
    "aria-label": label,
  };

  if (isControlled) {
    inputProps.checked = checked;
  } else if (typeof defaultChecked === "boolean") {
    inputProps.defaultChecked = defaultChecked;
  }

  return (
    <label
      htmlFor={checkboxId}
      className={clsx(
        "group relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
        isChecked
          ? "border-brand bg-brand/5 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
    >
      {/* Custom Checkbox Visual */}
      <div className="shrink-0">
        {isChecked ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-5 h-5 rounded border-2 border-brand bg-brand flex items-center justify-center"
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </motion.div>
        ) : (
          <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white group-hover:border-brand/50 transition-colors" />
        )}
      </div>

      {/* Hidden native checkbox for accessibility */}
      <input {...inputProps} type="checkbox" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
          <div className="flex-1 min-w-0">
            <p
              className={clsx(
                "text-sm font-medium truncate",
                isChecked
                  ? "text-gray-900"
                  : "text-gray-700 group-hover:text-gray-900",
                disabled && "text-gray-400"
              )}
            >
              {label}
              {required && <span className="text-rose-500"> *</span>}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Action (e.g., edit button) */}
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </label>
  );
}
