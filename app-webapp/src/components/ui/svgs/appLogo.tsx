export function AppLogo({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="al-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="al-shine" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="al-clip">
          <rect width="48" height="48" rx="12" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="48" height="48" rx="12" fill="url(#al-bg)" />

      {/* Inset border */}
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

      {/* Top sheen */}
      <rect clipPath="url(#al-clip)" x="0" y="0" width="48" height="24" fill="url(#al-shine)" />

      {/* SS — inline SVG uses the page's loaded Inter font, same as regular HTML text */}
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
  );
}
