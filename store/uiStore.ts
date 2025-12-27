import { isDragging } from "framer-motion";
import { create } from "zustand";

type VerifyInputPage = "send" | "otp";

interface UIState {
  verifyInputPage: VerifyInputPage;
  setVerifyInputPage: (page: VerifyInputPage) => void;
  isDragging: boolean;
  setIsDragging: () => void;
  isCreateRequestModalOpen: boolean;
  openCreateRequestModal: () => void;
  closeCreateRequestModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // verify state
  verifyInputPage: "send",
  setVerifyInputPage: (page) => set({ verifyInputPage: page }),
  isDragging: false,
  setIsDragging: () => set({ isDragging: !isDragging }),

  // modal state
  isCreateRequestModalOpen: false,
  openCreateRequestModal: () => set({ isCreateRequestModalOpen: true }),
  closeCreateRequestModal: () => set({ isCreateRequestModalOpen: false }),
}));
