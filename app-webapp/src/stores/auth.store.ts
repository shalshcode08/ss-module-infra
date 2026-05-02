import { create } from "zustand";
import { api } from "@/api";
import type { AuthUser } from "@/types/auth";
import API_ROUTES from "@/routes/api-routes";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  status: "idle",

  fetchUser: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    try {
      const user = await api.get<AuthUser>(API_ROUTES.AUTH_ME);
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  logout: async () => {
    try {
      await api.post(API_ROUTES.AUTH_LOGOUT);
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },
}));
