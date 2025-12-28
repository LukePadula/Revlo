import { create } from "zustand";
import { DocumentRequest } from "@/types";

// 1. Define the structure for your file (or just use native File)
export interface UploadedFile extends File {
  // If you want to add custom properties like previewUrl later,
  // you'd define them here. For now, we'll use native File.
}

interface RequestState {
  requestData: DocumentRequest | null;
  // 2. Changed from Record<string, UploadedFile> to Record<string, File[]>
  // This allows multiple files per document ID (e.g., 'id_card': [file1, file2])
  fileData: Record<string, File[]>;

  setRequestData: (data: DocumentRequest) => void;
  setFileData: (id: string, file: File) => void;
  // 3. Updated removeFile signature to accept the index
  removeFile: (id: string, index: number) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  requestData: null,
  fileData: {},

  setRequestData: (data) => set({ requestData: data }),

  setFileData: (id, file) =>
    set((state) => ({
      fileData: {
        ...state.fileData,
        // Using the spread operator to append the new file to the existing array
        [id]: [...(state.fileData[id] || []), file],
      },
    })),

  removeFile: (id, index) =>
    set((state) => {
      // If the ID doesn't exist, do nothing
      if (!state.fileData[id]) return state;

      return {
        fileData: {
          ...state.fileData,
          // Filter out the file at the specific index
          [id]: state.fileData[id].filter((_, i) => i !== index),
        },
      };
    }),
}));
