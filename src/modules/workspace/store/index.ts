import { create } from "zustand";
import { Organization } from "@/generated/prisma/browser";

export type WorkspaceStoreState = {
  workspaces?: Organization[];
  activeWorkspace?: Organization | null;
  isLoading?: boolean;
  error?: Error | null;
  message?: string;
};

type WorkspaceStateActions = {
  setWorkspaces: (workspaces: Organization[]) => void;
  setActiveWorkspace: (workspace: Organization) => void;
  setError: (error: Error) => void;
  setLoading: (state: boolean) => void;
  setMessage: (message: string) => void;
  setWorkspaceState: (state: WorkspaceStoreState) => void;
  reset: () => void;
};

const useWorkspaceState = create<WorkspaceStoreState & WorkspaceStateActions>(
  (set) => ({
    activeWorkspace: null,
    error: null,
    isLoading: false,
    message: undefined,
    workspaces: [],
    setActiveWorkspace: (workspace) => {
      set({ activeWorkspace: workspace });
    },
    setError: (error) => {
      set({ error });
    },
    setLoading: (loading) => {
      set({ isLoading: loading });
    },
    setMessage: (message) => {
      set({ message });
    },
    setWorkspaces: (workspaces) => {
      set({ workspaces });
    },
    setWorkspaceState: (state: WorkspaceStoreState) => {
      set(state);
    },
    reset: () =>
      set({
        activeWorkspace: null,
        error: null,
        isLoading: false,
        message: undefined,
        workspaces: [],
      }),
  })
);

export default useWorkspaceState;
