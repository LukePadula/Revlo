import DocumentCategorySelector from "./DocumentCategorySelector";
import { Category } from "@/types";

export default function DocumentCategoryList({ categoryList }: any) {
  return (
    <div className="flex gap-3 flex-col">
      {Object.entries(categoryList).map(([key, value]) => (
        <DocumentCategorySelector
          category={value as Category}
          index={key}
          key={key}
        />
      ))}
    </div>
  );
}
