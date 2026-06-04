"use client";

import type { LetterGrade } from "@/lib/types";

export function ShareOnX({
  reportId,
  overallGrade,
  url,
  className = "",
}: {
  reportId: string;
  overallGrade: LetterGrade;
  url: string;
  className?: string;
}) {
  const reportUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/report/${reportId}`
      : `/report/${reportId}`;

  const tweet = `Just got my landing page roasted 🔥\n\nGrade: ${overallGrade}\nURL: ${url}\n\nGet yours:`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(reportUrl)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ||
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
      }
    >
      <XIcon />
      Share on X
    </a>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
