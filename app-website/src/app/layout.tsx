import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: {
    default: "SS Module",
    template: "%s · SS Module",
  },
  description: "Ask questions. Get answers.",
  themeColor: "#6366F1",
  openGraph: {
    type: "website",
    siteName: "SS Module",
    title: "SS Module",
    description: "Ask questions. Get answers.",
  },
  twitter: {
    card: "summary",
    title: "SS Module",
    description: "Ask questions. Get answers.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-[var(--font-geist)]">
        <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center px-4 py-3">
            <Link href="/" aria-label="Home">
              <svg
                width="28"
                height="28"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="al-bg"
                    x1="0"
                    y1="0"
                    x2="48"
                    y2="48"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4338CA" />
                  </linearGradient>
                  <linearGradient
                    id="al-shine"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="al-clip">
                    <rect width="48" height="48" rx="12" />
                  </clipPath>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#al-bg)" />
                <rect
                  x="0.5"
                  y="0.5"
                  width="47"
                  height="47"
                  rx="11.5"
                  stroke="white"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
                <rect
                  clipPath="url(#al-clip)"
                  x="0"
                  y="0"
                  width="48"
                  height="24"
                  fill="url(#al-shine)"
                />
                <text
                  x="24"
                  y="24"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Inter, system-ui, -apple-system, sans-serif"
                  fontWeight="700"
                  fontSize="19"
                  letterSpacing="-0.5"
                  fill="white"
                  fillOpacity="0.95"
                >
                  SS
                </text>
              </svg>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
