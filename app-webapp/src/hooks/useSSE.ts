import { useEffect, useRef } from "react";
import { useConversationStore } from "@/stores/conversation.store";
import API_ROUTES from "@/routes/api-routes";

export function useSSE(questionId: string | null) {
  const status = useConversationStore((s) => s.status);
  const appendChunk = useConversationStore((s) => s.appendChunk);
  const setCatchup = useConversationStore((s) => s.setCatchup);
  const setCompleted = useConversationStore((s) => s.setCompleted);
  const setFailed = useConversationStore((s) => s.setFailed);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!questionId || status !== "streaming") return;

    const url = `${import.meta.env.VITE_API_URL}${API_ROUTES.conversationsStream(questionId)}`;
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.addEventListener("catchup", (e) => {
      const { content } = JSON.parse(e.data);
      setCatchup(content);
    });

    es.addEventListener("chunk", (e) => {
      const { text } = JSON.parse(e.data);
      appendChunk(text);
    });

    es.addEventListener("done", (e) => {
      const data = JSON.parse(e.data);
      setCompleted(data.model ?? "");
      es.close();
    });

    es.addEventListener("error", () => {
      setFailed("Generation failed. Please try again.");
      es.close();
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [questionId, status]);
}
