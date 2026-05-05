import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { fetchPublicChatBySlug } from "@/lib/api";

export default async function QnaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = await fetchPublicChatBySlug(slug);
  if (!question) notFound();

  const solution = question.solutions[0];

  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <Link
          href="/"
          className="mb-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition-all hover:border-slate-300 hover:text-slate-800"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11L5 7l4-4" />
          </svg>
          Back
        </Link>

        <div className="space-y-2">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="mb-1.5 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Question
            </p>
            <p className="text-base leading-relaxed whitespace-pre-wrap text-slate-700">
              {question.plainText}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="mb-3 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Answer
            </p>
            {solution?.content ? (
              <div className="prose-answer">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {solution.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No answer yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
