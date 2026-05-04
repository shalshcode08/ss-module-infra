import { create } from "zustand";
import { api } from "@/api";
import API_ROUTES from "@/routes/api-routes";

export interface HistoryItem {
  id: string;
  plainText: string;
  slug: string;
  createdAt: string;
  solutions: Array<{ streamStatus: string }>;
}

interface HistoryStore {
  items: HistoryItem[];
  hasMore: boolean;
  loading: boolean;
  page: number;

  fetchHistory: (reset?: boolean) => Promise<void>;
  fetchRecent: () => Promise<void>;
}

const PAGE_SIZE = 20;

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  items: [],
  hasMore: true,
  loading: false,
  page: 0,

  fetchHistory: async (reset = false) => {
    if (get().loading) return;
    const page = reset ? 0 : get().page;
    set({ loading: true, ...(reset ? { hasMore: true, page: 0 } : {}) });
    try {
      const data = await api.get<HistoryItem[]>(
        `${API_ROUTES.CONVERSATIONS_HISTORY}?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`,
      );
      set((s) => ({
        items: reset ? data : [...s.items, ...data],
        hasMore: data.length === PAGE_SIZE,
        page: page + 1,
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  fetchRecent: async () => {
    try {
      const data = await api.get<HistoryItem[]>(
        `${API_ROUTES.CONVERSATIONS_HISTORY}?limit=3&offset=0`,
      );
      set((s) => ({
        items: s.items.length === 0 ? data : s.items,
      }));
    } catch {
      // silently fail — home page recent questions are non-critical
    }
  },
}));
