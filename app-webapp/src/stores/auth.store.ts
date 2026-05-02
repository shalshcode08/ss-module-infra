import { create } from "zustand";
import { api } from "@/api";
import type { AuthUser } from "@/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: "idle",

  fetchUser: async () => {
    set({ status: "loading" });
    try {
      const user = await api.get<AuthUser>("/auth/me");
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },
}));
