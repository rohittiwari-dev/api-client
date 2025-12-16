import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { RequestStateInterface } from "@/modules/requests/types/request.types";
import { SidebarItemInterface } from "@/modules/layout/store/sidebar.store";
import { RequestsStoreState } from "@/modules/requests/store/request.store";

/**
 * Snapshot of a workspace's UI state
 * This captures the user's working state that should persist across workspace switches
 */
export interface WorkspaceStateSnapshot {
  workspaceId: string;
  // UI State
  tabIds: string[];
  draftIds: string[];
  activeTabId: string | null;
  activeRequest: RequestStateInterface | null;
  // Full request state (captures everything including unsaved changes & drafts)
  requests: RequestStateInterface[];
  // Sidebar state
  sidebarItems: SidebarItemInterface[];
  // Active environment
  activeEnvironmentId: string | null;
  savedAt: number;
}

interface WorkspaceStateCacheState {
  snapshots: Record<string, WorkspaceStateSnapshot>;
  currentWorkspaceId: string | null;
  // Workspace ID that needs cache restoration after navigation
  pendingRestoreWorkspaceId: string | null;
  // Workspace ID that has had restore applied (to prevent re-applying)
  appliedRestoreWorkspaceId: string | null;
}

interface WorkspaceStateCacheActions {
  saveSnapshot: (snapshot: WorkspaceStateSnapshot) => void;
  getSnapshot: (workspaceId: string) => WorkspaceStateSnapshot | null;
  removeSnapshot: (workspaceId: string) => void;
  setCurrentWorkspaceId: (workspaceId: string | null) => void;
  reset: () => void;
  /**
   * Mark a workspace for pending restore (called before navigation)
   */
  setPendingRestore: (workspaceId: string) => void;
  /**
   * Clear pending restore flag
   */
  clearPendingRestore: () => void;
  /**
   * Get pending restore workspace ID
   */
  getPendingRestore: () => string | null;
  /**
   * Mark restore as applied for a workspace
   */
  setAppliedRestore: (workspaceId: string) => void;
  /**
   * Check if restore was already applied for a workspace
   */
  hasAppliedRestore: (workspaceId: string) => boolean;
  /**
   * Clear applied restore when switching away
   */
  clearAppliedRestore: () => void;
  /**
   * Create a snapshot from the current request store state
   */
  createSnapshotFromState: (
    workspaceId: string,
    requestState: RequestsStoreState,
    sidebarItems: SidebarItemInterface[],
    activeEnvironmentId: string | null
  ) => WorkspaceStateSnapshot;
  /**
   * Merge cached snapshot with fresh DB requests
   * Returns the merged request state ready to be applied
   */
  mergeWithDatabaseRequests: (
    snapshot: WorkspaceStateSnapshot,
    dbRequests: RequestStateInterface[]
  ) => Partial<RequestsStoreState>;
}

const useWorkspaceStateCache = create<
  WorkspaceStateCacheState & WorkspaceStateCacheActions
>()(
  devtools(
    persist(
      (set, get) => ({
        snapshots: {},
        currentWorkspaceId: null,
        pendingRestoreWorkspaceId: null,
        appliedRestoreWorkspaceId: null,

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

        setPendingRestore: (workspaceId) =>
          set({
            pendingRestoreWorkspaceId: workspaceId,
            appliedRestoreWorkspaceId: null,
          }),

        clearPendingRestore: () => set({ pendingRestoreWorkspaceId: null }),

        getPendingRestore: () => get().pendingRestoreWorkspaceId,

        setAppliedRestore: (workspaceId) =>
          set({ appliedRestoreWorkspaceId: workspaceId }),

        hasAppliedRestore: (workspaceId) =>
          get().appliedRestoreWorkspaceId === workspaceId,

        clearAppliedRestore: () => set({ appliedRestoreWorkspaceId: null }),

        reset: () =>
          set({
            snapshots: {},
            currentWorkspaceId: null,
            pendingRestoreWorkspaceId: null,
            appliedRestoreWorkspaceId: null,
          }),

        createSnapshotFromState: (
          workspaceId,
          requestState,
          sidebarItems,
          activeEnvironmentId
        ) => {
          const { requests, tabIds, draftIds, activeTabId, activeRequest } =
            requestState;

          return {
            workspaceId,
            tabIds,
            draftIds,
            activeTabId,
            activeRequest,
            requests, // Save the full request state
            sidebarItems,
            activeEnvironmentId,
            savedAt: Date.now(),
          };
        },

        mergeWithDatabaseRequests: (snapshot, dbRequests) => {
          // 1. Start with fresh DB requests as the base
          // Map to quick lookup for DB existence
          const dbRequestMap = new Map(dbRequests.map((r) => [r.id, r]));

          // 2. Process cached requests to apply overlays
          const fusedRequests: RequestStateInterface[] = [];
          const processedIds = new Set<string>();

          // Iterate through cached requests to preserve order/unsaved work
          // Handle legacy snapshots where requests might be undefined
          const cachedRequests = snapshot.requests || [];
          cachedRequests.forEach((cachedReq) => {
            const dbReq = dbRequestMap.get(cachedReq.id);

            if (dbReq) {
              // CASE A: Request exists in DB
              if (cachedReq.unsaved) {
                // If local has unsaved changes, PRESERVE local version
                fusedRequests.push(cachedReq);
              } else {
                // If local is clean, use fresh DB version (to get external updates)
                fusedRequests.push(dbReq);
              }
            } else {
              // CASE B: Request NOT in DB (It's a local draft)
              // Preserve it
              fusedRequests.push(cachedReq);
            }
            processedIds.add(cachedReq.id);
          });

          // 3. Add any NEW DB requests that weren't in cache
          // (e.g. created by another user or in another session)
          dbRequests.forEach((dbReq) => {
            if (!processedIds.has(dbReq.id)) {
              fusedRequests.push(dbReq);
            }
          });

          // 4. Validate UI State
          // Ensure tabIds only point to existing requests
          const validRequestIds = new Set(fusedRequests.map((r) => r.id));
          const validTabIds = snapshot.tabIds.filter((id) =>
            validRequestIds.has(id)
          );
          const validDraftIds = snapshot.draftIds.filter((id) =>
            validRequestIds.has(id)
          );

          // Validate active tab
          let activeTabId = snapshot.activeTabId;
          if (activeTabId && !validRequestIds.has(activeTabId)) {
            activeTabId = validTabIds[0] || null;
          }

          const activeRequest = activeTabId
            ? fusedRequests.find((r) => r.id === activeTabId) || null
            : null;

          return {
            requests: fusedRequests,
            tabIds: validTabIds,
            draftIds: validDraftIds,
            activeTabId,
            activeRequest,
          };
        },
      }),
      {
        name: "workspace-state-cache",
      }
    )
  )
);

export default useWorkspaceStateCache;
