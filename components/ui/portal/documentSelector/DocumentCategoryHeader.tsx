import ToggleInput from "../../core/inputs/ToggleInput";
import DocumentIcon from "../../core/documentIcon";
import { Category } from "@/types";
import { useModifyRequestStore } from "@/store/modifyRequestStore";
import { dynamicIconImports } from "lucide-react/dynamic";
import { ColourVariant } from "@/types";
import { iconConfig } from "@/documentCategoryData";
import { IconConfigKey } from "@/types";

export default function DocumentCategoryHeader({
  category,
  index,
}: {
  category: Category;
  index: IconConfigKey;
}) {
  const { title, description } = category;

  const toggleCategory = useModifyRequestStore((s) => s.toggleEnableCategory);

  const handleHeaderClick = () => {
    if (!category.selected) {
      toggleCategory(index);
    }
  };
  type IconName = keyof typeof dynamicIconImports;

  return (
    <div
      className="flex items-center justify-between"
      onClick={handleHeaderClick}
    >
      <div className="flex items-center space-x-3">
        <DocumentIcon
          iconName={iconConfig[index].name as IconName}
          colourVariant={iconConfig[index].colour as ColourVariant}
        />
        <div>
          <h3 className="text-md font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
      <ToggleInput
        value={category.selected}
        onClick={() => toggleCategory(index)}
      />
    </div>
  );
}
