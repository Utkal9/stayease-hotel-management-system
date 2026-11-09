interface LogoProps {
  tone?: "light" | "dark";
}

export default function Logo({ tone = "light" }: LogoProps) {
  const textColor = tone === "light" ? "text-white" : "text-navy-950";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#ffffff" />
        <path d="M7 15.5 16 8l9 7.5V25H7z" fill="none" stroke="#06152b" strokeWidth="2" strokeLinejoin="round" />
        <path d="M13 25v-6h6v6" fill="none" stroke="#06152b" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${textColor}`}>StayEase</span>
    </span>
  );
}
