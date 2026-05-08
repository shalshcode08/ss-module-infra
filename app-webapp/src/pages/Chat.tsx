import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Share2, Check } from "lucide-react";
import { useConversationStore } from "@/stores/conversation.store";
import { useSSE } from "@/hooks/useSSE";
import { RichTextInput } from "@/components/RichTextInput";
import { SolutionRenderer } from "@/components/SolutionRenderer";

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL ?? "";

function ShareButton({ slug }: { slug: string | null }) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const handleShare = async () => {
    if (!slug) return;
    const url = `${WEBSITE_URL}/qna/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setToast(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={!slug}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
      >
        {copied ? <Check size={13} className="text-slate-500" /> : <Share2 size={13} />}
        <span>{copied ? "Copied" : "Share"}</span>
      </button>

      {toast && (
        <div className="animate-in fade-in slide-in-from-bottom-2 fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-slate-800 px-4 py-2 text-xs text-white shadow-lg duration-200">
          Public link copied
        </div>
      )}
    </div>
  );
}

function useTypewriter(source: string, charsPerTick = 3, tickMs = 16) {
  const [displayed, setDisplayed] = useState(source);
  const sourceRef = useRef(source);
  const indexRef = useRef(source.length);
  const prevLengthRef = useRef(source.length);

  useEffect(() => {
    const prevLen = prevLengthRef.current;
    const newLen = source.length;
    prevLengthRef.current = newLen;
    sourceRef.current = source;

    if (source === "") {
      indexRef.current = 0;
      setDisplayed("");
    } else if (newLen - prevLen > 200) {
      // Bulk update (history load or SSE catchup) — show immediately without animation
      indexRef.current = newLen;
      setDisplayed(source);
    }
  }, [source]);

  useEffect(() => {
    const id = setInterval(() => {
      const src = sourceRef.current;
      if (indexRef.current < src.length) {
        indexRef.current = Math.min(indexRef.current + charsPerTick, src.length);
        setDisplayed(src.slice(0, indexRef.current));
      }
    }, tickMs);
    return () => clearInterval(id);
  }, []);

  return displayed;
}

const LOADING_MESSAGES = [
  "Thinking through your question…",
  "Putting together an answer…",
  "Almost there…",
];

function LoadingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % LOADING_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <p
      className="mb-3 text-xs text-slate-400 transition-opacity duration-400"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {LOADING_MESSAGES[index]}
    </p>
  );
}

export default function ChatPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const plainText = useConversationStore((s) => s.plainText);
  const slug = useConversationStore((s) => s.slug);
  const storeQuestionId = useConversationStore((s) => s.questionId);
  const solutionContent = useConversationStore((s) => s.solutionContent);
  const status = useConversationStore((s) => s.status);
  const error = useConversationStore((s) => s.error);
  const fetching = useConversationStore((s) => s.fetching);
  const loadQuestion = useConversationStore((s) => s.loadQuestion);
  const reset = useConversationStore((s) => s.reset);

  const displayedContent = useTypewriter(solutionContent);

  // Use store's questionId (not URL param) so SSE connects to the correct stream
  // even during the brief window between submit() and navigation completing.
  useSSE(storeQuestionId);

  useEffect(() => {
    if (questionId) loadQuestion(questionId);
    return () => reset();
  }, [questionId]);

  const isLoading = (status === "creating" || status === "streaming") && !solutionContent;

  if (fetching) {
    return (
      <div className="w-full animate-pulse space-y-1 self-start py-8">
        <div className="h-24 rounded-xl bg-slate-100" />
        <div className="h-48 rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .prose-answer { font-size: 0.9rem; line-height: 1.8; color: #334155; }
        .prose-answer > *:first-child { margin-top: 0 !important; }
        .prose-answer > *:last-child { margin-bottom: 0 !important; }
        .prose-answer p { margin: 0 0 1em; }
        .prose-answer h1, .prose-answer h2, .prose-answer h3 {
          font-weight: 650; letter-spacing: -0.02em; color: #0f172a;
          margin: 1.6em 0 0.5em;
        }
        .prose-answer h1 { font-size: 1.2em; }
        .prose-answer h2 { font-size: 1.08em; }
        .prose-answer h3 { font-size: 0.95em; color: #475569; }
        .prose-answer ul { list-style: disc; padding-left: 1.4em; margin: 0.75em 0; }
        .prose-answer ul li { margin: 0.35em 0; }
        .prose-answer ol { list-style: decimal; padding-left: 1.5em; margin: 0.75em 0; }
        .prose-answer ol li { margin: 0.35em 0; }
        .prose-answer strong { font-weight: 600; color: #1e293b; }
        .prose-answer em { font-style: italic; color: #475569; }
        .prose-answer a { color: #334155; text-decoration: underline; }
        .prose-answer blockquote {
          border-left: 2px solid #e2e8f0; padding-left: 1em;
          margin: 1em 0; color: #64748b; font-style: italic;
        }
        .prose-answer code:not(pre code) {
          background: #f1f5f9; border-radius: 4px;
          padding: 0.15em 0.4em; font-size: 0.8em;
          font-family: ui-monospace, monospace; color: #334155;
        }
        .prose-answer pre {
          background: #0d1117; border-radius: 10px;
          padding: 1.1em 1.25em; margin: 1.1em 0;
          overflow-x: auto; border: 1px solid #1e293b;
        }
        .prose-answer pre code {
          background: transparent; border: none; color: #e2e8f0;
          font-size: 0.8em; font-family: ui-monospace, monospace; padding: 0;
        }
        .prose-answer table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.85em; }
        .prose-answer th {
          background: #f8fafc; font-weight: 600; text-align: left;
          padding: 0.6em 0.85em; border: 1px solid #e2e8f0; color: #475569;
          font-size: 0.78em; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .prose-answer td { padding: 0.6em 0.85em; border: 1px solid #f1f5f9; }
        .prose-answer tr:nth-child(even) td { background: #f8fafc; }
        .prose-answer hr { border: none; border-top: 1px solid #f1f5f9; margin: 1.5em 0; }
        .prose-answer .hljs-comment, .prose-answer .hljs-quote { color: #6e7681; font-style: italic; }
        .prose-answer .hljs-keyword, .prose-answer .hljs-selector-tag { color: #ff7b72; }
        .prose-answer .hljs-string, .prose-answer .hljs-attr { color: #a5d6ff; }
        .prose-answer .hljs-title, .prose-answer .hljs-name { color: #d2a8ff; }
        .prose-answer .hljs-number, .prose-answer .hljs-literal { color: #79c0ff; }
        .prose-answer .hljs-built_in, .prose-answer .hljs-type { color: #ffa657; }
        .prose-answer .hljs-variable, .prose-answer .hljs-template-variable { color: #ffa657; }
        .prose-answer .hljs-tag { color: #7ee787; }
        .prose-answer .hljs-meta { color: #e3b341; }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease infinite;
          border-radius: 4px;
        }
      `}</style>

      <div className="w-full space-y-1 self-start py-8">
        {plainText && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <p className="mb-1.5 text-sm font-bold text-slate-800">Question</p>
            <p className="text-base leading-relaxed whitespace-pre-wrap text-slate-500">
              {plainText}
            </p>
          </div>
        )}

        {/* Solution block */}
        <div className="min-h-[100px] rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="mb-3 text-sm font-bold text-slate-800">Answer</p>
          {isLoading && (
            <div className="space-y-3">
              <LoadingText />
              <div className="skeleton h-3 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          )}

          {displayedContent && (
            <SolutionRenderer content={displayedContent} questionId={storeQuestionId} />
          )}

          {status === "failed" && !solutionContent && (
            <p className="text-sm text-red-400">
              {error ?? "Something went wrong. Please try again."}
            </p>
          )}
        </div>

        {status === "completed" && displayedContent.length >= solutionContent.length && (
          <>
            <div className="flex px-1">
              <ShareButton slug={slug} />
            </div>
            <RichTextInput compact />
          </>
        )}
      </div>
    </>
  );
}
