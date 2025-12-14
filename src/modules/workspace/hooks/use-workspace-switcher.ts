import { useCallback } from "react";
import useWorkspaceStateCache, {
  WorkspaceStateSnapshot,
} from "../store/workspace-state-cache";
import useSidebarStore from "@/modules/layout/store/sidebar.store";
import useEnvironmentStore from "@/modules/environment/store/environment.store";
import useWorkspaceState from "../store";
import useRequestSyncStoreState from "@/modules/requests/hooks/requestSyncStore";

/**
 * Hook to manage workspace switching with state preservation
 */
export function useWorkspaceSwitcher() {
  const {
    saveSnapshot,
    getSnapshot,
    setCurrentWorkspaceId,
    currentWorkspaceId,
  } = useWorkspaceStateCache();
  const { setActiveWorkspace, activeWorkspace } = useWorkspaceState();

  // Request store (Unified)
  const { setRequestsState, getState } = useRequestSyncStoreState();

  // Sidebar store
  const { items: sidebarItems, setItems: setSidebarItems } = useSidebarStore();

  // Environment store
  const { activeEnvironmentId, setActiveEnvironment } = useEnvironmentStore();

  /**
   * Save the current workspace state to cache
   */
  const saveCurrentWorkspaceState = useCallback(() => {
    if (!currentWorkspaceId) return;

    const snapshot: WorkspaceStateSnapshot = {
      workspaceId: currentWorkspaceId,
      requestState: getState(),
      sidebarItems: sidebarItems,
      activeEnvironmentId: activeEnvironmentId,
      savedAt: Date.now(),
    };

    saveSnapshot(snapshot);
  }, [
    currentWorkspaceId,
    getState,
    sidebarItems,
    activeEnvironmentId,
    saveSnapshot,
  ]);

  /**
   * Restore a workspace's state from cache
   */
  const restoreWorkspaceState = useCallback(
    (workspaceId: string) => {
      const snapshot = getSnapshot(workspaceId);

      if (snapshot) {
        // Restore tabs
        setRequestsState(snapshot.requestState);
        // Restore sidebar
        setSidebarItems(snapshot.sidebarItems);

        // Restore environment
        if (snapshot.activeEnvironmentId) {
          setActiveEnvironment(snapshot.activeEnvironmentId);
        }
      } else {
        // No cached state - clear stores for fresh workspace
        setRequestsState({
          requests: [],
          tabIds: [],
          activeTabId: null,
          draftIds: [],
          requestLoading: false,
          activeRequestLoading: false,
        });
        // Sidebar will be populated by the page query
      }
    },
    [getSnapshot, setRequestsState, setSidebarItems, setActiveEnvironment]
  );

  /**
   * Switch to a new workspace, saving current state and restoring target state
   */
  const switchWorkspace = useCallback(
    (targetWorkspace: typeof activeWorkspace) => {
      if (!targetWorkspace) return;

      // Save current workspace state before switching
      saveCurrentWorkspaceState();

      // Update current workspace ID
      setCurrentWorkspaceId(targetWorkspace.id);

      // Set the new active workspace
      setActiveWorkspace(targetWorkspace);

      // Restore target workspace state
      restoreWorkspaceState(targetWorkspace.id);
    },
    [
      saveCurrentWorkspaceState,
      setCurrentWorkspaceId,
      setActiveWorkspace,
      restoreWorkspaceState,
    ]
  );

  /**
   * Initialize workspace state tracking (call on app load)
   */
  const initializeWorkspaceTracking = useCallback(
    (workspaceId: string) => {
      setCurrentWorkspaceId(workspaceId);
    },
    [setCurrentWorkspaceId]
  );

  return {
    switchWorkspace,
    saveCurrentWorkspaceState,
    restoreWorkspaceState,
    initializeWorkspaceTracking,
    currentWorkspaceId,
  };
}
