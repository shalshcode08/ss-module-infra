import { api } from "@/api";
import type { UserConfig } from "@/types/auth";
import API_ROUTES from "@/routes/api-routes";
import { create } from "zustand";

interface ConfigStore {
  config: UserConfig | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  status: "idle",
  fetchConfig: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    try {
      const config = await api.get<UserConfig>(API_ROUTES.USER_CONFIG);
      set({ config, status: "succeeded" });
    } catch {
      set({ config: null, status: "failed" });
    }
  },
}));
