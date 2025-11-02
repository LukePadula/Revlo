import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import { ColourVariant } from "@/types";
type IconName = keyof typeof dynamicIconImports;

interface props {
  iconName: IconName;
  colourVariant: ColourVariant;
}

export default function DocumentIcon({ iconName, colourVariant }: props) {
  const colourMap: Record<string, [string, string]> = {
    blue: ["#2563EB", "#DBEAFE"],
    purple: ["#B371F0", "#F3E8FF"],
    green: ["#059669", "#DCFCE7"],
    orange: ["#EA580C", "#FFEDD5"],
  };

  return (
    <div
      className="rounded-full p-2"
      style={{ backgroundColor: colourMap[colourVariant][1] }}
    >
      <DynamicIcon
        name={iconName}
        color={colourMap[colourVariant][0]}
        size={32}
        strokeWidth={1.8}
      />
    </div>
  );
}
