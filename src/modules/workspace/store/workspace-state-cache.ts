import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { RequestStateInterface } from "@/modules/requests/types/request.types";
import { SidebarItemInterface } from "@/modules/layout/store/sidebar.store";
import { RequestsStoreState } from "@/modules/requests/store/request.store";

/**
 * Snapshot of a workspace's UI state
 */
export interface WorkspaceStateSnapshot {
  workspaceId: string;
  requestState: RequestsStoreState;
  sidebarItems: SidebarItemInterface[];
  activeEnvironmentId: string | null;
  savedAt: number;
}

interface WorkspaceStateCacheState {
  snapshots: Record<string, WorkspaceStateSnapshot>;
  currentWorkspaceId: string | null;
}

interface WorkspaceStateCacheActions {
  saveSnapshot: (snapshot: WorkspaceStateSnapshot) => void;
  getSnapshot: (workspaceId: string) => WorkspaceStateSnapshot | null;
  removeSnapshot: (workspaceId: string) => void;
  setCurrentWorkspaceId: (workspaceId: string | null) => void;
  reset: () => void;
}

const useWorkspaceStateCache = create<
  WorkspaceStateCacheState & WorkspaceStateCacheActions
>()(
  devtools(
    persist(
      (set, get) => ({
        snapshots: {},
        currentWorkspaceId: null,

        saveSnapshot: (snapshot) =>
          set((state) => ({
            snapshots: {
              ...state.snapshots,
              [snapshot.workspaceId]: snapshot,
            },
          })),

        getSnapshot: (workspaceId) => {
          return get().snapshots[workspaceId] || null;
        },

        removeSnapshot: (workspaceId) =>
          set((state) => {
            const { [workspaceId]: _, ...rest } = state.snapshots;
            return { snapshots: rest };
          }),

        setCurrentWorkspaceId: (workspaceId) =>
          set({ currentWorkspaceId: workspaceId }),

        reset: () => set({ snapshots: {}, currentWorkspaceId: null }),
      }),
      {
        name: "workspace-state-cache",
      }
    )
  )
);

export default useWorkspaceStateCache;
