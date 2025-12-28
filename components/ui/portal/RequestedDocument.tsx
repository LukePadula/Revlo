import DocumentIcon from "../core/documentIcon";
import InputForm from "../core/InputForm";
import InputField from "../core/inputs/InputField";
import { dynamicIconImports } from "lucide-react/dynamic";
import IconButton from "../core/IconButton";
import { InputDocument } from "@/types";
import { useModifyRequestStore } from "@/store/modifyRequestStore";
import Checkbox from "../core/checkbox";
import { motion } from "framer-motion";

type IconName = keyof typeof dynamicIconImports;

interface props {
  document: InputDocument;
  index: number;
  readOnly?: boolean;
}

export default function RequestedDocument({
  document,
  index,
  readOnly = false,
}: props) {
  const addDocumentItem = useModifyRequestStore((s) => s.updateRequestInputs);
  const deleteDocumentItem = useModifyRequestStore((s) => s.deleteRequestInput);

  const onChange = (value: string | boolean, key: keyof InputDocument) => {
    const updated = { ...document, [key]: value };
    addDocumentItem(updated, index);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.96,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        transition: {
          opacity: { duration: 0.15 },
          height: { duration: 0.3 },
          marginTop: { duration: 0.3 },
          marginBottom: { duration: 0.3 },
          paddingTop: { duration: 0.3 },
          paddingBottom: { duration: 0.3 },
        },
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start mb-4">
          <DocumentIcon
            iconName={document.icon as IconName}
            colourVariant={document.colourVariant}
          />
          <div className="ml-3">
            <h2 className="font-medium text-gray-900">{document.label}</h2>
            <small className="text-sm text-gray-500">
              Configure document details
            </small>
          </div>
        </div>
        <IconButton
          iconName="trash"
          onClick={() => deleteDocumentItem(index)}
        />
      </div>

      <InputForm>
        <InputField
          label="Title"
          placeholder="Recipient Full Name"
          value={document.label}
          onChange={(v) => onChange(v, "label")}
        />

        <InputField
          label="Description"
          placeholder="Recipient Full Name"
          value={document.description}
          onChange={(v) => onChange(v, "description")}
        />

        <Checkbox
          label="Required"
          value={document.required}
          onChange={(v) => onChange(v, "required")}
        />
      </InputForm>
    </motion.div>
  );
}
