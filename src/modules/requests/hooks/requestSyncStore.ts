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

  const tabs = requests.filter(
    (r) => tabIds.includes(r.id) && r.workspaceId === activeWorkspace?.id
  );

  const closeAllTabs = () => {
    setRequestsState({
      tabIds: [],
      activeRequest: null,
    });
  };

  const closeOtherTabs = (tabId: string) => {
    const targetRequest = requests.find(
      (r) => r.id === tabId && r.workspaceId === activeWorkspace?.id
    );

    setRequestsState({
      tabIds: [tabId],
      activeRequest: targetRequest || null,
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
