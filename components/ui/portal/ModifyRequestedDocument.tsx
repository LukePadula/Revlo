"use client";
import { useMemo } from "react";
import PageCard from "../core/pageCard";
import Icon from "../core/icon";
import { DocumentCategoryMap, Category, DocListType } from "@/types";
import { useModifyRequestStore } from "@/store/modifyRequestStore";
import DocumentCategoryList from "./documentSelector/DocumentCategoryList";
import { FileText, AlertCircle, Info } from "lucide-react";

interface props {
  categories: DocumentCategoryMap;
  errors?: Record<string, string>;
}

export default function ModifyRequestDocuments({ categories, errors }: props) {
  const categoryList = useModifyRequestStore((s) => s.categoryData);

  // Calculate statistics
  const stats = useMemo(() => {
    const selectedCategories = Object.values(categoryList).filter(
      (cat) => cat.selected
    );

    return {
      selectedCategories: selectedCategories.length,
    };
  }, [categoryList]);

  return (
    <PageCard
      title="Required Documents"
      subtitle="Select document categories and specify which documents are needed from each category"
      headerVariant="neutral"
      icon={<Icon iconName="file-text" variant="brand" size="medium" />}
    >
      <div className="space-y-6" data-section="documents">
        {/* Validation Errors */}
        {(errors?.categories || errors?.documents) && (
          <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            {errors.categories && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-900">
                  {errors.categories}
                </p>
              </div>
            )}
            {errors.documents && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-900">
                  {errors.documents}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900">
              How to select documents
            </p>
            <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
              <li>Enable a category by toggling it on</li>
              <li>Select specific documents from that category</li>
              <li>
                Click the pencil icon to customize document titles and
                descriptions
              </li>
              <li>Choose whether all or specific documents are required</li>
            </ol>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          <DocumentCategoryList categoryList={categoryList} />
        </div>
      </div>
    </PageCard>
  );
}
