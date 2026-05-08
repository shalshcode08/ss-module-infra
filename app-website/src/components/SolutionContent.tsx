"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export type ContentSegment = { type: "text"; content: string } | { type: "image"; id: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  `http://localhost:${process.env.NEXT_PUBLIC_API_PORT ?? 8080}/api/v1`;

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

export function SolutionContent({
  segments,
  questionId,
}: {
  segments: ContentSegment[];
  questionId: string;
}) {
  const [imageSet, setImageSet] = useState<ImageSet | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/images/question/${questionId}`)
      .then((r) => r.json())
      .then((json: { data: ImageSet }) => setImageSet(json.data))
      .catch(() => {});
  }, [questionId]);

  return (
    <div className="prose-answer">
      {segments.map((seg, i) => {
        if (seg.type === "image") {
          if (!imageSet) {
            return (
              <div
                key={i}
                className="my-4 h-28 w-full rounded-xl"
                style={{
                  background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%)",
                  backgroundSize: "800px 100%",
                  animation: "shimmer 1.4s ease infinite",
                }}
              />
            );
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
