import { create } from "zustand";
import { Organization } from "@/generated/prisma/browser";

export type GlobalAuthState = {
  type: string;
  data?: unknown;
} | null;

export type WorkspaceWithGlobalAuth = Organization & {
  globalAuth?: GlobalAuthState;
};

export type WorkspaceStoreState = {
  workspaces?: Organization[];
  activeWorkspace?: WorkspaceWithGlobalAuth | null;
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
  updateWorkspaceGlobalAuth: (globalAuth: GlobalAuthState) => void;
  reset: () => void;
};

const useWorkspaceState = create<WorkspaceStoreState & WorkspaceStateActions>(
  (set, get) => ({
    activeWorkspace: null,
    error: null,
    isLoading: false,
    message: undefined,
    workspaces: [],
    setActiveWorkspace: (workspace) => {
      // Cast globalAuth from Prisma JsonValue to our GlobalAuthState type
      const globalAuth = workspace.globalAuth as GlobalAuthState;
      set({ activeWorkspace: { ...workspace, globalAuth } as any });
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
    updateWorkspaceGlobalAuth: (globalAuth) => {
      const currentWorkspace = get().activeWorkspace;
      if (currentWorkspace) {
        set({
          activeWorkspace: {
            ...currentWorkspace,
            globalAuth,
          } as WorkspaceWithGlobalAuth,
        });
      }
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
