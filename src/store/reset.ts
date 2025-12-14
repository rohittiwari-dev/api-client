import { useAuthStore } from "@/modules/authentication/store";
import useSidebarStore from "@/modules/layout/store/sidebar.store";
import useCookieStore from "@/modules/requests/store/cookie.store";
import useRequestStore from "@/modules/requests/store/request.store";
import useWorkspaceState from "@/modules/workspace/store";

const useResetStore = () => {
  const { reset: resetAuth } = useAuthStore();
  const { reset: resetWorkspace } = useWorkspaceState();
  const { reset: resetSidebar } = useSidebarStore();
  const { reset: resetCookie } = useCookieStore();
  const { reset: resetRequest } = useRequestStore();

  const resetStores = () => {
    resetAuth();
    resetWorkspace();
    resetSidebar();
    resetCookie();
    resetRequest();
  };

  const resetCollectionsRequestsAndCookies = () => {
    resetSidebar();
    resetRequest();
    resetCookie();
  };

  return {
    resetStores,
    resetAuth,
    resetWorkspace,
    resetSidebar,
    resetCookie,
    resetRequest,
    resetCollectionsRequestsAndCookies,
  };
};

export default useResetStore;
