import { Session, User } from "better-auth";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AuthStoreState = {
  data?: { session: Session | null; user: User | null } | null;
  isLoading?: boolean;
  error?: Error | null;
  message?: string | null;
  triggerRefetch?: boolean;
};

type AuthStoreActions = {
  setAuthSession: (data: {
    session: Session | null;
    user: User | null;
  }) => void;
  setError: (error: Error | null) => void;
  setMessage: (message?: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setAuthStoreState: (state: AuthStoreState) => void;
  setTriggerRefetch: (triggerRefetch: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  devtools(
    persist(
      immer((set) => ({
        data: null,
        isLoading: false,
        error: null,
        message: "",
        triggerRefetch: false,
        setError: (error) => {
          set({ error });
        },
        setIsLoading: (val) => {
          set({ isLoading: val });
        },
        setMessage: (val) => {
          set({ message: val });
        },
        setAuthSession: (data) => {
          set({ data });
        },
        setAuthStoreState: (state: AuthStoreState) => {
          set(state);
        },
        setTriggerRefetch: (triggerRefetch: boolean) => {
          set({ triggerRefetch });
        },
        reset: () =>
          set({
            data: null,
            isLoading: false,
            error: null,
            message: "",
            triggerRefetch: false,
          }),
      })),
      { name: "auth-store" }
    )
  )
);
