import Link from "next/link";
import { fetchPublicChats } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/[-*+]\s/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(Number(pageParam) || 1, 1);
  const { data: questions, totalPages, total } = await fetchPublicChats(page, 10);

  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Community Q&amp;A</h1>
          <p className="mt-1 text-sm text-slate-400">{total} questions answered</p>
        </div>

        <div className="space-y-2">
          {questions.map((q) => {
            const preview = stripMarkdown(q.solutions[0]?.content ?? "").slice(0, 240);
            return (
              <Link
                key={q.id}
                href={`/qna/${q.slug}`}
                className="block rounded-xl border border-slate-200 bg-white px-5 py-4 transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <p className="text-sm leading-snug font-semibold text-slate-800">{q.plainText}</p>
                {preview && (
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {preview}
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-300">
                  {new Date(q.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </Link>
            );
          })}
        </div>

        <Pagination page={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
