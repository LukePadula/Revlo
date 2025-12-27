import clsx from "clsx";
import React from "react";

type Props = {
  selected: boolean;
  value: string;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const TokenButton: React.FC<Props> = ({
  selected,
  value,
  label,
  onClick,
  className,
  ...rest
}) => {
  return (
    <button
      type="button"
      value={value}
      aria-pressed={selected}
      onClick={onClick}
      title={label}
      className={clsx(
        "rounded-full px-2 py-1 transition-colors duration-150",
        selected
          ? "bg-brand text-white"
          : "bg-gray-100 border border-gray-200 text-gray-800 hover:bg-gray-200",
        className
      )}
      {...rest}
    >
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default TokenButton;
