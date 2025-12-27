import DocumentListItem from "./DocumentListItem";

import { useModifyRequestStore } from "@/store/modifyRequestStore";

import {
  createPassportDocType,
  createGovernmentIdDocType,
  createBankStatementDocType,
  createEducationCertificateDocType,
} from "@/factories/documentTypes";

export default function AddRequestedDocument() {
  const addDocumentItem = useModifyRequestStore((s) => s.updateRequestInputs);

  return (
    <div className="flex flex-wrap gap-2 my-4 ">
      <DocumentListItem
        iconName="globe"
        colourVariant="blue"
        label="Passport"
        onClick={() => addDocumentItem(createPassportDocType())}
      />
      <DocumentListItem
        iconName="landmark"
        colourVariant="green"
        label="Bank Statement"
        onClick={() => addDocumentItem(createBankStatementDocType())}
      />
      <DocumentListItem
        iconName="id-card"
        colourVariant="purple"
        label="Government ID"
        onClick={() => addDocumentItem(createGovernmentIdDocType())}
      />
      <DocumentListItem
        iconName="graduation-cap"
        colourVariant="orange"
        label="Education Certificate"
        onClick={() => addDocumentItem(createEducationCertificateDocType())}
      />
    </div>
  );
}
