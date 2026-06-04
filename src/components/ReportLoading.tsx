"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Scraping your live page",
  "Running conversion audit",
  "Grading six sections",
  "Writing paste-ready rewrites",
];

export function ReportLoading({ url }: { url: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  let hostname = url;
  try {
    hostname = new URL(url).hostname;
  } catch {
    /* keep raw url */
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-2 py-8 text-center sm:min-h-[70vh] sm:px-6">
      <div className="relative mb-8 sm:mb-10">
        <span className="absolute inset-0 animate-ping rounded-full bg-flame/25" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-flame/40 bg-flame/10 sm:h-20 sm:w-20">
          <span className="font-mono text-xl text-flame sm:text-2xl" aria-hidden>
            ···
          </span>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-xs">
        Audit in progress
      </p>
      <h1 className="mt-3 max-w-full break-anywhere font-display text-xl font-semibold leading-snug text-white sm:mt-4 sm:text-3xl">
        Roasting{" "}
        <span className="text-flame">{hostname}</span>
      </h1>

      <div className="mt-6 h-6 overflow-hidden sm:mt-8">
        <p key={step} className="animate-fade-up text-sm text-white/50">
          {STEPS[step]}
        </p>
      </div>

      <div className="mt-8 h-1 w-full max-w-[12rem] overflow-hidden rounded-full bg-white/10 sm:mt-10 sm:max-w-[12rem]">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-flame" />
      </div>

      <p className="mt-5 max-w-xs px-2 text-xs leading-relaxed text-white/30 sm:mt-6">
        Your report will appear automatically — usually under 60 seconds.
      </p>
    </div>
  );
}
