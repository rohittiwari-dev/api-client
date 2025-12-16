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
  // Only store what we need to restore UI state, not the full DB data
  tabIds: string[];
  draftIds: string[];
  activeTabId: string | null;
  // Draft requests that don't exist in DB (local only)
  draftRequests: RequestStateInterface[];
  // Unsaved changes for DB requests (id -> partial request with changes)
  unsavedChanges: Record<string, Partial<RequestStateInterface>>;
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
          set({ pendingRestoreWorkspaceId: workspaceId }),

        clearPendingRestore: () => set({ pendingRestoreWorkspaceId: null }),

        getPendingRestore: () => get().pendingRestoreWorkspaceId,

        reset: () =>
          set({
            snapshots: {},
            currentWorkspaceId: null,
            pendingRestoreWorkspaceId: null,
          }),

        createSnapshotFromState: (
          workspaceId,
          requestState,
          sidebarItems,
          activeEnvironmentId
        ) => {
          const { requests, tabIds, draftIds, activeTabId } = requestState;

          // Separate draft requests (local only, type: NEW) from DB requests
          const draftRequests = requests.filter(
            (r) => draftIds.includes(r.id) && r.type === "NEW"
          );

          // Collect unsaved changes for DB requests (not drafts)
          const unsavedChanges: Record<
            string,
            Partial<RequestStateInterface>
          > = {};
          requests.forEach((r) => {
            if (r.unsaved && !draftIds.includes(r.id)) {
              // Store the full request state for unsaved DB requests
              unsavedChanges[r.id] = { ...r };
            }
          });

          return {
            workspaceId,
            tabIds,
            draftIds,
            activeTabId,
            draftRequests,
            unsavedChanges,
            sidebarItems,
            activeEnvironmentId,
            savedAt: Date.now(),
          };
        },

        mergeWithDatabaseRequests: (snapshot, dbRequests) => {
          // Start with DB requests
          const mergedRequests: RequestStateInterface[] = dbRequests.map(
            (dbReq) => {
              // Check if there are unsaved changes for this request
              const unsavedChanges = snapshot.unsavedChanges[dbReq.id];
              if (unsavedChanges) {
                return {
                  ...dbReq,
                  ...unsavedChanges,
                  unsaved: true,
                };
              }
              return { ...dbReq, unsaved: false };
            }
          );

          // Add draft requests that don't exist in DB
          snapshot.draftRequests.forEach((draftReq) => {
            if (!mergedRequests.find((r) => r.id === draftReq.id)) {
              mergedRequests.push(draftReq);
            }
          });

          // Filter tabIds to only include valid requests (in merged list)
          const validRequestIds = new Set(mergedRequests.map((r) => r.id));
          const validTabIds = snapshot.tabIds.filter((id) =>
            validRequestIds.has(id)
          );
          const validDraftIds = snapshot.draftIds.filter((id) =>
            validRequestIds.has(id)
          );

          // Determine active tab - use cached if valid, otherwise first tab or null
          let activeTabId = snapshot.activeTabId;
          if (activeTabId && !validRequestIds.has(activeTabId)) {
            activeTabId = validTabIds[0] || null;
          }

          const activeRequest = activeTabId
            ? mergedRequests.find((r) => r.id === activeTabId) || null
            : null;

          return {
            requests: mergedRequests,
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
