import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BaseSidebarItem {
	name: string;
	type: string;
	id: string;
}

interface RequestSidebarItem extends BaseSidebarItem {
	method: string;
	path: string;
}

type SidebarItem = BaseSidebarItem | RequestSidebarItem;

interface SidebarState {
	items: any[];
}

type SidebarStateActions = {
	setItems: (items: any[]) => void;
	updateItem: (id: string, updates: Partial<any>) => void;
	removeItem: (id: string) => void;
};

const useSidebarStore = create<SidebarState & SidebarStateActions>()(
	devtools(
		persist(
			(set) => ({
				items: [],
				setItems: (items) => set({ items }),
				updateItem: (id, updates) =>
					set((state) => ({
						items: state.items.map((item) =>
							item.id === id ? { ...item, ...updates } : item,
						),
					})),
				removeItem: (id) =>
					set((state) => ({
						items: state.items.filter((item) => item.id !== id),
					})),
			}),
			{
				name: 'sidebar-storage',
			},
		),
	),
);

export default useSidebarStore;
