import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import { MouseEventHandler } from "react";
import clsx from "clsx";

type IconName = keyof typeof dynamicIconImports;

interface Props {
  iconName: IconName;
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function IconButton({ iconName, fullWidth, onClick }: Props) {
  const baseStyles = clsx(
    "inline-flex items-center justify-center",
    "rounded-lg transition duration-200 active:scale-[0.98]",
    "hover:bg-gray-100",
    "p-2",
    fullWidth && "w-full"
  );

  return (
    <button onClick={onClick} className={baseStyles}>
      <DynamicIcon
        name={iconName}
        size={18}
        strokeWidth={2.5}
        className="text-gray-600"
      />
    </button>
  );
}
