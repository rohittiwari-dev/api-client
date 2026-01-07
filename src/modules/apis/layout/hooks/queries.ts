import { SidebarItemInterface } from "@/modules/apis/layout/store/sidebar.store";
import { useQuery } from "@tanstack/react-query";
import { getRequestSideBarTree } from "../server/sidebar.actions";

export function useRequestSideBarTree(
  workspaceId: string,
  initialData?: SidebarItemInterface[]
) {
  return useQuery({
    queryKey: ["requests-side-bar-tree", workspaceId],
    initialData,
    queryFn: async () => await getRequestSideBarTree(workspaceId),
  });
}
