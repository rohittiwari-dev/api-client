import { getAllCollections } from "@/modules/collections/server/collection.action";
import {
  SidebarCollectionItemInterface,
  SidebarItemInterface,
} from "../store/sidebar.store";
import { NestedCollection } from "@/modules/collections/types/sidebar.types";
import { RequestType } from "@/modules/requests/types/store.types";
import { getAllIndependentRequests } from "@/modules/requests/server/request";
import { HTTPMethod } from "better-auth";

export const getRequestSideBarTree = async (workspaceId: string) => {
  try {
    const requestNestedTree: SidebarItemInterface[] = [];
    const nestedCollections = await getAllCollections(workspaceId);
    const mappedCollections = nestedCollections?.data?.map((collection) => {
      const mapCollection = (col: NestedCollection): SidebarItemInterface => {
        const collectionNode: SidebarCollectionItemInterface = {
          name: col.name,
          type: "COLLECTION" as const,
          id: col.id,
          children: [],
          workspaceId: col.workspaceId,
          parentId: col.parentId,
        };
        if (col.requests && col.requests.length > 0) {
          col.requests.forEach((request) => {
            collectionNode.children.push({
              name: request.name,
              type: request.type,
              method: (request.method as HTTPMethod) || "GET",
              id: request.id,
              path: request.url as string,
              workspaceId: request.workspaceId,
              collectionId: col.id,
            });
          });
        }
        if (col.children && col.children.length > 0) {
          col.children.forEach((child) => {
            collectionNode.children.push(mapCollection(child));
          });
        }
        return collectionNode;
      };

      return mapCollection(collection);
    });
    const independentRequests = await getAllIndependentRequests(workspaceId);
    independentRequests?.data?.forEach((request) => {
      requestNestedTree.push({
        name: request.name,
        type: request.type as RequestType,
        method: (request.method as HTTPMethod) || "GET",
        id: request.id,
        workspaceId: request.workspaceId,
        collectionId: null,
        path: request.url as string,
      });
    });
    return [...(mappedCollections || []), ...requestNestedTree];
  } catch {
    return [];
  }
};
