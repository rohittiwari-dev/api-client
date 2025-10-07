import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { HttpMethod } from '@/generated/prisma';
import { RequestType } from '../types/store.types';

export type RequestTabsStoreState = {
	id: string;
	title: string;
	type: RequestType | 'NEW';
	method?: HttpMethod | null;
	collectionId?: string | null;
	isSaved?: boolean;
};
type RequestTabsStore = {
	tabs: RequestTabsStoreState[];
	activeTab: RequestTabsStoreState | null;
	addTab: (tab: RequestTabsStoreState) => void;
	removeTab: (id: string) => void;
	setActiveTab: (tab: RequestTabsStoreState) => void;
	setActiveTabById: (id: string) => void;
	setTabs: (tabs: RequestTabsStoreState[]) => void;
	replaceTabData: (
		id: string,
		newData: Partial<RequestTabsStoreState>,
	) => void;
	setCollectionId: (id: string | null, requestId: string | null) => void;
};

const useRequestTabsStore = create<RequestTabsStore>()(
	devtools(
		persist(
			(set) => ({
				tabs: [],
				activeTab: null,
				isSaved: false,
				collectionId: null,
				addTab: (tab) =>
					set((state) => {
						const existingTabIndex = state.tabs.findIndex(
							(t) => t.id === tab.id,
						);
						const tabs =
							existingTabIndex !== -1
								? state.tabs
								: state.tabs.length >= 10
									? [tab, ...state.tabs.slice(0, 9)]
									: [...state.tabs, tab];
						return { tabs: tabs, activeTab: tab };
					}),
				removeTab: (id) =>
					set((state) => ({
						tabs: state.tabs.filter((tab) => tab.id !== id),
						activeTab:
							state.activeTab?.id === id
								? state.tabs.filter((tab) => tab.id !== id)[0]
								: state.activeTab,
					})),
				setActiveTab: (tab) =>
					set(() => ({
						activeTab: tab,
					})),
				setActiveTabById: (id) =>
					set((state) => ({
						activeTab:
							state.tabs.find((tab) => tab.id === id) || null,
					})),
				setTabs: (tabs) =>
					set(() => ({
						tabs,
						activeTab: tabs[0] || null,
					})),
				replaceTabData: (id, newData) =>
					set((state) => ({
						tabs: state.tabs.map((tab) => {
							if (tab.id === id) {
								return { ...tab, ...newData };
							}
							return tab;
						}),
						activeTab:
							state.activeTab?.id === id
								? { ...state.activeTab, ...newData }
								: state.activeTab,
					})),
				setCollectionId: (collection_id, requestId) =>
					set((state) => ({
						tabs: state.tabs.map((tab) => {
							if (tab.id === requestId) {
								return { ...tab, collection_id };
							}
							return tab;
						}),
						activeTab:
							state.activeTab?.id === requestId
								? { ...state.activeTab, collection_id }
								: state.activeTab,
					})),
			}),
			{
				name: 'request-tabs',
			},
		),
	),
);

export default useRequestTabsStore;
