import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RequestMethod, RequestType } from '../types';

export type RequestTabsStoreState = {
	id: string;
	title: string;
	type: RequestType;
	method?: RequestMethod;
};
type RequestTabsStore = {
	tabs: RequestTabsStoreState[];
	activeTab: RequestTabsStoreState | null;
	addTab: (tab: RequestTabsStoreState) => void;
	removeTab: (id: string) => void;
	setActiveTab: (tab: RequestTabsStoreState) => void;
	setActiveTabById: (id: string) => void;
	setTabs: (tabs: RequestTabsStoreState[]) => void;
	reorderTabs: (startIndex: number, endIndex: number) => void;
};

const useRequestTabsStore = create<RequestTabsStore>()(
	devtools(
		persist(
			(set) => ({
				tabs: [],
				activeTab: null,
				addTab: (tab) =>
					set((state) => {
						const tabs =
							state.tabs.length >= 10
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
				reorderTabs: (startIndex, endIndex) =>
					set((state) => {
						const result = Array.from(state.tabs);
						const [removed] = result.splice(startIndex, 1);
						result.splice(endIndex, 0, removed);
						return { tabs: result };
					}),
			}),
			{
				name: 'request-tabs',
			},
		),
	),
);

export default useRequestTabsStore;
