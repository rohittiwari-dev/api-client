import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollectionAction,
  deleteCollectionAction,
  getAllCollections,
  getAllCollectionsOnLevelOne,
  renameCollectionAction,
} from "../server/collection.action";
import { NestedCollection } from "../types/sidebar.types";

export function useCollectionsOnTopLevel(workspaceId: string) {
  return useQuery({
    queryKey: ["collections-top-level", workspaceId],
    queryFn: async () => getAllCollectionsOnLevelOne(workspaceId),
  });
}

export function useCollections(
  workspaceId: string,
  initialData?: NestedCollection[]
) {
  return useQuery<NestedCollection[]>({
    queryKey: ["collections", workspaceId],
    queryFn: async () => {
      const { data } = await getAllCollections(workspaceId);
      if (!data) throw new Error("Failed to fetch collections");
      return data;
    },
    initialData,
  });
}

export function useCreateCollection(
  workspaceId: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      parentId,
    }: {
      name: string;
      parentId?: string;
    }) => createCollectionAction(name, workspaceId, parentId),
    onError: (error) => {
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["collections", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections-top-level", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

export function useDeleteCollection(
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

  return useMutation({
    mutationFn: async (collectionId: string) =>
      deleteCollectionAction(collectionId),
    onMutate: async (collectionId) => {
      // Cancel refetches
      await queryClient.cancelQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });

      // Snapshot previous value
      const previousSidebarTree = queryClient.getQueryData([
        "requests-side-bar-tree",
        workspaceId,
      ]);

      // Helper to remove collection from tree (deep)
      const removeFromTree = (items: any[]): any[] => {
        return items
          .filter((item) => item.id !== collectionId)
          .map((item) => {
            if (item.type === "COLLECTION" && item.children) {
              return { ...item, children: removeFromTree(item.children) };
            }
            return item;
          });
      };

      // Optimistically remove from sidebar cache
      queryClient.setQueryData(
        ["requests-side-bar-tree", workspaceId],
        (old: any[] | undefined) => (old ? removeFromTree(old) : old)
      );

      return { previousSidebarTree };
    },
    onError: (error, collectionId, context) => {
      // Rollback sidebar cache
      if (context?.previousSidebarTree) {
        queryClient.setQueryData(
          ["requests-side-bar-tree", workspaceId],
          context.previousSidebarTree
        );
      }
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections-top-level"],
      });
    },
  });
}

export function useRenameCollection(
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

  return useMutation({
    mutationFn: async ({
      collectionId,
      name,
    }: {
      collectionId: string;
      name: string;
    }) => renameCollectionAction(collectionId, name),
    onMutate: async ({ collectionId, name }) => {
      // Cancel refetches
      await queryClient.cancelQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });

      // Snapshot previous value
      const previousSidebarTree = queryClient.getQueryData([
        "requests-side-bar-tree",
        workspaceId,
      ]);

      // Helper to update name in tree (deep)
      const updateNameInTree = (items: any[]): any[] => {
        return items.map((item) => {
          if (item.id === collectionId) {
            return { ...item, name };
          }
          if (item.type === "COLLECTION" && item.children) {
            return { ...item, children: updateNameInTree(item.children) };
          }
          return item;
        });
      };

      // Optimistically update sidebar cache
      queryClient.setQueryData(
        ["requests-side-bar-tree", workspaceId],
        (old: any[] | undefined) => (old ? updateNameInTree(old) : old)
      );

      return { previousSidebarTree };
    },
    onError: (error, variables, context) => {
      // Rollback sidebar cache
      if (context?.previousSidebarTree) {
        queryClient.setQueryData(
          ["requests-side-bar-tree", workspaceId],
          context.previousSidebarTree
        );
      }
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections-top-level"],
      });
    },
  });
}
