export default function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className={className}>
      <rect width="40" height="40" rx="10" fill="url(#dj_gradient)" />
      <path
        d="M13 15L8 20L13 25"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 15L32 20L27 25"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 13L18 27" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="dj_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f172a" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
