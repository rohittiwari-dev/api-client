import { useAuthStore } from "@/modules/authentication/store";
import useSidebarStore from "@/modules/layout/store/sidebar.store";
import useCookieStore from "@/modules/requests/store/cookie.store";
import useRequestStore from "@/modules/requests/store/request.store";
import useRequestTabsStore from "@/modules/requests/store/tabs.store";
import useWorkspaceState from "@/modules/workspace/store";

const useResetStore = () => {
  const { reset: resetAuth } = useAuthStore();
  const { reset: resetWorkspace } = useWorkspaceState();
  const { reset: resetSidebar } = useSidebarStore();
  const { reset: resetCookie } = useCookieStore();
  const { reset: resetRequest, setActiveRequest } = useRequestStore();
  const { reset: resetRequestTabs, setActiveTab } = useRequestTabsStore();

  const resetStores = () => {
    resetAuth();
    resetWorkspace();
    resetSidebar();
    resetCookie();
    resetRequest();
    resetRequestTabs();
  };

  const resetCollectionsRequestsAndCookies = () => {
    resetSidebar();
    resetRequest();
    resetRequestTabs();
    resetCookie();
  };

  const clearActiveRequestTabsStates = () => {
    setActiveRequest(null);
    setActiveTab(null);
  };

  return {
    resetStores,
    resetAuth,
    resetWorkspace,
    resetSidebar,
    resetCookie,
    resetRequest,
    resetRequestTabs,
    resetCollectionsRequestsAndCookies,
    clearActiveRequestTabsStates,
  };
};

export default useResetStore;
