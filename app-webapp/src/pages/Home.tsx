import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Clock } from "lucide-react";
import { RichTextInput } from "@/components/RichTextInput";
import { useAuthStore } from "@/stores/auth.store";
import { api } from "@/api";
import API_ROUTES from "@/routes/api-routes";
import AppRoutes from "@/routes/app-routes";

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface RecentQuestion {
  id: string;
  plainText: string;
  createdAt: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const [recent, setRecent] = useState<RecentQuestion[]>([]);

  useEffect(() => {
    api
      .get<RecentQuestion[]>(API_ROUTES.CONVERSATIONS_HOME)
      .then(setRecent)
      .catch(() => {});
  }, []);

  return (
    <div className="flex w-full flex-1 items-center pb-24">
      <div className="w-full">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-medium tracking-[0.15em] text-indigo-400 uppercase">
            {getTimeGreeting()}, {firstName}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-500">
            What do you want to solve?
          </h2>
        </div>
        <RichTextInput />

        {recent.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 px-1 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
              Recent
            </p>
            <div className="space-y-1.5">
              {recent.map((q) => (
                <button
                  key={q.id}
                  onClick={() => navigate(AppRoutes.chat(q.id))}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  <span className="flex-1 truncate text-sm text-slate-500">{q.plainText}</span>
                  {q.createdAt && (
                    <span className="shrink-0 text-[11px] text-slate-300">
                      {new Date(q.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate(AppRoutes.HISTORY)}
              className="mt-2 w-full rounded-xl border border-slate-200 py-1.5 text-center text-xs text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
