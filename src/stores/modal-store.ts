import { create } from "zustand";

type SidebarTabType = "documents" | "casual" | "mindspace";

interface DefaultModal {
  extras: any;
  isOpen: boolean;
  activeTab: SidebarTabType;
  setActiveTab: (tab: SidebarTabType) => void;
  onOpen: (extras?: any) => void;
  onClose: () => void;
  toggle: () => void;
}

const defaultModalValues = (set: any) => ({
  isOpen: false,
  extras: {},
  onOpen: (extras?: any) => set({ isOpen: true, extras }),
  onClose: () => set({ isOpen: false, extras: {} }),
  toggle: () => set((state: DefaultModal) => ({ isOpen: !state.isOpen })),
  activeTab: "casual" as SidebarTabType,
  setActiveTab: (tab: SidebarTabType) => set({ activeTab: tab }),
});

export const useCreateVaultModal = create<DefaultModal>(defaultModalValues);
