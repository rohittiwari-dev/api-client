import useWorkspaceState from "@/modules/workspace/store";
import useRequestStore from "../store/request.store";

const useRequestSyncStoreState = () => {
  const { activeWorkspace } = useWorkspaceState();
  const {
    requests,
    activeRequestLoading,
    getState,
    requestLoading,
    setRequestsState,
    activeRequest,
    tabIds,
    setActiveRequest, // Added setActiveRequest
    ...rest
  } = useRequestStore();

  const tabs = requests
    .filter(
      (r) => tabIds.includes(r.id) && r.workspaceId === activeWorkspace?.id
    )
    .sort((a, b) => tabIds.indexOf(a.id) - tabIds.indexOf(b.id));

  const closeAllTabs = () => {
    // Only remove unsaved/NEW requests when closing tabs
    // Keep saved requests in store for listings (empty state, command palette, etc.)
    const requestsToRemove = tabs
      .filter((t) => t.type === "NEW" || t.unsaved)
      .map((t) => t.id);

    setRequestsState({
      tabIds: [],
      activeRequest: null,
      requests: requests.filter((r) => !requestsToRemove.includes(r.id)),
    });
  };

  const closeOtherTabs = (tabId: string) => {
    const targetRequest = requests.find(
      (r) => r.id === tabId && r.workspaceId === activeWorkspace?.id
    );

    // Only remove unsaved/NEW requests when closing tabs
    const requestsToRemove = tabs
      .filter((t) => t.id !== tabId && (t.type === "NEW" || t.unsaved))
      .map((t) => t.id);

    setRequestsState({
      tabIds: [tabId],
      activeRequest: targetRequest || null,
      requests: requests.filter((r) => !requestsToRemove.includes(r.id)),
    });
  };

  return {
    requests,
    activeRequest,
    tabs,
    getState,
    setRequestsState,
    requestLoading,
    tabIds,
    setActiveRequest,
    closeAllTabs,
    closeOtherTabs,
    activeWorkspace,
    ...rest,
  };
};

export default useRequestSyncStoreState;
