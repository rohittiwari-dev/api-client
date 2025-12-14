import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRequestAction,
  deleteRequestAction,
  renameRequestAction,
  upsertRequestAction,
  moveRequestToCollectionAction,
  duplicateRequestAction,
} from "../actions";
import {
  BodyType,
  HttpMethod,
  RequestType,
  Request,
} from "@/generated/prisma/client";
import { createId } from "@paralleldrive/cuid2";
import useSidebarStore, {
  SidebarItemInterface,
} from "@/modules/layout/store/sidebar.store";
import { getAllRequests } from "../server/request";
import useRequestStore from "../store/request.store";

export function useCreateRequest(
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
    }) => createRequestAction(name, workspaceId, parentId),
    onError: (error) => {
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-top-level", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

export function useDeleteRequest(
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
    mutationFn: async (requestId: string) => deleteRequestAction(requestId),
    onError: (error) => {
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-top-level", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

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

  return useMutation({
    mutationFn: async ({
      requestId,
      collectionId,
    }: {
      requestId: string;
      collectionId: string | null;
    }) => moveRequestToCollectionAction(requestId, collectionId),
    onError: (error) => {
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-top-level", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

export function useRenameRequest(
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
      requestId,
      name,
    }: {
      requestId: string;
      name: string;
    }) => renameRequestAction(requestId, name),
    onError: (error) => {
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-top-level", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

/**
 * Hook for saving (upserting) a request with automatic query invalidation
 */
export function useUpsertRequest(
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
    mutationFn: async (data: {
      requestId: string;
      name: string;
      url: string;
      workspaceId: string;
      collectionId?: string | null;
      type: "API" | "WEBSOCKET" | "SOCKET_IO";
      method?: HttpMethod | null;
      headers?: any[];
      parameters?: any[];
      body?: any;
      auth?: any;
      bodyType?: BodyType | null;
      savedMessages?: any[];
    }) =>
      upsertRequestAction(data.requestId, {
        name: data.name,
        url: data.url,
        workspaceId: data.workspaceId,
        collectionId: data.collectionId,
        type: data.type,
        method: data.method,
        headers: data.headers,
        parameters: data.parameters,
        body: data.body,
        auth: data.auth,
        bodyType: data.bodyType,
        savedMessages: data.savedMessages,
      }),
    onError: (error) => {
      onError?.(error);
    },
    onSuccess: () => {
      onSuccess?.();
      // Invalidate all relevant queries to refresh the sidebar
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-top-level", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });
    },
  });
}

/**
 * Hook for duplicating a request with automatic query invalidation
 */
export function useDuplicateRequest(
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
    mutationFn: async (originalRequest: any) =>
      duplicateRequestAction(originalRequest.requestId),
    onMutate: async (originalRequest) => {
      // Cancel refetches
      await queryClient.cancelQueries({
        queryKey: ["requests-side-bar-tree", workspaceId],
      });

      const tempId = createId();
      const optimisticName = `${originalRequest.requestName} (Copy)`;

      // Optimistic Sidebar Item
      const optimisticSidebarItem: SidebarItemInterface = {
        id: tempId,
        name: optimisticName,
        type: originalRequest.type,
        method: originalRequest.method || "GET",
        workspaceId,
        collectionId: originalRequest.collectionId || null,
        path: "", // Path isn't crucial for immediate sidebar display
      };

      const optimisticRequestItem: any = {
        // Using any temporarily to bypass strict Prisma type checks for optimistic UI
        id: tempId,
        name: optimisticName,
        type: originalRequest.type as RequestType,
        method: (originalRequest.method as HttpMethod) || "GET",
        url: originalRequest.url || "",
        headers: [],
        parameters: [],
        body: {
          raw: "",
          formData: [],
          urlEncoded: [],
          file: null,
          json: null,
        },
        auth: { type: "NONE" },
        bodyType: "NONE",
        workspaceId,
        collectionId: originalRequest.collectionId || null,
        unsaved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        sortOrder: 0,
        description: null,
        messageType: originalRequest.type !== "API" ? "CONNECTION" : null,
        savedMessages: [],
      };

      // 1. Add to Sidebar Store immediately
      useSidebarStore
        .getState()
        .addItem(optimisticSidebarItem, originalRequest.collectionId);

      // 2. Add to Request Store
      useRequestStore.getState().addRequest(optimisticRequestItem);

      return { tempId, collectionId: originalRequest.collectionId };
    },
    onError: (error, variables, context) => {
      onError?.(error);
      if (context?.tempId) {
        useSidebarStore.getState().removeItem(context.tempId);
        useRequestStore.getState().removeRequest(context.tempId);
      }
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.();

      if (context?.tempId) {
        // Remove optimistic item and add real item
        useSidebarStore.getState().removeItem(context.tempId);
        useRequestStore.getState().removeRequest(context.tempId);

        // Transform server response to Sidebar Item
        const realSidebarItem: SidebarItemInterface = {
          id: data.id,
          name: data.name,
          type: data.type as RequestType,
          method: (data.method as HttpMethod) || null,
          workspaceId: data.workspaceId,
          collectionId: data.collectionId,
          path: "",
        };

        // Add real item to Sidebar Store
        useSidebarStore.getState().addItem(realSidebarItem, data.collectionId);

        // Helper to add to request store if needed (optional since we might fetch on click)
        // But good for consistency
        // @ts-ignore
        useRequestStore.getState().addRequest({
          ...data,
          headers: data.headers as any[],
          parameters: data.parameters as any[],
          body: data.body as any,
          auth: data.auth as any,
          savedMessages: data.savedMessages as any[],
          unsaved: false,
        });
      }

      // Soft refresh other lists, but NOT the tree to avoid shake
      queryClient.invalidateQueries({
        queryKey: ["requests", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests-top-level", workspaceId],
      });
    },
  });
}

export function useFetchAllRequests(
  workspaceId: string,
  initialData: Request[]
) {
  return useQuery({
    queryKey: ["requests", workspaceId],
    queryFn: () => getAllRequests(workspaceId),
    initialData,
  });
}
