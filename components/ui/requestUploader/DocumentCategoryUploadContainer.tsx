import PageCard from "../core/pageCard";
import Icon from "../core/icon";
import { DocumentCategoryMap } from "@/types";
import RequestedDocumentItem from "./RequestedDocumentItem";

interface Props {
  categories: DocumentCategoryMap;
}

export default function DocumentCategoryUploadContainer({ categories }: Props) {
  return (
    <>
      {Object.keys(categories).map((key: string) => (
        <div key={key}>
          <RequestedDocumentItem category={categories[key]} />
        </div>
      ))}
    </>
  );
}
