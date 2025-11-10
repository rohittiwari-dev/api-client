import { useCallback } from 'react';
import useWorkspaceStateCache, { WorkspaceStateSnapshot } from '../store/workspace-state-cache';
import useRequestTabsStore from '@/modules/requests/store/tabs.store';
import useRequestStore from '@/modules/requests/store/request.store';
import useSidebarStore from '@/modules/layout/store/sidebar.store';
import useEnvironmentStore from '@/modules/environment/store/environment.store';
import useWorkspaceState from '../store';

/**
 * Hook to manage workspace switching with state preservation
 */
export function useWorkspaceSwitcher() {
    const { saveSnapshot, getSnapshot, setCurrentWorkspaceId, currentWorkspaceId } = useWorkspaceStateCache();
    const { setActiveWorkspace, activeWorkspace } = useWorkspaceState();

    // Tabs store
    const { tabs, activeTab, setTabs, setActiveTab, setActiveTabById } = useRequestTabsStore();

    // Request store
    const { requests, activeRequest, setRequests, setActiveRequest, setActiveRequestById } = useRequestStore();

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
            tabs: tabs,
            activeTabId: activeTab?.id || null,
            requests: requests,
            activeRequestId: activeRequest?.id || null,
            sidebarItems: sidebarItems,
            activeEnvironmentId: activeEnvironmentId,
            savedAt: Date.now(),
        };

        saveSnapshot(snapshot);
    }, [
        currentWorkspaceId,
        tabs,
        activeTab,
        requests,
        activeRequest,
        sidebarItems,
        activeEnvironmentId,
        saveSnapshot,
    ]);

    /**
     * Restore a workspace's state from cache
     */
    const restoreWorkspaceState = useCallback((workspaceId: string) => {
        const snapshot = getSnapshot(workspaceId);

        if (snapshot) {
            // Restore tabs
            setTabs(snapshot.tabs);
            if (snapshot.activeTabId) {
                setActiveTabById(snapshot.activeTabId);
            } else {
                setActiveTab(null);
            }

            // Restore requests
            setRequests(snapshot.requests);
            if (snapshot.activeRequestId) {
                setActiveRequestById(snapshot.activeRequestId);
            } else {
                setActiveRequest(null);
            }

            // Restore sidebar
            setSidebarItems(snapshot.sidebarItems);

            // Restore environment
            if (snapshot.activeEnvironmentId) {
                setActiveEnvironment(snapshot.activeEnvironmentId);
            }
        } else {
            // No cached state - clear stores for fresh workspace
            setTabs([]);
            setActiveTab(null);
            setRequests([]);
            setActiveRequest(null);
            // Sidebar will be populated by the page query
        }
    }, [
        getSnapshot,
        setTabs,
        setActiveTab,
        setActiveTabById,
        setRequests,
        setActiveRequest,
        setActiveRequestById,
        setSidebarItems,
        setActiveEnvironment,
    ]);

    /**
     * Switch to a new workspace, saving current state and restoring target state
     */
    const switchWorkspace = useCallback((targetWorkspace: typeof activeWorkspace) => {
        if (!targetWorkspace) return;

        // Save current workspace state before switching
        saveCurrentWorkspaceState();

        // Update current workspace ID
        setCurrentWorkspaceId(targetWorkspace.id);

        // Set the new active workspace
        setActiveWorkspace(targetWorkspace);

        // Restore target workspace state
        restoreWorkspaceState(targetWorkspace.id);
    }, [
        saveCurrentWorkspaceState,
        setCurrentWorkspaceId,
        setActiveWorkspace,
        restoreWorkspaceState,
    ]);

    /**
     * Initialize workspace state tracking (call on app load)
     */
    const initializeWorkspaceTracking = useCallback((workspaceId: string) => {
        setCurrentWorkspaceId(workspaceId);
    }, [setCurrentWorkspaceId]);

    return {
        switchWorkspace,
        saveCurrentWorkspaceState,
        restoreWorkspaceState,
        initializeWorkspaceTracking,
        currentWorkspaceId,
    };
}
