import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { RequestStateInterface } from "../types/request.types";

export type RequestsStoreState = {
  requests: RequestStateInterface[];
  activeRequest: RequestStateInterface | null;
  activeRequestLoading: boolean;
  requestLoading: boolean;
};

type RequestStoreStateActions = {
  setActiveRequestLoading: (loading: boolean) => void;
  setRequestLoading: (loading: boolean) => void;
  setRequests: (requests: RequestStateInterface[]) => void;
  setActiveRequest: (request: RequestStateInterface | null) => void;
  setActiveRequestById: (id: string) => void;
  updateRequest: (id: string, request: Partial<RequestStateInterface>) => void;
  addRequest: (request: RequestStateInterface) => void;
  removeRequest: (id: string) => void;
  clearRequests: () => void;
  getRequestById: (id: string) => RequestStateInterface | null;
  reset: () => void;
};

const useRequestStore = create<RequestsStoreState & RequestStoreStateActions>()(
  devtools(
    persist(
      (set, get) => ({
        requests: [],
        activeRequest: null,
        activeRequestLoading: false,
        requestLoading: false,
        setRequests: (requests) => set({ requests }),
        setActiveRequest: (activeRequest) => set({ activeRequest }),
        setActiveRequestLoading: (activeRequestLoading) =>
          set({ activeRequestLoading }),
        setRequestLoading: (requestLoading) => set({ requestLoading }),
        setActiveRequestById: (id) =>
          set((state) => ({
            activeRequest: state.requests.find((req) => req.id === id) || null,
          })),
        updateRequest: (id, request) =>
          set((state) => ({
            requests: state.requests.map((req) => {
              if (req.id === id) {
                return { ...req, ...request };
              } else {
                return req;
              }
            }),
            activeRequest:
              state.activeRequest?.id === id
                ? { ...state.activeRequest, ...request }
                : state.activeRequest,
          })),
        addRequest: (request) =>
          set((state) => {
            if (state.requests.some((req) => req.id === request.id)) {
              return {
                requests: state.requests,
                activeRequest: state.requests.find(
                  (req) => req.id === request.id
                ),
              };
            }
            return {
              requests: [...state.requests, request],
              activeRequest: request,
            };
          }),
        removeRequest: (id) =>
          set((state) => ({
            requests: state.requests.filter((req) => req.id !== id),
            activeRequest:
              state.activeRequest?.id === id ? null : state.activeRequest,
          })),
        clearRequests: () => set({ requests: [], activeRequest: null }),
        getRequestById: (id) => {
          const request = get().requests.find((req) => req.id === id) || null;
          return request;
        },
        reset: () => set({ requests: [], activeRequest: null }),
      }),
      {
        name: "request-storage",
      }
    )
  )
);

export default useRequestStore;
