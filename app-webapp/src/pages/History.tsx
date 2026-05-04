import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useHistoryStore } from "@/stores/history.store";
import AppRoutes from "@/routes/app-routes";

function StatusBadge({ status }: { status: string }) {
  if (status === "COMPLETED") {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
        Done
      </span>
    );
  }
  if (status === "FAILED") {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
        Failed
      </span>
    );
  }
  return (
    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-500">
      Streaming
    </span>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { items, hasMore, loading, fetchHistory } = useHistoryStore();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory(true);
  }, []);

  // Infinite scroll — observe the sentinel div at the bottom of the list
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchHistory();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="w-full self-start py-8">
      <h1 className="mb-6 text-sm font-semibold tracking-widest text-slate-400 uppercase">
        History
      </h1>

      {items.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm font-medium text-slate-400">No questions yet</p>
          <p className="mt-1 text-xs text-slate-300">Ask your first question from the home page</p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const solution = item.solutions[0];
          return (
            <button
              key={item.id}
              onClick={() => navigate(AppRoutes.chat(item.id))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="flex-1 truncate text-sm font-medium text-slate-800">
                  {item.plainText}
                </p>
                {solution && <StatusBadge status={solution.streamStatus} />}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </button>
          );
        })}
      </div>

      {/* Skeleton rows while loading — only shown on first load when no items exist yet */}
      {loading && items.length === 0 && (
        <div className="mt-2 animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100" />
          ))}
        </div>
      )}

      {/* Sentinel — IntersectionObserver watches this to trigger next page */}
      <div ref={sentinelRef} className="h-4" />

      {!hasMore && items.length > 0 && (
        <p className="mt-4 text-center text-xs text-slate-400">You've reached the end</p>
      )}
    </div>
  );
}
