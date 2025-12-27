"use client";
import { useState } from "react";
import DocumentCategoryHeader from "./DocumentCategoryHeader";
import { Category, DocListType } from "@/types";
import RequiredTypeSelector from "./RequiredTypeSelector";
import { useModifyRequestStore } from "@/store/modifyRequestStore";
import Icon from "../../core/icon";
import EditDocumentModal from "../EditDocumentModal";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import Checkbox from "../../core/inputs/Checkbox";

export default function DocumentCategorySelector({
  category,
  index,
}: {
  category: Category;
  index: string;
}) {
  const updateCategory = useModifyRequestStore((s) => s.updateCategory);
  const [editingDocument, setEditingDocument] = useState<{
    document: DocListType;
    index: number;
  } | null>(null);

  const handleUpdate = (category: Category) => {
    updateCategory(index, category);
  };

  const handleEditDocument = (document: DocListType, itemIndex: number) => {
    setEditingDocument({ document, index: itemIndex });
  };

  const handleSaveDocument = (updatedDocument: DocListType) => {
    const updatedDocuments = [...category.requestedDocumentList];
    updatedDocuments[editingDocument!.index] = updatedDocument;
    handleUpdate({ ...category, requestedDocumentList: updatedDocuments });
    setEditingDocument(null);
  };

  return (
    <div>
      <motion.div
        initial={false}
        animate={{
          backgroundColor: category.selected ? "#fafafa" : "#ffffff",
        }}
        transition={{ duration: 0.2 }}
        className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-xs transition-all duration-200"
      >
        <DocumentCategoryHeader category={category} index={index} />

        <AnimatePresence>
          {category.selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-5 mt-6 pt-6 border-t border-gray-200">
                <RequiredTypeSelector
                  category={category}
                  onUpdate={handleUpdate}
                />
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Document Types
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.requestedDocumentList.map((item, i) => (
                    <motion.div
                      key={`${item.id}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Checkbox
                        label={item.label}
                        description={item.description}
                        checked={item.selected}
                        onChange={(checked) => {
                          const updatedDocuments = [
                            ...category.requestedDocumentList,
                          ];
                          updatedDocuments[i] = {
                            ...updatedDocuments[i],
                            selected: checked,
                          };
                          handleUpdate({
                            ...category,
                            requestedDocumentList: updatedDocuments,
                          });
                        }}
                        icon={<FileText className="w-4 h-4 text-gray-400" />}
                        rightAction={
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: item.selected ? 1 : 0,
                              scale: item.selected ? 1 : 0.8,
                            }}
                            whileHover={item.selected ? { scale: 1.1 } : {}}
                            whileTap={item.selected ? { scale: 0.95 } : {}}
                            onClick={(e) => {
                              if (!item.selected) return;
                              e.stopPropagation();
                              e.preventDefault();
                              handleEditDocument(item, i);
                            }}
                            disabled={!item.selected}
                            className="w-8 flex items-center justify-center aspect-square rounded-lg text-center bg-white border border-gray-200 hover:bg-blue-100 hover:border-blue-100 hover:text-blue-600 transition-all duration-200 shrink-0 shadow-sm"
                            style={{
                              pointerEvents: item.selected ? "auto" : "none",
                            }}
                            aria-label={`Edit ${item.label}`}
                            title="Edit document"
                          >
                            <Icon
                              iconName="pen"
                              size="small"
                              variant="neutral"
                            />
                          </motion.button>
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {editingDocument && (
        <EditDocumentModal
          document={editingDocument.document}
          isOpen={!!editingDocument}
          onClose={() => setEditingDocument(null)}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
}
