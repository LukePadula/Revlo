import { DynamicIcon } from "lucide-react/dynamic";

export default function Icon() {
  return (
    <div className="w-8 mr-3 rounded aspect-square bg-blue-600 flex justify-center items-center">
      <DynamicIcon name="shield" color="white" size={20} />
    </div>
  );
}
