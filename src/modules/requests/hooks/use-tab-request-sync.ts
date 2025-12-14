import { useCallback } from 'react';
import useRequestTabsStore, { RequestTabsStoreState } from '@/modules/requests/store/tabs.store';
import useRequestStore from '@/modules/requests/store/request.store';
import { RequestStateInterface } from '@/modules/requests/types/request.types';

/**
 * Hook to ensure tabs and requests are always in sync
 */
export function useTabRequestSync() {
    const {
        addTab,
        setActiveTabById,
        removeTab,
        replaceTabData,
        tabs,
        activeTab,
    } = useRequestTabsStore();

    const {
        addRequest,
        setActiveRequestById,
        removeRequest,
        updateRequest,
        requests,
        activeRequest,
    } = useRequestStore();

    /**
     * Open a request - syncs both tab and request stores
     */
    const openRequest = useCallback((
        tab: RequestTabsStoreState,
        request: RequestStateInterface
    ) => {
        // Add to both stores atomically
        addTab(tab);
        addRequest(request);
    }, [addTab, addRequest]);

    /**
     * Set active item by ID - syncs both stores
     */
    const setActiveById = useCallback((id: string) => {
        setActiveTabById(id);
        setActiveRequestById(id);
    }, [setActiveTabById, setActiveRequestById]);

    /**
     * Close a tab/request - removes from both stores
     */
    const closeItem = useCallback((id: string) => {
        removeTab(id);
        removeRequest(id);
    }, [removeTab, removeRequest]);

    /**
     * Update item data - updates both stores
     */
    const updateItem = useCallback((
        id: string,
        tabUpdates: Partial<RequestTabsStoreState>,
        requestUpdates: Partial<RequestStateInterface>
    ) => {
        if (Object.keys(tabUpdates).length > 0) {
            replaceTabData(id, tabUpdates);
        }
        if (Object.keys(requestUpdates).length > 0) {
            updateRequest(id, requestUpdates);
        }
    }, [replaceTabData, updateRequest]);

    /**
     * Check if tabs and requests are in sync
     */
    const checkSync = useCallback(() => {
        const tabIds = new Set(tabs.map(t => t.id));
        const requestIds = new Set(requests.map(r => r.id));

        const missingInRequests = tabs.filter(t => !requestIds.has(t.id));
        const missingInTabs = requests.filter(r => !tabIds.has(r.id));

        const activeInSync = activeTab?.id === activeRequest?.id;

        return {
            inSync: missingInRequests.length === 0 && missingInTabs.length === 0 && activeInSync,
            missingInRequests,
            missingInTabs,
            activeInSync,
        };
    }, [tabs, requests, activeTab, activeRequest]);

    /**
     * Force sync - ensures activeTab and activeRequest match
     */
    const forceSync = useCallback(() => {
        if (activeTab && activeRequest?.id !== activeTab.id) {
            setActiveRequestById(activeTab.id);
        } else if (activeRequest && activeTab?.id !== activeRequest.id) {
            setActiveTabById(activeRequest.id);
        }
    }, [activeTab, activeRequest, setActiveRequestById, setActiveTabById]);

    return {
        openRequest,
        setActiveById,
        closeItem,
        updateItem,
        checkSync,
        forceSync,
        // Pass through for direct access
        tabs,
        requests,
        activeTab,
        activeRequest,
    };
}
