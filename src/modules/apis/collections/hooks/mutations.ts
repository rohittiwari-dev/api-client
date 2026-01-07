import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  moveCollectionAction,
  reorderCollectionsAction,
  reorderRequestsAction,
} from "../server/collection.action";
import { moveRequestToCollectionAction } from "@/modules/apis/requests/actions";
import useSidebarStore from "@/modules/apis/layout/store/sidebar.store";

/**
 * Hook for moving a collection to a new parent
 */
export function useMoveCollection(
  workspaceId: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {}
) {
  const queryClient = useQueryClient();
  const moveItem = useSidebarStore((s) => s.moveItem);

  return useMutation({
    mutationFn: async ({
      collectionId,
      newParentId,
      sortOrder,
    }: {
      collectionId: string;
      newParentId: string | null;
      sortOrder?: number;
    }) => moveCollectionAction(collectionId, newParentId, sortOrder),
    onMutate: async ({ collectionId, newParentId }) => {
      // Optimistically move collection in sidebar
      moveItem(collectionId, newParentId);
    },
    onError: (error) => {
      onError?.(error);
      // Refresh to restore correct state on error
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

/**
 * Hook for reordering collections within a parent
 */
export function useReorderCollections(
  workspaceId: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {}
) {
  const queryClient = useQueryClient();
  const reorderItems = useSidebarStore((s) => s.reorderItems);

  return useMutation({
    mutationFn: async ({
      orderedIds,
      parentId,
    }: {
      orderedIds: string[];
      parentId: string | null;
    }) => reorderCollectionsAction(orderedIds),
    onMutate: async ({ orderedIds, parentId }) => {
      // Optimistically reorder collections in sidebar
      reorderItems(orderedIds, parentId, "COLLECTION");
    },
    onError: (error) => {
      onError?.(error);
      // Refresh to restore correct state on error
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

/**
 * Hook for reordering requests within a collection
 */
export function useReorderRequests(
  workspaceId: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {}
) {
  const queryClient = useQueryClient();
  const reorderItems = useSidebarStore((s) => s.reorderItems);

  return useMutation({
    mutationFn: async ({
      orderedIds,
      parentId,
    }: {
      orderedIds: string[];
      parentId: string | null;
    }) => reorderRequestsAction(orderedIds),
    onMutate: async ({ orderedIds, parentId }) => {
      // Optimistically reorder requests in sidebar
      reorderItems(orderedIds, parentId, "REQUEST");
    },
    onError: (error) => {
      onError?.(error);
      // Refresh to restore correct state on error
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

/**
 * Hook for moving a request to a different collection
 */
export function useMoveRequest(
  workspaceId: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {}
) {
  const queryClient = useQueryClient();
  const moveItem = useSidebarStore((s) => s.moveItem);

  return useMutation({
    mutationFn: async ({
      requestId,
      collectionId,
    }: {
      requestId: string;
      collectionId: string | null;
    }) => moveRequestToCollectionAction(requestId, collectionId),
    onMutate: async ({ requestId, collectionId }) => {
      // Optimistically move request in sidebar
      moveItem(requestId, collectionId);
    },
    onError: (error) => {
      onError?.(error);
      // Refresh to restore correct state on error
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}
