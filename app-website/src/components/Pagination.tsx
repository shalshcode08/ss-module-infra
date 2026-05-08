import Link from "next/link";

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export function Pagination({
  page,
  totalPages,
  baseHref = "/",
}: {
  page: number;
  totalPages: number;
  baseHref?: string;
}) {
  if (totalPages <= 1) return null;

  const range = getPageRange(page, totalPages);
  const href = (p: number) => `${baseHref}?page=${p}`;

  const navBase =
    "flex items-center gap-1.5 rounded-xl border bg-white px-4 h-10 text-sm font-medium transition-colors";
  const navActive = "border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900";
  const navDisabled = "border-slate-100 text-slate-300 pointer-events-none select-none";

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${navBase} ${navActive}`}>
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
          Prev
        </Link>
      ) : (
        <span className={`${navBase} ${navDisabled}`}>
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
          Prev
        </span>
      )}

      {range.map((item, i) =>
        item === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center text-sm text-slate-400"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${
              item === page
                ? "border-blue-500 text-blue-600"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${navBase} ${navActive}`}>
          Next
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
            <path d="M5 3l4 4-4 4" />
          </svg>
        </Link>
      ) : (
        <span className={`${navBase} ${navDisabled}`}>
          Next
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
            <path d="M5 3l4 4-4 4" />
          </svg>
        </span>
      )}
    </div>
  );
}
