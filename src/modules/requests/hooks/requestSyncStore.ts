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
    });
  };

  const closeOtherTabs = (tabId: string) => {
    setRequestsState({
      tabIds: tabIds.filter((id) => id !== tabId),
      draftIds: draftIds.filter((id) => id !== tabId),
      activeTabId: null,
      activeRequest:
        requests.find(
          (r) => r.id === tabId && r.workspaceId === activeWorkspace?.id
        ) || null,
      requests: requests.filter((r) => !draftIds.includes(r.id)),
    });
  };

  const closeAllDrafts = () => {
    setRequestsState({
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
