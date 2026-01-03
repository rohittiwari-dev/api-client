import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { RequestStateInterface } from "../types/request.types";

export type RequestsStoreState = {
  requests: RequestStateInterface[];
  activeRequestLoading: boolean;
  requestLoading: boolean;
  tabIds: string[];
  activeRequest: RequestStateInterface | null;
};

type RequestStoreStateActions = {
  setLoading: ({
    activeRequestLoading,
    requestLoading,
  }: {
    activeRequestLoading?: boolean;
    requestLoading?: boolean;
  }) => void;
  addRequest: (request: RequestStateInterface) => void;
  removeRequest: (id: string) => void;
  updateRequest: (id: string, request: Partial<RequestStateInterface>) => void;
  setActiveRequest: (id: string | null) => void;
  getRequestById: (id: string) => RequestStateInterface | null | undefined;
  closeTab: (tabId: string) => void;
  setRequestsState: (state: Partial<RequestsStoreState>) => void;
  getActiveRequest: () => RequestStateInterface | null | undefined;
  getState: () => RequestsStoreState;
  openRequest: (request: RequestStateInterface) => void;
  reset: () => void;
};

const useRequestStore = create<RequestsStoreState & RequestStoreStateActions>()(
  devtools(
    persist(
      (set, get) => ({
        requests: [],
        activeRequestLoading: false,
        requestLoading: false,
        tabIds: [],
        activeRequest: null,
        setRequestsState(incomingState) {
          set((state) => ({ ...state, ...incomingState }));
        },
        setLoading: ({
          activeRequestLoading,
          requestLoading,
        }: {
          activeRequestLoading?: boolean;
          requestLoading?: boolean;
        }) => {
          set((state) => ({
            ...state,
            activeRequestLoading:
              activeRequestLoading ?? state.activeRequestLoading,
            requestLoading: requestLoading ?? state.requestLoading,
          }));
        },
        openRequest: (request) => {
          set((state) => {
            const existingRequest = state.requests.find(
              (r) => r.id === request.id
            );
            return {
              ...state,
              activeRequest: existingRequest
                ? { ...existingRequest, ...request }
                : request,
              requests: existingRequest
                ? state.requests.map((r) =>
                    r.id === request.id ? { ...r, ...request } : r
                  )
                : [...state.requests, request],
              tabIds: state.tabIds.includes(request.id)
                ? state.tabIds
                : [...state.tabIds, request.id],
            };
          });
        },
        getActiveRequest: () => {
          const { activeRequest } = get();
          return activeRequest;
        },
        addRequest: (request) =>
          set((state) => {
            const existingRequest = state.requests.find(
              (r) => r.id === request.id
            );
            if (existingRequest) {
              return {
                ...state,
                requests: state.requests.map((r) =>
                  r.id === request.id ? { ...r, ...request } : r
                ),
              };
            }
            return {
              ...state,
              requests: [...state.requests, request],
            };
          }),
        getState: () => get(),
        removeRequest: (requestId) =>
          set((state) => ({
            ...state,
            requests: state.requests.filter((r) => r.id !== requestId),
            tabIds: state.tabIds.filter((id) => id !== requestId),
            activeRequest:
              state.activeRequest?.id === requestId
                ? null
                : state.activeRequest,
          })),
        updateRequest: (id, request) =>
          set((state) => {
            return {
              ...state,
              requests: state.requests.map((r) =>
                r.id === id ? { ...r, ...request } : r
              ),
              activeRequest:
                state.activeRequest?.id === id
                  ? { ...state.activeRequest, ...request }
                  : state.activeRequest,
            };
          }),
        setActiveRequest: (id) =>
          set((state) => {
            const newActiveRequest =
              state.requests.find((r) => r.id === id) || null;
            return {
              ...state,
              activeRequest: newActiveRequest,
            };
          }),
        getRequestById: (id) => get().requests.find((r) => r.id === id),

        closeTab: (tabId) =>
          set((state) => {
            const isActiveRequest = state.activeRequest?.id === tabId;
            const currentIndex = state.tabIds.indexOf(tabId);

            // Check if the request being closed is of type "NEW" (not persisted to DB)
            const requestToClose = state.requests.find((r) => r.id === tabId);
            const isNewRequest = requestToClose?.type === "NEW";

            // Calculate next active tab if closing the active tab
            let nextActiveRequest: RequestStateInterface | null = null;

            if (isActiveRequest && state.tabIds.length > 1) {
              // Try to select the previous tab, or the next one if closing the first tab
              const nextIndex = currentIndex > 0 ? currentIndex - 1 : 1;
              const nextActiveTabId = state.tabIds[nextIndex] || null;
              nextActiveRequest =
                state.requests.find((r) => r.id === nextActiveTabId) || null;
            } else if (!isActiveRequest) {
              // Keep current active tab
              nextActiveRequest = state.activeRequest;
            }

            return {
              ...state,
              tabIds: state.tabIds.filter((id) => id !== tabId),
              // Remove "NEW" type requests from requests array as they are not persisted
              requests: isNewRequest
                ? state.requests.filter((r) => r.id !== tabId)
                : state.requests,
              activeRequest: nextActiveRequest,
            };
          }),

        reset: () =>
          set((state) => ({
            ...state,
            requests: [],
            tabIds: [],
            requestLoading: false,
            activeRequestLoading: false,
          })),
      }),
      {
        name: "request-storage",
      }
    )
  )
);

export default useRequestStore;
