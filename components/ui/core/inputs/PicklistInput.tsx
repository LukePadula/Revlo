import clsx from "clsx";
import { DynamicIcon } from "lucide-react/dynamic";
import { useId } from "react";

export interface PicklistOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface PicklistProps {
  label?: string;
  options: PicklistOption[];
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  className?: string;
  name?: string;
}

export default function PicklistInput({
  label,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder,
  helperText,
  errorText,
  className,
  name,
}: PicklistProps) {
  const id = useId();
  const selectId = `picklist-${id}`;
  const hasError = !!errorText;
  const feedback = errorText || helperText;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-900"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          aria-invalid={hasError}
          aria-describedby={feedback ? `${selectId}-feedback` : undefined}
          className={clsx(
            "w-full appearance-none px-3 py-2.5 pr-10 text-sm",
            "rounded-lg border bg-white transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            hasError
              ? "border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-500"
              : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500",
            "hover:border-gray-400"
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div
          className={clsx(
            "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
            disabled && "opacity-50"
          )}
        >
          <DynamicIcon
            name="chevron-down"
            size={18}
            color={hasError ? "#f43f5e" : "#6b7280"}
            strokeWidth={2.5}
          />
        </div>
      </div>

      {feedback && (
        <p
          id={`${selectId}-feedback`}
          className={clsx(
            "text-xs font-medium",
            hasError ? "text-rose-600" : "text-gray-500"
          )}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
