import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
type IconName = keyof typeof dynamicIconImports;

interface props {
  iconName: IconName;
  variant: string;
  size: "small" | "medium";
}

export default function Icon({ iconName, variant, size }: props) {
  let colour = "white";
  let pxSize = 20;
  let containerWidthClass = "w-8";
  let containerRoundedClass = "rounded-sm";
  let containerColourClass = "bg-brand";
  let strokeWidth = 2.4;

  if (size === "small") {
    pxSize = 12;
    containerWidthClass = "w-4";
  }

  if (variant === "brand") {
    colour = "white";
  } else if (variant === "medium") {
    containerColourClass = "bg-brand-medium";
  } else if (variant === "light") {
    colour = "#2563eb";
    containerColourClass = "bg-brand-light";
  } else if (variant == "success") {
    colour = "white";
    containerColourClass = "bg-success";
    containerRoundedClass = "rounded-full";
    strokeWidth = 3.4;
  }
  return (
    <div
      className={`${containerWidthClass} ${containerRoundedClass} ${containerColourClass} mr-3 aspect-square flex justify-center items-center`}
    >
      <DynamicIcon
        name={iconName}
        color={colour}
        size={pxSize}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
