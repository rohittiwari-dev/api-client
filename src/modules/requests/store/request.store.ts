import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { RequestStateInterface } from "../types/request.types";

export type RequestsStoreState = {
  requests: RequestStateInterface[];
  activeRequestLoading: boolean;
  requestLoading: boolean;
  tabIds: string[];
  draftIds: string[];
  activeRequest: RequestStateInterface | null;
  activeTabId: string | null;
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
  setActiveTabId: (activeTabId: string | null) => void;
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
        draftIds: [],
        activeTabId: null,
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
            const requestInfo = state?.requests.find(
              (r) => r.id === request.id
            );
            return {
              activeTabId: request.id,
              requests: requestInfo
                ? state.requests.map((r) =>
                    r.id === request.id ? { ...r, ...request } : r
                  )
                : [...state.requests, request],
              tabIds: state.tabIds.includes(request.id)
                ? state.tabIds
                : [...state.tabIds, request.id],
              draftIds: state.draftIds.includes(request.id)
                ? state.draftIds
                : requestInfo
                ? [...state.draftIds, request.id]
                : state.draftIds,
              activeRequest: requestInfo
                ? { ...requestInfo, ...request }
                : request,
            };
          });
        },
        getActiveRequest: () => {
          const { requests, activeTabId, activeRequest } = get();
          return activeRequest || requests.find((r) => r.id === activeTabId);
        },
        addRequest: (request) =>
          set((state) => {
            const existingRequest = state.requests.find(
              (r) => r.id === request.id
            );
            if (existingRequest) {
              return {
                requests: state.requests.map((r) =>
                  r.id === request.id ? { ...r, ...request } : r
                ),
                tabIds: state.tabIds.includes(request.id)
                  ? state.tabIds
                  : [...state.tabIds, request.id],
              };
            }
            return {
              requests: [...state.requests, request],
              tabIds: state.tabIds.includes(request.id)
                ? state.tabIds
                : [...state.tabIds, request.id],
            };
          }),
        getState: () => get(),
        removeRequest: (requestId) =>
          set((state) => ({
            requests: state.requests.filter((r) => r.id !== requestId),
            tabIds: state.tabIds.filter((id) => id !== requestId),
            draftIds: state.draftIds.filter((id) => id !== requestId),
            activeTabId:
              state.activeTabId === requestId ? null : state.activeTabId,
            activeRequest:
              state.activeRequest?.id === requestId
                ? null
                : state.activeRequest,
          })),
        updateRequest: (id, request) =>
          set((state) => {
            return {
              requests: state.requests.map((r) =>
                r.id === id ? { ...r, ...request } : r
              ),
              activeRequest:
                state.activeRequest?.id === id
                  ? { ...state.activeRequest, ...request }
                  : state.activeRequest,
            };
          }),
        setActiveTabId: (activeTabId) =>
          set((state) => {
            return {
              activeTabId:
                state.requests?.find((r) => r.id === activeTabId)?.id || null,
              activeRequest:
                state.requests?.find((r) => r.id === activeTabId) || null,
            };
          }),
        getRequestById: (id) => get().requests.find((r) => r.id === id),

        closeTab: (tabId) =>
          set((state) => {
            const isDraft = state.draftIds.includes(tabId);
            return {
              tabIds: state.tabIds.filter((id) => id !== tabId),
              requests: isDraft
                ? state.requests.filter((r) => r.id !== tabId)
                : state.requests,
              draftIds: isDraft
                ? state.draftIds.filter((id) => id !== tabId)
                : state.draftIds,
              activeTabId:
                state.activeTabId === tabId ? null : state.activeTabId,
              activeRequest:
                state.activeRequest?.id === tabId ? null : state.activeRequest,
            };
          }),

        reset: () =>
          set(() => ({
            requests: [],
            tabIds: [],
            activeTabId: null,
            draftIds: [],
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
