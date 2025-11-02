import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
type IconName = keyof typeof dynamicIconImports;

interface props {
  label: string;
  variant: "brand" | "neutral";
  iconName: IconName;
  fullWidth?: boolean;
}

export default function Button({ label, variant, iconName, fullWidth }: props) {
  return (
    <button
      className={`${
        variant == "brand" ? "bg-brand" : "bg-gray-500"
      } p-3 pl-5 pr-5 m-1 flex items-center justify-center rounded cursor-pointer ${
        fullWidth ? "w-full sm:42" : "w-42"
      }`}
    >
      <DynamicIcon name={iconName} color="white" size={16} strokeWidth={3} />
      <small className="text-white ml-2 font-medium">{label}</small>
    </button>
  );
}
