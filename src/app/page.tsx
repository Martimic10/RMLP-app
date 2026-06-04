import { RoastForm } from "@/components/RoastForm";
import { APP_NAME, APP_TAGLINE, PRICE_DISPLAY } from "@/lib/constants";

const STEPS = [
  { n: "01", title: "Paste your URL", desc: "We scrape your live page — no PDFs, no screenshots." },
  { n: "02", title: `Pay ${PRICE_DISPLAY} once`, desc: "No subscription. No upsell funnel. Just the roast." },
  { n: "03", title: "Get destroyed (helpfully)", desc: "6 graded sections, specific roasts, paste-ready rewrites." },
];

const SECTIONS = [
  "Headline",
  "Hero copy",
  "CTA",
  "Trust signals",
  "Objection handling",
  "Overall clarity",
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-64 w-64 rounded-full bg-flame/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px]" />
        <div className="absolute -right-20 top-1/3 h-48 w-48 rounded-full bg-amber-500/10 blur-[80px] sm:h-80 sm:w-80 sm:blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-48 w-full max-w-[600px] -translate-x-1/2 rounded-full bg-flame/10 blur-[60px] sm:h-64 sm:blur-[80px]" />
      </div>

      <header className="safe-px relative z-10 mx-auto flex max-w-6xl flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-8">
        <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
          {APP_NAME}
        </span>
        <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50 sm:text-xs">
          {APP_TAGLINE}
        </span>
      </header>

      <main className="safe-px relative z-10 mx-auto max-w-6xl pb-16 pt-4 sm:pb-24 sm:pt-8 md:pt-16">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-3 py-1.5 text-xs text-flame sm:mb-6 sm:px-4 sm:text-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
            </span>
            AI-powered · 60 second delivery
          </p>

          <h1 className="font-display text-[2.35rem] font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl">
            Your landing page
            <br />
            <span className="bg-gradient-to-r from-flame via-amber-300 to-flame bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
              is lying to you.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:mt-6 sm:text-lg">
            Brutally honest feedback for indie hackers. Six sections graded,
            roasted with your actual copy, and rewritten so you can ship tonight.
          </p>

          <div className="mt-8 flex justify-center sm:mt-12">
            <RoastForm />
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl sm:mt-32">
          <h2 className="mb-6 text-center font-display text-xl font-semibold text-white sm:mb-10 sm:text-2xl">
            What you get
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
            {SECTIONS.map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-left text-sm text-white/70 sm:text-center"
              >
                <span className="mr-2 text-flame">◆</span>
                {label}
                <span className="mt-0.5 block text-white/30 sm:ml-2 sm:mt-0 sm:inline">
                  + grade + rewrite
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:mt-24 sm:gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-6"
            >
              <span className="font-mono text-sm text-flame">{step.n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-white sm:mt-3 sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                {step.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center sm:mt-24 sm:p-8">
          <p className="font-display text-xl font-semibold text-white sm:text-2xl">
            Built for founders who ship
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/45 sm:text-base">
            Not another generic SEO audit. A conversion-focused roast that
            quotes your headline back to you — then hands you the fix.
          </p>
        </section>
      </main>

      <footer className="safe-px relative z-10 border-t border-white/5 py-6 text-center text-[11px] leading-relaxed text-white/30 sm:py-8 sm:text-xs">
        {APP_NAME} · One-time {PRICE_DISPLAY}
        <span className="hidden sm:inline"> · </span>
        <span className="block sm:inline">Share your roast, grow word-of-mouth</span>
      </footer>
    </div>
  );
}
