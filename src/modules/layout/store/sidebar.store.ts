import { HttpMethod } from "@/generated/prisma/browser";
import { RequestType } from "@/modules/requests/types/store.types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface SidebarCollectionItemInterface {
  name: string;
  type: "COLLECTION";
  id: string;
  children: SidebarItemInterface[];
  workspaceId: string;
  parentId: string | null;
}

interface RequestSidebarItemInterface {
  name: string;
  type: RequestType | "NEW";
  id: string;
  method: HttpMethod | null;
  path: string;
  workspaceId: string;
  collectionId: string | null;
}

export type SidebarItemInterface =
  | SidebarCollectionItemInterface
  | RequestSidebarItemInterface;

interface SidebarState {
  items: SidebarItemInterface[];
}

type SidebarStateActions = {
  setItems: (items: SidebarItemInterface[]) => void;
  addItem: (item: SidebarItemInterface, parentId?: string | null) => void;
  moveItem: (itemId: string, newParentId: string | null) => void;
  reorderItems: (orderedIds: string[], parentId: string | null, type: "COLLECTION" | "REQUEST") => void;
  updateItemDeep: (id: string, updates: Partial<SidebarItemInterface>) => void;
  removeItemDeep: (id: string) => void;
  updateItem: (id: string, updates: Partial<SidebarItemInterface>) => void;
  removeItem: (id: string) => void;
  reset: () => void;
};

// Helper: Find and remove item from tree, returning [newTree, removedItem]
const findAndRemove = (
  items: SidebarItemInterface[],
  itemId: string
): [SidebarItemInterface[], SidebarItemInterface | null] => {
  let foundItem: SidebarItemInterface | null = null;

  const newItems = items.reduce<SidebarItemInterface[]>((acc, item) => {
    if (item.id === itemId) {
      foundItem = item;
      return acc;
    }
    if (item.type === "COLLECTION") {
      const [newChildren, found] = findAndRemove(item.children || [], itemId);
      if (found) foundItem = found;
      acc.push({ ...item, children: newChildren });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  return [newItems, foundItem];
};

// Helper: Add item to tree at parentId location
const addToTree = (
  items: SidebarItemInterface[],
  item: SidebarItemInterface,
  parentId: string | null
): SidebarItemInterface[] => {
  if (!parentId) {
    // Add to root - collections at top, requests at bottom
    if (item.type === "COLLECTION") {
      const collections = items.filter((i) => i.type === "COLLECTION");
      const requests = items.filter((i) => i.type !== "COLLECTION");
      return [...collections, item, ...requests];
    }
    return [...items, item];
  }

  return items.map((i) => {
    if (i.id === parentId && i.type === "COLLECTION") {
      return { ...i, children: [...(i.children || []), item] };
    }
    if (i.type === "COLLECTION") {
      return { ...i, children: addToTree(i.children || [], item, parentId) };
    }
    return i;
  });
};

// Helper: Update item deep in tree
const updateInTree = (
  items: SidebarItemInterface[],
  id: string,
  updates: Partial<SidebarItemInterface>
): SidebarItemInterface[] => {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates } as SidebarItemInterface;
    }
    if (item.type === "COLLECTION") {
      return { ...item, children: updateInTree(item.children || [], id, updates) };
    }
    return item;
  });
};

// Helper: Remove item deep from tree
const removeFromTree = (
  items: SidebarItemInterface[],
  id: string
): SidebarItemInterface[] => {
  return items.reduce<SidebarItemInterface[]>((acc, item) => {
    if (item.id === id) {
      return acc;
    }
    if (item.type === "COLLECTION") {
      acc.push({ ...item, children: removeFromTree(item.children || [], id) });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

const useSidebarStore = create<SidebarState & SidebarStateActions>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        setItems: (items) => set({ items }),
        addItem: (item, parentId) =>
          set((state) => ({ items: addToTree(state.items, item, parentId ?? null) })),
        moveItem: (itemId, newParentId) =>
          set((state) => {
            const [itemsWithoutMoved, movedItem] = findAndRemove(state.items, itemId);
            if (!movedItem) return state;
            return { items: addToTree(itemsWithoutMoved, movedItem, newParentId) };
          }),
        reorderItems: (orderedIds, parentId, type) =>
          set((state) => {
            const reorderAtLevel = (items: SidebarItemInterface[]): SidebarItemInterface[] => {
              if (!parentId) {
                // Reorder at root level
                const targetItems = items.filter(i =>
                  type === "COLLECTION" ? i.type === "COLLECTION" : i.type !== "COLLECTION"
                );
                const otherItems = items.filter(i =>
                  type === "COLLECTION" ? i.type !== "COLLECTION" : i.type === "COLLECTION"
                );
                const reordered = orderedIds
                  .map(id => targetItems.find(item => item.id === id))
                  .filter(Boolean) as SidebarItemInterface[];
                // Collections first, then requests
                return type === "COLLECTION"
                  ? [...reordered, ...otherItems]
                  : [...otherItems, ...reordered];
              }
              // Reorder inside a parent collection
              return items.map(item => {
                if (item.id === parentId && item.type === "COLLECTION") {
                  const children = item.children || [];
                  const targetChildren = children.filter(c =>
                    type === "COLLECTION" ? c.type === "COLLECTION" : c.type !== "COLLECTION"
                  );
                  const otherChildren = children.filter(c =>
                    type === "COLLECTION" ? c.type !== "COLLECTION" : c.type === "COLLECTION"
                  );
                  const reordered = orderedIds
                    .map(id => targetChildren.find(c => c.id === id))
                    .filter(Boolean) as SidebarItemInterface[];
                  return {
                    ...item,
                    children: type === "COLLECTION"
                      ? [...reordered, ...otherChildren]
                      : [...otherChildren, ...reordered]
                  };
                }
                if (item.type === "COLLECTION") {
                  return { ...item, children: reorderAtLevel(item.children || []) };
                }
                return item;
              });
            };
            return { items: reorderAtLevel(state.items) };
          }),
        updateItemDeep: (id, updates) =>
          set((state) => ({ items: updateInTree(state.items, id, updates) })),
        removeItemDeep: (id) =>
          set((state) => ({ items: removeFromTree(state.items, id) })),
        // Legacy shallow versions for backward compatibility
        updateItem: (id, updates) =>
          set((state) => ({ items: updateInTree(state.items, id, updates) })),
        removeItem: (id) =>
          set((state) => ({ items: removeFromTree(state.items, id) })),
        reset: () => set({ items: [] }),
      }),
      {
        name: "sidebar-storage",
      }
    )
  )
);

export default useSidebarStore;
