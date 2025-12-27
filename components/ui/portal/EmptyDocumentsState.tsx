import DocumentIcon from "../core/documentIcon";

export default function EmptyDocumentState() {
  return (
    <div className="border-dashed border-gray-300 border-2 p-4 py-6 flex gap-2 flex-col items-center justify-center rounded">
      <DocumentIcon iconName="lamp-desk" colourVariant="blue" />
      <div className="text-center text-gray-600">
        <h1 className="font-semibold">Nothing here yet</h1>
        <small>Select a document type below.</small>
      </div>
    </div>
  );
}
