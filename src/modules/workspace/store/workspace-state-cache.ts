import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RequestTabsStoreState } from '@/modules/requests/store/tabs.store';
import { RequestStateInterface } from '@/modules/requests/types/request.types';
import { SidebarItemInterface } from '@/modules/layout/store/sidebar.store';

/**
 * Snapshot of a workspace's UI state
 */
export interface WorkspaceStateSnapshot {
    workspaceId: string;
    // Tabs state
    tabs: RequestTabsStoreState[];
    activeTabId: string | null;
    // Request state
    requests: RequestStateInterface[];
    activeRequestId: string | null;
    // Sidebar state
    sidebarItems: SidebarItemInterface[];
    // Environment state
    activeEnvironmentId: string | null;
    // Timestamp for debugging
    savedAt: number;
}

interface WorkspaceStateCacheState {
    // Map of workspaceId -> snapshot
    snapshots: Record<string, WorkspaceStateSnapshot>;
    // Currently active workspace ID
    currentWorkspaceId: string | null;
}

interface WorkspaceStateCacheActions {
    /**
     * Save the current state for a workspace before switching away
     */
    saveSnapshot: (snapshot: WorkspaceStateSnapshot) => void;

    /**
     * Get the saved snapshot for a workspace
     */
    getSnapshot: (workspaceId: string) => WorkspaceStateSnapshot | null;

    /**
     * Remove a workspace's snapshot
     */
    removeSnapshot: (workspaceId: string) => void;

    /**
     * Set the current workspace ID
     */
    setCurrentWorkspaceId: (workspaceId: string | null) => void;

    /**
     * Clear all snapshots
     */
    reset: () => void;
}

const useWorkspaceStateCache = create<WorkspaceStateCacheState & WorkspaceStateCacheActions>()(
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

                reset: () =>
                    set({ snapshots: {}, currentWorkspaceId: null }),
            }),
            {
                name: 'workspace-state-cache',
            }
        )
    )
);

export default useWorkspaceStateCache;
