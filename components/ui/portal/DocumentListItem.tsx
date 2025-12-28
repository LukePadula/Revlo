import { IconName, DynamicIcon } from "lucide-react/dynamic";
import clsx from "clsx";
import DocumentIcon from "../core/documentIcon";
import { ColourVariant } from "@/types";

interface Props {
  iconName: IconName;
  label: string;
  colourVariant: ColourVariant;
  disabled?: boolean;
  onClick?: () => void;
}

export default function DocumentListItem({
  iconName,
  colourVariant,
  label,
  disabled = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "basis-[calc(50%-0.25rem)] border-2 border-dashed rounded px-3 py-3 flex items-center justify-between text-left transition",
        "border-gray-300 hover:border-blue-500 hover:bg-blue-50",
        disabled && "opacity-60 cursor-not-allowed hover:border-gray-300"
      )}
    >
      <DocumentIcon iconName={iconName} colourVariant={colourVariant} />
      <div className="flex-1 px-3">
        <h2 className="text-sm font-medium text-gray-900 text-center">
          {label}
        </h2>
      </div>
      <DynamicIcon
        name="plus"
        color="#475467"
        size={20}
        strokeWidth={2.6}
        className={clsx(disabled && "opacity-40")}
      />
    </button>
  );
}
