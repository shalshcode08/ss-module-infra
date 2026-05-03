import { useEffect } from "react";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useConversationStore } from "@/stores/conversation.store";
import { useSSE } from "@/hooks/useSSE";

export default function ChatPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const plainText = useConversationStore((s) => s.plainText);
  const solutionContent = useConversationStore((s) => s.solutionContent);
  const status = useConversationStore((s) => s.status);
  const error = useConversationStore((s) => s.error);
  const loadQuestion = useConversationStore((s) => s.loadQuestion);
  const reset = useConversationStore((s) => s.reset);

  useSSE(questionId ?? null);

  useEffect(() => {
    if (questionId) loadQuestion(questionId);
    return () => reset();
  }, [questionId]);

  return (
    <>
      <style>{`
        .solution-body { font-size: 0.9rem; line-height: 1.75; color: #1e293b; }
        .solution-body p { margin: 0 0 0.85em; }
        .solution-body p:last-child { margin-bottom: 0; }
        .solution-body h1,.solution-body h2,.solution-body h3 { font-weight: 700; margin: 1.25em 0 0.5em; color: #0f172a; }
        .solution-body h1 { font-size: 1.25em; }
        .solution-body h2 { font-size: 1.1em; }
        .solution-body h3 { font-size: 1em; }
        .solution-body ul { list-style: disc; padding-left: 1.4em; margin: 0.5em 0; }
        .solution-body ol { list-style: decimal; padding-left: 1.4em; margin: 0.5em 0; }
        .solution-body li { margin: 0.2em 0; }
        .solution-body blockquote { border-left: 3px solid #e2e8f0; padding-left: 0.75em; margin: 0.5em 0; color: #64748b; }
        .solution-body strong { font-weight: 600; }
        .solution-body em { font-style: italic; }
        .solution-body a { color: #6366f1; text-decoration: underline; }
        .solution-body code:not(pre code) {
          background: #eef2ff; border: 1px solid #e0e7ff; border-radius: 4px;
          padding: 0.1em 0.35em; font-size: 0.82em;
          font-family: ui-monospace, monospace; color: #6366f1;
        }
        .solution-body pre {
          background: #0f172a; border-radius: 10px;
          padding: 1em 1.25em; margin: 0.75em 0; overflow-x: auto;
        }
        .solution-body pre code {
          background: transparent; border: none; color: #e2e8f0;
          padding: 0; font-size: 0.82em; font-family: ui-monospace, monospace;
        }
        .solution-body table { width: 100%; border-collapse: collapse; margin: 0.75em 0; font-size: 0.85em; }
        .solution-body th { background: #f8fafc; font-weight: 600; text-align: left; padding: 0.5em 0.75em; border: 1px solid #e2e8f0; }
        .solution-body td { padding: 0.5em 0.75em; border: 1px solid #e2e8f0; }
        .solution-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 1em 0; }
      `}</style>

      <div className="w-full space-y-6 py-8">
        {/* Question */}
        {plainText && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="mb-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
              Question
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
              {plainText}
            </p>
          </div>
        )}

        {/* Solution */}
        <div className="min-h-[120px] rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="mb-3 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            Solution
          </p>

          {/* Streaming / creating skeleton */}
          {(status === "creating" || status === "streaming") && !solutionContent && (
            <div className="animate-pulse space-y-2.5">
              <div className="h-3 w-3/4 rounded-full bg-slate-100" />
              <div className="h-3 w-full rounded-full bg-slate-100" />
              <div className="h-3 w-5/6 rounded-full bg-slate-100" />
            </div>
          )}

          {/* Progressive / completed content */}
          {solutionContent && (
            <div className="solution-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {solutionContent}
              </ReactMarkdown>
            </div>
          )}

          {/* Streaming cursor */}
          {status === "streaming" && solutionContent && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-500 align-middle" />
          )}

          {/* Error */}
          {status === "failed" && (
            <p className="text-sm text-red-500">
              {error ?? "Something went wrong. Please try again."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
