import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { HttpMethod } from "@/generated/prisma/browser";
import { RequestType } from "../types/store.types";

export type RequestTabsStoreState = {
  id: string;
  title: string;
  type: RequestType | "NEW";
  method?: HttpMethod | null;
  collectionId?: string | null;
  unsaved?: boolean;
  workspaceId: string;
};
type RequestTabsStore = {
  tabs: RequestTabsStoreState[];
  activeTab: RequestTabsStoreState | null;
  addTab: (tab: RequestTabsStoreState) => void;
  removeTab: (id: string) => void;
  removeOtherTabs: (id: string, workspaceId: string) => void;
  removeAllTabs: (workspaceId: string) => void;
  setActiveTab: (tab: RequestTabsStoreState | null) => void;
  setActiveTabById: (id: string) => void;
  setTabs: (tabs: RequestTabsStoreState[], preserveActiveTab?: boolean) => void;
  replaceTabData: (id: string, newData: Partial<RequestTabsStoreState>) => void;
  setCollectionId: (id: string | null, requestId: string | null) => void;
  reset: () => void;
};

const useRequestTabsStore = create<RequestTabsStore>()(
  devtools(
    persist(
      (set, get) => ({
        tabs: [],
        activeTab: null,
        isSaved: false,
        collectionId: null,
        addTab: (tab) =>
          set((state) => {
            const existingTabIndex = state.tabs.findIndex(
              (t) => t.id === tab.id
            );
            if (existingTabIndex !== -1) {
              const tabs = [...state.tabs];
              const updatedTab = {
                ...tabs[existingTabIndex],
                ...tab,
                id: tabs[existingTabIndex].id,
              };
              tabs[existingTabIndex] = updatedTab;
              return { tabs, activeTab: updatedTab };
            }
            const tabs = [...state.tabs, tab];
            return { tabs, activeTab: tab };
          }),
        removeTab: (id) =>
          set((state) => {
            const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
            const newTabs = state.tabs.filter((tab) => tab.id !== id);

            let newActiveTab = state.activeTab;
            if (state.activeTab?.id === id) {
              if (tabIndex > 0) {
                newActiveTab = newTabs[tabIndex - 1] || newTabs[0] || null;
              } else {
                newActiveTab = newTabs[0] || null;
              }
            }

            return { tabs: newTabs, activeTab: newActiveTab };
          }),
        removeOtherTabs: (id, workspaceId) =>
          set((state) => {
            const newTabs = state.tabs.filter(
              (tab) => tab.id === id || tab.workspaceId !== workspaceId
            );
            const activeTab = newTabs.find((tab) => tab.id === id) || null;
            return { tabs: newTabs, activeTab };
          }),
        removeAllTabs: (workspaceId) =>
          set((state) => {
            const newTabs = state.tabs.filter(
              (tab) => tab.workspaceId !== workspaceId
            );
            const activeTab = state.activeTab?.workspaceId === workspaceId
              ? null
              : state.activeTab;
            return { tabs: newTabs, activeTab };
          }),
        setActiveTab: (tab) =>
          set(() => ({
            activeTab: tab,
          })),
        setActiveTabById: (id) =>
          set((state) => ({
            activeTab: state.tabs.find((tab) => tab.id === id) || null,
          })),
        setTabs: (tabs, preserveActiveTab = true) =>
          set((state) => {
            if (preserveActiveTab && state.activeTab) {
              const activeExists = tabs.find((t) => t.id === state.activeTab?.id);
              if (activeExists) {
                return { tabs, activeTab: activeExists };
              }
            }
            return { tabs, activeTab: tabs[0] || null };
          }),
        replaceTabData: (id, newData) =>
          set((state) => ({
            tabs: state.tabs.map((tab) => {
              if (tab.id === id) {
                return { ...tab, ...newData };
              }
              return tab;
            }),
            activeTab:
              state.activeTab?.id === id
                ? { ...state.activeTab, ...newData }
                : state.activeTab,
          })),
        setCollectionId: (collectionId, requestId) =>
          set((state) => ({
            tabs: state.tabs.map((tab) => {
              if (tab.id === requestId) {
                return { ...tab, collectionId };
              }
              return tab;
            }),
            activeTab:
              state.activeTab?.id === requestId
                ? { ...state.activeTab, collectionId }
                : state.activeTab,
          })),
        reset: () => set({ tabs: [], activeTab: null }),
      }),
      {
        name: "request-tabs",
      }
    )
  )
);

export default useRequestTabsStore;

