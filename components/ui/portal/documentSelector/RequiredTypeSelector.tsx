"use client";
import { Category, CategoryRequiredType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Hash } from "lucide-react";

export default function RequiredTypeSelector({
  category,
  onUpdate,
}: {
  category: Category;
  onUpdate: (category: Category) => void;
}) {
  const totalDocuments = category.requestedDocumentList.length;
  const selectedDocuments = category.requestedDocumentList.filter(
    (doc) => doc.selected
  ).length;

  const handleOptionClick = (value: CategoryRequiredType) => {
    if (value === "select") {
      onUpdate({
        ...category,
        requiredType: value,
        minimumRequiredDocumentCount: Math.min(
          category.minimumRequiredDocumentCount || 1,
          selectedDocuments || 1
        ),
      });
    } else {
      onUpdate({
        ...category,
        requiredType: value,
        minimumRequiredDocumentCount: 1,
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === "" ? 1 : Math.max(1, parseInt(value, 10) || 1);
    const maxValue = selectedDocuments || totalDocuments;
    const clampedValue = Math.min(numValue, maxValue);

    onUpdate({
      ...category,
      minimumRequiredDocumentCount: clampedValue,
    });
  };

  const options = [
    {
      value: "all" as CategoryRequiredType,
      label: "All",
      description: "All selected documents in this category are required",

      icon: CheckCircle2,
    },
    {
      value: "optional" as CategoryRequiredType,
      label: "All Optional",
      description: "All selected documents in this category are optional",
      icon: Circle,
    },
    {
      value: "select" as CategoryRequiredType,
      label: "Select Number",
      description: "Specify how many documents are required",
      icon: Hash,
    },
  ];

  const maxRequired = selectedDocuments || totalDocuments;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Document Requirements
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = category.requiredType === option.value;

            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-2 rounded-lg border-2 transition-all duration-200 text-left
                  ${
                    isSelected
                      ? "border-brand bg-brand/5 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        isSelected
                          ? "bg-brand text-white"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`
                          text-sm font-semibold
                          ${isSelected ? "text-brand" : "text-gray-900"}
                        `}
                      >
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {category.requiredType === "select" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Number of documents required
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-[200px]">
                  <input
                    type="number"
                    min={1}
                    max={maxRequired}
                    value={category.minimumRequiredDocumentCount}
                    onChange={handleNumberChange}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  of {maxRequired}{" "}
                  {maxRequired === 1 ? "document" : "documents"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recipients must submit at least this many documents from this
                category
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
