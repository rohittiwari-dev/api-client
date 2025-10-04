import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Request } from '@/generated/prisma';

export type RequestsStoreState = {
	requests: Request[];
	activeRequest: Request | null;
	activeRequestLoading: boolean;
	requestLoading: boolean;
};

type RequestStoreStateActions = {
	setActiveRequestLoading: (loading: boolean) => void;
	setRequestLoading: (loading: boolean) => void;
	setRequests: (requests: Request[]) => void;
	setActiveRequest: (request: Request | null) => void;
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
			}),
			{
				name: 'request-storage',
			},
		),
	),
);

export default useRequestStore;
