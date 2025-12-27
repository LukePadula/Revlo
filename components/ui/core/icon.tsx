import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
type IconName = keyof typeof dynamicIconImports;

interface Props {
  iconName: IconName;
  variant: string;
  size: "small" | "medium";
  fill?: boolean;
}

export default function Icon({
  iconName,
  variant = "",
  size,
  fill = false,
}: Props) {
  let colour = "white";
  let pxSize = 20;
  let containerWidthClass = "w-8";
  let containerRoundedClass = "rounded-sm";
  let containerColourClass = "";
  let strokeWidth = 2.4;

  if (size === "small") {
    pxSize = 12;
    containerWidthClass = "w-4";
  }

  if (variant === "brand") {
    containerColourClass = "bg-brand";
    colour = "white";
  } else if (variant === "medium") {
    containerColourClass = "bg-brand-medium";
  } else if (variant === "light") {
    colour = "#2563eb";
    containerColourClass = "bg-brand-light";
  } else if (variant == "success") {
    colour = "#007a55";
    containerColourClass = "bg-success";
    containerRoundedClass = "rounded-full";
    strokeWidth = 3.4;
  } else if (variant == "neutral") {
    colour = "#434343";
    containerColourClass = "bg-brand-light";
  } else {
    colour = "gray";
  }

  return (
    <div
      className={`${containerWidthClass} ${containerRoundedClass} ${containerColourClass} aspect-square flex justify-center items-center`}
    >
      <DynamicIcon
        name={iconName}
        color={colour}
        size={pxSize}
        strokeWidth={strokeWidth}
        className={fill ? "[&>path]:fill-current" : ""}
      />
    </div>
  );
}
