import { create } from "zustand";
import { api } from "@/api";
import API_ROUTES from "@/routes/api-routes";

export type ConversationStatus = "idle" | "creating" | "streaming" | "completed" | "failed";

interface ConversationState {
  questionId: string | null;
  plainText: string | null;
  contentJson: string | null;
  solutionContent: string;
  status: ConversationStatus;
  fetching: boolean;
  model: string | null;
  error: string | null;

  submit: (plainText: string, contentJson?: string) => Promise<string>;
  loadQuestion: (questionId: string) => Promise<void>;
  appendChunk: (text: string) => void;
  setCatchup: (content: string) => void;
  setCompleted: (model: string) => void;
  setFailed: (error: string) => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  questionId: null,
  plainText: null,
  contentJson: null,
  solutionContent: "",
  status: "idle",
  fetching: false,
  model: null,
  error: null,

  submit: async (plainText, contentJson) => {
    set({
      status: "creating",
      plainText,
      contentJson,
      solutionContent: "",
      error: null,
      model: null,
    });
    const { questionId } = await api.post<{ questionId: string }>(API_ROUTES.CONVERSATIONS_CREATE, {
      plainText,
      contentJson,
    });
    set({ questionId, status: "streaming" });
    return questionId;
  },

  loadQuestion: async (questionId) => {
    if (get().questionId === questionId) return;
    set({ fetching: true });
    const data = await api.get<{
      plainText: string;
      contentJson: string | null;
      solutions: Array<{ content: string; streamStatus: string; model: string | null }>;
    }>(API_ROUTES.conversationsQuestion(questionId));

    const solution = data.solutions[0];
    const status: ConversationStatus =
      solution?.streamStatus === "COMPLETED"
        ? "completed"
        : solution?.streamStatus === "FAILED"
          ? "failed"
          : "streaming";

    set({
      questionId,
      plainText: data.plainText,
      contentJson: data.contentJson,
      solutionContent: solution?.content ?? "",
      status,
      fetching: false,
      model: solution?.model ?? null,
      error: null,
    });
  },

  appendChunk: (text) => set((s) => ({ solutionContent: s.solutionContent + text })),
  setCatchup: (content) => set({ solutionContent: content }),
  setCompleted: (model) => set({ status: "completed", model }),
  setFailed: (error) => set({ status: "failed", error }),
  reset: () =>
    set({
      questionId: null,
      plainText: null,
      contentJson: null,
      solutionContent: "",
      status: "idle",
      fetching: false,
      model: null,
      error: null,
    }),
}));
