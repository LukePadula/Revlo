import { create } from "zustand";
import { DocumentRequest } from "../types";

export type TabType = "open" | "pending" | "all";

interface DashboardState {
  requests: DocumentRequest[];
  activeTab: TabType;
  setRequests: (requests: DocumentRequest[]) => void;
  setActiveTab: (tab: TabType) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  requests: [],
  activeTab: "open",
  setRequests: (requests) => set({ requests }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
