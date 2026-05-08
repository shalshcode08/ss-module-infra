import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { api } from "@/api";
import API_ROUTES from "@/routes/api-routes";
import { processSolution } from "@/utils/solution-parser";

interface ImageSet {
  id: string;
  urls: string[];
  favicons: string[];
}

function ImageRow({ urls, favicons }: { urls: string[]; favicons: string[] }) {
  return (
    <div className="my-4 flex gap-2 overflow-x-auto pb-1">
      {urls.map((url, i) => (
        <div key={url} className="flex flex-shrink-0 flex-col gap-1">
          <img
            src={url}
            alt=""
            className="h-28 w-auto max-w-[160px] rounded-lg border border-slate-100 object-cover"
          />
          {favicons[i] && (
            <img src={favicons[i]} alt="" className="h-3 w-3 self-center rounded-sm opacity-60" />
          )}
        </div>
      ))}
    </div>
  );
}

export function SolutionRenderer({
  content,
  questionId,
}: {
  content: string;
  questionId: string | null;
}) {
  const [imageSet, setImageSet] = useState<ImageSet | null>(null);

  useEffect(() => {
    if (!questionId) return;
    api
      .get<ImageSet>(API_ROUTES.questionImages(questionId))
      .then(setImageSet)
      .catch(() => {});
  }, [questionId]);

  const segments = processSolution(content);

  return (
    <div className="prose-answer">
      {segments.map((seg, i) => {
        if (seg.type === "image") {
          if (!imageSet) {
            return <div key={i} className="skeleton my-4 h-28 w-full rounded-xl" />;
          }
          return <ImageRow key={i} urls={imageSet.urls} favicons={imageSet.favicons} />;
        }
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {seg.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
