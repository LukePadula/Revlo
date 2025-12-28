import PageCard from "./pageCard";
import DocumentIcon from "./documentIcon";
import Button from "./button";
import Icon from "./icon";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";

interface Props {
  children?: React.ReactNode;
  onClose?: () => void;
}

export default function Modal({ children, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose} // close when clicking background
    >
      <div
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <PageCard>{children}</PageCard>
      </div>
    </div>
  );
}
