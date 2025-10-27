import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
type IconName = keyof typeof dynamicIconImports;

interface props {
  label: string;
  variant: "brand" | "neutral";
  iconName: IconName;
}

export default function Button({ label, variant, iconName }: props) {
  const data = [
    {
      type: "passport",
      required: true,
      label: "Passport",
      description: "A clear photo of your passport",
      colourVariant: "blue",
    },
  ];

  const request = {
    requestDetails: {
      requestedBy: "Luke Padula",
      purpose: "Verify identity",
      expires: "date",
    },
    dataPolicy: { encrypt: true, autoDeletePeriod: "7 days", auditTrail: true },
  };

  return (
    <button
      className={`${
        variant == "brand" ? "bg-brand" : "bg-gray-500"
      } p-3 pl-5 pr-5 m-1 flex items-center justify-center rounded cursor-pointer`}
    >
      <DynamicIcon name={iconName} color="white" size={16} strokeWidth={3} />
      <small className="text-white ml-2 font-bold">{label}</small>
    </button>
  );
}
