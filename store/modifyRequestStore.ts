import { create } from "zustand";
import { DocumentRequest, RequestDetails } from "../types";
import { createEmptyRequestDetails } from "@/factories/documentRequest";
import { categoryTemplateData } from "@/documentCategoryData";
import { Category } from "../types";
import { DocumentCategoryMap } from "../types";
type CategoryKey = keyof DocumentCategoryMap;

interface ModifyRequestState {
  docRequest: RequestDetails;
  previewRequest: boolean;
  requestCategoryData: DocumentCategoryMap | {};
  categoryData: DocumentCategoryMap;

  updateRequestDetails: <K extends keyof RequestDetails>(
    key: K,
    value: RequestDetails[K]
  ) => void;
  // togglePreviewRequest: () => void;
  // deleteRequestInput: (index: string) => void;
  toggleEnableCategory: (index: CategoryKey) => void;
  updateCategory: (index: string, category: Category) => void;
}

export const useModifyRequestStore = create<ModifyRequestState>((set) => ({
  docRequest: createEmptyRequestDetails(),
  previewRequest: false,
  // requestDetails: createEmptyRequestDetails(),
  categoryData: categoryTemplateData,

  updateRequestDetails: <K extends keyof RequestDetails>(
    key: K,
    value: RequestDetails[K]
  ) =>
    set((state) => ({
      docRequest: {
        ...state.docRequest,
        [key]: value,
      },
    })),

  // togglePreviewRequest: () => {
  //   set((state) => ({
  //     previewRequest: !state.previewRequest,
  //   }));
  // },

  toggleEnableCategory: (key: CategoryKey) =>
    set((state) => {
      const isSelected = state.categoryData[key].selected;

      if (isSelected) {
        return {
          categoryData: {
            ...state.categoryData,
            [key]: {
              ...categoryTemplateData[key],
              selected: false,
            },
          },
        };
      }

      return {
        categoryData: {
          ...state.categoryData,
          [key]: {
            ...state.categoryData[key],
            selected: true,
          },
        },
      };
    }),

  updateCategory: (key: CategoryKey, category: Category) =>
    set((state) => ({
      categoryData: {
        ...state.categoryData,
        [key]: {
          ...state.categoryData[key],
          ...category,
        },
      },
    })),
}));
