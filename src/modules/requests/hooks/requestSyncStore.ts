import useWorkspaceState from "@/modules/workspace/store";
import useRequestStore from "../store/request.store";

const useRequestSyncStoreState = () => {
  const { activeWorkspace } = useWorkspaceState();
  const {
    requests,
    activeTabId,
    activeRequestLoading,
    draftIds,
    getState,
    requestLoading,
    setRequestsState,
    activeRequest,
    tabIds,
    ...rest
  } = useRequestStore();

  const tabs = requests.filter(
    (r) => tabIds.includes(r.id) && r.workspaceId === activeWorkspace?.id
  );

  const closeAllTabs = () => {
    setRequestsState({
      tabIds: [],
      draftIds: [],
      activeTabId: null,
      activeRequest: null,
      // Remove all draft requests from the requests array
      requests: requests.filter((r) => !draftIds.includes(r.id)),
    });
  };

  const closeOtherTabs = (tabId: string) => {
    const targetRequest = requests.find(
      (r) => r.id === tabId && r.workspaceId === activeWorkspace?.id
    );
    // Keep only the specified tab, close all others
    // Drafts that are not the target tab should be removed from requests
    const otherDraftIds = draftIds.filter((id) => id !== tabId);

    setRequestsState({
      tabIds: [tabId], // Keep only this tab
      draftIds: draftIds.includes(tabId) ? [tabId] : [], // Keep draft status only for target
      activeTabId: tabId,
      activeRequest: targetRequest || null,
      // Remove other drafts from requests array
      requests: requests.filter((r) => !otherDraftIds.includes(r.id)),
    });
  };

  const closeAllDrafts = () => {
    setRequestsState({
      tabIds: tabIds.filter((id) => !draftIds.includes(id)),
      draftIds: [],
      activeTabId: draftIds?.includes(activeTabId || "") ? null : activeTabId,
      activeRequest: draftIds?.includes(activeRequest?.id || "")
        ? null
        : activeRequest,
      requests: requests.filter((r) => !draftIds.includes(r.id)),
    });
  };

  return {
    requests,
    activeRequest,
    tabs,
    activeTabId,
    activeRequestLoading,
    draftIds,
    getState,
    setRequestsState,
    requestLoading,
    tabIds,
    closeAllTabs,
    closeOtherTabs,
    closeAllDrafts,
    activeWorkspace,
    ...rest,
  };
};

export default useRequestSyncStoreState;
