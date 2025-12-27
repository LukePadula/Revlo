import { Category } from "@/types";
import Button from "../core/button";
import PageCard from "../core/pageCard";
import Icon from "../core/icon";
import UploadArea from "./UploadArea";
import DocumentIcon from "../core/documentIcon";

export default function RequestedDocumentItem({
  category,
}: {
  category: Category;
}) {
  console.log(category, "CAT");

  const requiredText = {
    all: "Upload ALL of the following documents",
  };

  return (
    <div key={category.title} className="w-full p-2">
      <PageCard
        headerVariant="neutral"
        subtitle={requiredText[category.requiredType]}
        title={category.title}
        icon={
          <DocumentIcon
            iconName="id-card"
            colourVariant="blue"
            shape="square"
          />
        }
      >
        <div className="grid gap-2 md:grid-cols-2">
          {category.requestedDocumentList.map((doc) => (
            <div key={doc.id} className="w-full">
              <UploadArea docType={doc} />
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
