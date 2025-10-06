import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Request } from '@/generated/prisma';

export type RequestsStoreState = {
	requests: (Request & { isSaved: boolean })[];
	activeRequest: (Request & { isSaved: boolean }) | null;
	activeRequestLoading: boolean;
	requestLoading: boolean;
};

type RequestStoreStateActions = {
	setActiveRequestLoading: (loading: boolean) => void;
	setRequestLoading: (loading: boolean) => void;
	setRequests: (requests: (Request & { isSaved: boolean })[]) => void;
	setActiveRequest: (
		request: (Request & { isSaved: boolean }) | null,
	) => void;
	setActiveRequestById: (id: string) => void;
	updateRequest: (
		id: string,
		request: Partial<Request & { isSaved: boolean }>,
	) => void;
	addRequest: (request: Request & { isSaved: boolean }) => void;
	removeRequest: (id: string) => void;
	clearRequests: () => void;
};

const useRequestStore = create<RequestsStoreState & RequestStoreStateActions>()(
	devtools(
		persist(
			(set) => ({
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
						activeRequest:
							state.requests.find((req) => req.id === id) || null,
					})),
				updateRequest: (id, request) =>
					set((state) => ({
						requests: state.requests.map((req) =>
							req.id === id ? { ...req, ...request } : req,
						),
						activeRequest:
							state.activeRequest?.id === id
								? { ...state.activeRequest, ...request }
								: state.activeRequest,
					})),
				addRequest: (request) =>
					set((state) => ({
						requests: [...state.requests, request],
						activeRequest: request,
					})),
				removeRequest: (id) =>
					set((state) => ({
						requests: state.requests.filter((req) => req.id !== id),
						activeRequest:
							state.activeRequest?.id === id
								? null
								: state.activeRequest,
					})),
				clearRequests: () => set({ requests: [], activeRequest: null }),
			}),
			{
				name: 'request-storage',
			},
		),
	),
);

export default useRequestStore;
